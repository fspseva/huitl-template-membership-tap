import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get("redirectTo") || "/";
  const safeRedirect = redirectTo.startsWith("/") && !redirectTo.startsWith("//") && !redirectTo.includes("://") ? redirectTo : "/";
  const url = getGoogleAuthUrl(safeRedirect);
  return NextResponse.redirect(url);
}
