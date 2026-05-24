import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProduct } from "../data/products";

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, itemCount } = useCart();
  const [error, setError] = useState<string | null>(null);

  if (itemCount === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
        <p className="text-slate-600 mb-8">Add items from the shop to checkout.</p>
        <Link
          to="/shop"
          className="inline-block bg-brand-blue text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-blue-dark transition"
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
          <Link to={`/product/${productId}`} className="font-semibold text-slate-900 hover:text-brand-blue">
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Cart</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 divide-y divide-slate-100">
          {rows}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <p className="text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2 mb-2">
            Checkout requires a <strong>5-digit code</strong> from the shop.
          </p>
          <p className="text-sm text-slate-600 mb-4">
            <Link to="/how-it-works" className="font-semibold text-brand-blue hover:underline">
              How checkout works →
            </Link>
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-lg font-bold text-slate-900">
              Total: {currency} {total}
            </p>
            {error && (
              <p className="w-full text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-3 w-full sm:w-auto sm:ml-auto">
              <Link
                to="/shop"
                className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition"
              >
                Continue shopping
              </Link>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  if (itemCount === 0) return;
                  sessionStorage.removeItem("checkout_verified_session");
                  navigate("/checkout", { state: { fromCart: true, fulfillment: "pickup" } });
                }}
                className="px-6 py-2.5 rounded-full bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark transition"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
