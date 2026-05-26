import { Link } from "react-router-dom";
import { getFavoriteProduct } from "../../data/products";
import ProductImageSlider from "../ProductImageSlider";

export default function FavoritePrintSpotlight() {
  const product = getFavoriteProduct();
  const donated = ((product.price * product.donationPercent) / 100).toFixed(2);

  return (
    <section
      className="relative overflow-hidden border-y border-cyan-200/60 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-4 py-12 md:py-16"
      aria-labelledby="favorite-print-heading"
    >
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl motion-safe:animate-pulse-slow" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl motion-safe:animate-pulse-slow" />

      <div className="relative mx-auto max-w-site">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <span className="attention-badge motion-safe:animate-bounce-subtle rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-slate-900 shadow-lg">
            Attention
          </span>
          <span className="rounded-full border border-cyan-400/50 bg-cyan-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cyan-100">
            Jay&apos;s favorite print
          </span>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400 opacity-75 blur-md motion-safe:animate-glow-ring" />
            <div className="relative overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl">
              <ProductImageSlider product={product} className="aspect-[4/3] min-h-[260px] md:min-h-[320px]" />
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Inside the spotlight</p>
            <h2
              id="favorite-print-heading"
              className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              {product.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">{product.description}</p>
            <p className="mt-4 text-sm text-cyan-200/90">
              This is the print Jay is most proud of—detailed, display-ready, and part of every sale that
              helps kids through UNICEF USA.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <span className="text-3xl font-extrabold text-white">
                {product.currency} {product.price}
              </span>
              <span className="rounded-lg bg-white/10 px-3 py-1 text-sm font-semibold text-amber-200">
                ~${donated} donated per sale
              </span>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                to={`/product/${product.id}`}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3.5 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                See the samurai sword →
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                All prints
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
