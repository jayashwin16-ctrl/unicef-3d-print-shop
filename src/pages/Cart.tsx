import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProduct } from "../data/products";
import SchoolPickupForm from "../components/SchoolPickupForm";

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, itemCount } = useCart();
  const [error, setError] = useState<string | null>(null);

  if (itemCount === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
          <p className="text-slate-600 mb-8">Add items from the shop to checkout.</p>
          <Link
            to="/shop"
            className="inline-block bg-brand-blue text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-blue-dark transition"
          >
            Browse shop
          </Link>
        </div>
        <div className="max-w-xl mx-auto space-y-4">
          <p className="text-center text-sm text-slate-600">
            Picking up at school? You can still fill out the form below, or see the{" "}
            <Link to="/about#school-pickup" className="font-semibold text-brand-blue underline">
              About page
            </Link>
            .
          </p>
          <SchoolPickupForm sectionId="school-pickup-cart" idSuffix="cart-empty" />
        </div>
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Cart</h1>
      <div className="grid gap-8 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 divide-y divide-slate-100">
              {rows}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-lg font-bold text-slate-900">
                  Total: {currency} {total}
                </p>
                {error && (
                  <p className="w-full text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}
                <div className="flex flex-col gap-3 w-full sm:w-auto sm:items-end">
                  <div className="flex flex-wrap gap-3">
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
                        navigate("/checkout", { state: { fromCart: true, fulfillment: "pickup" } });
                      }}
                      className="px-6 py-2.5 rounded-full border-2 border-brand-blue bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark transition"
                    >
                      Get in person
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        if (itemCount === 0) return;
                        navigate("/checkout", { state: { fromCart: true, fulfillment: "delivery" } });
                      }}
                      className="px-6 py-2.5 rounded-full bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark transition"
                    >
                      Delivered to you
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 lg:sticky lg:top-24 space-y-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-slate-900">How do you want your order?</p>
            <p className="mt-2 text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2">
              Checkout requires a <strong>5-digit code</strong> from the shop. You cannot pay without
              it.
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 space-y-1">
              <li>
                <strong>Get in person</strong> — pay on the next screen; no shipping address there.
                Use the <strong>school pickup form</strong> here.
              </li>
              <li>
                <strong>Delivered to you</strong> — pay on the next screen; enter your{" "}
                <strong>shipping address</strong> and phone there (Stripe).
              </li>
            </ul>
          </div>
          <SchoolPickupForm sectionId="school-pickup-cart" idSuffix="cart" />
        </div>
      </div>
    </div>
  );
}
