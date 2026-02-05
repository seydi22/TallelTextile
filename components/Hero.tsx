// *********************
// Role of the component: Premium hero component for the TALLEL TEXTILE home page
// Name of the component: Hero.tsx
// Developer: Aleksandar Kuzmanovic (Updated by Gemini for TALLEL TEXTILE)
// Version: 2.0
// Component call: <Hero />
// Input parameters: no input parameters
// Output: Full-screen hero component with a background image and centered text content.
// *********************

import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <div
      className="relative h-[70vh] md:h-[80vh] w-full bg-cover bg-center flex items-center justify-center text-center"
      style={{ backgroundImage: "url('/apartman banner.jpg')" }}
    >
      {/* Gradient Overlay */}
      <div className="gradient-overlay"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-y-6 md:gap-y-8 px-4 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-serif font-semibold leading-tight text-balance">
          L&apos;Élégance dans chaque fibre.
        </h1>
        <p className="text-white/95 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed">
          Découvrez nos collections de textiles d&apos;exception, conçues pour durer et sublimer votre quotidien.
        </p>
        <Link href="/shop" className="mt-2">
          <button className="btn btn-primary btn-lg">
            Explorer les collections
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
