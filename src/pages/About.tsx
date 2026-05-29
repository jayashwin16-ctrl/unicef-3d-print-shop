import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import SiteDisclaimer from "../components/SiteDisclaimer";
import { LEARN_LINKS } from "../config/siteNav";

export default function About() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    e.currentTarget.reset();
  };

  return (
    <>
      <PageHero
        label="About the project"
        title={
          <>
            Meet <span className="text-brand-blue">Jay</span>
          </>
        }
        subtitle="3D Prints for Good is an independent student shop—60% of proceeds goes to UNICEF USA."
      />

      <Section label="Who runs this shop" title="About Jay">
        <div className="mx-auto max-w-[700px] space-y-4 text-sm leading-relaxed text-[#333]">
          <p>
            <strong className="text-brand-heading">Jay</strong> is a 10 year old builder who runs this
            3D print shop with parent supervision. Jay designs and prints fidgets, figures, and
            collectibles in PLA plastic.
          </p>
          <p>
            60% of proceeds from every purchase is donated to UNICEF USA. This project is not
            affiliated with, sponsored by, or endorsed by UNICEF or UNICEF USA.
          </p>
          <p>
            <Link to="/how-it-works" className="font-semibold text-brand-blue hover:underline">
              How to buy from the shop →
            </Link>
          </p>
        </div>
      </Section>

      <Section title="Learn why this matters" alt>
        <p className="mx-auto mb-6 max-w-lg text-center text-sm text-brand-muted">
          These pages explain the problem, the data, and why we chose UNICEF USA—not our shop rules.
        </p>
        <ul className="mx-auto grid max-w-md gap-2 text-sm">
          {LEARN_LINKS.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className="flex items-center justify-between rounded-lg border border-brand-border bg-brand-card px-4 py-3 font-medium text-brand-heading hover:border-brand-blue"
              >
                {label}
                <span className="text-brand-blue">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="mx-auto max-w-lg rounded-[10px] border border-orange-200 bg-orange-50 p-6">
          <h2 className="text-xl font-bold text-orange-900">Feedback</h2>
          <p className="mt-2 text-sm text-orange-800">
            Tell Jay what you like and what we should improve.
          </p>
          {submitted && (
            <p className="mt-4 rounded-lg bg-orange-200 px-3 py-2 text-sm font-medium text-orange-900">
              Thanks for your feedback!
            </p>
          )}
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="feedbackName" className="mb-1 block text-sm font-semibold text-orange-900">
                Name
              </label>
              <input
                id="feedbackName"
                name="feedbackName"
                type="text"
                required
                className="w-full rounded-lg border border-orange-300 bg-white px-3 py-2 text-slate-800 outline-none ring-orange-400 focus:ring-2"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="feedbackEmail" className="mb-1 block text-sm font-semibold text-orange-900">
                Email
              </label>
              <input
                id="feedbackEmail"
                name="feedbackEmail"
                type="email"
                required
                className="w-full rounded-lg border border-orange-300 bg-white px-3 py-2 text-slate-800 outline-none ring-orange-400 focus:ring-2"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="feedbackMessage" className="mb-1 block text-sm font-semibold text-orange-900">
                Message
              </label>
              <textarea
                id="feedbackMessage"
                name="feedbackMessage"
                rows={4}
                required
                className="w-full rounded-lg border border-orange-300 bg-white px-3 py-2 text-slate-800 outline-none ring-orange-400 focus:ring-2"
                placeholder="Share your feedback..."
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-orange-500 px-6 py-2.5 font-semibold text-white transition hover:bg-orange-600"
            >
              Send feedback
            </button>
          </form>
        </div>
        <p className="mt-8 text-center">
          <Link to="/shop" className="font-semibold text-brand-blue hover:underline">
            Browse the shop →
          </Link>
        </p>
      </Section>

      <div className="border-t border-brand-border bg-brand-card px-6 py-6">
        <SiteDisclaimer variant="banner" className="mx-auto max-w-3xl" />
      </div>
    </>
  );
}
