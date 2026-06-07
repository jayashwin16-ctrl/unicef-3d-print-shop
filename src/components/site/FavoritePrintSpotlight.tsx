import { useState } from "react";
import { Link } from "react-router-dom";
import { FAVORITE_PRODUCT_ID, products } from "../../data/products";
import ProductImage from "../ProductImage";
import PrintFileDownload from "../PrintFileDownload";
import SamuraiSwordWarning from "../SamuraiSwordWarning";
import ProductPrice from "../ProductPrice";

const CAROUSEL_PRODUCTS = [
  products.find((p) => p.id === FAVORITE_PRODUCT_ID)!,
  ...products.filter((p) => p.id !== FAVORITE_PRODUCT_ID),
];

type FavoritePrintSpotlightProps = {
  /** Sits inside the home hero (first fold) instead of a separate section below. */
  embedded?: boolean;
};

export default function FavoritePrintSpotlight({ embedded = false }: FavoritePrintSpotlightProps) {
  const [index, setIndex] = useState(0);
  const product = CAROUSEL_PRODUCTS[index];
  const isFavorite = product.id === FAVORITE_PRODUCT_ID;
  const count = CAROUSEL_PRODUCTS.length;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  const inner = (
    <div className={embedded ? "text-center lg:text-left" : "mx-auto max-w-lg text-center"}>
      <p className={`text-xs font-bold uppercase tracking-wide ${embedded ? "text-amber-300" : "text-amber-300"}`}>
        Our prints
      </p>
      {isFavorite && (
        <p className={`mt-1 text-sm ${embedded ? "text-cyan-200" : "text-cyan-200"}`}>
          Jay&apos;s favorite: Samurai sword
        </p>
      )}

      <div
        className={`relative overflow-hidden rounded-2xl border border-white/25 bg-slate-900/90 shadow-lg ${
          embedded ? "mt-4" : "mt-6"
        }`}
      >
        <ProductImage
          product={product}
          className={`aspect-[4/3] w-full ${embedded ? "min-h-[140px] sm:min-h-[180px]" : "min-h-[200px]"}`}
        />
        {isFavorite && (
          <SamuraiSwordWarning
            productId={product.id}
            onDark
            className="absolute bottom-2 left-2 right-2 text-center text-xs sm:text-sm"
          />
        )}
      </div>

      <p className={`mt-3 text-sm ${embedded ? "text-slate-300" : "text-slate-300"}`}>
        Print {index + 1} of {count}
      </p>

      <div className={`flex items-center justify-center gap-3 ${embedded ? "lg:justify-start" : ""}`}>
        <button
          type="button"
          onClick={prev}
          className="rounded-full border border-white/30 px-3 py-1.5 text-sm font-bold text-white hover:bg-white/10"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={next}
          className="rounded-full border border-white/30 px-3 py-1.5 text-sm font-bold text-white hover:bg-white/10"
        >
          Next →
        </button>
      </div>

      <h2 className={`mt-4 font-bold text-white ${embedded ? "text-lg" : "text-xl"}`}>{product.title}</h2>
      <div className="mt-1 [&_.line-through]:text-slate-400 [&_span]:text-white">
        <ProductPrice product={product} size="sm" />
      </div>

      <div className={`mt-4 flex flex-wrap items-center justify-center gap-3 ${embedded ? "lg:justify-start" : ""}`}>
        <Link
          to={`/product/${product.id}`}
          className={`btn-primary inline-flex ${embedded ? "!py-2.5 !px-6" : ""}`}
        >
          View this print
        </Link>
        {product.modelFile && <PrintFileDownload product={product} variant="compact" />}
      </div>
      <p className="mt-2">
        <Link
          to="/shop"
          className={`text-sm font-semibold hover:underline ${embedded ? "text-cyan-300" : "text-cyan-300"}`}
        >
          See all in the shop
        </Link>
      </p>
    </div>
  );

  if (embedded) {
    return (
      <div className="rounded-2xl border border-white/15 bg-slate-900/40 p-4 backdrop-blur-sm md:p-5" aria-label="Our prints">
        {inner}
      </div>
    );
  }

  return (
    <section className="border-y border-brand-border bg-slate-800 px-4 py-10" aria-label="Our prints">
      {inner}
    </section>
  );
}
