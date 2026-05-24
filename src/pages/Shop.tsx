import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductImage from "../components/ProductImage";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";

const CATEGORIES = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

export default function Shop() {
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const list = [...products];
    if (category === "All") return list.sort((a, b) => a.price - b.price);
    return list.filter((p) => p.category === category).sort((a, b) => a.price - b.price);
  }, [category]);

  return (
    <>
      <PageHero
        label="Shop"
        title={
          <>
            3D Prints That <span className="text-brand-blue">Give Back</span>
          </>
        }
        subtitle="All items are 3D-printed in PLA. We donate 60% of proceeds from every purchase to UNICEF USA."
      />

      <Section>
        <div className="mx-auto mb-8 flex max-w-3xl flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === cat
                  ? "bg-brand-blue text-white"
                  : "border border-brand-border bg-brand-card text-brand-muted hover:border-brand-blue"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-brand-muted">No products in this category.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group overflow-hidden rounded-[10px] border border-brand-border bg-brand-card transition hover:-translate-y-1 hover:border-brand-blue"
              >
                <ProductImage product={p} className="h-48" />
                <div className="p-5">
                  <span className="text-xs font-medium uppercase tracking-wide text-brand-blue-dark">
                    {p.category}
                  </span>
                  <h2 className="mt-1 text-lg font-semibold text-brand-heading group-hover:text-brand-blue">
                    {p.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-brand-muted">{p.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-brand-heading">
                      {p.currency} {p.price}
                    </span>
                    <span className="rounded bg-[#e3f2fd] px-2 py-1 text-sm text-brand-blue-dark">
                      {p.donationPercent}% donated
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
