// *********************
// Role of the component: Button for adding product to the cart on the single product page
// Name of the component: AddToCartSingleProductBtn.tsx
// Developer: Aleksandar Kuzmanovic (Updated by Gemini for TALLEL TEXTILE)
// Version: 2.0
// Component call: <AddToCartSingleProductBtn product={product} quantityCount={quantityCount}  />
// Input parameters: SingleProductBtnProps interface
// Output: A primary button with "add to cart" functionality.
// *********************
"use client";

import React from "react";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";

const AddToCartSingleProductBtn = ({ product, quantityCount }: SingleProductBtnProps) => {
  const { addToCart, calculateTotals } = useProductStore();

  const handleAddToCart = () => {
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: quantityCount,
    });
    calculateTotals();
    toast.success(`${product?.title} a été ajouté au panier.`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full h-12 bg-brand-secondary text-white font-sans font-semibold text-lg rounded-md hover:bg-gray-800 transition-colors duration-300"
    >
      Ajouter au panier
    </button>
  );
};

export default AddToCartSingleProductBtn;
