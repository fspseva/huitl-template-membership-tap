interface KVPair {
  key: string;
  value: string;
}

export function KeyValue({ name, value }: { name: string; value: KVPair[] }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return (
    <div className="bg-[var(--inner-card)] rounded-[16px] p-4">
      <p className="text-[12px] text-[var(--muted)] uppercase tracking-wider mb-3">{name}</p>
      <table className="w-full text-[13px]">
        <tbody>
          {value.map((pair, i) => (
            <tr key={i} className={i < value.length - 1 ? "border-b border-[var(--divider)]/30" : ""}>
              <td className="py-2 text-[var(--muted)]">{pair.key}</td>
              <td className="py-2 text-right text-[var(--foreground)]">{pair.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
