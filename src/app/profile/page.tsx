"use client";

import { useEffect, useState } from "react";
import { FieldRenderer } from "@/components/display/FieldRenderer";

interface MemberProfile {
  id: string;
  name: string;
  email: string;
  tier: string;
  creditBalance: number;
  customData: Record<string, unknown>;
  sharingPrefs: Record<string, string>;
  status: string;
  joinedAt: string;
}

interface CustomField {
  id: string;
  name: string;
  display_type: string;
  editable_by_member: boolean;
  default_sharing: string;
}

interface ProfileConfig {
  clubName: string;
  tiers: Array<{ id: string; name: string; badge_color: string }>;
  customFields: CustomField[];
}

const SHARING_OPTIONS = ["everyone", "members", "staff", "none"] as const;

export default function ProfilePage() {
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [config, setConfig] = useState<ProfileConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then(r => {
        if (r.status === 401) {
          window.location.href = "/login?redirectTo=/profile";
          return null;
        }
        return r.json();
      })
      .then(data => {
        if (data) {
          setMember(data.member);
          setConfig(data.config);
        }
      })
      .catch(() => setError("Failed to load profile"));
  }, []);

  async function save(updates: Record<string, unknown>) {
    setSaving(true);
    try {
      const resp = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!resp.ok) throw new Error("Save failed");
      const data = await (await fetch("/api/profile")).json();
      setMember(data.member);
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="w-full max-w-[420px] bg-[var(--card)] rounded-[28px] p-6 text-center">
        <p className="text-[var(--danger)]">{error}</p>
      </div>
    );
  }

  if (!member || !config) {
    return (
      <div className="w-full max-w-[420px] bg-[var(--card)] rounded-[28px] p-6 text-center">
        <p className="text-[var(--muted)]">Loading...</p>
      </div>
    );
  }

  const tierDef = config.tiers.find(t => t.id === member.tier);

  return (
    <div className="w-full max-w-[420px] bg-[var(--card)] rounded-[28px] p-6 pb-8 flex flex-col shadow-2xl shadow-black/50 border border-white/[0.02]">
      <h1 className="text-[22px] font-bold text-[var(--foreground)] mb-1 text-center">{member.name}</h1>
      {tierDef && (
        <p className="text-center mb-6">
          <span className="text-[13px] font-bold" style={{ color: tierDef.badge_color }}>
            {tierDef.name}
          </span>
        </p>
      )}

      <div className="bg-[var(--inner-card)] rounded-[16px] p-4 mb-4">
        <p className="text-[12px] text-[var(--muted)] uppercase tracking-wider mb-1">Credit Balance</p>
        <p className="text-[20px] font-bold text-[var(--foreground)]">{member.creditBalance}</p>
      </div>

      {config.customFields.map(field => (
        <div key={field.id} className="mb-4">
          <FieldRenderer
            field={{
              id: field.id,
              name: field.name,
              display_type: field.display_type,
              value: member.customData[field.id],
            }}
          />
          <div className="flex items-center gap-2 mt-2 px-1">
            <span className="text-[11px] text-[var(--muted)]">Visible to:</span>
            <select
              className="text-[11px] bg-[var(--inner-card)] text-[var(--foreground)] border border-[var(--divider)] rounded px-2 py-1"
              value={member.sharingPrefs[field.id] || field.default_sharing}
              onChange={(e) => {
                save({ sharingPrefs: { [field.id]: e.target.value } });
              }}
              disabled={saving}
            >
              {SHARING_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <p className="text-[var(--muted)]/50 text-[12px] font-mono mt-6 text-center">
        Powered by HUITL Protocol
      </p>
    </div>
  );
}
