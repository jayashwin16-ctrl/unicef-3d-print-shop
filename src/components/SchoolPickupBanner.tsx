import { Link } from "react-router-dom";

export default function SchoolPickupBanner() {
  return (
    <div className="rounded-xl border border-sky-300 bg-sky-50 p-4 text-sm text-sky-900 shadow-sm">
      <p className="font-semibold">School pickup</p>
      <p className="mt-1 text-sky-800">
        Pickup details are collected on the <strong>checkout</strong> page when you pay.
      </p>
      <Link
        to="/how-it-works"
        className="mt-2 inline-block font-semibold text-sky-800 underline hover:text-sky-950"
      >
        See how checkout works →
      </Link>
    </div>
  );
}
