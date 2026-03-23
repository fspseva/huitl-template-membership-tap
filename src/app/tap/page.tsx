import { MemberCard } from "@/components/MemberCard";
import { verifyMemberCard } from "@/lib/verify";

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
      return <ErrorCard status="warning" message={data.message!} />;
    }

    if (data.verified === "error") {
      return <ErrorCard message={data.error || data.message!} />;
    }

    return <ErrorCard message={data.message || "Verification failed."} />;
  } catch {
    return <ErrorCard message="Verification temporarily unavailable. Please try again." />;
  }
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
