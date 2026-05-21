import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductImage from "../components/ProductImage";
import PageHero from "../components/site/PageHero";
import StatsBar from "../components/site/StatsBar";
import Section from "../components/site/Section";
import CtaBanner from "../components/site/CtaBanner";
import SiteDisclaimer from "../components/SiteDisclaimer";

/** UNICEF’s seven regional offices (where much of their field work is organized). */
const UNICEF_REGIONS = [
  { icon: "🌏", name: "East Asia & Pacific" },
  { icon: "🌍", name: "Eastern & Southern Africa" },
  { icon: "🏔️", name: "Europe & Central Asia" },
  { icon: "🌎", name: "Latin America & Caribbean" },
  { icon: "🕌", name: "Middle East & North Africa" },
  { icon: "🪷", name: "South Asia" },
  { icon: "🌍", name: "West & Central Africa" },
];

export default function Home() {
  const featured = products.slice(0, 3);

  return (
    <>
      <PageHero
        image
        label="This project was created by Jay"
        title={
          <>
            Help Children Worldwide
            <br />
            <span>Through Every Purchase</span>
          </>
        }
        subtitle="We sell 3D-printed items and donate a portion of proceeds to UNICEF USA. Your purchase supports creative prints and charitable giving."
      >
        <Link to="/shop" className="btn-primary">
          Shop
        </Link>
        <Link to="/problem" className="btn-outline">
          Learn More
        </Link>
      </PageHero>

      <div className="border-b border-brand-border bg-brand-card px-6 py-4">
        <SiteDisclaimer variant="banner" className="mx-auto max-w-3xl" />
      </div>

      <StatsBar
        stats={[
          { value: "390M+", label: "Children in extreme poverty (global)", tone: "green" },
          { value: "7", label: "Global regions we highlight", tone: "dark" },
          { value: "Portion", label: "Of proceeds donated", tone: "green" },
          { value: "$10+", label: "Prints that make a difference", tone: "dark" },
        ]}
      />

      <Section label="Our Mission" title="What We Do">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-6 md:flex-row">
          <div className="flex min-h-[180px] flex-1 items-center justify-center overflow-hidden rounded-[10px] border border-brand-border bg-brand-card">
            <img
              src="/Photos/home-bg.jpg"
              alt="Children and community"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 text-sm leading-relaxed text-[#333]">
            <p className="mb-3.5">
              <strong className="text-brand-heading">3D Prints for Good</strong> is an independent
              student 3D print shop created by Jay. We make fidgets, figures, and collectibles—and
              donate a portion of proceeds to{" "}
              <span className="font-bold text-brand-blue">UNICEF USA</span>.
            </p>
            <p>
              Our goal is simple:{" "}
              <span className="font-bold text-brand-blue-dark">
                turn everyday purchases into support for children in need.
              </span>{" "}
              We are not affiliated with, sponsored by, or endorsed by UNICEF or UNICEF USA.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Regions where children need support" alt>
        <p className="mx-auto mb-6 max-w-lg text-center text-sm text-brand-muted">
          UNICEF USA supports programs in more than 190 countries. These seven regions reflect
          where much of that work is organized worldwide.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {UNICEF_REGIONS.map((r) => (
            <div
              key={r.name}
              className="w-[140px] rounded-lg border border-brand-border bg-brand-bg px-3 py-5 text-center transition hover:-translate-y-1 hover:border-brand-blue"
            >
              <div className="text-[28px]">{r.icon}</div>
              <div className="mt-1.5 text-xs font-bold leading-snug text-[#333]">{r.name}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <blockquote className="mx-auto max-w-xl text-center text-base italic leading-relaxed text-[#333]">
          &ldquo;I believe every child deserves safety, school, and a future. This shop is one way we
          can help—one print at a time.&rdquo;
        </blockquote>
        <p className="mt-3 text-center text-sm text-brand-muted">— Jay</p>
      </Section>

      <Section title="Featured prints" alt>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="overflow-hidden rounded-[10px] border border-brand-border bg-brand-card transition hover:-translate-y-1 hover:border-brand-blue"
            >
              <ProductImage product={p} className="h-40" />
              <div className="p-4">
                <h3 className="font-semibold text-brand-heading">{p.title}</h3>
                <p className="mt-1 text-sm text-brand-blue-dark">{p.donationPercent}% pledged</p>
                <p className="mt-2 font-medium text-brand-heading">
                  {p.currency} {p.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link to="/shop" className="font-semibold text-brand-blue hover:underline">
            View all products →
          </Link>
        </p>
      </Section>

      <CtaBanner
        title="Ready to Make a Difference?"
        text="Shop our prints or learn how your purchase supports children."
        buttonLabel="Shop Now"
        to="/shop"
      />
    </>
  );
}
