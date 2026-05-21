import { useState } from "react";

type SchoolPickupFormProps = {
  sectionId?: string;
  idSuffix?: string;
  className?: string;
  /** When set, called after a successful submit (e.g. advance checkout to payment). */
  onSubmitted?: () => void;
};

export default function SchoolPickupForm({
  sectionId,
  idSuffix = "",
  className = "",
  onSubmitted,
}: SchoolPickupFormProps) {
  const [pickupSubmitted, setPickupSubmitted] = useState(false);
  const suf = idSuffix ? `-${idSuffix}` : "";

  const handlePickupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPickupSubmitted(true);
    onSubmitted?.();
  };

  return (
    <section
      id={sectionId}
      className={`rounded-2xl border border-sky-300 bg-sky-50 p-6 shadow-sm ${sectionId ? "scroll-mt-24" : ""} ${className}`.trim()}
    >
      <h2 className="text-xl font-bold text-sky-900 md:text-2xl">School pickup form</h2>
      <p className="mt-2 text-sm text-sky-800">
        For school pickup, share your full name, grade, and parent email.
      </p>
      {pickupSubmitted ? (
        <p className="mt-4 rounded-lg bg-sky-200 px-3 py-2 text-sm font-medium text-sky-900">
          Thanks! Your pickup details were saved. Continue below to pay.
        </p>
      ) : (
      <form className="mt-5 space-y-4" onSubmit={handlePickupSubmit}>
        <div>
          <label htmlFor={`pickupName${suf}`} className="mb-1 block text-sm font-semibold text-sky-900">
            Full name
          </label>
          <input
            id={`pickupName${suf}`}
            name="pickupName"
            type="text"
            required
            className="w-full rounded-lg border border-sky-300 bg-white px-3 py-2 text-slate-800 outline-none ring-sky-400 focus:ring-2"
            placeholder="Student name"
          />
        </div>
        <div>
          <label htmlFor={`pickupGrade${suf}`} className="mb-1 block text-sm font-semibold text-sky-900">
            Grade
          </label>
          <input
            id={`pickupGrade${suf}`}
            name="pickupGrade"
            type="text"
            required
            className="w-full rounded-lg border border-sky-300 bg-white px-3 py-2 text-slate-800 outline-none ring-sky-400 focus:ring-2"
            placeholder="Grade level"
          />
        </div>
        <div>
          <label htmlFor={`pickupEmail${suf}`} className="mb-1 block text-sm font-semibold text-sky-900">
            Parent Email
          </label>
          <input
            id={`pickupEmail${suf}`}
            name="pickupEmail"
            type="email"
            required
            className="w-full rounded-lg border border-sky-300 bg-white px-3 py-2 text-slate-800 outline-none ring-sky-400 focus:ring-2"
            placeholder="parent@example.com"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-brand-blue px-6 py-2.5 font-semibold text-white transition hover:bg-brand-blue-dark sm:w-auto"
        >
          Submit pickup details
        </button>
      </form>
      )}
    </section>
  );
}
