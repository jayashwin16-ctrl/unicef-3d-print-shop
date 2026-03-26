import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProduct } from "../data/products";
import OwsPickupBanner from "../components/OwsPickupBanner";

export default function Cart() {
  const { items, removeItem, updateQuantity, itemCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const baseUrl = window.location.origin;
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl, items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (itemCount === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
        <p className="text-slate-600 mb-8">Add items from the shop to checkout.</p>
        <Link
          to="/shop"
          className="inline-block bg-unicef-blue text-white px-6 py-3 rounded-full font-semibold hover:bg-unicef-dark transition"
        >
          Browse shop
        </Link>
      </div>
    );
  }

  const rows = items.map(({ productId, quantity }) => {
    const product = getProduct(productId);
    if (!product) return null;
    const subtotal = product.price * quantity;
    return (
      <div
        key={productId}
        className="flex gap-4 py-4 border-b border-slate-200 last:border-0"
      >
        <Link
          to={`/product/${productId}`}
          className="shrink-0 w-20 h-20 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden"
        >
          {product.image && (
            <img
              src={product.image}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/product/${productId}`} className="font-semibold text-slate-900 hover:text-unicef-blue">
            {product.title}
          </Link>
          <p className="text-slate-600 text-sm mt-0.5">
            {product.currency} {product.price} each
          </p>
          <div className="flex items-center gap-2 mt-2">
            <select
              value={quantity}
              onChange={(e) => updateQuantity(productId, Number(e.target.value))}
              className="text-sm border border-slate-300 rounded px-2 py-1"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeItem(productId)}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="font-semibold text-slate-900">
            {product.currency} {subtotal}
          </span>
        </div>
      </div>
    );
  });

  const total = items.reduce((sum, { productId, quantity }) => {
    const p = getProduct(productId);
    return sum + (p ? p.price * quantity : 0);
  }, 0);
  const currency = getProduct(items[0]?.productId)?.currency ?? "USD";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Cart</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 divide-y divide-slate-100">
          {rows}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-4">
          <OwsPickupBanner />
          <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-lg font-bold text-slate-900">
            Total: {currency} {total}
          </p>
          {error && (
            <p className="w-full text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <Link
              to="/shop"
              className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition"
            >
              Continue shopping
            </Link>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-unicef-blue text-white font-semibold hover:bg-unicef-dark transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Redirecting…" : "Proceed to checkout"}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
