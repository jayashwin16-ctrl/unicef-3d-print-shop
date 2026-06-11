import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <p className="text-5xl font-extrabold text-brand-blue mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
        <p className="text-slate-600 mb-8">
          Sorry, we couldn’t find that page. It may have been moved or the link
          might be misspelled.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-block rounded-full bg-brand-blue px-6 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
          >
            Go home
          </Link>
          <Link
            to="/shop"
            className="inline-block rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Browse the shop
          </Link>
        </div>
      </div>
    </div>
  );
}
