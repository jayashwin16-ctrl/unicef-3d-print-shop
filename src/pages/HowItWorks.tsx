import { Link } from "react-router-dom";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import ExploreCards from "../components/site/ExploreCards";

const STEPS = [
  {
    n: 1,
    title: "Browse the shop",
    body: "Pick a print and add it to your cart, or use Buy now on a product page.",
    link: { to: "/shop", label: "Shop" },
  },
  {
    n: 2,
    title: "Enter the checkout code",
    body: "At checkout, enter the 5-digit code from the shop. You cannot pay without it.",
    link: { to: "/cart", label: "Cart & checkout" },
  },
  {
    n: 3,
    title: "School pickup details",
    body: "Enter your name, grade, and email (for receipt). Then continue to payment.",
    link: null,
  },
  {
    n: 4,
    title: "Pay securely",
    body: "Pay with card on Stripe. You will get a receipt email and a verification PIN for pickup.",
    link: null,
  },
  {
    n: 5,
    title: "Pick up at school",
    body: "Bring your PIN if asked. 60% of proceeds from your purchase is donated to UNICEF USA.",
    link: null,
  },
];

export default function HowItWorks() {
  return (
    <>
      <PageHero
        label="How it works"
        title={
          <>
            Buying from <span className="text-brand-blue">3D Prints for Good</span>
          </>
        }
        subtitle="Five simple steps—from the shop to school pickup."
      />

      <Section>
        <ol className="mx-auto max-w-xl space-y-6">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="flex gap-4 rounded-[10px] border border-brand-border bg-brand-card p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                {s.n}
              </span>
              <div>
                <h2 className="font-bold text-brand-heading">{s.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-[#333]">{s.body}</p>
                {s.link && (
                  <Link to={s.link.to} className="mt-2 inline-block text-sm font-semibold text-brand-blue hover:underline">
                    {s.link.label} →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Want to give another way?" alt>
        <p className="mx-auto max-w-lg text-center text-sm text-brand-muted">
          Buying a print supports our shop and UNICEF USA through our 60% pledge. You can also donate
          directly on{" "}
          <a
            href="https://www.unicefusa.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-blue underline"
          >
            unicefusa.org
          </a>
          .
        </p>
        <p className="mt-6 text-center">
          <Link to="/donate" className="font-semibold text-brand-blue hover:underline">
            Official UNICEF USA links →
          </Link>
        </p>
      </Section>

      <Section label="Explore" title="Where to go next">
        <ExploreCards />
      </Section>
    </>
  );
}
