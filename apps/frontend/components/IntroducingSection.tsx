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
    <section className="relative w-full">
      {/* Grille : vidéo grande à gauche, texte dans une bande à droite — collée au hero au-dessus */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[60vh] md:min-h-[75vh]">
        {/* Vidéo immersive (collée au contenu du haut, pas d’espace) */}
        <div className="relative md:col-span-8 lg:col-span-9 min-h-[50vh] md:min-h-[75vh] overflow-hidden bg-gray-900">
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

        {/* Bande texte à droite */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col justify-center p-6 md:p-8 lg:p-10 bg-brand-bg-primary text-left">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-brand-text-primary mb-3 md:mb-4">
            Savoir-faire & Passion
          </h2>
          <p className="font-sans text-brand-text-secondary text-sm md:text-base leading-relaxed">
            Chez TALLEL TEXTILE, chaque fil est choisi avec soin, chaque motif est pensé pour l&apos;intemporalité. Nous croyons en une mode qui traverse le temps, alliant artisanat traditionnel et design contemporain pour créer des pièces uniques qui racontent une histoire.
          </p>
          <div className="mt-4">
            <Link href="/about" className="font-sans font-semibold text-brand-text-primary pb-1 border-b border-brand-accent hover:text-brand-primary hover:border-brand-primary transition-colors duration-300">
              Découvrir notre histoire
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroducingSection;
