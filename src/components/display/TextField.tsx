export function TextField({ name, value }: { name: string; value: string }) {
  return (
    <div className="bg-[var(--inner-card)] rounded-[16px] p-4">
      <p className="text-[12px] text-[var(--muted)] uppercase tracking-wider mb-1">{name}</p>
      <p className="text-[14px] text-[var(--foreground)]">{value}</p>
    </div>
  );
}
