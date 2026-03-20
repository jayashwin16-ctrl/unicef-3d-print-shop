import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductImage from "../components/ProductImage";

/** Put your image in `public/Photos/` and set the path here (starts with `/Photos/...`). */
const HERO_BACKGROUND_IMAGE = "/Photos/home-bg.jpg";

export default function Home() {
  const featured = products.slice(0, 3);
  return (
    <div className="relative min-h-screen">
      {/*
        Fixed to the screen so you always see the FULL image (object-contain).
        object-cover was only showing a zoomed/cropped part. Letterbox bars use bg color.
      */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-emerald-950" aria-hidden>
        <img
          src={HERO_BACKGROUND_IMAGE}
          alt=""
          className="h-full w-full object-contain object-center"
          width={1920}
          height={1080}
          loading="eager"
        />
        {/* Green tint to blend with the photo (trees / outdoor scene) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-emerald-700/30 to-emerald-950/88" />
      </div>

      <section className="relative z-10 border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-4">
            3D-printed goods.{" "}
            <span className="text-white/95">Real impact</span> for children.
          </h1>
          <p className="text-lg text-white/95 max-w-2xl mx-auto mb-8 drop-shadow-md">
            Every purchase helps fund UNICEF programs. Shop unique 3D-printed items—keychains,
            puzzles, and more—knowing a share supports children worldwide.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-unicef-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-unicef-dark transition shadow-lg"
          >
            Shop now
          </Link>
        </div>
      </section>
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center drop-shadow">
          How your purchase helps
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { t: "You buy", d: "Choose from our catalog of 3D-printed items." },
            { t: "We print", d: "Quality PLA prints, shipped with care." },
            { t: "We donate", d: "A pledged portion supports UNICEF-aligned giving." },
          ].map((item) => (
            <div
              key={item.t}
              className="rounded-xl p-6 shadow-lg border border-white/20 bg-emerald-900/65 backdrop-blur-sm"
            >
              <h3 className="font-semibold text-white mb-2">{item.t}</h3>
              <p className="text-emerald-100 text-sm">{item.d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 text-center drop-shadow">
            Featured
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featured.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="rounded-xl overflow-hidden shadow-lg border border-white/20 bg-emerald-900/65 backdrop-blur-sm hover:bg-emerald-900/80 transition"
              >
                <ProductImage product={p} className="h-40" />
                <div className="p-4">
                  <h3 className="font-semibold text-white">{p.title}</h3>
                  <p className="text-unicef-accent text-sm mt-1 font-medium">
                    {p.donationPercent}% to donation
                  </p>
                  <p className="text-emerald-100 font-medium mt-2">
                    {p.currency} {p.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="text-unicef-accent font-semibold hover:underline drop-shadow"
            >
              View all products →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
