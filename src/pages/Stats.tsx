import { Link } from "react-router-dom";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import CtaBanner from "../components/site/CtaBanner";
import PlainEnglish from "../components/site/PlainEnglish";
import BarChart from "../components/advanced/BarChart";
import { UNICEF_REGIONS_OVERVIEW } from "../config/siteNav";

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
    number: "60%",
    text: "Of proceeds from each sale on our shop goes to UNICEF USA (independent student project).",
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

      <Section>
        <PlainEnglish className="mx-auto max-w-2xl">
          <p>
            These numbers come from UNICEF regional offices. The chart below compares how many
            countries each region covers—bigger bars mean more countries in that regional group.
          </p>
        </PlainEnglish>
      </Section>

      <Section title="Regions at a glance" alt>
        <div className="mx-auto max-w-2xl">
          <BarChart
            items={[
              { label: "East Asia & Pacific", value: 30, display: "30+" },
              { label: "Latin America & Caribbean", value: 30, display: "30+" },
              { label: "West & Central Africa", value: 24, display: "24" },
              { label: "Eastern & Southern Africa", value: 20, display: "20+" },
              { label: "Europe & Central Asia", value: 20, display: "20+" },
              { label: "Middle East & North Africa", value: 20, display: "20+" },
              { label: "South Asia", value: 8, display: "8" },
            ]}
          />
        </div>
      </Section>

      <Section title="Seven global regions">
        <p className="mx-auto mb-6 max-w-lg text-center text-sm text-brand-muted">
          UNICEF USA supports programs in more than 190 countries. Much of that work is organized
          through seven regional offices.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {UNICEF_REGIONS_OVERVIEW.map((r) => (
            <div
              key={r.name}
              className="w-[140px] rounded-lg border border-brand-border bg-brand-bg px-3 py-5 text-center"
            >
              <div className="text-[28px]">{r.icon}</div>
              <div className="mt-1.5 text-xs font-bold leading-snug text-[#333]">{r.name}</div>
            </div>
          ))}
        </div>
      </Section>

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
          Facts above cite UNICEF regional sources. For official UNICEF USA information, visit{" "}
          <a
            href="https://www.unicefusa.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-blue underline"
          >
            unicefusa.org
          </a>
          . This site is not affiliated with or endorsed by UNICEF or UNICEF USA.
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
            We are not a large charity—we are an independent student 3D print shop. We donate 60% of
            proceeds from every purchase to UNICEF USA to support children in regions like those
            described above.
          </p>
          <p>
            Small purchases add up when many people participate. Thank you for supporting this
            project.
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
        text="Shop prints or give directly through UNICEF USA."
        buttonLabel="Donate / Shop Now"
        to="/donate"
      />
    </>
  );
}
