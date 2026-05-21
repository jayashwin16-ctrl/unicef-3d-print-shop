import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import SchoolPickupForm from "../components/SchoolPickupForm";
import SiteDisclaimer from "../components/SiteDisclaimer";

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
        label="About"
        title={
          <>
            3D Prints for <span className="text-brand-blue">Good</span>
          </>
        }
        subtitle="Independent student 3D printing. A portion of proceeds is donated to UNICEF USA."
      />

      <div className="border-b border-brand-border bg-brand-card px-6 py-4">
        <SiteDisclaimer variant="banner" className="mx-auto max-w-3xl" />
      </div>

      <Section label="About this shop" title="What we do">
        <div className="mx-auto max-w-[700px] space-y-4 text-sm leading-relaxed text-[#333]">
          <p>
            This shop sells 3D-printed items and donates part of the proceeds to support children.
            We like 3D printing because it is creative and rewarding without being out of reach for
            students running the project.
          </p>
          <p>
            We chose to donate a portion of proceeds to UNICEF USA because they focus on
            children&apos;s health, education, and protection worldwide. That choice does not imply
            any official partnership.
          </p>
          <p>
            We hope you enjoy our products and this website. Share feedback anytime, and tell others
            about 3D Prints for Good. Happy shopping!
          </p>
          <p className="text-brand-muted">
            This project was created by Jay.
          </p>
        </div>
      </Section>

      <Section title="How the shop works" alt>
        <div className="mx-auto max-w-[700px] space-y-4 text-sm leading-relaxed text-[#333]">
          <p>
            Every item in our shop is 3D-printed in durable PLA. A portion of each sale is donated to
            UNICEF USA to support children&apos;s health, education, and protection.
          </p>
          <p>
            You can buy online with secure checkout, pick up at school (see the form below), or
            choose shipping when you pay. Thank you for supporting this project!
          </p>
          <p>
            For official donations directly to UNICEF USA, visit{" "}
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
        </div>
      </Section>

      <Section>
        <SchoolPickupForm sectionId="school-pickup" />
      </Section>

      <Section alt>
        <div className="mx-auto max-w-lg rounded-[10px] border border-orange-200 bg-orange-50 p-6">
          <h2 className="text-xl font-bold text-orange-900">Feedback form</h2>
          <p className="mt-2 text-sm text-orange-800">
            Tell us what you like and what we should improve.
          </p>
          {submitted && (
            <p className="mt-4 rounded-lg bg-orange-200 px-3 py-2 text-sm font-medium text-orange-900">
              Thanks for your feedback!
            </p>
          )}
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="feedbackName"
                className="mb-1 block text-sm font-semibold text-orange-900"
              >
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
              <label
                htmlFor="feedbackEmail"
                className="mb-1 block text-sm font-semibold text-orange-900"
              >
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
              <label
                htmlFor="feedbackMessage"
                className="mb-1 block text-sm font-semibold text-orange-900"
              >
                Feedback
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
    </>
  );
}
