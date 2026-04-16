import { NextRequest, NextResponse } from "next/server";
import { exchangeCode, getGoogleUser } from "@/lib/auth";
import { setSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const redirectTo = state ? decodeURIComponent(state) : "/";
  const safeRedirect = redirectTo.startsWith("/") && !redirectTo.startsWith("//") && !redirectTo.includes("://") ? redirectTo : "/";

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  try {
    const { accessToken } = await exchangeCode(code);
    const user = await getGoogleUser(accessToken);
    await setSession(user.email, user.name);
    return NextResponse.redirect(new URL(safeRedirect, request.url));
  } catch {
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }
}
