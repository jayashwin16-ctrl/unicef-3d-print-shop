import { Link } from "react-router-dom";

export default function CheckoutPaymentError() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h1 className="text-2xl font-bold text-red-900">Error Payment did not work</h1>
        <p className="mt-3 text-red-800">Something went wrong when starting or completing payment. Please try again.</p>
        <Link
          to="/checkout"
          className="mt-6 inline-block rounded-full bg-unicef-blue px-6 py-3 font-semibold text-white hover:bg-unicef-dark"
        >
          Back to checkout
        </Link>
        <div className="mt-4">
          <Link to="/cart" className="text-sm text-slate-600 hover:underline">
            View cart
          </Link>
        </div>
      </div>
    </div>
  );
}
