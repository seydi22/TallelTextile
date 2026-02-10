// *********************
// Role of the component: Showing products on the shop page with applied filter and sort
// Name of the component: Products.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Products params={params} searchParams={searchParams} />
// Input parameters: { params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import apiClient from '@tallel-textile/shared/lib/api';

const Products = async ({ params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }) => {
  // getting all data from URL slug and preparing everything for sending GET request
  const inStockNum = searchParams?.inStock === "true" ? 1 : 0;
  const outOfStockNum = searchParams?.outOfStock === "true" ? 1 : 0;
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  let stockMode: string = "lte";
  
  // preparing inStock and out of stock filter for GET request
  // If in stock checkbox is checked, stockMode is "equals"
  if (inStockNum === 1) {
    stockMode = "equals";
  }
 // If out of stock checkbox is checked, stockMode is "lt"
  if (outOfStockNum === 1) {
    stockMode = "lt";
  }
   // If in stock and out of stock checkboxes are checked, stockMode is "lte"
  if (inStockNum === 1 && outOfStockNum === 1) {
    stockMode = "lte";
  }
   // If in stock and out of stock checkboxes aren't checked, stockMode is "gt"
  if (inStockNum === 0 && outOfStockNum === 0) {
    stockMode = "gt";
  }

  let products = [];

  try {
    // Construire les paramètres de requête de manière sécurisée
    const queryParams = new URLSearchParams();
    
    // Ajouter les filtres
    queryParams.append('filters[price][$lte]', String(searchParams?.price || 3000));
    queryParams.append('filters[rating][$gte]', String(Number(searchParams?.rating) || 0));
    queryParams.append(`filters[inStock][$${stockMode}]`, '1');
    
    // Gérer le filtre de catégorie si un slug est fourni
    if (params?.slug && Array.isArray(params.slug) && params.slug.length > 0) {
      // Le slug est le nom de la catégorie en format URL (ex: "fil-a-fil", "costume-africain")
      // Le convertir en nom de catégorie pour la recherche (ex: "fil a fil", "costume africain")
      // Gérer les doubles tirets et les remplacer par des espaces simples
      const categorySlug = params.slug[0];
      const categoryName = categorySlug
        .replace(/--+/g, ' ') // Remplacer les doubles tirets par un espace
        .replace(/-/g, ' ')   // Remplacer les tirets simples par des espaces
        .trim();
      
      console.log('🔍 [Products] Category filter - Slug:', categorySlug, '→ Name:', categoryName);
      queryParams.append('filters[category][$equals]', categoryName);
    }
    
    // Ajouter le tri et la pagination
    queryParams.append('sort', String(searchParams?.sort || 'defaultSort'));
    queryParams.append('page', String(page));
    
    // Construire l'URL complète
    const queryString = queryParams.toString();
    const fullUrl = `/api/products?${queryString}`;
    console.log('🔍 [Products] Request URL:', fullUrl);
    console.log('🔍 [Products] Query params:', {
      price: searchParams?.price || 3000,
      rating: Number(searchParams?.rating) || 0,
      stockMode,
      category: params?.slug?.[0],
      sort: searchParams?.sort || 'defaultSort',
      page,
    });
    
    const response = await apiClient.get(fullUrl);

    if (!response.ok) {
      console.error('Failed to fetch products:', response.status, response.statusText);
      
      // Essayer de récupérer le message d'erreur du serveur
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Server error details:', errorData);
        } else {
          const text = await response.text();
          console.error('Server error response (non-JSON):', text.substring(0, 500));
        }
      } catch (e) {
        console.error('Could not parse error response:', e);
      }
      
      products = [];
    } else {
      // Utiliser safeJsonParse pour parser la réponse de manière sécurisée
      const result = await apiClient.safeJsonParse(response);
      products = Array.isArray(result) ? result : [];
    }
  } catch (error: any) {
    console.error('Error fetching products:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    products = [];
  }

  return (
    <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.length > 0 ? (
        products.map((product: any) => (
          <ProductItem key={product.id} product={product} color="black" />
        ))
      ) : (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
          No products found for specified query
        </h3>
      )}
    </div>
  );
};

export default Products;
