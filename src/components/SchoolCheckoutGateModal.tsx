import { FormEvent, useState } from "react";
import { grantSchoolCheckoutAccess } from "../lib/schoolCheckoutAccess";

/** Only this domain may proceed to Stripe from our checkout gate. */
const BOBCAT_EMAIL_DOMAIN = "ows.org";

type SchoolCheckoutGateModalProps = {
  open: boolean;
  onClose: () => void;
  /** Called after a valid school email is confirmed; parent starts Stripe redirect. */
  onVerified: () => void;
};

function isBobcatEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return normalized.endsWith(`@${BOBCAT_EMAIL_DOMAIN}`);
}

export default function SchoolCheckoutGateModal({ open, onClose, onVerified }: SchoolCheckoutGateModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isBobcatEmail(email)) {
      setError("Use your Bobcat school email.");
      return;
    }

    grantSchoolCheckoutAccess();
    onVerified();
    onClose();
    setEmail("");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="checkout-gate-title">
      <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 id="checkout-gate-title" className="text-xl font-bold text-slate-900 pr-8">
          Bobcat checkout
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter the <strong>Bobcat</strong> email you use at school to continue to payment.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="checkout-gate-email">
              Bobcat school email
            </label>
            <input
              id="checkout-gate-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1CABE2]"
              placeholder="name@school email"
              autoComplete="email"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#1CABE2] px-4 py-2.5 font-semibold text-white hover:bg-[#1596c4] transition"
            >
              Continue to checkout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
