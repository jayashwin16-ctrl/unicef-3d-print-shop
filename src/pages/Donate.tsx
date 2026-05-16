import { Link } from "react-router-dom";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import DonationAmountCards from "../components/site/DonationAmountCards";
import { products } from "../data/products";

const SHOP_TIERS = products.map((p) => ({
  icon: p.category.includes("Fidget") ? "🥚" : p.category.includes("Figures") ? "🐉" : "⚔️",
  amount: `$${p.price}`,
  impact: `${p.donationPercent}% pledged — ${p.title}`,
  to: `/product/${p.id}`,
}));

export default function Donate() {
  return (
    <>
      <PageHero
        label="Take Action"
        title={
          <>
            Make a <span className="text-brand-blue">Difference</span>
          </>
        }
      />

      <Section>
        <p className="mx-auto mb-8 max-w-lg text-center text-base text-[#333]">
          Every purchase pledges 30–40% toward children-focused giving aligned with UNICEF values.
          Pick a print below—or give directly through UNICEF.
        </p>

        <DonationAmountCards tiers={SHOP_TIERS} />

        <div className="mx-auto max-w-lg rounded-[10px] border border-brand-border bg-brand-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e3f2fd] text-2xl font-bold text-brand-blue">
            UNICEF
          </div>
          <p className="text-sm leading-relaxed text-[#333]">
            UNICEF works in more than 190 countries to protect children&apos;s rights, health, and
            education. This shop is an independent student project—not run by UNICEF—but we
            encourage direct giving for maximum impact.
          </p>
          <p className="mt-4 text-lg font-bold text-brand-heading">Give through UNICEF</p>
          <p className="mt-2 text-sm text-brand-muted">
            You&apos;ll go to unicef.org to complete your donation securely.
          </p>
          <a
            href="https://www.unicef.org/donate"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-yellow mt-6 inline-block"
          >
            Donate to UNICEF
          </a>
          <p className="mt-6 text-xs text-brand-dim">
            Or{" "}
            <Link to="/shop" className="font-semibold text-brand-blue underline">
              shop our 3D prints
            </Link>{" "}
            to support through a purchase.
          </p>
        </div>
      </Section>
    </>
  );
}
