export function NumberField({ name, value }: { name: string; value: number }) {
  return (
    <div className="bg-[var(--inner-card)] rounded-[16px] p-4">
      <p className="text-[12px] text-[var(--muted)] uppercase tracking-wider mb-1">{name}</p>
      <p className="text-[20px] font-bold text-[var(--foreground)]">{value.toLocaleString()}</p>
    </div>
  );
}
