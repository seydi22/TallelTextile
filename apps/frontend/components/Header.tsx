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
import HeaderTop from "./HeaderTop";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import apiClient from '@tallel-textile/shared/lib/api';
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
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Utiliser apiClient pour utiliser la bonne URL de base (backend)
        const response = await apiClient.get('/api/categories');
        
        if (!response.ok) {
          if (response.status === 404) {
            console.warn('⚠️ API endpoint not found. Is the backend server running?');
            setCategories([]);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await apiClient.safeJsonParse(response);
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
        </div>
      </div>
    </header>
  );
};

export default Header;
