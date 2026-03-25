import { getSession } from "@/lib/session";
import { LogoutButton } from "@/components/LogoutButton";
import { getDb, schema } from "@/db/index";
import { eq } from "drizzle-orm";

interface HomeProps {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const session = await getSession();
  const redirectTo = params.redirectTo || "/";
  const error = params.error;

  let isMember = false;
  let isDashboardUser = false;

  if (session) {
    const db = getDb();
    const member = await db.query.members.findFirst({
      where: eq(schema.members.email, session.email),
    });
    const dashUser = await db.query.dashboardUsers.findFirst({
      where: eq(schema.dashboardUsers.email, session.email),
    });
    isMember = !!member;
    isDashboardUser = !!dashUser;
  }

  return (
    <div className="w-full max-w-[420px] bg-[var(--card)] rounded-[28px] p-6 pb-8 flex flex-col items-center shadow-2xl shadow-black/50 border border-white/[0.02]">
      <div className="w-16 h-16 mb-6 flex items-center justify-center">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 20C25.373 20 20 25.373 20 32s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="var(--accent)"/>
          <path d="M32 12c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20zm0 34c-7.732 0-14-6.268-14-14s6.268-14 14-14 14 6.268 14 14-6.268 14-14 14z" fill="var(--accent)" opacity="0.5"/>
          <path d="M32 4C17.088 4 5 16.088 5 31s12.088 28 27 28 27-12.088 27-28S46.912 4 32 4zm0 50C19.318 54 9 43.682 9 31S19.318 8 32 8s23 10.318 23 23-10.318 23-23 23z" fill="var(--accent)" opacity="0.2"/>
        </svg>
      </div>
      <h1 className="text-[28px] font-bold tracking-[0.15em] text-[var(--foreground)] mb-2">
        MEMBERSHIP
      </h1>
      <p className="text-[var(--muted)] text-center text-[15px] leading-relaxed mb-8">
        {session ? "Tap a membership card." : "Tap a membership card or sign in."}
      </p>

      {error && (
        <div className="w-full rounded-[12px] p-3 bg-[var(--danger)]/10 border border-[var(--danger)]/20 mb-6">
          <p className="text-[13px] text-center text-[var(--danger)]">
            Authentication failed. Please try again.
          </p>
        </div>
      )}

      {session ? (
        <div className="w-full flex flex-col items-center gap-3 mb-4">
          <p className="text-[var(--accent)] text-[14px]">
            Signed in as {session.name}
          </p>

          <div className="w-full flex gap-3">
            {isMember && (
              <a
                href="/profile"
                className="flex-1 bg-white/10 text-[var(--foreground)] font-semibold text-[14px] rounded-xl py-3 flex items-center justify-center hover:bg-white/15 transition-colors"
              >
                Edit Profile
              </a>
            )}
            {isDashboardUser && (
              <a
                href="/dashboard"
                className="flex-1 bg-white/10 text-[var(--foreground)] font-semibold text-[14px] rounded-xl py-3 flex items-center justify-center hover:bg-white/15 transition-colors"
              >
                Dashboard
              </a>
            )}
          </div>

          <LogoutButton />
        </div>
      ) : (
        <a
          href={`/api/auth/google?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="w-full bg-white text-black font-semibold text-[15px] rounded-xl py-3.5 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 2.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </a>
      )}

      <p className="text-[var(--muted)]/50 text-[12px] font-mono mt-6">
        Powered by HUITL Protocol
      </p>
    </div>
  );
}
