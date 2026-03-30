import { useState } from "react";
import { Link } from "react-router-dom";
import SchoolPickupForm from "../components/SchoolPickupForm";

export default function About() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    e.currentTarget.reset();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">About this shop</h1>
      <div className="prose prose-slate max-w-none space-y-4 text-slate-600">
        <p>
          This shop sells 3D-printed items and donates part of the proceeds to UNICEF. We like 3D
          printing because it is creative and rewarding without being out of reach for students.
          UNICEF is the United Nations agency focused on children worldwide. We hope you enjoy the
          products and the site — share feedback anytime. Happy shopping!
        </p>
        <p>
          <strong className="text-slate-800">Independent initiative.</strong> This website is not
          affiliated with or endorsed by UNICEF. For official UNICEF donations, use{" "}
          <a
            href="https://www.unicef.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-unicef-blue underline"
          >
            unicef.org
          </a>
          .
        </p>
      </div>
      <div className="mt-10">
        <SchoolPickupForm sectionId="school-pickup" />
      </div>
      <section className="mt-10 rounded-2xl border border-orange-300 bg-orange-50 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-orange-900">Feedback form</h2>
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
      </section>
      <Link to="/shop" className="inline-block mt-10 text-unicef-blue font-semibold hover:underline">
        Browse the shop →
      </Link>
    </div>
  );
}
