import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductImage from "../components/ProductImage";
import PageHero from "../components/site/PageHero";
import StatsBar from "../components/site/StatsBar";
import Section from "../components/site/Section";
import CtaBanner from "../components/site/CtaBanner";
import FavoritePrintSpotlight from "../components/site/FavoritePrintSpotlight";

export default function Home() {
  const featured = products.slice(0, 3);

  return (
    <>
      <PageHero
        image
        label="This project was created by Jay"
        subtitle="A student 3D print shop. 60% of proceeds goes to UNICEF USA."
      >
        <Link to="/shop" className="btn-primary">
          Shop prints
        </Link>
        <Link to="/how-it-works" className="btn-outline">
          How it works
        </Link>
      </PageHero>

      <FavoritePrintSpotlight />

      <StatsBar
        stats={[
          { value: "390M+", label: "Children in extreme poverty (global)", tone: "green" },
          { value: "60%", label: "Of proceeds donated", tone: "green" },
          { value: "5", label: "Prints in our shop", tone: "dark" },
          { value: "$9.99+", label: "Starting price", tone: "dark" },
        ]}
      />

      <Section label="Our Mission" title="What We Do">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 md:flex-row">
          <div className="flex min-h-[200px] flex-1 overflow-hidden rounded-2xl border border-brand-border/80 shadow-card">
            <img src="/Photos/home-bg.png" alt="Children and community" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 text-sm leading-relaxed text-slate-700">
            <p className="mb-3.5">
              <strong className="text-brand-heading">3D Prints for Good</strong> is an independent
              student 3D print shop run by Jay (age 10) with parent supervision.
            </p>
            <p className="mb-3.5">
              60% of proceeds from every purchase is donated to{" "}
              <span className="font-bold text-brand-accent">UNICEF USA</span>.
            </p>
            <p>We are not affiliated with, sponsored by, or endorsed by UNICEF or UNICEF USA.</p>
          </div>
        </div>
      </Section>

      <Section>
        <blockquote className="mx-auto max-w-xl text-center text-lg italic leading-relaxed text-brand-heading">
          &ldquo;I believe every child deserves safety, school, and a future. This shop is one way we
          can help—one print at a time.&rdquo;
        </blockquote>
        <p className="mt-3 text-center text-sm text-brand-muted">— Jay</p>
      </Section>

      <Section title="Featured prints" alt>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} className="card-premium group">
              <ProductImage product={p} className="h-40" />
              <div className="p-4">
                <h3 className="font-semibold text-brand-heading group-hover:text-brand-accent">{p.title}</h3>
                <p className="mt-1 text-sm text-cyan-800">{p.donationPercent}% donated</p>
                <p className="mt-2 font-bold text-brand-heading">
                  {p.currency} {p.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link to="/shop" className="font-bold text-brand-accent hover:underline">
            View all products →
          </Link>
        </p>
      </Section>

      <CtaBanner
        title="Ready to help?"
        text="Browse the shop or learn why we give to UNICEF USA."
        buttonLabel="Shop now"
        to="/shop"
      />
    </>
  );
}
