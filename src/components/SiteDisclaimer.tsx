/** Legal disclaimer — show anywhere we mention UNICEF or donations. */
export const SITE_DISCLAIMER =
  "3D Prints for Good is an independent student project. A portion of proceeds will be donated to UNICEF USA. This project is not affiliated with, sponsored by, or endorsed by UNICEF or UNICEF USA.";

type SiteDisclaimerProps = {
  className?: string;
  variant?: "inline" | "banner";
};

export default function SiteDisclaimer({
  className = "",
  variant = "inline",
}: SiteDisclaimerProps) {
  if (variant === "banner") {
    return (
      <aside
        className={`rounded-lg border border-brand-border bg-brand-bg px-4 py-3 text-sm leading-relaxed text-brand-muted ${className}`}
        role="note"
      >
        {SITE_DISCLAIMER}
      </aside>
    );
  }

  return (
    <p className={`text-sm leading-relaxed text-brand-muted ${className}`}>{SITE_DISCLAIMER}</p>
  );
}
