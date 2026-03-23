interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirectTo || "/";
  const error = params.error;

  return (
    <div className="w-full max-w-[420px] bg-[var(--card)] rounded-[28px] p-6 pb-8 flex flex-col items-center shadow-2xl shadow-black/50 border border-white/[0.02]">
      <h1 className="text-[24px] font-bold text-[var(--foreground)] mb-2">Sign In</h1>
      <p className="text-[var(--muted)] text-center text-[14px] mb-8">
        Sign in to see more when you tap a membership card.
      </p>

      {error && (
        <div className="w-full rounded-[12px] p-3 bg-[var(--danger)]/10 border border-[var(--danger)]/20 mb-6">
          <p className="text-[13px] text-center text-[var(--danger)]">
            Authentication failed. Please try again.
          </p>
        </div>
      )}

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

      <p className="text-[var(--muted)]/50 text-[12px] font-mono mt-8">
        Powered by HUITL Protocol
      </p>
    </div>
  );
}
