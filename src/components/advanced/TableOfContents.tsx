import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

export default function TableOfContents({ containerSelector = "main" }: { containerSelector?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const root = document.querySelector(containerSelector);
    if (!root) return;

    const nodes = root.querySelectorAll<HTMLElement>("h2.section-title[id]");
    const list: Heading[] = [];

    nodes.forEach((el) => {
      if (el.id) list.push({ id: el.id, text: el.textContent?.trim() ?? "" });
    });

    setHeadings(list);
  }, [containerSelector]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5] }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="hidden xl:block">
      <div className="sticky top-24 w-52 rounded-2xl border border-brand-border/80 bg-brand-card p-4 shadow-card dark:border-slate-600 dark:bg-slate-800">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-accent">On this page</p>
        <ul className="mt-3 space-y-1 text-sm">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`block rounded-lg px-2 py-1.5 transition ${
                  active === h.id
                    ? "bg-cyan-50 font-semibold text-cyan-900 dark:bg-cyan-950/60 dark:text-cyan-100"
                    : "text-brand-muted hover:bg-slate-50 hover:text-brand-heading dark:hover:bg-slate-700"
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
