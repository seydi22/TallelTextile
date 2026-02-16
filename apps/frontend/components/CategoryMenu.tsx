"use client";
import React, { useEffect, useState } from "react";
import CategoryItemCompact from "./CategoryItemCompact";
import apiClient from '@tallel-textile/shared/lib/api';

interface Category {
  id: string;
  title: string;
  href: string;
  bgImage: string;
}

interface ApiCategory {
  id: string;
  name: string;
  image: string | null;
}

const CategoryMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Utiliser apiClient pour utiliser la bonne URL de base (backend)
        // Ajouter un timeout pour éviter les blocages
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes timeout
        
        const response = await apiClient.get("/api/categories", {
          cache: 'no-store', // Force fresh data
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            }
          } catch (e) {
            // Ignore JSON parsing errors for error responses
          }
          throw new Error(errorMessage);
        }
        
        // Vérifier le Content-Type avant de parser
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error("Non-JSON response received:", text.substring(0, 200));
          throw new Error('La réponse du serveur n\'est pas au format JSON');
        }
        
        const data = await response.json();
        console.log("📦 Data received from /api/categories:", data);
        
        // Handle both array and error object
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Handle both array format and object format (for backward compatibility)
        let categoriesArray: ApiCategory[] = data;
        if (!Array.isArray(data)) {
          // If it's an object with categories property (debug mode)
          if (data.categories && Array.isArray(data.categories)) {
            categoriesArray = data.categories;
          } else {
            setError("Format de données invalide reçu du serveur.");
            console.error(
              "❌ Data received from /api/categories is not an array:",
              data
            );
            setCategories([]);
            return;
          }
        }
        
        // Transform API categories to component format
        const transformedCategories: Category[] = categoriesArray
          .filter((cat: ApiCategory) => cat.id && cat.name) // Filter out invalid categories
          .map((cat: ApiCategory) => {
            // Normalize image path for Next.js Image component
            let imagePath = "/product_placeholder.jpg"; // Default placeholder
            if (cat.image) {
              const trimmedImage = cat.image.trim();
              if (trimmedImage) {
                // If it's already a full URL (http:// or https://), use it as is
                if (trimmedImage.startsWith("http://") || trimmedImage.startsWith("https://")) {
                  imagePath = trimmedImage;
                } 
                // If it's a relative path, ensure it starts with /
                else if (trimmedImage.startsWith("/")) {
                  imagePath = trimmedImage;
                } 
                // If it doesn't start with /, add it
                else {
                  imagePath = `/${trimmedImage}`;
                }
              }
            }
            
            return {
              id: cat.id,
              title: cat.name,
              href: `/shop/category/${cat.id}`, // Generate href from category ID
              bgImage: imagePath,
            };
          });
        
        if (transformedCategories.length > 0) {
          setCategories(transformedCategories);
          console.log(`✅ Loaded ${transformedCategories.length} categories:`, transformedCategories);
        } else {
          console.warn("⚠️ No categories found in response");
          setCategories([]);
        }
      } catch (e: any) {
        console.error("❌ Failed to fetch categories:", e);
        if (e.name === 'AbortError') {
          setError("Timeout: Le serveur met trop de temps à répondre");
        } else {
          setError(e.message || "Erreur lors du chargement des catégories");
        }
        // Ne pas vider les catégories en cas d'erreur pour éviter le flash
        // setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <div className="py-24 bg-brand-bg-primary text-center">
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 bg-brand-bg-primary text-center text-red-500">
        <p>Error loading categories: {error}</p>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        {/* Titre de section */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-brand-text-primary tracking-tight mb-4">
            Nos Univers
          </h2>
          <div className="w-24 h-px bg-brand-primary mx-auto"></div>
        </div>

        {/* Grille compacte : plus de colonnes pour afficher beaucoup de catégories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {categories.length > 0 ? (
            categories.map((item, index) => (
              <div
                key={item.id}
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
              >
                <CategoryItemCompact
                  title={item.title}
                  href={item.href}
                  bgImage={item.bgImage}
                />
              </div>
            ))
          ) : (
            !loading && (
              <div className="col-span-full text-center text-brand-text-secondary py-20">
                <p className="font-serif text-lg">Aucune catégorie disponible pour le moment.</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryMenu;
