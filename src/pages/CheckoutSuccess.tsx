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
        <p className="mb-8 text-slate-600">
          Payment was successful. A thank-you email with your order details has been sent to the
          address you used at checkout.
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
