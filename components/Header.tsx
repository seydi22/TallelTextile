// *********************
// Role of the component: Header component
// Name of the component: Header.tsx
// Developer: Seydi Dieng (Updated by Gemini for TALLEL TEXTILE)
// Version: 2.0
// Component call: <Header />
// Input parameters: no input parameters
// Output: Header component
// *********************

"use client";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import HeaderTop from "./HeaderTop";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

import CartElement from "./CartElement";

const NavLink = ({ href, children, isActive }: { href: string, children: React.ReactNode, isActive?: boolean }) => (
  <Link 
    href={href} 
    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
  >
    {children}
  </Link>
);

interface Category {
  id: string;
  title: string;
  href: string;
}

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Vérifier si l'utilisateur est admin
  const isAdmin = session?.user?.role === "admin";
  const isLoggedIn = !!session;

  // Fonction de déconnexion
  const handleSignOut = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: "/"
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);


  if (pathname.startsWith("/admin")) {
    return (
      <header className="bg-brand-bg-secondary shadow-sm sticky top-0 z-40">
        <div className="flex justify-between h-20 items-center px-8 max-w-screen-2xl mx-auto">
          <Link href="/admin">
            <span className="font-serif font-semibold text-2xl text-brand-text-primary tracking-wider uppercase">
              TALLEL TEXTILE
            </span>
          </Link>
          <div className="flex gap-x-6 items-center">
            <Link href="/admin" className="font-sans text-brand-text-primary hover:text-brand-primary transition-colors">
              Tableau de bord
            </Link>
            <Link 
              href="/" 
              className="font-sans text-brand-text-primary hover:text-brand-primary transition-colors"
            >
              Boutique
            </Link>
            {isLoggedIn && (
              <button
                onClick={handleSignOut}
                className="font-sans text-brand-text-primary hover:text-brand-primary transition-colors"
              >
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-brand-bg-secondary sticky top-0 z-40">
      <HeaderTop />
      <div className="h-24 bg-brand-bg-secondary flex items-center justify-between px-12 max-w-screen-2xl mx-auto max-md:px-6">
        {/* Left: Navigation */}
        <nav className="hidden lg:flex items-center gap-x-8">
          <NavLink href="/shop">Boutique</NavLink>
          {categories.map((category) => (
            <NavLink key={category.id} href={category.href}>
              {category.title}
            </NavLink>
          ))}
          <NavLink href="/about">À propos</NavLink>
        </nav>
        <div className="lg:hidden"></div> {/* Spacer for mobile */}

        {/* Center: Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/">
            <span className="font-serif font-semibold text-3xl text-brand-text-primary tracking-wider uppercase max-lg:text-2xl">
              TALLEL TEXTILE
            </span>
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex gap-x-6 items-center">
          <button className="text-2xl hover:text-brand-primary transition-colors"><FaSearch /></button>
          <CartElement />
          {/* Lien Admin - visible uniquement pour les admins connectés */}
          {isAdmin && (
            <Link
              href="/admin"
              className="nav-link"
            >
              Admin
            </Link>
          )}
          {/* Bouton de déconnexion - visible si connecté */}
          {isLoggedIn && (
            <button
              onClick={handleSignOut}
              className="nav-link"
            >
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
