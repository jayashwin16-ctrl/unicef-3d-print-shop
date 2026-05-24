import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductImage from "../components/ProductImage";
import PageHero from "../components/site/PageHero";
import StatsBar from "../components/site/StatsBar";
import Section from "../components/site/Section";
import CtaBanner from "../components/site/CtaBanner";
import ExploreCards from "../components/site/ExploreCards";

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
        subtitle="We sell 3D-printed items and donate 60% of proceeds from every purchase to UNICEF USA."
      >
        <Link to="/shop" className="btn-primary">
          Shop
        </Link>
        <Link to="/how-it-works" className="btn-outline">
          How it works
        </Link>
      </PageHero>

      <StatsBar
        stats={[
          { value: "390M+", label: "Children in extreme poverty (global)", tone: "green" },
          { value: "60%", label: "Of proceeds donated", tone: "green" },
          { value: "5", label: "Prints in our shop", tone: "dark" },
          { value: "$9.99+", label: "Starting price", tone: "dark" },
        ]}
      />

      <Section label="Start here" title="Explore">
        <ExploreCards />
      </Section>

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
              student 3D print shop created by Jay, a 10 year old builder, under parent supervision.
              Jay makes fidgets, figures, and collectibles for people to enjoy.
            </p>
            <p className="mb-3.5">
              60% of proceeds from every purchase is donated to{" "}
              <span className="font-bold text-brand-blue">UNICEF USA</span> to support children
              worldwide.
            </p>
            <p>
              Jay&apos;s goal is simple: turn everyday purchases into support for children in need.
              The site is not affiliated with, sponsored by, or endorsed by UNICEF or UNICEF USA.
            </p>
          </div>
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
                <p className="mt-1 text-sm text-brand-blue-dark">{p.donationPercent}% donated</p>
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
        text="See how to buy, or browse the shop."
        buttonLabel="How it works"
        to="/how-it-works"
      />
    </>
  );
}
