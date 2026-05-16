import { Link } from "react-router-dom";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import CtaBanner from "../components/site/CtaBanner";

const FACTS = [
  {
    number: "32M+",
    text: "Children out of school in South Asia alone—before counting the rest of the world.",
    source: "UNESCO / UNICEF estimates",
  },
  {
    number: "50%+",
    text: "Of children in low-income countries cannot read a simple story by age 10.",
    source: "World Bank, learning poverty",
  },
  {
    number: "1 in 5",
    text: "Children worldwide live in conflict zones or fragile settings where school is disrupted.",
    source: "UNICEF",
  },
  {
    number: "2×",
    text: "Girls in some regions are twice as likely as boys to never attend school.",
    source: "UNICEF education reports",
  },
  {
    number: "26M+",
    text: "Child laborers in South Asia—the highest regional total globally.",
    source: "ILO estimates",
  },
  {
    number: "Your $",
    text: "Every purchase from our shop pledges 30–40% toward children-focused giving.",
    source: "Prints for UNICEF shop policy",
  },
];

export default function Stats() {
  return (
    <>
      <PageHero
        label="The Data"
        title={
          <>
            Stats & <span className="text-brand-blue">Data</span>
          </>
        }
        subtitle="Numbers help us understand the scale of the crisis—and why every action matters."
      />

      <Section title="Key facts">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FACTS.map((f) => (
            <div
              key={f.number + f.text.slice(0, 20)}
              className="rounded-[10px] border border-brand-border bg-brand-card p-6 text-center"
            >
              <div className="text-[32px] font-bold text-brand-blue">{f.number}</div>
              <p className="mt-2 text-sm leading-relaxed text-[#333]">{f.text}</p>
              <p className="mt-2.5 text-[11px] text-brand-dim">{f.source}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-xl text-center text-sm text-brand-muted">
          This site is an independent student project. For official UNICEF data and reports, visit{" "}
          <a
            href="https://www.unicef.org/reports"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-blue underline"
          >
            unicef.org/reports
          </a>
          .
        </p>
      </Section>

      <Section title="How our shop fits in" alt>
        <div className="mx-auto max-w-[700px] space-y-4 text-sm leading-relaxed text-[#333]">
          <p>
            We are not a large charity—we are a 3D print shop with a pledge. Each product lists the
            percentage of that sale we set aside for giving aligned with UNICEF&apos;s values.
          </p>
          <p>
            Buying a $10 fidget can mean $4 pledged. Buying a $28 figure can mean $8+ pledged. Small
            purchases add up when many people participate.
          </p>
        </div>
        <p className="mt-8 text-center">
          <Link to="/shop" className="btn-primary">
            Browse the shop
          </Link>
        </p>
      </Section>

      <CtaBanner
        title="Turn data into action"
        text="Shop prints or give directly through UNICEF."
        buttonLabel="Donate / Shop Now"
        to="/donate"
      />
    </>
  );
}
