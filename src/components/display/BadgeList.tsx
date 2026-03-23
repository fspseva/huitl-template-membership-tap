export function BadgeList({ name, value }: { name: string; value: string[] }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return (
    <div className="bg-[var(--inner-card)] rounded-[16px] p-4">
      <p className="text-[12px] text-[var(--muted)] uppercase tracking-wider mb-3">{name}</p>
      <div className="flex flex-wrap gap-2">
        {value.map((badge, i) => (
          <span key={i} className="px-3 py-1 rounded-full text-[12px] bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}
