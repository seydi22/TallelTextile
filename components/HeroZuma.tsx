// *********************
// Role of the component: Hero component inspired by Zuma Restaurant design
// Name of the component: HeroZuma.tsx
// Developer: Auto (Inspired by Zuma Restaurant)
// Version: 1.0
// Component call: <HeroZuma />
// Input parameters: no input parameters
// Output: Full-screen hero with elegant typography and smooth animations
// *********************

"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const HeroZuma = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/apartman banner.jpg"
          alt="TALLEL TEXTILE"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: 'center' }}
        />
        {/* Subtle gradient overlay - Zuma style */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30"></div>
      </div>

      {/* Content - Centered with elegant spacing */}
      <div className={`relative z-10 h-full flex items-center justify-center px-6 md:px-12 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-5xl mx-auto text-center space-y-8 md:space-y-12">
          {/* Main Title - Large, elegant serif */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white font-light tracking-tight leading-[1.1] animate-fade-in">
            L&apos;Élégance
            <br />
            <span className="font-normal">dans chaque fibre</span>
          </h1>

          {/* Subtitle - Refined and minimal */}
          <p className="text-white/90 text-lg md:text-xl lg:text-2xl font-light max-w-2xl mx-auto leading-relaxed tracking-wide animate-slide-up">
            Textiles d&apos;exception, conçus pour durer et sublimer votre quotidien
          </p>

          {/* CTA Button - Minimalist style */}
          <div className="pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/shop">
              <button className="group relative px-8 py-4 md:px-12 md:py-5 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-serif text-sm md:text-base tracking-wider uppercase hover:bg-white/20 transition-all duration-500 hover:border-white/50">
                <span className="relative z-10">Découvrir</span>
                <span className="absolute inset-0 bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Zuma style */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroZuma;
