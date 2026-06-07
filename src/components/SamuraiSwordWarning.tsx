import { FAVORITE_PRODUCT_ID } from "../data/products";

type SamuraiSwordWarningProps = {
  productId: string;
  /** Lighter text for dark backgrounds (home carousel). */
  onDark?: boolean;
  className?: string;
};

export default function SamuraiSwordWarning({
  productId,
  onDark = false,
  className = "",
}: SamuraiSwordWarningProps) {
  if (productId !== FAVORITE_PRODUCT_ID) return null;

  return (
    <div
      role="note"
      className={`rounded-lg border-2 px-3 py-2 text-sm font-bold ${
        onDark
          ? "border-amber-400/80 bg-amber-500/20 text-amber-100"
          : "border-amber-500 bg-amber-50 text-amber-950"
      } ${className}`}
    >
      ⚠️ Do not swing near someone
    </div>
  );
}
