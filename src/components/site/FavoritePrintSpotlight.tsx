import { useCallback, useEffect, useState } from "react";
import { FAVORITE_PRODUCT_ID, products } from "../../data/products";
import ProductCarousel3D from "./ProductCarousel3D";

const CAROUSEL_PRODUCTS = [
  products.find((p) => p.id === FAVORITE_PRODUCT_ID)!,
  ...products.filter((p) => p.id !== FAVORITE_PRODUCT_ID),
];

const AUTO_MS = 4500;

export default function FavoritePrintSpotlight() {
  const [index, setIndex] = useState(0);

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
      className="relative overflow-x-hidden border-y border-cyan-200/60 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-4 py-10 md:py-12"
      aria-label="Featured prints"
    >
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl motion-safe:animate-pulse-slow" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl motion-safe:animate-pulse-slow" />

      <div className="relative mx-auto max-w-site">
        <div className="mb-4 flex justify-center">
          <span className="motion-safe:animate-bounce-subtle rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-slate-900">
            Attention
          </span>
        </div>

        <ProductCarousel3D
          items={CAROUSEL_PRODUCTS}
          activeIndex={index}
          onIndexChange={setIndex}
          onStep={go}
          favoriteId={FAVORITE_PRODUCT_ID}
        />
      </div>
    </section>
  );
}
