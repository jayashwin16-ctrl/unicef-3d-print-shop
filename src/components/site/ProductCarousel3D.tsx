import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../data/products";
import ProductImage from "../ProductImage";

type ProductCarousel3DProps = {
  items: Product[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onStep: (delta: number) => void;
  favoriteId?: string;
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const check = () =>
      setReduced(mq.matches || document.documentElement.classList.contains("reduce-motion"));
    check();
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, []);
  return reduced;
}

export default function ProductCarousel3D({
  items,
  activeIndex,
  onIndexChange,
  onStep,
  favoriteId,
}: ProductCarousel3DProps) {
  const reducedMotion = usePrefersReducedMotion();
  const count = items.length;
  const angleStep = 360 / count;
  const product = items[activeIndex];
  const isFavorite = favoriteId && product.id === favoriteId;

  return (
    <div className="w-full">
      <div
        className="carousel-3d-viewport relative mx-auto h-[300px] max-w-3xl sm:h-[340px] md:h-[380px]"
        style={{ perspective: "1100px" }}
      >
        <div
          className="carousel-3d-stage absolute left-1/2 top-1/2 h-0 w-0"
          style={{
            transform: `rotateY(${-activeIndex * angleStep}deg)`,
            transition: reducedMotion ? "none" : "transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {items.map((p, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={p.id}
                className="carousel-3d-panel absolute left-0 top-0"
                style={{
                  transform: `rotateY(${i * angleStep}deg) translateZ(clamp(200px, 42vw, 320px))`,
                }}
              >
                <button
                  type="button"
                  onClick={() => onIndexChange(i)}
                  className={`block w-[min(168px,38vw)] overflow-hidden rounded-xl border-2 bg-slate-900 text-left shadow-2xl transition-[box-shadow,opacity,border-color] sm:w-[200px] md:w-[220px] ${
                    isActive
                      ? "border-amber-400 opacity-100 shadow-amber-500/25"
                      : "border-white/25 opacity-75 hover:opacity-95"
                  }`}
                  aria-label={`View ${p.title}`}
                  aria-current={isActive}
                >
                  <ProductImage product={p} className="aspect-[4/3] h-36 w-full sm:h-40" />
                  <p className="truncate px-2 py-2 text-[11px] font-bold text-white sm:text-xs">
                    {p.title.replace(/^3D printed /i, "")}
                  </p>
                </button>
              </div>
            );
          })}
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-8 h-16 bg-gradient-to-t from-slate-900/80 to-transparent"
          aria-hidden
        />

        <button
          type="button"
          onClick={() => onStep(-1)}
          className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 px-3 py-3 text-2xl text-white backdrop-blur hover:bg-black/70 sm:left-2"
          aria-label="Rotate prints left"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => onStep(1)}
          className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 px-3 py-3 text-2xl text-white backdrop-blur hover:bg-black/70 sm:right-2"
          aria-label="Rotate prints right"
        >
          ›
        </button>
      </div>

      <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-wider text-cyan-300/90">
        Swipe the ring · {count} prints
      </p>

      <div className="mt-4 flex justify-center gap-1.5">
        {items.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-label={`Rotate to ${p.title}`}
            aria-current={i === activeIndex}
            onClick={() => onIndexChange(i)}
            className={`h-2 rounded-full transition-all ${
              i === activeIndex ? "w-7 bg-cyan-400" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 text-center lg:text-left">
        <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
          {isFavorite && (
            <span className="rounded-full border border-cyan-400/50 bg-cyan-500/20 px-3 py-1 text-[11px] font-bold uppercase text-cyan-100">
              Jay&apos;s favorite
            </span>
          )}
        </div>
        <h2 className="mt-3 text-2xl font-extrabold text-white md:text-3xl">{product.title}</h2>
        <p className="mt-2 text-xl font-bold text-white md:text-2xl">
          {product.currency} {product.price}
          <span className="ml-2 text-sm font-semibold text-amber-200">
            · {product.donationPercent}% donated
          </span>
        </p>
        <Link
          to={`/product/${product.id}`}
          className="mt-5 inline-flex rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-7 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
        >
          View print →
        </Link>
      </div>
    </div>
  );
}
