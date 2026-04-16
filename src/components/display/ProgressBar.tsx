interface ProgressValue {
  current: number;
  max: number;
  label?: string;
}

export function ProgressBar({ name, value }: { name: string; value: ProgressValue }) {
  const pct = value.max === 0 ? 0 : Math.min(100, Math.max(0, (value.current / value.max) * 100));
  return (
    <div className="bg-[var(--inner-card)] rounded-[16px] p-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-[12px] text-[var(--muted)] uppercase tracking-wider">{name}</p>
        <p className="text-[13px] text-[var(--foreground)]">{value.label || `${value.current}/${value.max}`}</p>
      </div>
      <div className="w-full h-2 bg-[var(--divider)] rounded-full overflow-hidden">
        <div className="h-full bg-[var(--accent)] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
