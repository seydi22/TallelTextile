// *********************
// Role of the component: Client component for dynamic fields on the single product page.
// Name of the component: SingleProductDynamicFields.tsx
// Developer: Aleksandar Kuzmanovic (Updated by Gemini for TALLEL TEXTILE)
// Version: 2.0
// Component call: <SingleProductDynamicFields product={product} />
// Input parameters: { product: Product }
// Output: Quantity input and an "Add to cart" button.
// *********************

"use client";
import React, { useState } from "react";
import QuantityInput from "./QuantityInput";
import AddToCartSingleProductBtn from "./AddToCartSingleProductBtn";

const SingleProductDynamicFields = ({ product }: { product: Product }) => {
  const [quantityCount, setQuantityCount] = useState<number>(1);
  return (
    <>
      {Boolean(product.inStock) && (
        <div className="flex items-center gap-x-4 max-[500px]:flex-col max-[500px]:items-stretch max-[500px]:gap-y-3">
          <QuantityInput
            quantityCount={quantityCount}
            setQuantityCount={setQuantityCount}
          />
          <div className="flex-1">
            <AddToCartSingleProductBtn
              quantityCount={quantityCount}
              product={product}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SingleProductDynamicFields;
