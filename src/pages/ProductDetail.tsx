import { Link, useParams } from "react-router-dom";
import { getProduct } from "../data/products";
import ProductImageSlider from "../components/ProductImageSlider";

export default function ProductDetail() {
  const { id } = useParams();
  const product = id ? getProduct(id) : undefined;
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
          <button
            type="button"
            className="mt-8 w-full md:w-auto bg-unicef-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-unicef-dark transition"
          >
            Add to cart (demo)
          </button>
        </div>
      </div>
    </div>
  );
}
