import { useState } from "react";
import type { Product } from "../data/products";

interface ProductImageProps {
  product: Product;
  className?: string;
  alt?: string;
}

export default function ProductImage({
  product,
  className = "",
  alt,
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const imageAlt = alt || product.title;
  const gradientClass = `bg-gradient-to-br ${product.imageGradient ?? "from-unicef-blue to-unicef-dark"}`;
  
  const imageUrl = product.images?.[0] || product.image;

  if (imageUrl && !imageError) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return <div className={`${gradientClass} ${className}`} />;
}
