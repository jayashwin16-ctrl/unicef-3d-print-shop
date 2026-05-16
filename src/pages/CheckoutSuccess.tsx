import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-sky-100">
          <svg className="h-7 w-7 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Thank you for your order</h1>
        <p className="mb-4 text-slate-600">
          Payment was successful. A portion of your purchase supports our donation efforts.
        </p>
        <p className="mb-8 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-left text-sm text-slate-600">
          <strong className="text-sky-900">School pickup:</strong> if you pick up at school and have
          not submitted the form yet, use the{" "}
          <Link to="/about#school-pickup" className="font-semibold text-sky-800 underline">
            pickup form on the About page
          </Link>
          . (Before paying, it is also on the Cart page next to your order.)
        </p>
        <Link
          to="/shop"
          className="inline-block rounded-full bg-brand-blue px-6 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
        >
          Back to shop
        </Link>
      </div>
    </div>
  );
}
