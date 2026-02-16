"use client";
import { CustomButton, DashboardSidebar, SectionTitle } from '../../../../../components';
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import {
  convertCategoryNameToURLFriendly as convertSlugToURLFriendly,
  formatCategoryName,
} from "../../../../../utils/categoryFormating";
import apiClient from '@tallel-textile/shared/lib/api';
import config from '@tallel-textile/shared/lib/config';
import { getImageUrl } from '../../../../../utils/imageUtils';

interface DashboardProductDetailsProps {
  params: Promise<{ id: string }>;
}

interface Product {
  id: string;
  slug: string;
  title: string;
  mainImage: string;
  price: number;
  rating: number;
  description: string;
  manufacturer: string;
  inStock: number;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

interface OtherImages {
  imageID: string;
  productID?: string;
  image: string;
}

const MAX_EXTRA_IMAGES = 4;
const MAX_TOTAL_IMAGES = 5;

const DashboardProductDetails = ({ params }: DashboardProductDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [product, setProduct] = useState<Product>();
  const [categories, setCategories] = useState<Category[]>();
  const [otherImages, setOtherImages] = useState<OtherImages[]>([]);
  const router = useRouter();

  // functionality for deleting product
  const deleteProduct = async () => {
    const requestOptions = {
      method: "DELETE",
    };
    apiClient
      .delete(`/api/products/${id}`, requestOptions)
      .then((response) => {
        if (response.status !== 204) {
          if (response.status === 400) {
            toast.error(
              "Impossible de supprimer ce produit : il est référencé par des commandes."
            );
          } else {
            throw Error("There was an error while deleting product");
          }
        } else {
          toast.success("Produit supprimé avec succès");
          router.push("/admin/products");
        }
      })
      .catch((error) => {
        toast.error("Erreur lors de la suppression du produit");
      });
  };

  // functionality for updating product
  const updateProduct = async () => {
    if (
      product?.title === "" ||
      product?.slug === "" ||
      product?.price.toString() === "" ||
      product?.manufacturer === "" ||
      product?.description === ""
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const response = await apiClient.put(`/api/products/${id}`, product);

      if (response.status === 200) {
        await response.json();
        toast.success("Produit mis à jour avec succès");
        // Redirection vers la liste des produits après 1 seconde
        setTimeout(() => {
          router.push("/admin/products");
        }, 1000);
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error || "Erreur lors de la mise à jour du produit"
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Erreur lors de la mise à jour du produit");
    }
  };

  const uploadExtraImage = async (file: File) => {
    if (otherImages.length >= MAX_EXTRA_IMAGES) {
      toast.error(`Maximum ${MAX_TOTAL_IMAGES} photos par produit (1 principale + ${MAX_EXTRA_IMAGES} supplémentaires).`);
      return;
    }
    const formData = new FormData();
    formData.append("uploadedFile", file);
    try {
      const uploadUrl = `${config.apiBaseUrl}/api/main-image`;
      const response = await fetch(uploadUrl, { method: "POST", body: formData });
      if (!response.ok) {
        toast.error("Erreur lors de l'upload de l'image");
        return;
      }
      const data = await response.json();
      const imagePath = data.filename || data.url;
      const createRes = await apiClient.post("/api/images", {
        productID: id,
        image: imagePath,
      });
      if (createRes.ok) {
        const newImage = await createRes.json();
        setOtherImages((prev) => [...prev, newImage]);
        toast.success("Image ajoutée");
      } else {
        const err = await createRes.json().catch(() => ({}));
        toast.error(err?.details || err?.error || "Impossible d'ajouter l'image");
      }
    } catch {
      toast.error("Erreur lors de l'upload");
    }
  };

  const removeExtraImage = async (imageId: string) => {
    try {
      const res = await apiClient.delete(`/api/images/one/${imageId}`);
      if (res.ok || res.status === 204) {
        setOtherImages((prev) => prev.filter((img) => img.imageID !== imageId));
        toast.success("Image supprimée");
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  // functionality for uploading main image file
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
        // Update the product with the new image filename (or url for Cloudinary)
        if (product) {
          setProduct({ ...product, mainImage: data.filename || data.url });
        }
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
      console.error("There was an error while during request sending:", error);
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
    const fetchProductData = async () => {
      apiClient
        .get(`/api/products/${id}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setProduct(data);
        });

      const imagesData = await apiClient.get(`/api/images/${id}`, {
        cache: "no-store",
      });
      const images = await imagesData.json();
      setOtherImages((currentImages) => images);
    };

    const fetchCategories = async () => {
      apiClient
        .get(`/api/categories`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setCategories(data);
        });
    };
    fetchCategories();
    fetchProductData();
  }, [id]);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:ml-5 w-full max-xl:px-5">
        <h1 className="text-3xl font-semibold">Product details</h1>
        {/* Product name input div - start */}
        
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Product name:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.title || ""}
              onChange={(e) =>
                setProduct({ ...product!, title: e.target.value })
              }
            />
          </label>
        </div>
        {/* Product name input div - end */}
        {/* Product price input div - start */}

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Product price:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.price || ""}
              onChange={(e) =>
                setProduct({ ...product!, price: Number(e.target.value) })
              }
            />
          </label>
        </div>
        {/* Product price input div - end */}
        {/* Product manufacturer input div - start */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Manufacturer:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.manufacturer || ""}
              onChange={(e) =>
                setProduct({ ...product!, manufacturer: e.target.value })
              }
            />
          </label>
        </div>
        {/* Product manufacturer input div - end */}
        {/* Product slug input div - start */}

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Slug:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={
                product?.slug ? convertSlugToURLFriendly(product?.slug) : ""
              }
              onChange={(e) =>
                setProduct({
                  ...product!,
                  slug: convertSlugToURLFriendly(e.target.value),
                })
              }
            />
          </label>
        </div>
        {/* Product slug input div - end */}
        {/* Product inStock select input div - start */}

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Is product in stock?</span>
            </div>
            <select
              className="select select-bordered"
              value={product?.inStock ?? 1}
              onChange={(e) => {
                setProduct({ ...product!, inStock: Number(e.target.value) });
              }}
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </label>
        </div>
        {/* Product inStock select input div - end */}
        {/* Product category select input div - start */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Category:</span>
            </div>
            <select
              className="select select-bordered"
              value={product?.categoryId || ""}
              onChange={(e) =>
                setProduct({
                  ...product!,
                  categoryId: e.target.value,
                })
              }
            >
              {categories &&
                categories.map((category: Category) => (
                  <option key={category?.id} value={category?.id}>
                    {formatCategoryName(category?.name)}
                  </option>
                ))}
            </select>
          </label>
        </div>
        {/* Product category select input div - end */}

        {/* Main image file upload div - start */}
        <div>
          <input
            type="file"
            className="file-input file-input-bordered file-input-lg w-full max-w-sm"
            onChange={(e) => {
              // @ts-ignore
              const selectedFile = e.target.files[0];

              if (selectedFile) {
                uploadFile(selectedFile);
                setProduct({ ...product!, mainImage: selectedFile.name });
              }
            }}
          />
          {product?.mainImage && (
            <Image
              src={getImageUrl(product?.mainImage)}
              alt={product?.title}
              className="w-auto h-auto mt-2"
              width={100}
              height={100}
            />
          )}
        </div>
        {/* Main image file upload div - end */}
        {/* Images supplémentaires (max 5 au total : 1 principale + 4) */}
        <div>
          <div className="label">
            <span className="label-text">Images supplémentaires (max {MAX_TOTAL_IMAGES} au total : 1 principale + {MAX_EXTRA_IMAGES})</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {otherImages.map((img) => (
              <div key={img.imageID} className="relative group">
                <Image
                  src={getImageUrl(img.image)}
                  alt="Photo produit"
                  width={100}
                  height={100}
                  className="rounded object-cover border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeExtraImage(img.imageID)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white text-sm leading-none opacity-90 group-hover:opacity-100"
                  aria-label="Supprimer cette image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {otherImages.length < MAX_EXTRA_IMAGES && (
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadExtraImage(file);
                  e.target.value = "";
                }}
              />
              <p className="text-sm text-brand-text-secondary mt-1">
                {otherImages.length} / {MAX_EXTRA_IMAGES} images supplémentaires
              </p>
            </div>
          )}
        </div>
        {/* Product description div - start */}
        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Product description:</span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24"
              value={product?.description || ""}
              onChange={(e) =>
                setProduct({ ...product!, description: e.target.value })
              }
            ></textarea>
          </label>
        </div>
        {/* Product description div - end */}
        {/* Action buttons div - start */}
        <div className="flex gap-x-2 max-sm:flex-col">
          <button
            type="button"
            onClick={updateProduct}
            className="uppercase bg-brand-secondary px-10 py-5 text-lg border border-brand-primary font-bold text-white shadow-sm hover:bg-brand-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors duration-300"
          >
            Update product
          </button>
          <button
            type="button"
            className="uppercase bg-red-600 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
            onClick={deleteProduct}
          >
            Delete product
          </button>
        </div>
        {/* Action buttons div - end */}
        <p className="text-xl max-sm:text-lg text-error">
          To delete the product you first need to delete all its records in
          orders (customer_order_product table).
        </p>
      </div>
    </div>
  );
};

export default DashboardProductDetails;
