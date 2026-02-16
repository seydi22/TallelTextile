"use client";

import React from "react";

export interface CustomButtonProps {
  paddingX?: number;
  paddingY?: number;
  text: string;
  buttonType: "submit" | "reset" | "button";
  customWidth?: string;
  textSize?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
}

const CustomButton = ({
  paddingX = 6,
  paddingY = 3,
  text,
  buttonType,
  customWidth,
  textSize = "base",
  variant = "secondary",
  className = "",
}: CustomButtonProps) => {
  const widthClass = customWidth && customWidth !== "no" ? `min-w-[${customWidth}]` : "";
  const variantClass = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    ghost: "btn-ghost",
  }[variant];
  const sizeClass = textSize === "sm" ? "btn-sm" : textSize === "lg" ? "btn-lg" : "btn-md";

  return (
    <button
      type={buttonType}
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()}
      style={customWidth && customWidth !== "no" ? { minWidth: customWidth } : undefined}
    >
      {text}
    </button>
  );
};

export default CustomButton;
