import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "membership_session";
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

interface Session {
  email: string;
  name: string;
  expiresAt: number;
}

function sign(payload: string): string {
  const secret = process.env.SESSION_SECRET!;
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verify(token: string): string | null {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;
  const payload = token.slice(0, lastDot);
  const expected = sign(payload);
  const tokenBuf = Buffer.from(token);
  const expectedBuf = Buffer.from(expected);
  if (tokenBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(tokenBuf, expectedBuf)) return null;
  return payload;
}

export async function setSession(email: string, name: string): Promise<void> {
  const session: Session = {
    email,
    name,
    expiresAt: Date.now() + MAX_AGE * 1000,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const token = sign(payload);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verify(token);
  if (!payload) return null;

  const session: Session = JSON.parse(Buffer.from(payload, "base64url").toString());
  if (Date.now() > session.expiresAt) return null;

  return session;
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function refreshSession(): Promise<void> {
  const session = await getSession();
  if (session) {
    await setSession(session.email, session.name);
  }
}
