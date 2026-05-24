import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductImage from "../components/ProductImage";
import PageHero from "../components/site/PageHero";
import Section from "../components/site/Section";
import PlainEnglish from "../components/site/PlainEnglish";

const CATEGORIES = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
const SORT_OPTIONS = [
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name A–Z" },
  { id: "donation", label: "Donation %" },
] as const;

type SortId = (typeof SORT_OPTIONS)[number]["id"];
type ViewMode = "grid" | "list";

export default function Shop() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("price-asc");
  const [view, setView] = useState<ViewMode>("grid");
  const [maxPrice, setMaxPrice] = useState<number>(() => Math.max(...products.map((p) => p.price)));

  const priceCeiling = useMemo(() => Math.max(...products.map((p) => p.price)), []);

  const filtered = useMemo(() => {
    let list = [...products];
    const q = query.trim().toLowerCase();

    if (category !== "All") list = list.filter((p) => p.category === category);
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    list = list.filter((p) => p.price <= maxPrice);

    switch (sort) {
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "donation":
        list.sort((a, b) => b.donationPercent - a.donationPercent);
        break;
      default:
        list.sort((a, b) => a.price - b.price);
    }
    return list;
  }, [category, query, sort, maxPrice]);

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
        <PlainEnglish className="mx-auto mb-8 max-w-2xl">
          <p>
            Pick a print, add it to your cart, then go to checkout. You will need the{" "}
            <strong>5-digit code</strong> from Jay&apos;s shop before you can pay.{" "}
            <Link to="/how-it-works" className="font-bold text-cyan-700 underline dark:text-cyan-400">
              See how it works
            </Link>
            .
          </p>
        </PlainEnglish>

        <div className="mx-auto mb-6 max-w-4xl space-y-4 rounded-2xl border border-brand-border/80 bg-brand-card p-4 shadow-soft dark:border-slate-600 dark:bg-slate-800">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="flex-1 rounded-xl border border-brand-border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortId)}
              className="rounded-xl border border-brand-border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <div className="flex rounded-xl border border-brand-border p-0.5 dark:border-slate-600">
              <button
                type="button"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${view === "grid" ? "bg-cyan-500 text-white" : "text-brand-muted"}`}
              >
                Grid
              </button>
              <button
                type="button"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${view === "list" ? "bg-cyan-500 text-white" : "text-brand-muted"}`}
              >
                List
              </button>
            </div>
          </div>

          <label className="block text-sm text-brand-muted">
            Max price: <strong className="text-brand-heading dark:text-slate-200">${maxPrice.toFixed(2)}</strong>
            <input
              type="range"
              min={Math.min(...products.map((p) => p.price))}
              max={priceCeiling}
              step="0.01"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
              className="mt-2 w-full accent-cyan-600"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  category === cat ? "pill-active" : "pill-inactive"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-xs text-brand-dim">
            Showing {filtered.length} of {products.length} products
            {query ? ` matching “${query}”` : ""}
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-brand-muted">No products match your filters.</p>
        ) : view === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} list />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}

function ProductCard({
  product: p,
  list,
}: {
  product: (typeof products)[number];
  list?: boolean;
}) {
  const donated = (p.price * p.donationPercent) / 100;

  return (
    <Link
      to={`/product/${p.id}`}
      className={`group overflow-hidden rounded-[10px] border border-brand-border bg-brand-card transition hover:-translate-y-1 hover:border-brand-blue dark:border-slate-600 dark:bg-slate-800 ${
        list ? "flex sm:flex-row" : ""
      }`}
    >
      <ProductImage product={p} className={list ? "h-40 w-full sm:h-auto sm:w-48 shrink-0" : "h-48"} />
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-blue-dark dark:text-cyan-400">
          {p.category}
        </span>
        <h2 className="mt-1 text-lg font-semibold text-brand-heading group-hover:text-brand-blue dark:text-slate-100">
          {p.title}
        </h2>
        <p className={`mt-2 text-sm text-brand-muted ${list ? "" : "line-clamp-2"}`}>{p.description}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
          <span className="font-bold text-brand-heading dark:text-white">
            {p.currency} {p.price}
          </span>
          <span className="rounded bg-cyan-50 px-2 py-1 text-xs font-bold text-cyan-900 dark:bg-cyan-950 dark:text-cyan-200">
            ~${donated.toFixed(2)} to UNICEF USA
          </span>
        </div>
      </div>
    </Link>
  );
}
