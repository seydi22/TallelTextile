"use client";
import { DashboardSidebar } from '../../../../../components';
import apiClient from '@tallel-textile/shared/lib/api';
import config from '@tallel-textile/shared/lib/config';
import { convertCategoryNameToURLFriendly as convertSlugToURLFriendly } from '../../../../../utils/categoryFormating';
import { sanitizeFormData } from '../../../../../lib/form-sanitize';
import { getImageUrl } from '../../../../../utils/imageUtils';
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
}

interface Merchant {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  description?: string | null;
  status?: string;
}

const AddNewProduct = () => {
  const router = useRouter();
  const [product, setProduct] = useState<{
    merchantId?: string;
    title: string;
    price: number;
    manufacturer: string;
    inStock: number;
    mainImage: string;
    description: string;
    slug: string;
    categoryId: string;
  }>({
    merchantId: "",
    title: "",
    price: 0,
    manufacturer: "",
    inStock: 1,
    mainImage: "",
    description: "",
    slug: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const addProduct = async () => {
    // Validation des champs requis
    if (
      !product.merchantId ||
      product.title === "" ||
      product.manufacturer === "" ||
      product.description === "" ||
      product.slug === "" ||
      !product.categoryId
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      if (!product.categoryId) {
        toast.error("Veuillez sélectionner une catégorie");
      }
      return;
    }

    if (product.price <= 0) {
      toast.error("Le prix doit être supérieur à 0");
      return;
    }

    try {
      // Sanitize form data before sending to API
      const sanitizedProduct = sanitizeFormData(product);
      
      // S'assurer que le prix est un entier (l'API attend un Int)
      sanitizedProduct.price = Math.round(Number(sanitizedProduct.price));
      sanitizedProduct.inStock = Math.round(Number(sanitizedProduct.inStock));

      console.log("Sending product data:", sanitizedProduct);

      // Correct usage of apiClient.post
      const response = await apiClient.post(`/api/products`, sanitizedProduct);

      // Lire le texte de la réponse d'abord pour déboguer
      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);

      if (response.status === 201) {
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse response as JSON:", e);
          data = { message: "Produit créé avec succès" };
        }
        
        console.log("Product created successfully:", data);
        toast.success("Produit ajouté avec succès");
        // Redirection vers la liste des produits après 1 seconde
        setTimeout(() => {
          router.push("/admin/products");
        }, 1000);
        setProduct({
          merchantId: merchants[0]?.id || "",
          title: "",
          price: 0,
          manufacturer: "",
          inStock: 1,
          mainImage: "",
          description: "",
          slug: "",
          categoryId: categories[0]?.id || "",
        });
      } else {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse error response:", e);
          errorData = { message: responseText || "Erreur lors de la création du produit" };
        }
        
        console.error("Failed to create product:", errorData);
        const errorMessage = errorData.message || errorData.error || "Erreur lors de la création du produit";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error adding product:", error);
      const errorMessage = error?.message || "Erreur réseau. Veuillez réessayer.";
      toast.error(errorMessage);
    }
  };

  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      // Utiliser config.apiBaseUrl pour une URL cohérente
      const uploadUrl = `${config.apiBaseUrl}/api/main-image`;
      console.log(`📤 [Upload] Upload URL: ${uploadUrl}`);
      
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        // Ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement
      });

      if (response.ok) {
        // Vérifier le Content-Type avant de parser
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error("Non-JSON response:", text.substring(0, 200));
          toast.error("Erreur: Réponse serveur invalide");
          return;
        }
        
        const data = await response.json();
        // Use the filename returned by the server (or url for Cloudinary)
        setProduct({ ...product, mainImage: data.filename || data.url });
        toast.success("Image téléchargée avec succès");
      } else {
        // Gérer les erreurs HTTP
        let errorMessage = `Erreur HTTP ${response.status}`;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            const text = await response.text();
            console.error("Error response (non-JSON):", text.substring(0, 200));
            if (response.status === 404) {
              errorMessage = "Endpoint non trouvé. Le backend est-il démarré ?";
            }
          }
        } catch (e) {
          console.error("Could not parse error response:", e);
        }
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error happened while sending request:", error);
      const errorMessage = error?.message || "Erreur réseau lors de l'upload de l'image";
      
      // Messages d'erreur plus spécifiques
      if (errorMessage.includes('fetch failed') || errorMessage.includes('ECONNREFUSED')) {
        toast.error("Impossible de se connecter au serveur. Vérifiez que le backend est démarré (cd server && node app.js)");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get(`/api/categories`);
        
        if (!res.ok) {
          console.error("API response not OK:", res.status, res.statusText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("📦 Categories API response:", data);
        
        // L'API backend retourne { categories: [...], _debug: {...} }
        // Extraire le tableau categories
        let categoriesArray = [];
        
        if (data.categories && Array.isArray(data.categories)) {
          categoriesArray = data.categories;
          console.log(`✅ Found ${categoriesArray.length} categories in data.categories`);
        } else if (Array.isArray(data)) {
          categoriesArray = data;
          console.log(`✅ Found ${categoriesArray.length} categories (direct array)`);
        } else {
          console.warn("⚠️ Unexpected categories data format:", data);
          console.warn("Data type:", typeof data);
          console.warn("Has categories property:", 'categories' in data);
          categoriesArray = [];
        }
        
        console.log("📋 Categories array:", categoriesArray);
        if (categoriesArray.length > 0) {
          console.log("📋 First category example:", categoriesArray[0]);
        }
        setCategories(categoriesArray);
        
        if (categoriesArray.length > 0) {
          setProduct((prev) => ({
            ...prev,
            categoryId: categoriesArray[0]?.id || "",
          }));
        } else {
          toast.error("Aucune catégorie disponible. Veuillez créer une catégorie d'abord.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Erreur lors du chargement des catégories");
        setCategories([]); // S'assurer que c'est un tableau vide en cas d'erreur
      }
    };

    const fetchMerchants = async () => {
      try {
        const res = await apiClient.get("/api/merchants");
        const data: Merchant[] = await res.json();
        setMerchants(data || []);
        setProduct((prev) => ({
         ...prev,
          merchantId: prev.merchantId || data?.[0]?.id || "",
        }));
      } catch (e) {
        toast.error("Impossible de charger les marchands");
      }
    };

    fetchCategories();
    fetchMerchants();
  }, []);

  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content flex flex-col gap-6">
        <h1 className="page-title">Ajouter un produit</h1>
        <div className="form-group">
          <label htmlFor="product-merchant" className="form-label">Marchand</label>
            <select
              id="product-merchant"
              className="form-select max-w-xs"
              value={product?.merchantId}
              onChange={(e) =>
                setProduct({ ...product, merchantId: e.target.value })
              }
            >
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.name}
                </option>
              ))}
            </select>
            {merchants.length === 0 && (
              <span className="text-xs text-red-500 mt-1">
                Veuillez d&apos;abord créer un marchand.
              </span>
            )}
        </div>

        <div className="form-group">
          <label htmlFor="product-name" className="form-label">Nom du produit</label>
            <input
              id="product-name"
              type="text"
              className="form-input max-w-xs"
              value={product?.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
            />
        </div>

        <div className="form-group">
          <label htmlFor="product-slug" className="form-label">Slug du produit (identifiant URL)</label>
            <input
              id="product-slug"
              type="text"
              className="form-input max-w-xs"
              value={convertSlugToURLFriendly(product?.slug)}
              onChange={(e) =>
                setProduct({
                  ...product,
                  slug: convertSlugToURLFriendly(e.target.value),
                })
              }
            />
        </div>

        <div className="form-group">
          <label htmlFor="product-category" className="form-label">Catégorie</label>
            <select
              id="product-category"
              className="form-select max-w-xs"
              value={product?.categoryId}
              onChange={(e) =>
                setProduct({ ...product, categoryId: e.target.value })
              }
              disabled={!Array.isArray(categories) || categories.length === 0}
            >
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category: any) => (
                  <option key={category?.id} value={category?.id}>
                    {category?.name || category?.title || "Catégorie sans nom"}
                  </option>
                ))
              ) : (
                <option value="">Chargement des catégories...</option>
              )}
            </select>
            {(!Array.isArray(categories) || categories.length === 0) && (
              <span className="text-xs text-red-500 mt-1">
                Aucune catégorie disponible. Veuillez créer une catégorie d&apos;abord.
              </span>
            )}
        </div>

        <div className="form-group">
          <label htmlFor="product-price" className="form-label">Prix du produit</label>
            <input
              id="product-price"
              type="text"
              className="form-input max-w-xs"
              value={product?.price}
              onChange={(e) =>
                setProduct({ ...product, price: Number(e.target.value) })
              }
            />
        </div>
        <div className="form-group">
          <label htmlFor="product-manufacturer" className="form-label">Fabricant</label>
            <input
              id="product-manufacturer"
              type="text"
              className="form-input max-w-xs"
              value={product?.manufacturer}
              onChange={(e) =>
                setProduct({ ...product, manufacturer: e.target.value })
              }
            />
        </div>
        <div className="form-group">
          <label htmlFor="product-stock" className="form-label">Produit en stock ?</label>
            <select
              id="product-stock"
              className="form-select max-w-xs"
              value={product?.inStock}
              onChange={(e) =>
                setProduct({ ...product, inStock: Number(e.target.value) })
              }
            >
              <option value={1}>Oui</option>
              <option value={0}>Non</option>
            </select>
        </div>
        <div className="form-group">
          <label htmlFor="product-image" className="form-label">Image principale</label>
          <input
            id="product-image"
            type="file"
            className="file-input file-input-bordered file-input-lg w-full max-w-sm"
            onChange={(e: any) => {
              if (e.target.files && e.target.files[0]) {
                uploadFile(e.target.files[0]);
              }
            }}
          />
          {product?.mainImage && (
            <Image
              src={getImageUrl(product?.mainImage)}
              alt={product?.title}
              className="w-auto h-auto"
              width={100}
              height={100}
            />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="product-description" className="form-label">Description du produit</label>
            <textarea
              id="product-description"
              className="form-textarea max-w-xl h-24"
              value={product?.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
        </div>
        <div className="flex gap-x-2">
          <button
            onClick={addProduct}
            type="button"
            className="btn btn-secondary btn-lg"
          >
            Ajouter le produit
          </button>
        </div>
      </main>
    </div>
  );
};

export default AddNewProduct;
