import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductImage from "../components/ProductImage";

/** Put your image in `public/Photos/` and set the path here (starts with `/Photos/...`). */
const HERO_BACKGROUND_IMAGE = "/Photos/home-bg.jpg";

export default function Home() {
  const featured = products.slice(0, 3);
  return (
    <div>
      <section
        className="relative border-b border-slate-200 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${HERO_BACKGROUND_IMAGE}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/10 to-unicef-accent/40" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-sm mb-4">
            3D-printed goods.{" "}
            <span className="text-white/90">Real impact</span> for children.
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8 drop-shadow-sm">
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
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
          How your purchase helps
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { t: "You buy", d: "Choose from our catalog of 3D-printed items." },
            { t: "We print", d: "Quality PLA prints, shipped with care." },
            { t: "We donate", d: "A pledged portion supports UNICEF-aligned giving." },
          ].map((item) => (
            <div key={item.t} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-unicef-dark mb-2">{item.t}</h3>
              <p className="text-slate-600 text-sm">{item.d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
            Featured
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featured.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition"
              >
                <ProductImage product={p} className="h-40" />
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800">{p.title}</h3>
                  <p className="text-unicef-dark text-sm mt-1">
                    {p.donationPercent}% to donation
                  </p>
                  <p className="text-slate-600 font-medium mt-2">
                    {p.currency} {p.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="text-unicef-blue font-semibold hover:underline"
            >
              View all products →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
