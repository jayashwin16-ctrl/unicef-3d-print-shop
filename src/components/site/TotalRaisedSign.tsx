import { formatRaisedUsd, TOTAL_RAISED_USD } from "../../config/fundraising";

type TotalRaisedSignProps = {
  className?: string;
  size?: "default" | "large";
};

/** Prominent sign showing how much the shop has raised. */
export default function TotalRaisedSign({ className = "", size = "default" }: TotalRaisedSignProps) {
  const large = size === "large";

  return (
    <div
      className={`mx-auto w-fit ${className}`}
      role="region"
      aria-label={`Total amount raised: ${formatRaisedUsd(TOTAL_RAISED_USD)}`}
    >
      <div
        className={`relative rotate-[-1.5deg] rounded-2xl border-4 border-amber-400/90 bg-gradient-to-b from-amber-50 via-white to-amber-50 px-8 py-6 text-center shadow-[0_12px_40px_-8px_rgba(180,83,9,0.35)] dark:border-amber-500 dark:from-amber-950/80 dark:via-slate-800 dark:to-amber-950/60 ${
          large ? "px-10 py-8 md:px-14 md:py-10" : "px-8 py-6"
        }`}
      >
        <div
          className="pointer-events-none absolute inset-2 rounded-xl border-2 border-dashed border-amber-300/60 dark:border-amber-600/40"
          aria-hidden
        />
        <p
          className={`font-extrabold uppercase tracking-[0.2em] text-amber-900 dark:text-amber-200 ${
            large ? "text-sm md:text-base" : "text-xs md:text-sm"
          }`}
        >
          Total amount
        </p>
        <p
          className={`mt-2 font-extrabold tabular-nums tracking-tight text-brand-heading dark:text-white ${
            large ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl"
          }`}
        >
          {formatRaisedUsd(TOTAL_RAISED_USD)}
        </p>
        <p className="mt-2 text-xs font-semibold text-amber-800/90 dark:text-amber-300/90">
          Total raised for UNICEF USA
        </p>
      </div>
    </div>
  );
}
