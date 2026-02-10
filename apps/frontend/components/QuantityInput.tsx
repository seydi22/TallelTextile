// *********************
// Role of the component: Quantity input for incrementing and decrementing product quantity on the single product page
// Name of the component: QuantityInput.tsx
// Developer: Aleksandar Kuzmanovic (Updated by Gemini for TALLEL TEXTILE)
// Version: 2.0
// Component call: <QuantityInput quantityCount={quantityCount} setQuantityCount={setQuantityCount} />
// Input parameters: QuantityInputProps interface
// Output: one number input and two buttons for quantity manipulation.
// *********************

"use client";

import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";

interface QuantityInputProps {
  quantityCount: number;
  setQuantityCount: React.Dispatch<React.SetStateAction<number>>;
}

const QuantityInput = ({ quantityCount, setQuantityCount }: QuantityInputProps) => {
  const handleQuantityChange = (actionName: string): void => {
    if (actionName === "plus") {
      setQuantityCount(quantityCount + 1);
    } else if (actionName === "minus" && quantityCount > 1) {
      setQuantityCount(quantityCount - 1);
    }
  };

  return (
    <div className="flex items-center max-[500px]:justify-center">
      <div className="flex items-center border border-gray-300 rounded-md">
        <button
          type="button"
          className="size-12 leading-10 text-gray-600 transition hover:bg-gray-100 flex justify-center items-center"
          onClick={() => handleQuantityChange("minus")}
        >
          <FaMinus />
        </button>

        <input
          type="number"
          id="Quantity"
          readOnly
          value={quantityCount}
          className="h-12 w-16 border-transparent text-center [-moz-appearance:_textfield] sm:text-lg [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
        />

        <button
          type="button"
          className="size-12 leading-10 text-gray-600 transition hover:bg-gray-100 flex justify-center items-center"
          onClick={() => handleQuantityChange("plus")}
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default QuantityInput;
