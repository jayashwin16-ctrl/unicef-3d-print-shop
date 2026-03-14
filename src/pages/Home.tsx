import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductImage from "../components/ProductImage";

export default function Home() {
  const featured = products.slice(0, 3);
  return (
    <div>
      <section className="bg-gradient-to-br from-unicef-blue/10 via-white to-unicef-accent/10 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            3D-printed goods.{" "}
            <span className="text-unicef-dark">Real impact</span> for children.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
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
