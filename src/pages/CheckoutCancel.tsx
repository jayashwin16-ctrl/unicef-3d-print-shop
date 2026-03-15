import { Link } from "react-router-dom";

export default function CheckoutCancel() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Checkout cancelled</h1>
        <p className="text-slate-600 mb-8">
          No charge was made. You can continue shopping whenever you’re ready.
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
