import type { ReactNode } from "react";

type PageHeroProps = {
  label: string;
  title?: ReactNode;
  subtitle?: string;
  image?: boolean;
  children?: ReactNode;
};

export default function PageHero({ label, title, subtitle, image, children }: PageHeroProps) {
  if (image) {
    return (
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Photos/home-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/75 via-brand-ink/60 to-brand-ink/85" />
        <div className="absolute inset-0 bg-mesh-hero opacity-90" />
        <div className="relative z-10 mx-auto max-w-site px-6 py-24 text-center md:py-32">
          <p className="animate-fade-up text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-300/90">
            {label}
          </p>
          {title && (
            <h1 className="animate-fade-up mt-4 text-4xl font-extrabold tracking-tight text-white md:text-display-lg [&_span]:text-gradient">
              {title}
            </h1>
          )}
          {subtitle && (
            <p
              className={`animate-fade-up mx-auto max-w-prose text-base leading-relaxed text-slate-200 md:text-lg ${title ? "mt-6" : "mt-4"}`}
            >
              {subtitle}
            </p>
          )}
          {children && (
            <div className="animate-fade-up mt-10 flex flex-wrap justify-center gap-4">{children}</div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-brand-border bg-brand-bg bg-mesh-hero">
      <div className="mx-auto max-w-site px-6 py-16 text-center md:py-20">
        <p className="section-label">{label}</p>
        {title && (
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-heading md:text-display [&_span]:text-gradient">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mx-auto mt-5 max-w-prose text-base leading-relaxed text-brand-muted">{subtitle}</p>
        )}
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
