// *********************
// Role of the component: Premium product item card
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic (Updated by Gemini for TALLEL TEXTILE)
// Version: 2.0
// Component call: <ProductItem product={product} />
// Input parameters: { product: Product; }
// Output: A minimalist product card with brand styles and a hover effect to show the "Add to cart" button.
// *********************

"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { sanitize } from "@/lib/sanitize";
import { formatPriceMRU } from "@/lib/formatPrice";
import { getImageUrl } from "@/utils/imageUtils";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";

const ProductItem = ({ product, color }: { product: Product; color?: string }) => {
  const { addToCart, calculateTotals } = useProductStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêcher la navigation vers la page produit
    e.stopPropagation(); // Empêcher la propagation de l'événement
    
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: 1,
    });
    calculateTotals();
    toast.success(`${sanitize(product?.title)} a été ajouté au panier.`);
  };

  return (
    <div className="product-card group">
      <Link href={`/product/${product.slug}`} className="flex-grow">
        <div className="product-image-wrapper">
          <Image
            src={getImageUrl(product.mainImage)}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={sanitize(product?.title) || "Product image"}
            className="product-image group-hover:scale-110"
            priority={false}
          />
        </div>
        <div className="product-info">
          <h3 className="product-title">
            {sanitize(product.title)}
          </h3>
          <p className="product-price">
            {formatPriceMRU(product.price)}
          </p>
        </div>
      </Link>
      <div className="px-4 pb-4 md:px-6 md:pb-6">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleAddToCart}
            className="btn btn-secondary w-full btn-md bg-brand-secondary text-white hover:bg-brand-primary transition-colors duration-300"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
