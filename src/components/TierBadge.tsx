export function TierBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-[13px] font-bold tracking-wider border"
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}30`,
        color,
      }}
    >
      {name}
    </span>
  );
}
