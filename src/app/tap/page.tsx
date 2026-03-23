import { MemberCard } from "@/components/MemberCard";
import { verifyMemberCard } from "@/lib/verify";
import { getSession } from "@/lib/session";

interface TapPageProps {
  searchParams: Promise<{ picc_data?: string; cmac?: string }>;
}

export default async function TapPage({ searchParams }: TapPageProps) {
  const params = await searchParams;
  const { picc_data, cmac } = params;

  if (!picc_data || !cmac) {
    return (
      <ErrorCard message="Invalid scan. Missing verification data." />
    );
  }

  try {
    const data = await verifyMemberCard(picc_data, cmac);

    if (data.verified === "authentic" && data.member) {
      const tapUrl = `/tap?picc_data=${encodeURIComponent(picc_data)}&cmac=${encodeURIComponent(cmac)}`;
      return (
        <MemberCard
          member={data.member}
          viewerRole={data.viewerRole!}
          clubName={data.club?.name}
          tapUrl={tapUrl}
        />
      );
    }

    if (data.verified === "replay") {
      // If user just logged in (has session) and came back to a stale URL,
      // show a friendly re-tap prompt instead of an error
      const session = await getSession();
      if (session) {
        return <RetapCard name={session.name} />;
      }
      return <ErrorCard status="warning" message={data.message!} />;
    }

    if (data.verified === "error") {
      return <ErrorCard message={data.error || data.message!} />;
    }

    return <ErrorCard message={data.message || "Verification failed."} />;
  } catch (err) {
    console.error("Tap page error:", err);
    return <ErrorCard message="Verification temporarily unavailable. Please try again." />;
  }
}

function RetapCard({ name }: { name: string }) {
  return (
    <div className="w-full max-w-[420px] bg-[var(--card)] rounded-[28px] p-6 pb-8 flex flex-col items-center shadow-2xl shadow-black/50 border border-white/[0.02]">
      <div className="mb-4">
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" stroke="var(--accent)" strokeWidth="3" fill="rgba(45,212,108,0.1)" />
          <path d="M20 32l8 8 16-16" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-[20px] font-bold text-[var(--foreground)] mb-2">Welcome, {name}!</h2>
      <p className="text-[var(--muted)] text-center text-[14px] leading-relaxed mb-6">
        You&apos;re signed in. Tap the card again to see the full profile.
      </p>
      <div className="w-full bg-[var(--inner-card)] rounded-[16px] p-4">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
            <path d="M32 20C25.373 20 20 25.373 20 32s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="var(--accent)"/>
            <path d="M32 12c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20zm0 34c-7.732 0-14-6.268-14-14s6.268-14 14-14 14 6.268 14 14-6.268 14-14 14z" fill="var(--accent)" opacity="0.5"/>
          </svg>
          <p className="text-[13px] text-[var(--muted)]">
            Hold your phone near the card for a fresh scan
          </p>
        </div>
      </div>
      <p className="text-[var(--muted)]/50 text-[12px] font-mono mt-6">
        Powered by HUITL Protocol
      </p>
    </div>
  );
}

function ErrorCard({ message, status = "error" }: { message: string; status?: "error" | "warning" }) {
  const color = status === "warning" ? "var(--warning)" : "var(--danger)";
  return (
    <div className="w-full max-w-[420px] bg-[var(--card)] rounded-[28px] p-6 pb-8 flex flex-col items-center shadow-2xl shadow-black/50 border border-white/[0.02]">
      <div className="mb-4">
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="3" fill={`${color}15`} />
          {status === "warning" ? (
            <path d="M32 20v16M32 44h0" stroke={color} strokeWidth="3" strokeLinecap="round" />
          ) : (
            <path d="M24 24l16 16M40 24L24 40" stroke={color} strokeWidth="3" strokeLinecap="round" />
          )}
        </svg>
      </div>
      <div className="w-full rounded-[16px] p-4" style={{ backgroundColor: `${color}15`, borderColor: `${color}30`, borderWidth: 1, borderStyle: "solid" }}>
        <p className="text-[14px] text-center" style={{ color }}>{message}</p>
      </div>
      <p className="text-[var(--muted)]/50 text-[12px] font-mono mt-6">
        Powered by HUITL Protocol
      </p>
    </div>
  );
}
