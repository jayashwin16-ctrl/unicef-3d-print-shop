import { Link } from "react-router-dom";

const CARDS = [
  {
    title: "Shop prints",
    description: "Browse fidgets, figures, and collectibles. 60% of proceeds goes to UNICEF USA.",
    to: "/shop",
    cta: "Go to shop",
    accent: "border-brand-blue bg-[#e8f7fc]",
  },
  {
    title: "How it works",
    description: "Get the checkout code, submit pickup details, and pay securely.",
    to: "/how-it-works",
    cta: "See the steps",
    accent: "border-brand-border bg-brand-card",
  },
  {
    title: "Learn why",
    description: "Understand the problem and why we support children worldwide.",
    to: "/problem",
    cta: "Start learning",
    accent: "border-brand-border bg-brand-card",
  },
] as const;

export default function ExploreCards() {
  return (
    <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
      {CARDS.map((c) => (
        <Link
          key={c.to}
          to={c.to}
          className={`flex flex-col rounded-[10px] border p-5 transition hover:-translate-y-0.5 hover:border-brand-blue ${c.accent}`}
        >
          <h3 className="font-bold text-brand-heading">{c.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">{c.description}</p>
          <span className="mt-4 text-sm font-semibold text-brand-blue">{c.cta} →</span>
        </Link>
      ))}
    </div>
  );
}
