// *********************
// Rôle du composant : Composant de pied de page pour TALLEL TEXTILE
// Nom du composant : Footer.tsx
// Développeur : Gemini
// Version : 2.0
// Appel du composant : <Footer />
// Paramètres d'entrée : aucun
// Sortie : Pied de page stylisé avec navigation et formulaire de newsletter
// *********************

import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-neutral" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-screen-xl px-6 lg:px-8 pt-24 pb-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo & Tagline Column */}
          <div className="col-span-2 md:col-span-2 mb-8 md:mb-0">
            <Link href="/" className="block">
              <span className="font-serif font-semibold text-2xl text-base-100 tracking-wider uppercase">
                TALLEL TEXTILE
              </span>
            </Link>
            <p className="mt-4 text-base-100/70 text-sm max-w-xs">
              L&apos;élégance dans chaque fibre. Textiles d&apos;exception, conçus pour durer.
            </p>
          </div>

          {/* Navigation Columns */}
          <div>
            <h3 className="font-serif text-base font-semibold text-base-100">Collections</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li><Link href="/shop/linge-de-maison" className="text-sm text-base-100/80 hover:text-base-100 transition-colors">Linge de maison</Link></li>
              <li><Link href="/shop/ameublement" className="text-sm text-base-100/80 hover:text-base-100 transition-colors">Ameublement</Link></li>
              <li><Link href="/shop/pret-a-porter" className="text-sm text-base-100/80 hover:text-base-100 transition-colors">Prêt-à-porter</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold text-base-100">À propos</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li><Link href="/about" className="text-sm text-base-100/80 hover:text-base-100 transition-colors">Notre histoire</Link></li>
              <li><Link href="/contact" className="text-sm text-base-100/80 hover:text-base-100 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter and Social */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-serif text-base font-semibold text-base-100">Newsletter</h3>
            <form className="mt-6">
              <label htmlFor="email-address" className="sr-only">Adresse e-mail</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="email" name="email-address" id="email-address" autoComplete="email" required className="input input-bordered w-full bg-base-100/10 border-base-100/30 text-base-100 placeholder:text-base-100/50" placeholder="Votre e-mail" />
                <button type="submit" className="btn btn-primary">S&apos;inscrire</button>
              </div>
            </form>
            <h3 className="font-serif text-base font-semibold text-base-100 mt-8">Suivez-nous</h3>
            <div className="flex space-x-4 mt-6">
                <a 
                  href="https://web.facebook.com/profile.php?id=61575124925010" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-base-100/80 hover:text-base-100 transition-colors duration-300"
                  aria-label="Visitez notre page Facebook"
                >
                  <FaFacebook className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.instagram.com/textiletallel/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-base-100/80 hover:text-base-100 transition-colors duration-300"
                  aria-label="Visitez notre page Instagram"
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.tiktok.com/@tallel.textile" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-base-100/80 hover:text-base-100 transition-colors duration-300"
                  aria-label="Visitez notre page TikTok"
                >
                  <FaTiktok className="w-6 h-6" />
                </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-base-100/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-base-100/50">
            &copy; {new Date().getFullYear()} TALLEL TEXTILE. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
