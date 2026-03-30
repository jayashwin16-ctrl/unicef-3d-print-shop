import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Thank you for your order</h1>
        <p className="text-slate-600 mb-4">
          Payment was successful. A portion of your purchase supports our donation efforts.
        </p>
        <p className="text-sm text-slate-600 mb-8 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-left">
          <strong className="text-emerald-900">School pickup:</strong> if you pick up at school and
          have not submitted the form yet, use the{" "}
          <Link to="/about#school-pickup" className="font-semibold text-emerald-800 underline">
            pickup form on the About page
          </Link>
          . (Before paying, it is also on the Cart page next to your order.)
        </p>
        <Link
          to="/shop"
          className="inline-block bg-unicef-blue text-white px-6 py-3 rounded-full font-semibold hover:bg-unicef-dark transition"
        >
          Back to shop
        </Link>
      </div>
    </div>
  );
}
