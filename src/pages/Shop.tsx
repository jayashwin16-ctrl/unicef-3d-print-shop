import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductImage from "../components/ProductImage";

export default function Shop() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Shop</h1>
      <p className="text-slate-600 mb-10">
        All items are 3D-printed. Donation percentages shown below—pledged from each sale.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-unicef-blue/50 hover:shadow-lg transition"
          >
            <ProductImage product={p} className="h-48" />
            <div className="p-5">
              <span className="text-xs font-medium text-unicef-dark uppercase tracking-wide">
                {p.category}
              </span>
              <h2 className="text-lg font-semibold text-slate-900 mt-1 group-hover:text-unicef-blue">
                {p.title}
              </h2>
              <p className="text-slate-600 text-sm mt-2 line-clamp-2">{p.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  {p.currency} {p.price}
                </span>
                <span className="text-sm bg-unicef-accent/20 text-unicef-dark px-2 py-1 rounded">
                  {p.donationPercent}% donation
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
