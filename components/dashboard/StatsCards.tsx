import type { LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  Icon: LucideIcon;
  sub?: string;
  iconColor?: string;
}

interface StatsCardsProps {
  stats: Stat[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3 hover:border-brand/30 hover:shadow-sm transition-all"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-light text-brand"
            style={s.iconColor ? { backgroundColor: `${s.iconColor}15`, color: s.iconColor } : undefined}
          >
            <s.Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text leading-tight">{s.value}</p>
            <p className="text-sm font-medium text-text mt-1">{s.label}</p>
            {s.sub && <p className="text-xs text-muted">{s.sub}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
