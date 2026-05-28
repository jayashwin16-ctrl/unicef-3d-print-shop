import { useCallback, useEffect, useState } from "react";
import { FAVORITE_PRODUCT_ID, products } from "../../data/products";
import ProductCarousel3D from "./ProductCarousel3D";

const CAROUSEL_PRODUCTS = [
  products.find((p) => p.id === FAVORITE_PRODUCT_ID)!,
  ...products.filter((p) => p.id !== FAVORITE_PRODUCT_ID),
];

/** Faster auto-spin (was ~4.5s). */
const AUTO_MS = 2200;

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
      aria-label="Our prints"
    >
      <div className="relative mx-auto max-w-site">
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-wide text-amber-300">
          Our prints
        </p>

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
