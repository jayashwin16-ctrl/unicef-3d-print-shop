import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FAVORITE_PRODUCT_ID, products, type Product } from "../../data/products";
import ProductImage from "../ProductImage";

/** Samurai sword first, then the rest. */
const CAROUSEL_PRODUCTS: Product[] = [
  products.find((p) => p.id === FAVORITE_PRODUCT_ID)!,
  ...products.filter((p) => p.id !== FAVORITE_PRODUCT_ID),
];

const AUTO_MS = 5000;

export default function FavoritePrintSpotlight() {
  const [index, setIndex] = useState(0);
  const product = CAROUSEL_PRODUCTS[index];
  const isFavorite = product.id === FAVORITE_PRODUCT_ID;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + CAROUSEL_PRODUCTS.length) % CAROUSEL_PRODUCTS.length);
    },
    []
  );

  useEffect(() => {
    const reduced = document.documentElement.classList.contains("reduce-motion");
    if (reduced) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = window.setInterval(() => go(1), AUTO_MS);
    return () => clearInterval(id);
  }, [go]);

  return (
    <section
      className="relative overflow-hidden border-y border-cyan-200/60 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-4 py-10 md:py-12"
      aria-label="Featured prints"
    >
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl motion-safe:animate-pulse-slow" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl motion-safe:animate-pulse-slow" />

      <div className="relative mx-auto max-w-site">
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
          <span className="motion-safe:animate-bounce-subtle rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-slate-900">
            Attention
          </span>
          {isFavorite && (
            <span className="rounded-full border border-cyan-400/50 bg-cyan-500/20 px-3 py-1 text-[11px] font-bold uppercase text-cyan-100">
              Jay&apos;s favorite
            </span>
          )}
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="relative">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400 opacity-75 blur-md motion-safe:animate-glow-ring" />
            <div className="relative overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl">
              <ProductImage
                key={product.id}
                product={product}
                className="aspect-[4/3] min-h-[220px] w-full motion-safe:animate-fade-up md:min-h-[280px]"
              />
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
                aria-label="Previous print"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
                aria-label="Next print"
              >
                ›
              </button>
            </div>
            <div className="mt-3 flex justify-center gap-1.5">
              {CAROUSEL_PRODUCTS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`Show ${p.title}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-7 bg-cyan-400" : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-extrabold text-white md:text-3xl">{product.title}</h2>
            <p className="mt-3 text-2xl font-bold text-white">
              {product.currency} {product.price}
              <span className="ml-2 text-sm font-semibold text-amber-200">
                · {product.donationPercent}% to UNICEF USA
              </span>
            </p>
            <Link
              to={`/product/${product.id}`}
              className="mt-6 inline-flex rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-7 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
            >
              View print →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
