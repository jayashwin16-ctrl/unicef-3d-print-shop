type Stat = { value: string; label: string; tone?: "green" | "dark" };

export default function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="flex flex-wrap justify-around gap-4 border-y border-brand-border bg-brand-card px-8 py-7">
      {stats.map((s) => (
        <div key={s.label} className="min-w-[120px] text-center">
          <div
            className={`text-[28px] font-bold ${
              s.tone === "dark" ? "text-brand-blue-dark" : "text-brand-blue"
            }`}
          >
            {s.value}
          </div>
          <div className="mt-1 text-[11px] text-brand-muted">{s.label}</div>
        </div>
      ))}
    </section>
  );
}
