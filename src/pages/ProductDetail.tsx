import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../data/products";
import ProductImageSlider from "../components/ProductImageSlider";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const product = id ? getProduct(id) : undefined;
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    setLoading(true);
    setError(null);
    try {
      const baseUrl = window.location.origin;
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1, baseUrl }),
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

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600 mb-4">Product not found.</p>
        <Link to="/shop" className="text-unicef-blue font-semibold">
          Back to shop
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link to="/shop" className="text-sm text-unicef-blue hover:underline mb-8 inline-block">
        ← Back to shop
      </Link>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <ProductImageSlider product={product} className="aspect-square" />
        <div>
          <span className="text-sm font-medium text-unicef-dark">{product.category}</span>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">{product.title}</h1>
          <p className="text-slate-600 mt-4">{product.description}</p>
          <p className="mt-6 text-2xl font-bold text-slate-900">
            {product.currency} {product.price}
          </p>
          <p className="mt-2 text-sm text-unicef-dark">
            {product.donationPercent}% of this item is pledged to support donation efforts aligned with UNICEF values.
          </p>
          {error && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full md:w-auto border-2 border-unicef-blue text-unicef-blue px-8 py-3 rounded-full font-semibold hover:bg-unicef-blue/10 transition"
            >
              {added ? "Added to cart ✓" : "Add to cart"}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={loading}
              className="w-full md:w-auto bg-unicef-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-unicef-dark transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Redirecting…" : "Buy now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
