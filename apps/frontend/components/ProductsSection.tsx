// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Aleksandar Kuzmanovic (Updated by Gemini for TALLEL TEXTILE)
// Version: 2.0
// Component call: <ProductsSection />
// Input parameters: no input parameters
// Output: A grid of featured products.
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import apiClient from '@tallel-textile/shared/lib/api';
import ProductCarousel from "./ProductCarousel"; // Import the new component

const ProductsSection = async () => {
  let products = [];
  
  try {
    const data = await apiClient.get("/api/products?limit=8"); // Fetch more products for a better carousel experience
    
    if (!data.ok) {
      // Seulement logger en développement
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Backend API non disponible ou erreur:', data.statusText);
        console.info('💡 Pour résoudre: Démarrez le backend avec "cd server && node app.js"');
      }
      products = [];
    } else {
      const result = await data.json();
      products = Array.isArray(result) ? result : [];
    }
  } catch (error: any) {
    // Gestion silencieuse des erreurs pour éviter les crashes
    // L'erreur est souvent due au backend non démarré
    // Seulement logger en développement avec un message informatif
    if (process.env.NODE_ENV === 'development') {
      const errorMessage = error?.message || String(error);
      if (errorMessage.includes('fetch failed') || errorMessage.includes('ECONNREFUSED')) {
        // Erreur de connexion attendue si le backend n'est pas démarré
        console.info('ℹ️ Backend API non disponible. Démarrez le serveur avec: cd server && node app.js');
      } else {
        // Autres erreurs
        console.warn('⚠️ Erreur lors de la récupération des produits:', errorMessage);
      }
    }
    products = [];
  }

  return (
    <div className="bg-brand-bg-secondary py-24">
      <div className="max-w-screen-xl mx-auto">
        <Heading title="La Sélection TALLEL" />
        <div className="pt-12">
          {products.length > 0 ? (
            <ProductCarousel>
              {products.map((product: any) => (
                <div key={product.id} className="px-2">
                  <ProductItem product={product} />
                </div>
              ))}
            </ProductCarousel>
          ) : (
            <div className="col-span-full text-center text-brand-text-secondary py-10">
              <p>Aucun produit disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
