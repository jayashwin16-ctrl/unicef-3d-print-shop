import { useState } from "react";
import { Link } from "react-router-dom";
import { FAVORITE_PRODUCT_ID, products } from "../../data/products";
import ProductImage from "../ProductImage";

const CAROUSEL_PRODUCTS = [
  products.find((p) => p.id === FAVORITE_PRODUCT_ID)!,
  ...products.filter((p) => p.id !== FAVORITE_PRODUCT_ID),
];

export default function FavoritePrintSpotlight() {
  const [index, setIndex] = useState(0);
  const product = CAROUSEL_PRODUCTS[index];
  const isFavorite = product.id === FAVORITE_PRODUCT_ID;
  const count = CAROUSEL_PRODUCTS.length;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <section
      className="border-y border-brand-border bg-slate-800 px-4 py-10 dark:border-slate-600"
      aria-label="Our prints"
    >
      <div className="mx-auto max-w-lg text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-300">Our prints</p>
        {isFavorite && (
          <p className="mt-1 text-sm text-cyan-200">Jay&apos;s favorite: Samurai sword</p>
        )}

        <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/20 bg-slate-900 shadow-lg">
          <ProductImage product={product} className="aspect-[4/3] w-full min-h-[200px]" />
        </div>

        <p className="mt-4 text-sm text-slate-300">
          Print {index + 1} of {count} — use the arrows to see them all
        </p>

        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            Next →
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {CAROUSEL_PRODUCTS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={p.title}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full ${
                i === index ? "bg-cyan-400" : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        <h2 className="mt-6 text-xl font-bold text-white">{product.title}</h2>
        <p className="mt-1 text-lg font-semibold text-white">
          {product.currency} {product.price}
        </p>

        <Link
          to={`/product/${product.id}`}
          className="btn-primary mt-5 inline-flex"
        >
          View this print
        </Link>
        <p className="mt-3">
          <Link to="/shop" className="text-sm font-semibold text-cyan-300 hover:underline">
            See all in the shop
          </Link>
        </p>
      </div>
    </section>
  );
}
