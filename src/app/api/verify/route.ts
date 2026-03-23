import { NextRequest, NextResponse } from "next/server";
import { verifyMemberCard } from "@/lib/verify";
import { refreshSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const piccData = request.nextUrl.searchParams.get("picc_data");
  const cmac = request.nextUrl.searchParams.get("cmac");

  if (!piccData || !cmac) {
    return NextResponse.json({ error: "Missing picc_data or cmac" }, { status: 400 });
  }

  // Refresh session in route handler (where cookies can be set)
  await refreshSession();

  const result = await verifyMemberCard(piccData, cmac);

  if (result.error) {
    return NextResponse.json(result, { status: 503 });
  }

  return NextResponse.json(result);
}
