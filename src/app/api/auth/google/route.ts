import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get("redirectTo") || "/";
  const url = getGoogleAuthUrl(redirectTo);
  return NextResponse.redirect(url);
}
