import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductImage from "../components/ProductImage";
import PageHero from "../components/site/PageHero";
import StatsBar from "../components/site/StatsBar";
import Section from "../components/site/Section";
import CtaBanner from "../components/site/CtaBanner";

const COUNTRIES = [
  { flag: "🇧🇩", name: "Bangladesh" },
  { flag: "🇧🇹", name: "Bhutan" },
  { flag: "🇮🇳", name: "India" },
  { flag: "🇵🇰", name: "Pakistan" },
  { flag: "🇱🇰", name: "Sri Lanka" },
];

export default function Home() {
  const featured = products.slice(0, 3);

  return (
    <>
      <PageHero
        image
        label="A student-led shop"
        title={
          <>
            Help Children Worldwide
            <br />
            <span>Through Every Purchase</span>
          </>
        }
        subtitle="We sell 3D-printed items and pledge a share of each sale to support children. Your purchase funds creative prints—and real impact."
      >
        <Link to="/donate" className="btn-primary">
          Donate / Shop
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
          { value: "5", label: "Regions we highlight", tone: "dark" },
          { value: "30–40%", label: "Pledged from each sale", tone: "green" },
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
              <strong className="text-brand-heading">Prints for UNICEF</strong> is a 3D print shop
              run by students who want every child to have a fair chance. We make fidgets, figures,
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

      <Section title="Regions We Talk About" alt>
        <div className="flex flex-wrap justify-center gap-3">
          {COUNTRIES.map((c) => (
            <div
              key={c.name}
              className="w-[120px] rounded-lg border border-brand-border bg-brand-bg px-4 py-5 text-center transition hover:-translate-y-1 hover:border-brand-blue"
            >
              <div className="text-[28px]">{c.flag}</div>
              <div className="mt-1.5 text-xs font-bold text-[#333]">{c.name}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <blockquote className="mx-auto max-w-xl text-center text-base italic leading-relaxed text-[#333]">
          &ldquo;I believe every child deserves safety, school, and a future. This shop is one way we
          can help—one print at a time.&rdquo;
        </blockquote>
        <p className="mt-3 text-center text-sm text-brand-muted">— Prints for UNICEF team</p>
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
        buttonLabel="Donate / Shop Now"
        to="/donate"
      />
    </>
  );
}
