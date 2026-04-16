import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db/index";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const db = getDb();
  const member = await db.query.members.findFirst({
    where: eq(schema.members.email, session.email),
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const config = await db.query.clubConfig.findFirst();

  return NextResponse.json({
    member: {
      id: member.id,
      name: member.name,
      email: member.email,
      tier: member.tier,
      creditBalance: member.creditBalance,
      customData: member.customData,
      sharingPrefs: member.sharingPrefs,
      status: member.status,
      joinedAt: member.joinedAt,
    },
    config: config ? {
      clubName: config.name,
      tiers: config.tiers,
      customFields: config.customFields.filter(f => f.editable_by_member),
    } : null,
  });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const db = getDb();
  const member = await db.query.members.findFirst({
    where: eq(schema.members.email, session.email),
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (body.name && typeof body.name === "string") {
    if (body.name.length > 200) {
      return NextResponse.json({ error: "Name too long (max 200 characters)" }, { status: 400 });
    }
    updates.name = body.name;
  }

  if (body.customData && typeof body.customData === "object") {
    const config = await db.query.clubConfig.findFirst();
    if (config) {
      const editableIds = new Set(
        config.customFields.filter(f => f.editable_by_member).map(f => f.id)
      );
      const currentData = (member.customData || {}) as Record<string, unknown>;
      for (const [key, value] of Object.entries(body.customData)) {
        if (editableIds.has(key)) {
          currentData[key] = value;
        }
      }
      updates.customData = currentData;
    }
  }

  if (body.sharingPrefs && typeof body.sharingPrefs === "object") {
    const VALID_SHARING_LEVELS = ["everyone", "members", "staff", "none"];
    const sanitizedPrefs: Record<string, string> = {};
    for (const [key, value] of Object.entries(body.sharingPrefs)) {
      if (typeof value === "string" && VALID_SHARING_LEVELS.includes(value)) {
        sanitizedPrefs[key] = value;
      }
    }
    updates.sharingPrefs = { ...(member.sharingPrefs as Record<string, string>), ...sanitizedPrefs };
  }

  await db.update(schema.members)
    .set(updates)
    .where(eq(schema.members.id, member.id));

  return NextResponse.json({ ok: true });
}
