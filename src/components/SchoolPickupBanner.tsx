import { Link } from "react-router-dom";

export default function SchoolPickupBanner() {
  return (
    <div className="rounded-xl border border-sky-300 bg-sky-50 p-4 text-sm text-sky-900 shadow-sm">
      <p className="font-semibold">School pickup</p>
      <p className="mt-1 text-sky-800">
        If you will pick up at school, fill out the <strong>pickup form</strong> on the checkout
        page before you pay. You can also complete it after payment from the link in your receipt
        email.
      </p>
      <Link
        to="/cart"
        className="mt-2 inline-block font-semibold text-sky-800 underline hover:text-sky-950"
      >
        Go to cart → checkout
      </Link>
    </div>
  );
}
