interface Stat {
  label: string;
  value: string | number;
  icon: string;
  sub?: string;
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
          className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">{s.icon}</span>
          </div>
          <p className="text-2xl font-bold text-text">{s.value}</p>
          <div>
            <p className="text-sm font-medium text-text">{s.label}</p>
            {s.sub && <p className="text-xs text-muted">{s.sub}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
