interface GalleryItem {
  url?: string;
  label?: string;
  [key: string]: unknown;
}

export function ImageGallery({ name, value }: { name: string; value: GalleryItem[] }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return (
    <div className="bg-[var(--inner-card)] rounded-[16px] p-4">
      <p className="text-[12px] text-[var(--muted)] uppercase tracking-wider mb-3">{name}</p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {value.map((item, i) => (
          <div key={i} className="flex-shrink-0 w-[140px]">
            {item.url ? (
              <img src={item.url} alt={item.label || ""} className="w-full h-[100px] object-cover rounded-[12px] mb-2" />
            ) : (
              <div className="w-full h-[100px] bg-[var(--divider)] rounded-[12px] mb-2 flex items-center justify-center text-[var(--muted)] text-[12px]">
                No image
              </div>
            )}
            {item.label && (
              <p className="text-[13px] text-[var(--foreground)] truncate">{item.label}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
