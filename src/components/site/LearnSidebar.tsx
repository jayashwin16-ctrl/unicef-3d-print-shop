import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { path: "/learn", label: "Learn overview", desc: "Start here" },
  { path: "/problem", label: "The problem", desc: "Why kids need help" },
  { path: "/stats", label: "Stats & data", desc: "Numbers by region" },
  { path: "/why", label: "Why we give", desc: "Why UNICEF USA" },
  { path: "/donate", label: "Give to UNICEF USA", desc: "Donate directly" },
  { path: "/faq", label: "Q&A", desc: "Common questions" },
  { path: "/glossary", label: "Glossary", desc: "Words explained" },
  { path: "/tools", label: "Tools", desc: "Calculators" },
] as const;

export default function LearnSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <div className="sticky top-24 rounded-2xl border border-brand-border/80 bg-brand-card p-4 shadow-card">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-accent">Learn menu</p>
        <p className="mt-1 text-xs text-brand-muted">Pick a topic. Each page is written to be easy to read.</p>
        <ul className="mt-4 space-y-1">
          {LINKS.map((l) => {
            const active = pathname === l.path;
            return (
              <li key={l.path}>
                <Link
                  to={l.path}
                  className={`block rounded-xl px-3 py-2.5 transition ${
                    active
                      ? "bg-cyan-50 font-semibold text-cyan-900 ring-1 ring-cyan-200"
                      : "text-brand-muted hover:bg-slate-50 hover:text-brand-heading"
                  }`}
                >
                  <span className="block text-sm">{l.label}</span>
                  <span className="block text-[11px] font-normal opacity-80">{l.desc}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

export function isLearnAreaPath(pathname: string): boolean {
  return ["/learn", "/problem", "/stats", "/why", "/donate", "/faq", "/glossary", "/tools"].some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

/** Horizontal topic picker on phones (sidebar is desktop-only). */
export function LearnMobileNav() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Learn topics"
      className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {LINKS.map((l) => {
        const active = pathname === l.path;
        return (
          <Link
            key={l.path}
            to={l.path}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${
              active
                ? "bg-cyan-600 text-white"
                : "border border-brand-border bg-brand-card text-brand-muted"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
