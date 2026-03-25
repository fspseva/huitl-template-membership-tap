import { TierBadge } from "./TierBadge";
import { FieldRenderer } from "./display/FieldRenderer";

interface MemberData {
  name?: string;
  email?: string;
  tier?: string;
  tierName?: string;
  tierColor?: string;
  creditBalance?: number;
  status?: string;
  joinedAt?: string;
  fields?: Array<{ id: string; name: string; display_type: string; value: unknown }>;
  canEdit?: boolean;
}

interface Props {
  member: MemberData;
  viewerRole: string;
  clubName?: string;
  tapUrl?: string;
}

export function MemberCard({ member, viewerRole, clubName, tapUrl }: Props) {
  return (
    <div className="w-full max-w-[420px] bg-[var(--card)] rounded-[28px] p-6 pb-8 flex flex-col items-center shadow-2xl shadow-black/50 border border-white/[0.02]">
      <div className="mb-4">
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" stroke="#1b8b3a" strokeWidth="3" fill="rgba(27,139,58,0.1)" />
          <path d="M20 32l8 8 16-16" stroke="#2dd46c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {member.tierName && (
        <div className="mb-4">
          <TierBadge name={member.tierName} color={member.tierColor || "var(--accent)"} />
        </div>
      )}

      {member.name && (
        <h2 className="text-[22px] font-bold text-[var(--foreground)] mb-1">{member.name}</h2>
      )}

      {viewerRole === "public" && clubName && (
        <p className="text-[var(--muted)] text-[14px] mb-4">{clubName} Member</p>
      )}

      {member.status === "suspended" && (viewerRole === "staff" || viewerRole === "manager" || viewerRole === "owner") && (
        <div className="w-full rounded-[12px] p-3 bg-[var(--warning)]/10 border border-[var(--warning)]/20 mb-4">
          <p className="text-[13px] text-center text-[var(--warning)]">Account Suspended</p>
        </div>
      )}

      {(member.email || member.creditBalance !== undefined) && (
        <div className="w-full bg-[var(--inner-card)] rounded-[20px] p-5 mb-4">
          <table className="w-full text-[14px]">
            <tbody>
              {member.email && (
                <tr className="border-b border-[var(--divider)]/30">
                  <td className="py-3 text-[var(--muted)]">Email</td>
                  <td className="py-3 text-right text-[var(--foreground)]">{member.email}</td>
                </tr>
              )}
              {member.creditBalance !== undefined && (
                <tr className="border-b border-[var(--divider)]/30">
                  <td className="py-3 text-[var(--muted)]">Credit</td>
                  <td className="py-3 text-right text-[var(--foreground)] font-medium">{member.creditBalance}</td>
                </tr>
              )}
              {member.joinedAt && (
                <tr>
                  <td className="py-3 text-[var(--muted)]">Since</td>
                  <td className="py-3 text-right text-[var(--foreground)]">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {member.fields && member.fields.length > 0 && (
        <div className="w-full space-y-3 mb-4">
          {member.fields.map(field => (
            <FieldRenderer key={field.id} field={field} />
          ))}
        </div>
      )}

      {viewerRole === "public" && (
        <a
          href={`/?redirectTo=${encodeURIComponent(tapUrl || "/")}`}
          className="w-full bg-white/10 text-[var(--foreground)] font-semibold text-[14px] rounded-xl py-3 flex items-center justify-center mt-2 hover:bg-white/15 transition-colors"
        >
          Sign in to see more
        </a>
      )}

      {member.canEdit && (
        <a
          href="/profile"
          className="w-full bg-[var(--accent)] text-black font-bold text-[15px] rounded-xl py-3.5 flex items-center justify-center mt-2 hover:opacity-90 transition-opacity"
        >
          Edit Profile
        </a>
      )}

      <p className="text-[var(--muted)]/50 text-[12px] font-mono mt-6">
        Powered by HUITL Protocol
      </p>
    </div>
  );
}
