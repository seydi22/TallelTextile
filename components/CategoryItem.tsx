// *********************
// Role of the component: A large, visual category card with a background image.
// Name of the component: CategoryItem.tsx
// Developer: Aleksandar Kuzmanovic (Updated by Gemini for TALLEL TEXTILE)
// Version: 2.0
// Component call: <CategoryItem title="Title" href="/shop/category" bgImage="/path/to/image.jpg" />
// Input parameters: CategoryItemProps interface
// Output: A large linkable card with a background image and centered title.
// *********************

import Link from "next/link";
import React from "react";
import Image from "next/image";

interface CategoryItemProps {
  title: string;
  href: string;
  bgImage: string;
}

const CategoryItem = ({ title, href, bgImage }: CategoryItemProps) => {
  // Ensure bgImage is always a valid string (normalized in CategoryMenu, but double-check here)
  const imageSrc = (() => {
    if (!bgImage || !bgImage.trim()) {
      return "/product_placeholder.jpg";
    }
    const trimmed = bgImage.trim();
    // If it's already a full URL, use it as is
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    // If it's a relative path, ensure it starts with /
    if (trimmed.startsWith("/")) {
      return trimmed;
    }
    // If it doesn't start with /, add it
    return `/${trimmed}`;
  })();
  
  // Validate that href is a valid string
  const validHref = href && href.trim() ? href.trim() : "#";
  
  return (
    <Link 
      href={validHref} 
      className="block group overflow-hidden relative aspect-[4/5] md:aspect-[3/4] transition-all duration-700 hover:scale-[1.02]"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={title || "Category"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Subtle overlay - Zuma style */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500"></div>
      </div>
      
      {/* Content - Bottom aligned like Zuma */}
      <div className="absolute inset-0 flex items-end p-6 md:p-8">
        <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight transform translate-y-0 group-hover:translate-y-[-4px] transition-transform duration-500">
          {title}
        </h3>
      </div>

      {/* Subtle border on hover */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all duration-500"></div>
    </Link>
  );
};

export default CategoryItem;
