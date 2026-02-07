// *********************
// Role of the component: Header inspired by Zuma Restaurant - minimal, elegant, transparent
// Name of the component: HeaderZuma.tsx
// Developer: Auto (Inspired by Zuma Restaurant)
// Version: 1.0
// Component call: <HeaderZuma />
// Input parameters: no input parameters
// Output: Minimalist header with smooth scroll effects
// *********************

"use client";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useSafeSession } from "@/hooks/useSafeSession";
import { useRouter } from "next/navigation";
import CartElement from "./CartElement";
import apiClient from "@/lib/api";

interface Category {
  id: string;
  title: string;
  href: string;
}

interface ApiCategory {
  id: string;
  name: string;
  image: string | null;
}

const HeaderZuma = () => {
  const pathname = usePathname();
  // Utiliser le hook sécurisé pour éviter les erreurs de destructuration
  const sessionResult = useSafeSession();
  const session = sessionResult?.data || null;
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Debug: log session status
  useEffect(() => {
    if (sessionResult?.status === "authenticated") {
      console.log("🔐 [HeaderZuma] Session authentifiée:", session);
      console.log("🔐 [HeaderZuma] User role:", session?.user?.role);
    } else if (sessionResult?.status === "loading") {
      console.log("⏳ [HeaderZuma] Session en chargement...");
    } else {
      console.log("❌ [HeaderZuma] Pas de session:", sessionResult);
    }
  }, [sessionResult, session]);
  
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
        // Utiliser apiClient pour utiliser la bonne URL de base (backend)
        const response = await apiClient.get('/api/categories');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Vérifier le Content-Type avant de parser
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error("Non-JSON response received from /api/categories");
          setCategories([]);
          return;
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Transform API categories to component format
          const transformedCategories: Category[] = data
            .filter((cat: ApiCategory) => cat.id && cat.name) // Filter out invalid categories
            .map((cat: ApiCategory) => ({
              id: cat.id,
              title: cat.name,
              href: `/shop/category/${cat.id}`, // Generate href from category ID
            }));
          
          setCategories(transformedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]); // Set empty array on error
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Admin header - keep simple
  if (pathname.startsWith("/admin")) {
    return (
      <header className="bg-white shadow-sm sticky top-0 z-50">
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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Left: Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-x-8">
            <Link 
              href="/shop" 
              className={`font-serif text-sm tracking-wider uppercase transition-colors duration-300 ${
                isScrolled ? 'text-brand-text-primary hover:text-brand-primary' : 'text-white hover:text-white/80'
              }`}
            >
              Boutique
            </Link>
            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className={`font-serif text-sm tracking-wider uppercase transition-colors duration-300 ${
                  isScrolled ? 'text-brand-text-primary hover:text-brand-primary' : 'text-white hover:text-white/80'
                }`}
              >
                {category.title}
              </Link>
            ))}
            <Link 
              href="/about" 
              className={`font-serif text-sm tracking-wider uppercase transition-colors duration-300 ${
                isScrolled ? 'text-brand-text-primary hover:text-brand-primary' : 'text-white hover:text-white/80'
              }`}
            >
              À propos
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden transition-colors duration-300 ${
              isScrolled ? 'text-brand-text-primary' : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <span className={`font-serif font-semibold tracking-wider uppercase transition-all duration-500 ${
              isScrolled ? 'text-2xl text-brand-text-primary' : 'text-3xl text-white'
            }`}>
              TALLEL TEXTILE
            </span>
          </Link>

          {/* Right: Icons */}
          <div className="flex gap-x-6 items-center">
            <button 
              className={`transition-colors duration-300 ${
                isScrolled ? 'text-brand-text-primary hover:text-brand-primary' : 'text-white hover:text-white/80'
              }`}
            >
              <FaSearch size={18} />
            </button>
            <CartElement />
            {/* Lien Admin - visible uniquement pour les admins connectés */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`font-serif text-sm tracking-wider uppercase transition-colors duration-300 ${
                  isScrolled ? 'text-brand-text-primary hover:text-brand-primary' : 'text-white hover:text-white/80'
                }`}
              >
                Admin
              </Link>
            )}
            {/* Bouton de déconnexion - visible si connecté */}
            {isLoggedIn && (
              <button
                onClick={handleSignOut}
                className={`font-serif text-sm tracking-wider uppercase transition-colors duration-300 ${
                  isScrolled ? 'text-brand-text-primary hover:text-brand-primary' : 'text-white hover:text-white/80'
                }`}
              >
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
          <nav className="px-6 py-6 space-y-4">
            <Link 
              href="/shop" 
              className="block font-serif text-sm tracking-wider uppercase text-brand-text-primary hover:text-brand-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Boutique
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="block font-serif text-sm tracking-wider uppercase text-brand-text-primary hover:text-brand-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {category.title}
              </Link>
            ))}
            <Link 
              href="/about" 
              className="block font-serif text-sm tracking-wider uppercase text-brand-text-primary hover:text-brand-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              À propos
            </Link>
            {/* Lien Admin dans le menu mobile - visible uniquement pour les admins */}
            {isAdmin && (
              <Link 
                href="/admin" 
                className="block font-serif text-sm tracking-wider uppercase text-brand-text-primary hover:text-brand-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {/* Bouton de déconnexion dans le menu mobile */}
            {isLoggedIn && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="block w-full text-left font-serif text-sm tracking-wider uppercase text-brand-text-primary hover:text-brand-primary transition-colors"
              >
                Déconnexion
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderZuma;
