const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export function getGoogleAuthUrl(redirectTo?: string): string {
  const state = redirectTo ? encodeURIComponent(redirectTo) : "";
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.BASE_URL}/api/auth/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    ...(state ? { state } : {}),
  });
  return `${GOOGLE_AUTH_URL}?${params}`;
}

export async function exchangeCode(code: string): Promise<{ accessToken: string }> {
  const resp = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${process.env.BASE_URL}/api/auth/callback`,
    }),
  });
  const data = (await resp.json()) as { access_token: string; error?: string };
  if (!resp.ok) throw new Error(`Google token exchange failed: ${data.error}`);
  return { accessToken: data.access_token };
}

export async function getGoogleUser(accessToken: string): Promise<{
  id: string;
  email: string;
  name: string;
}> {
  const resp = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = (await resp.json()) as { sub: string; email: string; name: string };
  return { id: data.sub, email: data.email, name: data.name };
}
