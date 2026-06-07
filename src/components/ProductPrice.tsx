import type { Product } from "../data/products";
import { FATHERS_DAY_SALE, formatMoney, getDiscountedPrice, isFathersDaySaleActive } from "../lib/pricing";

type ProductPriceProps = {
  product: Product;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClass = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl font-bold",
};

export default function ProductPrice({ product, className = "", size = "md" }: ProductPriceProps) {
  const onSale = isFathersDaySaleActive();
  const salePrice = getDiscountedPrice(product.price);
  const text = sizeClass[size];

  if (!onSale) {
    return (
      <span className={`${text} ${className}`}>
        {product.currency} {formatMoney(product.price)}
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-2 ${text} ${className}`}>
      <span className="text-brand-muted line-through">
        {product.currency} {formatMoney(product.price)}
      </span>
      <span className="font-bold text-red-600">
        {product.currency} {formatMoney(salePrice)}
      </span>
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-800">
        {FATHERS_DAY_SALE.percentOff}% off
      </span>
    </span>
  );
}

export function getProductChargePrice(product: Product): number {
  return getDiscountedPrice(product.price);
}
