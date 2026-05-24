import { useMemo, useState } from "react";
import { products } from "../../data/products";

const DONATION_RATE = 0.6;

export default function ImpactCalculator({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<"custom" | "product">("custom");
  const [amount, setAmount] = useState("19.99");
  const [productId, setProductId] = useState(products[0]?.id ?? "1");

  const price = useMemo(() => {
    if (mode === "product") {
      const p = products.find((x) => x.id === productId);
      return p?.price ?? 0;
    }
    const n = parseFloat(amount);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [mode, amount, productId]);

  const donated = price * DONATION_RATE;
  const kept = price - donated;

  return (
    <div className={`card-premium !translate-y-0 p-6 ${className}`}>
      <h3 className="text-lg font-bold text-brand-heading dark:text-white">Donation impact calculator</h3>
      <p className="mt-1 text-sm text-brand-muted">
        See how much of a purchase goes to UNICEF USA at our 60% pledge rate.
      </p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("custom")}
          className={`rounded-full px-4 py-1.5 text-xs font-bold ${mode === "custom" ? "pill-active" : "pill-inactive"}`}
        >
          Custom amount
        </button>
        <button
          type="button"
          onClick={() => setMode("product")}
          className={`rounded-full px-4 py-1.5 text-xs font-bold ${mode === "product" ? "pill-active" : "pill-inactive"}`}
        >
          Pick a product
        </button>
      </div>

      <div className="mt-4">
        {mode === "custom" ? (
          <label className="block text-sm font-medium text-brand-heading dark:text-slate-200">
            Purchase amount (USD)
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-border px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
            />
          </label>
        ) : (
          <label className="block text-sm font-medium text-brand-heading dark:text-slate-200">
            Product
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-border px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} — ${p.price}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatBox label="You pay" value={`$${price.toFixed(2)}`} />
        <StatBox label="To UNICEF USA (60%)" value={`$${donated.toFixed(2)}`} highlight />
        <StatBox label="Shop & costs (40%)" value={`$${kept.toFixed(2)}`} />
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-500"
          style={{ width: price > 0 ? `${DONATION_RATE * 100}%` : "0%" }}
        />
      </div>
      <p className="mt-2 text-xs text-brand-dim">
        Illustration only—actual costs and donations are tracked by the student project with a parent.
      </p>
    </div>
  );
}

function StatBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 text-center ${
        highlight ? "border-cyan-300 bg-cyan-50 dark:border-cyan-700 dark:bg-cyan-950/40" : "border-brand-border dark:border-slate-600"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wide text-brand-muted">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-brand-heading dark:text-white">{value}</p>
    </div>
  );
}
