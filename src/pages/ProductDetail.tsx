import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../data/products";
import ProductImageSlider from "../components/ProductImageSlider";
import OwsPickupBanner from "../components/OwsPickupBanner";
import { useCart } from "../context/CartContext";

type Review = {
  id: string;
  productId: string;
  stars: number;
  name?: string;
  message?: string;
  createdAt: number;
};

function getReviewStorageKey(productId: string) {
  return `reviews:${productId}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const product = id ? getProduct(id) : undefined;
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [stars, setStars] = useState<number>(5);
  const [reviewName, setReviewName] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (!product) return;
    try {
      const raw = localStorage.getItem(getReviewStorageKey(product.id));
      const parsed = raw ? (JSON.parse(raw) as Review[]) : [];
      setReviews(Array.isArray(parsed) ? parsed : []);
    } catch {
      setReviews([]);
    }
  }, [product?.id]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((n, r) => n + r.stars, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

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

  const saveReview = () => {
    if (!product) return;
    const next: Review = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      productId: product.id,
      stars,
      name: reviewName.trim() || undefined,
      message: reviewMessage.trim() || undefined,
      createdAt: Date.now(),
    };
    const updated = [next, ...reviews].slice(0, 50);
    setReviews(updated);
    localStorage.setItem(getReviewStorageKey(product.id), JSON.stringify(updated));
    setReviewName("");
    setReviewMessage("");
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 2500);
  };

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
          {averageRating !== null && (
            <p className="mt-2 text-sm text-slate-600">
              Rating: <span className="font-semibold text-slate-900">{averageRating}</span> / 5{" "}
              <span className="text-slate-500">({reviews.length} review{reviews.length === 1 ? "" : "s"})</span>
            </p>
          )}
          <p className="text-slate-600 mt-4">{product.description}</p>
          <p className="mt-6 text-2xl font-bold text-slate-900">
            {product.currency} {product.price}
          </p>
          <p className="mt-2 text-sm text-unicef-dark">
            {product.donationPercent}% of this item is pledged to support donation efforts aligned with UNICEF values.
          </p>
          <div className="mt-6">
            <OwsPickupBanner />
          </div>
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

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Leave a 5‑star review</h2>
            <p className="mt-1 text-sm text-slate-600">Tap the stars, then submit your review.</p>

            {reviewSubmitted && (
              <p className="mt-4 rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-900">
                Thanks for your review!
              </p>
            )}

            <div className="mt-4 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStars(n)}
                  className="p-1"
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                >
                  <svg
                    className={`h-7 w-7 ${n <= stars ? "text-amber-400" : "text-slate-300"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.454a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.538 1.118l-3.376-2.454a1 1 0 00-1.176 0L6.026 18.05c-.783.57-1.838-.197-1.538-1.118l1.286-3.967a1 1 0 00-.364-1.118L2.034 9.394c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold text-slate-800">{stars}/5</span>
            </div>

            <div className="mt-4 grid gap-3">
              <input
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none ring-amber-300 focus:ring-2"
                placeholder="Your name (optional)"
              />
              <textarea
                value={reviewMessage}
                onChange={(e) => setReviewMessage(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none ring-amber-300 focus:ring-2"
                placeholder="Write a short review (optional)"
              />
              <button
                type="button"
                onClick={saveReview}
                className="w-full sm:w-auto rounded-full bg-amber-500 px-6 py-2.5 font-semibold text-white transition hover:bg-amber-600"
              >
                Submit review
              </button>
              <p className="text-xs text-slate-500">
                Note: Reviews are saved in your browser only (not shared with other visitors yet).
              </p>
            </div>

            {reviews.length > 0 && (
              <div className="mt-6 border-t border-slate-200 pt-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Recent reviews</h3>
                <div className="space-y-3">
                  {reviews.slice(0, 5).map((r) => (
                    <div key={r.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">
                            {r.name || "Anonymous"}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-amber-600">{r.stars}/5</span>
                      </div>
                      {r.message && <p className="mt-2 text-sm text-slate-700">{r.message}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
