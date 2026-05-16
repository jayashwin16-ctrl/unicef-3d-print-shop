import type { ReactNode } from "react";

type SectionProps = {
  label?: string;
  title?: string;
  alt?: boolean;
  children: ReactNode;
  className?: string;
};

export default function Section({ label, title, alt, children, className = "" }: SectionProps) {
  return (
    <section className={`py-12 ${alt ? "bg-brand-card" : ""} ${className}`}>
      <div className="mx-auto max-w-site px-6">
        {label && <div className="section-label">{label}</div>}
        {title && <h2 className="section-title">{title}</h2>}
        {children}
      </div>
    </section>
  );
}
