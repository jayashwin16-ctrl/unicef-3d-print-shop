import { Link } from "react-router-dom";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import CtaBanner from "../components/site/CtaBanner";

const REGION_FACTS = [
  {
    icon: "🌏",
    region: "East Asia & Pacific",
    number: "30+",
    text: "Countries and territories where UNICEF runs health, nutrition, and education programs for children.",
    source: "UNICEF East Asia & Pacific",
  },
  {
    icon: "🌍",
    region: "Eastern & Southern Africa",
    number: "20+",
    text: "Countries where UNICEF delivers vaccines, treats malnutrition, and keeps children learning through crises.",
    source: "UNICEF Eastern & Southern Africa",
  },
  {
    icon: "🏔️",
    region: "Europe & Central Asia",
    number: "20+",
    text: "Countries where UNICEF supports refugee and migrant children, inclusive schools, and emergency relief.",
    source: "UNICEF Europe & Central Asia",
  },
  {
    icon: "🌎",
    region: "Latin America & Caribbean",
    number: "30+",
    text: "Countries and territories where UNICEF works on early childhood, safe schools, and protection from violence.",
    source: "UNICEF Latin America & Caribbean",
  },
  {
    icon: "🕌",
    region: "Middle East & North Africa",
    number: "20+",
    text: "Countries where UNICEF responds to conflict and displacement with water, health care, and psychosocial support.",
    source: "UNICEF Middle East & North Africa",
  },
  {
    icon: "🪷",
    region: "South Asia",
    number: "8",
    text: "Countries in this region where UNICEF focuses on literacy, nutrition, and girls' education for hundreds of millions of children.",
    source: "UNICEF South Asia",
  },
  {
    icon: "🌍",
    region: "West & Central Africa",
    number: "24",
    text: "Countries supported from UNICEF's regional hub in Dakar, with focus on vaccines, safe water, and ending child marriage.",
    source: "UNICEF West & Central Africa",
  },
];

const GLOBAL_FACTS = [
  {
    number: "190+",
    text: "Countries and territories where UNICEF works—the widest reach of any organization focused only on children.",
    source: "UNICEF",
  },
  {
    number: "~50%",
    text: "Of each sale from our shop pledged toward children-focused giving aligned with UNICEF's mission.",
    source: "3D Prints for Good",
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
        subtitle="UNICEF organizes much of its work through seven regional offices worldwide. Here is what children face in those focus areas."
      />

      <Section title="Facts by UNICEF focus region">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REGION_FACTS.map((f) => (
            <div
              key={f.region}
              className="rounded-[10px] border border-brand-border bg-brand-card p-6 text-center"
            >
              <div className="text-[28px]">{f.icon}</div>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-brand-blue-dark">
                {f.region}
              </p>
              <div className="mt-3 text-[32px] font-bold text-brand-blue">{f.number}</div>
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

      <Section title="Worldwide snapshot" alt>
        <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
          {GLOBAL_FACTS.map((f) => (
            <div
              key={f.number}
              className="rounded-[10px] border border-brand-border bg-brand-card p-6 text-center"
            >
              <div className="text-[32px] font-bold text-brand-blue">{f.number}</div>
              <p className="mt-2 text-sm leading-relaxed text-[#333]">{f.text}</p>
              <p className="mt-2.5 text-[11px] text-brand-dim">{f.source}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="How our shop fits in">
        <div className="mx-auto max-w-[700px] space-y-4 text-sm leading-relaxed text-[#333]">
          <p>
            We are not a large charity—we are a 3D print shop with a pledge. Each product lists the
            percentage of that sale we set aside for giving aligned with UNICEF&apos;s values,
            across all the regions where UNICEF works.
          </p>
          <p>
            Buying a $10 fidget can mean $5 pledged. Buying a $28 figure can mean $14 pledged. Small
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
