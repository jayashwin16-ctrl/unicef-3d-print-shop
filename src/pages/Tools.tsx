import { Link } from "react-router-dom";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import PlainEnglish from "../components/site/PlainEnglish";
import ImpactCalculator from "../components/advanced/ImpactCalculator";
import { useSiteShell } from "../components/advanced/SiteShell";

export default function Tools() {
  const { openSearch, openKeyboardHelp } = useSiteShell();

  return (
    <>
      <PageHero
        label="Tools"
        title={
          <>
            Calculators & <span>power tools</span>
          </>
        }
        subtitle="Interactive helpers—still explained in plain language."
      />

      <Section>
        <PlainEnglish className="mx-auto max-w-2xl">
          <p>
            Use these tools to explore how donations work. Press{" "}
            <button type="button" onClick={openSearch} className="font-bold text-cyan-700 underline">
              ⌘K
            </button>{" "}
            to search the whole site, or{" "}
            <button type="button" onClick={openKeyboardHelp} className="font-bold text-cyan-700 underline">
              ?
            </button>{" "}
            for keyboard shortcuts.
          </p>
        </PlainEnglish>
      </Section>

      <Section title="Donation impact" alt>
        <ImpactCalculator className="mx-auto max-w-2xl" />
      </Section>

      <Section title="More helpers">
        <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
          <Link to="/glossary" className="card-premium block p-5 !translate-y-0">
            <h3 className="font-bold text-brand-heading dark:text-white">Glossary</h3>
            <p className="mt-1 text-sm text-brand-muted">UNICEF, PLA, Stripe, and other words—defined simply.</p>
          </Link>
          <Link to="/faq" className="card-premium block p-5 !translate-y-0">
            <h3 className="font-bold text-brand-heading dark:text-white">Q&A</h3>
            <p className="mt-1 text-sm text-brand-muted">Checkout, pickup, and donations answered step by step.</p>
          </Link>
        </div>
      </Section>
    </>
  );
}
