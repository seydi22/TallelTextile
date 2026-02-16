"use client";

import React from "react";

interface SectionTitleProps {
  title: string;
  path: string;
}

const SectionTitle = ({ title, path }: SectionTitleProps) => {
  return (
    <header className="h-[200px] sm:h-[230px] md:h-[250px] border-b border-brand-primary/20 bg-brand-secondary flex flex-col justify-center items-center pt-12 pb-6 px-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center text-white font-serif font-semibold mb-2 sm:mb-4">
        {title}
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-brand-accent text-center" aria-label="Fil d’Ariane">
        {path}
      </p>
    </header>
  );
};

export default SectionTitle;
