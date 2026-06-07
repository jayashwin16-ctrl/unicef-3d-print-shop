import { FATHERS_DAY_SALE, isFathersDaySaleActive } from "../lib/pricing";

export default function FathersDayBanner({ className = "" }: { className?: string }) {
  if (!isFathersDaySaleActive()) return null;

  return (
    <div
      className={`rounded-xl border-2 border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 text-center ${className}`}
      role="status"
    >
      <p className="text-sm font-bold text-amber-950">
        🎁 {FATHERS_DAY_SALE.label} — {FATHERS_DAY_SALE.percentOff}% off every print!
      </p>
    </div>
  );
}
