import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductImage from "../components/ProductImage";
import PageHero from "../components/site/PageHero";
import StatsBar from "../components/site/StatsBar";
import Section from "../components/site/Section";
import CtaBanner from "../components/site/CtaBanner";
import PlainEnglish from "../components/site/PlainEnglish";
import TotalRaisedSign from "../components/site/TotalRaisedSign";
import FavoritePrintSpotlight from "../components/site/FavoritePrintSpotlight";
import { LEARN_LINKS, PROJECT_LINKS, SHOP_LINKS } from "../config/siteNav";

const SITE_MAP = [
  { group: "Shop", links: SHOP_LINKS },
  { group: "Learn", links: [...LEARN_LINKS, { path: "/faq", label: "Q&A" }, { path: "/tools", label: "Tools" }] },
  { group: "Project", links: PROJECT_LINKS },
] as const;

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
        subtitle="A student 3D print shop that donates 60% of proceeds to UNICEF USA—explained simply, step by step."
      >
        <Link to="/shop" className="btn-primary">
          Shop prints
        </Link>
        <Link to="/learn" className="btn-outline">
          Learn (start here)
        </Link>
      </PageHero>

      <FavoritePrintSpotlight />

      <section className="border-b border-brand-border/80 bg-brand-bg px-4 py-10 dark:border-slate-700 dark:bg-slate-950">
        <TotalRaisedSign size="large" />
      </section>

      <StatsBar
        stats={[
          { value: "390M+", label: "Children in extreme poverty (global)", tone: "green" },
          { value: "60%", label: "Of proceeds donated", tone: "green" },
          { value: "5", label: "Prints in our shop", tone: "dark" },
          { value: "$9.99+", label: "Starting price", tone: "dark" },
        ]}
      />

      <Section>
        <PlainEnglish className="mx-auto max-w-2xl">
          <p>
            <strong>Welcome.</strong> This site sells 3D-printed toys and figures to raise money for
            children in need. Jay (age 10, with a parent helping) runs the shop. We are{" "}
            <strong>not</strong> UNICEF—we support UNICEF USA by donating part of each sale.
          </p>
        </PlainEnglish>
      </Section>

      <Section label="Power features" title="Advanced tools (still easy to use)" alt>
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "⌘K Search", desc: "Find any page, product, or FAQ instantly", to: "/tools" },
            { title: "Dark mode", desc: "Open Preferences (gear icon) in the header", to: "/tools" },
            { title: "Impact calculator", desc: "See how much goes to UNICEF USA per purchase", to: "/tools" },
            { title: "Glossary", desc: "Every hard word explained in plain English", to: "/glossary" },
          ].map((f) => (
            <Link key={f.title} to={f.to} className="card-premium block p-4 !translate-y-0 hover:!shadow-card">
              <h3 className="font-bold text-brand-heading dark:text-white">{f.title}</h3>
              <p className="mt-1 text-xs text-brand-muted">{f.desc}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section label="Choose your path" title="What do you want to do?">
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
          <Link to="/how-it-works" className="card-premium block p-6">
            <span className="text-2xl">🛒</span>
            <h3 className="mt-3 font-bold text-brand-heading">Buy a print</h3>
            <p className="mt-2 text-sm text-brand-muted">
              See the 3 steps: code → pickup info → pay. Then open the shop.
            </p>
            <span className="mt-4 inline-block text-sm font-bold text-brand-accent">How it works →</span>
          </Link>
          <Link to="/learn" className="card-premium block p-6">
            <span className="text-2xl">📖</span>
            <h3 className="mt-3 font-bold text-brand-heading">Learn why it matters</h3>
            <p className="mt-2 text-sm text-brand-muted">
              Read about the problem, see stats, and learn why we give to UNICEF USA.
            </p>
            <span className="mt-4 inline-block text-sm font-bold text-brand-accent">Learn hub →</span>
          </Link>
          <Link to="/donate" className="card-premium block p-6">
            <span className="text-2xl">💙</span>
            <h3 className="mt-3 font-bold text-brand-heading">Donate directly</h3>
            <p className="mt-2 text-sm text-brand-muted">
              Skip the shop and give straight to UNICEF USA through their official site.
            </p>
            <span className="mt-4 inline-block text-sm font-bold text-brand-accent">Donate links →</span>
          </Link>
        </div>
      </Section>

      <Section label="Our Mission" title="What We Do">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 md:flex-row">
          <div className="flex min-h-[200px] flex-1 overflow-hidden rounded-2xl border border-brand-border/80 shadow-card">
            <img src="/Photos/home-bg.jpg" alt="Children and community" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 text-sm leading-relaxed text-slate-700">
            <p className="mb-3.5">
              <strong className="text-brand-heading">3D Prints for Good</strong> is an independent
              student 3D print shop created by Jay, a 10 year old builder, under parent supervision.
              Jay makes fidgets, figures, and collectibles for people to enjoy.
            </p>
            <p className="mb-3.5">
              60% of proceeds from every purchase is donated to{" "}
              <span className="font-bold text-brand-accent">UNICEF USA</span>.
            </p>
            <p>
              Jay&apos;s goal is simple: turn everyday purchases into support for children in need.
              The site is not affiliated with, sponsored by, or endorsed by UNICEF or UNICEF USA.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Full site map" alt>
        <p className="mx-auto mb-8 max-w-lg text-center text-sm text-brand-muted">
          Every page on this website, grouped so you can find your way.
        </p>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {SITE_MAP.map((g) => (
            <div key={g.group} className="rounded-2xl border border-brand-border/80 bg-brand-card p-5 shadow-soft">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-accent">{g.group}</h3>
              <ul className="mt-3 space-y-2">
                {g.links.map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="text-sm font-medium text-brand-heading hover:text-brand-accent hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
        title="Still have questions?"
        text="Read the FAQ or see how checkout works."
        buttonLabel="Questions & answers"
        to="/faq"
      />
    </>
  );
}
