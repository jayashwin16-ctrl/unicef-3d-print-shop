import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductImage from "../components/ProductImage";
import PageHero from "../components/site/PageHero";
import StatsBar from "../components/site/StatsBar";
import Section from "../components/site/Section";
import CtaBanner from "../components/site/CtaBanner";

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
        subtitle="We sell 3D-printed items and pledge a share of each sale to support children. Your purchase funds creative prints—and real impact."
      >
        <Link to="/shop" className="btn-primary">
          Shop
        </Link>
        <Link to="/problem" className="btn-outline">
          Learn More
        </Link>
        <p className="mt-10 w-full text-center text-xs uppercase tracking-[0.2em] text-white/85">
          In partnership with UNICEF-aligned giving
        </p>
      </PageHero>

      <StatsBar
        stats={[
          { value: "390M+", label: "Children in extreme poverty (global)", tone: "green" },
          { value: "7", label: "UNICEF regional offices", tone: "dark" },
          { value: "~50%", label: "Pledged from each sale", tone: "green" },
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
              <strong className="text-brand-heading">3D Prints for Good</strong> is a 3D print shop
              created by Jay to help every child have a fair chance. We make fidgets, figures,
              and collectibles—and pledge a meaningful share of each sale to support children.
            </p>
            <p>
              We align our giving with{" "}
              <span className="font-bold text-brand-blue">UNICEF&apos;s mission</span>: health,
              education, and protection for children in need. Our goal is simple:{" "}
              <span className="font-bold text-brand-blue-dark">
                turn everyday purchases into help for kids.
              </span>
            </p>
          </div>
        </div>
      </Section>

      <Section title="Regions UNICEF Focuses On" alt>
        <p className="mx-auto mb-6 max-w-lg text-center text-sm text-brand-muted">
          UNICEF works in more than 190 countries. Most programs are run through seven regional
          offices around the world.
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
