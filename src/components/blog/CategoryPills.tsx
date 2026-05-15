import type { BlogCategory } from "@/lib/blog.functions";

export function CategoryPills({
  categories,
  active,
  onChange,
}: {
  categories: BlogCategory[];
  active: string | null;
  onChange: (name: string | null) => void;
}) {
  const Pill = ({
    label,
    isActive,
    onClick,
  }: {
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors"
      style={{
        backgroundColor: isActive ? "#111111" : "rgba(255,255,255,0.7)",
        border: isActive ? "1px solid #111111" : "1px solid #E8E3DC",
        color: isActive ? "#ffffff" : "#6b4c44",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto max-w-[1100px] px-6 pb-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Pill label="All" isActive={active === null} onClick={() => onChange(null)} />
        {categories.map((c) => (
          <Pill
            key={c.id}
            label={c.name}
            isActive={active === c.name}
            onClick={() => onChange(c.name)}
          />
        ))}
      </div>
    </div>
  );
}
