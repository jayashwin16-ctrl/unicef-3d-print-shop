type Stat = { value: string; label: string; tone?: "green" | "dark" };

export default function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-y border-brand-border/80 bg-brand-card">
      <div className="mx-auto grid max-w-site grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4 md:py-12">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div
              className={`text-3xl font-extrabold tracking-tight md:text-4xl ${
                s.tone === "dark" ? "text-brand-heading" : "text-gradient"
              }`}
            >
              {s.value}
            </div>
            <div className="mt-2 text-xs font-medium leading-snug text-brand-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
