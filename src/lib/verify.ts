import { eq, and } from "drizzle-orm";
import { getDb, schema } from "@/db/index";
import { huitlApi } from "@/lib/huitl";
import { getSession, refreshSession } from "@/lib/session";
import { resolveRole, type ViewerRole } from "@/lib/roles";
import { filterFields } from "@/lib/fields";

export interface VerifyResult {
  verified: "authentic" | "invalid" | "replay" | "error";
  viewerRole?: ViewerRole;
  member?: Record<string, unknown>;
  club?: { name: string };
  message?: string;
  error?: string;
}

export async function verifyMemberCard(piccData: string, cmac: string): Promise<VerifyResult> {
  // 1. Verify via huitl-cloud
  let verification;
  try {
    verification = await huitlApi(`/v1/verify?picc_data=${encodeURIComponent(piccData)}&cmac=${encodeURIComponent(cmac)}`);
  } catch {
    return { verified: "error", error: "Verification temporarily unavailable. Please try again." };
  }

  if (verification.status !== "authentic") {
    return {
      verified: verification.status,
      message: verification.status === "replay"
        ? "Stale read — tap the card again for fresh verification."
        : "Verification failed.",
    };
  }

  const cardUid = verification.uid;
  const db = getDb();

  // 2. Find active card → member
  const activeCard = await db.query.memberCards.findFirst({
    where: and(
      eq(schema.memberCards.cardUid, cardUid),
      eq(schema.memberCards.status, "active"),
    ),
  });

  if (!activeCard) {
    // Check if the card was revoked (not just unlinked)
    const revokedCard = await db.query.memberCards.findFirst({
      where: and(
        eq(schema.memberCards.cardUid, cardUid),
        eq(schema.memberCards.status, "revoked"),
      ),
    });
    if (revokedCard) {
      return { verified: "authentic", message: "This card has been deactivated. Contact staff." };
    }
    return { verified: "authentic", message: "Card verified but not linked to a membership." };
  }

  const member = await db.query.members.findFirst({
    where: eq(schema.members.id, activeCard.memberId),
  });

  if (!member) {
    return { verified: "authentic", message: "Card verified but member not found." };
  }

  // 3. Get session and resolve role
  const session = await getSession();
  // Note: refreshSession() is NOT called here because this function
  // may run in a server component (tap page) where cookies can't be set.
  // Session refresh happens in the API route wrapper instead.

  // Check member status — revoked members
  if (member.status === "revoked") {
    return { verified: "authentic", message: "This membership has been revoked. Contact staff." };
  }

  let memberRecord = null;
  let dashboardUserRecord = null;

  if (session) {
    memberRecord = await db.query.members.findFirst({
      where: eq(schema.members.email, session.email),
    });
    dashboardUserRecord = await db.query.dashboardUsers.findFirst({
      where: eq(schema.dashboardUsers.email, session.email),
    });
  }

  const viewerRole = resolveRole({
    session,
    cardOwnerEmail: member.email,
    member: memberRecord ? { id: memberRecord.id, email: memberRecord.email } : null,
    dashboardUser: dashboardUserRecord ? {
      id: dashboardUserRecord.id,
      email: dashboardUserRecord.email,
      tapRole: dashboardUserRecord.tapRole,
    } : null,
  });

  // Suspended member: public/member viewers see generic message
  if (member.status === "suspended" && (viewerRole === "public" || viewerRole === "member")) {
    await db.insert(schema.tapLogs).values({
      cardUid,
      memberId: member.id,
      scannedById: memberRecord?.id || dashboardUserRecord?.id || null,
      scannedByType: dashboardUserRecord ? "dashboard_user" : memberRecord ? "member" : null,
      viewerRole,
      verified: "authentic",
    });
    return { verified: "authentic", message: "Card inactive." };
  }

  // 4. Get club config for field definitions
  const config = await db.query.clubConfig.findFirst();

  // 5. Filter fields based on role
  const visibleFields = config ? filterFields({
    customFields: config.customFields,
    customData: member.customData as Record<string, unknown>,
    sharingPrefs: member.sharingPrefs as Record<string, string>,
    viewerRole,
  }) : [];

  // 6. Log the tap
  await db.insert(schema.tapLogs).values({
    cardUid,
    memberId: member.id,
    scannedById: memberRecord?.id || dashboardUserRecord?.id || null,
    scannedByType: dashboardUserRecord ? "dashboard_user" : memberRecord ? "member" : null,
    viewerRole,
    verified: "authentic",
  });

  // 7. Build role-appropriate response
  const result: VerifyResult = {
    verified: "authentic",
    viewerRole,
  };

  switch (viewerRole) {
    case "owner":
      result.member = {
        name: member.name,
        email: member.email,
        tier: member.tier,
        creditBalance: member.creditBalance,
        status: member.status,
        joinedAt: member.joinedAt,
        fields: visibleFields,
        canEdit: true,
      };
      break;

    case "manager":
      result.member = {
        name: member.name,
        email: member.email,
        tier: member.tier,
        creditBalance: member.creditBalance,
        status: member.status,
        joinedAt: member.joinedAt,
        fields: visibleFields,
      };
      break;

    case "staff":
      result.member = {
        name: member.name.split(" ")[0],
        tier: member.tier,
        creditBalance: member.creditBalance,
        status: member.status,
        fields: visibleFields,
      };
      break;

    case "member":
      result.member = {
        name: member.name.split(" ")[0],
        tier: member.tier,
        fields: visibleFields,
      };
      break;

    case "public":
      result.member = { tier: member.tier };
      break;
  }

  // Add tier display info and club name
  if (config) {
    result.club = { name: config.name };
    const tierDef = config.tiers.find(t => t.id === member.tier);
    if (tierDef && result.member) {
      result.member.tierName = tierDef.name;
      result.member.tierColor = tierDef.badge_color;
    }
  }

  return result;
}
