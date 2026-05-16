import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import SchoolPickupForm from "../components/SchoolPickupForm";

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
        subtitle="Student-led 3D printing with a pledge to help children through UNICEF-aligned giving."
      />

      <Section label="Our story" title="Meet the maker">
        <div className="mx-auto max-w-[700px] space-y-4 text-sm leading-relaxed text-[#333]">
          <p>
            Hello, my name is Jay Ashwin. I go to school at Open Window School. I am in fourth grade
            and I am 10 years old. This project is about selling 3D prints and donating to UNICEF
            using the money we get from our 3D prints sold.
          </p>
          <p>
            I chose making 3D prints because 3D prints are very cool and they also take some skill to
            make, but they are not too hard. I chose UNICEF as the organization I am donating to
            because they are special by being the only U.N. agency dedicated exclusively to
            children.
          </p>
          <p>
            We hope you like our products and give us feedback on what we should improve on! We also
            hope you like our website and recommend it to other people. This is 3D Prints for Good
            saying bye! Happy shopping!
          </p>
        </div>
      </Section>

      <Section title="How the shop works today" alt>
        <div className="mx-auto max-w-[700px] space-y-4 text-sm leading-relaxed text-[#333]">
          <p>
            Every item in our shop is 3D-printed in durable PLA. We pledge about{" "}
            <strong className="text-brand-heading">50% of each sale</strong> toward children-focused
            giving aligned with UNICEF&apos;s mission—health, education, and protection for kids
            worldwide.
          </p>
          <p>
            You can buy online with secure checkout, pick up at school (see the form below), or
            choose shipping when you pay. Thank you for supporting this project!
          </p>
          <p>
            <strong className="text-brand-heading">Independent initiative.</strong> This website is
            not affiliated with or endorsed by UNICEF. For official UNICEF donations, use{" "}
            <a
              href="https://www.unicef.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-blue underline"
            >
              unicef.org
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
