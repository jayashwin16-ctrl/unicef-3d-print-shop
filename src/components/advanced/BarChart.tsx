export type BarChartItem = {
  label: string;
  value: number;
  display?: string;
  sublabel?: string;
};

export default function BarChart({ items, maxValue }: { items: BarChartItem[]; maxValue?: number }) {
  const max = maxValue ?? Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-4" role="img" aria-label="Bar chart">
      {items.map((item) => {
        const pct = Math.min(100, (item.value / max) * 100);
        return (
          <div key={item.label}>
            <div className="mb-1 flex items-end justify-between gap-2 text-sm">
              <span className="font-semibold text-brand-heading dark:text-slate-100">{item.label}</span>
              <span className="font-bold text-cyan-700 dark:text-cyan-300">
                {item.display ?? item.value}
              </span>
            </div>
            {item.sublabel && <p className="mb-1 text-xs text-brand-muted">{item.sublabel}</p>}
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
