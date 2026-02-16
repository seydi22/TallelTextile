"use client";
// Carte catégorie compacte : cercle avec image + nom en dessous (style grille type "Nos Univers")
import Link from "next/link";
import Image from "next/image";
import React from "react";

interface CategoryItemCompactProps {
  title: string;
  href: string;
  bgImage: string;
}

const CategoryItemCompact = ({ title, href, bgImage }: CategoryItemCompactProps) => {
  const imageSrc = (() => {
    if (!bgImage?.trim()) return "/product_placeholder.jpg";
    const t = bgImage.trim();
    if (t.startsWith("http://") || t.startsWith("https://")) return t;
    return t.startsWith("/") ? t : `/${t}`;
  })();
  const validHref = href?.trim() || "#";

  return (
    <Link
      href={validHref}
      className="group flex flex-col items-center text-center"
    >
      <div className="relative w-full aspect-square max-w-[140px] mx-auto mb-2 md:mb-3 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-brand-primary transition-all duration-300 group-hover:scale-105">
        <Image
          src={imageSrc}
          alt={title || "Catégorie"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 140px"
        />
      </div>
      <span className="text-xs md:text-sm font-medium text-brand-text-primary uppercase tracking-wide line-clamp-2 group-hover:text-brand-primary transition-colors">
        {title}
      </span>
    </Link>
  );
};

export default CategoryItemCompact;
