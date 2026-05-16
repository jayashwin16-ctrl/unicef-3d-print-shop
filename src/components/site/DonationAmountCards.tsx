import { Link } from "react-router-dom";

export type DonationTier = {
  icon: string;
  amount: string;
  impact: string;
  to: string;
};

export default function DonationAmountCards({ tiers }: { tiers: DonationTier[] }) {
  return (
    <div className="mb-10 flex flex-wrap justify-center gap-4">
      {tiers.map((t) => (
        <Link
          key={t.amount + t.to}
          to={t.to}
          className="w-40 rounded-[10px] border border-brand-border bg-brand-card p-5 text-center transition hover:-translate-y-1 hover:border-brand-blue-dark"
        >
          <div className="text-3xl">{t.icon}</div>
          <div className="mt-2 text-xl font-bold text-brand-heading">{t.amount}</div>
          <p className="mt-2 text-xs leading-snug text-brand-muted">{t.impact}</p>
        </Link>
      ))}
    </div>
  );
}
