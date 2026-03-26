import { useState } from "react";

type OwsPickupFormProps = {
  /** Anchor id for #ows-pickup links (only set on About page section). */
  sectionId?: string;
  /** Suffix for input ids so multiple forms on the site stay unique (e.g. "cart"). */
  idSuffix?: string;
  className?: string;
};

export default function OwsPickupForm({ sectionId, idSuffix = "", className = "" }: OwsPickupFormProps) {
  const [pickupSubmitted, setPickupSubmitted] = useState(false);
  const suf = idSuffix ? `-${idSuffix}` : "";

  const handlePickupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPickupSubmitted(true);
    e.currentTarget.reset();
  };

  return (
    <section
      id={sectionId}
      className={`rounded-2xl border border-emerald-300 bg-emerald-50 p-6 shadow-sm ${sectionId ? "scroll-mt-24" : ""} ${className}`.trim()}
    >
      <h2 className="text-xl font-bold text-emerald-900 md:text-2xl">OWS pickup form</h2>
      <p className="mt-2 text-sm text-emerald-800">
        For Open Window School pickup, share your full name, grade, and parent email.
      </p>
      {pickupSubmitted && (
        <p className="mt-4 rounded-lg bg-emerald-200 px-3 py-2 text-sm font-medium text-emerald-900">
          Thanks! Your OWS pickup info was submitted.
        </p>
      )}
      <form className="mt-5 space-y-4" onSubmit={handlePickupSubmit}>
        <div>
          <label htmlFor={`pickupName${suf}`} className="mb-1 block text-sm font-semibold text-emerald-900">
            Full name
          </label>
          <input
            id={`pickupName${suf}`}
            name="pickupName"
            type="text"
            required
            className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-slate-800 outline-none ring-emerald-400 focus:ring-2"
            placeholder="Student name"
          />
        </div>
        <div>
          <label htmlFor={`pickupGrade${suf}`} className="mb-1 block text-sm font-semibold text-emerald-900">
            Grade
          </label>
          <input
            id={`pickupGrade${suf}`}
            name="pickupGrade"
            type="text"
            required
            className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-slate-800 outline-none ring-emerald-400 focus:ring-2"
            placeholder="Example: 4th grade"
          />
        </div>
        <div>
          <label htmlFor={`pickupEmail${suf}`} className="mb-1 block text-sm font-semibold text-emerald-900">
            Parent Email
          </label>
          <input
            id={`pickupEmail${suf}`}
            name="pickupEmail"
            type="email"
            required
            className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-slate-800 outline-none ring-emerald-400 focus:ring-2"
            placeholder="parent@example.com"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-emerald-600 px-6 py-2.5 font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
        >
          Submit pickup details
        </button>
      </form>
    </section>
  );
}
