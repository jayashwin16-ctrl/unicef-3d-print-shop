import { Link } from "react-router-dom";

/** Reminder shown before/during checkout: OWS pickup requires the form on About. */
export default function OwsPickupBanner() {
  return (
    <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-sm">
      <p className="font-semibold">Open Window School pickup</p>
      <p className="mt-1 text-emerald-800">
        If you will pick up at school, fill out the <strong>OWS pickup form</strong> on the{" "}
        <strong>Cart</strong> page (next to your order). Shipping address is entered on the next
        step (Stripe). You can submit the OWS form before or after you pay.
      </p>
      <Link
        to="/cart#ows-cart-pickup"
        className="mt-2 inline-block font-semibold text-emerald-800 underline hover:text-emerald-950"
      >
        Go to Cart — OWS pickup form →
      </Link>
    </div>
  );
}
