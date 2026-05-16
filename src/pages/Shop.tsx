import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductImage from "../components/ProductImage";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";

export default function Shop() {
  return (
    <>
      <PageHero
        label="Shop"
        title={
          <>
            3D Prints That <span className="text-brand-blue">Give Back</span>
          </>
        }
        subtitle="All items are 3D-printed in PLA. Donation percentages are pledged from each sale."
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
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
                    {p.donationPercent}% pledged
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
