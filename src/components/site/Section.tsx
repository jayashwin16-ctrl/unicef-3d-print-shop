import type { ReactNode } from "react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type SectionProps = {
  label?: string;
  title?: string;
  /** Stable id for in-page navigation / table of contents */
  id?: string;
  alt?: boolean;
  children: ReactNode;
  className?: string;
};

export default function Section({ label, title, id, alt, children, className = "" }: SectionProps) {
  const sectionId = id ?? (title ? slugify(title) : undefined);

  return (
    <section
      id={sectionId}
      data-toc-id={sectionId}
      data-toc-title={title}
      className={`scroll-mt-28 py-16 md:py-20 ${alt ? "border-y border-brand-border/60 bg-brand-card dark:border-slate-700 dark:bg-slate-800/50" : ""} ${className}`}
    >
      <div className="mx-auto max-w-site px-6">
        {label && <div className="section-label">{label}</div>}
        {title && (
          <h2 id={sectionId ? `${sectionId}-heading` : undefined} className="section-title">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
