// *********************
// Role of the component: A section to introduce the brand's philosophy (Manifesto).
// Name of the component: IntroducingSection.tsx
// Developer: Aleksandar Kuzmanovic (Updated by Gemini for TALLEL TEXTILE)
// Version: 2.0
// Component call: <IntroducingSection /> ou <IntroducingSection videoSrc="/videos/savoir-faire.mp4" />
// Output: A two-column section with a video (MP4, sans son) and text about the brand.
// *********************

import Link from "next/link";
import React from "react";

const DEFAULT_VIDEO_SRC = "/savoir-faire.mp4";

const IntroducingSection = ({ videoSrc = DEFAULT_VIDEO_SRC }: { videoSrc?: string }) => {
  return (
    <div className="bg-brand-bg-primary">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 items-stretch gap-12 px-6 py-24">
        {/* Colonne vidéo (MP4, sans son, lecture auto en boucle) */}
        <div className="w-full h-full min-h-[600px] relative rounded-md overflow-hidden bg-gray-50">
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            aria-label="Savoir-faire et atelier TALLEL TEXTILE"
          />
        </div>

        {/* Text Column */}
        <div className="flex flex-col justify-center text-left gap-y-4">
          <h2 className="font-serif text-4xl font-semibold text-brand-text-primary">
            Savoir-faire & Passion
          </h2>
          <p className="font-sans text-brand-text-secondary text-lg leading-relaxed">
            Chez TALLEL TEXTILE, chaque fil est choisi avec soin, chaque motif est pensé pour l&apos;intemporalité. Nous croyons en une mode qui traverse le temps, alliant artisanat traditionnel et design contemporain pour créer des pièces uniques qui racontent une histoire.
          </p>
          <div className="mt-4">
            <Link href="/about" className="font-sans font-semibold text-brand-text-primary pb-1 border-b border-brand-accent hover:text-brand-primary hover:border-brand-primary transition-colors duration-300">
              Découvrir notre histoire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroducingSection;
