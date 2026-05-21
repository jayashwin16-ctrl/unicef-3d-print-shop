import { useState } from "react";

export type PickupDetails = {
  name: string;
  grade: string;
  email: string;
};

type SchoolPickupFormProps = {
  sectionId?: string;
  idSuffix?: string;
  className?: string;
  /** Called after submit with form values (e.g. advance checkout to payment). */
  onSubmitted?: (details: PickupDetails) => void;
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
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("pickupName") ?? "").trim();
    const grade = String(fd.get("pickupGrade") ?? "").trim();
    const email = String(fd.get("pickupEmail") ?? "").trim();
    if (!name || !grade || !email.includes("@")) return;
    setPickupSubmitted(true);
    onSubmitted?.({ name, grade, email });
  };

  return (
    <section
      id={sectionId}
      className={`rounded-2xl border border-sky-300 bg-sky-50 p-6 shadow-sm ${sectionId ? "scroll-mt-24" : ""} ${className}`.trim()}
    >
      <h2 className="text-xl font-bold text-sky-900 md:text-2xl">School pickup</h2>
      <p className="mt-2 text-sm text-sky-800">
        Full name, grade, and email (used for your receipt and school pickup).
      </p>
      {pickupSubmitted ? (
        <p className="mt-4 rounded-lg bg-sky-200 px-3 py-2 text-sm font-medium text-sky-900">
          Thanks! Your details were saved — continue to payment below.
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
              placeholder="e.g. 7th"
            />
          </div>
          <div>
            <label htmlFor={`pickupEmail${suf}`} className="mb-1 block text-sm font-semibold text-sky-900">
              Email (for receipt)
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
            className="w-full rounded-full bg-brand-blue px-6 py-2.5 font-semibold text-white transition hover:bg-brand-blue-dark"
          >
            Continue to payment
          </button>
        </form>
      )}
    </section>
  );
}
