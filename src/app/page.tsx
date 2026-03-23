import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();

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
        Tap your membership card to check in.
      </p>

      {session ? (
        <p className="text-[var(--accent)] text-[14px] mb-4">
          Signed in as {session.name}
        </p>
      ) : (
        <a
          href="/login"
          className="w-full bg-white/10 text-[var(--foreground)] font-semibold text-[14px] rounded-xl py-3 flex items-center justify-center mb-4 hover:bg-white/15 transition-colors"
        >
          Sign in
        </a>
      )}

      <p className="text-[var(--muted)]/50 text-[12px] font-mono">
        Powered by HUITL Protocol
      </p>
    </div>
  );
}
