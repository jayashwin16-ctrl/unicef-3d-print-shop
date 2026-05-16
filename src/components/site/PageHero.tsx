import type { ReactNode } from "react";

type PageHeroProps = {
  label: string;
  title: ReactNode;
  subtitle?: string;
  image?: boolean;
  children?: ReactNode;
};

export default function PageHero({ label, title, subtitle, image, children }: PageHeroProps) {
  return (
    <section
      className={
        image
          ? "relative bg-cover bg-center px-8 py-20 text-center md:py-24"
          : "bg-gradient-to-br from-[#e3f2fd] via-[#f0f7fc] to-[#e3f2fd] px-8 py-16 text-center md:py-20"
      }
      style={
        image
          ? {
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/Photos/home-bg.jpg')",
            }
          : undefined
      }
    >
      <div className={image ? "relative z-10" : ""}>
        <div className={`section-label ${image ? "!text-white/90" : ""}`}>{label}</div>
        <h1
          className={`text-3xl font-bold leading-tight md:text-[32px] ${
            image
              ? "text-white [&_span]:text-[#7ec8f0]"
              : "text-brand-heading [&_span]:text-brand-blue"
          }`}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`mx-auto mt-4 max-w-lg text-sm leading-relaxed ${
              image ? "text-white/85" : "text-brand-muted"
            }`}
          >
            {subtitle}
          </p>
        )}
        {children && <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
