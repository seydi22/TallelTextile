"use client";
import { DashboardSidebar } from '../../../../../components';
import { useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { formatCategoryName } from "../../../../../utils/categoryFormating";
import { convertCategoryNameToURLFriendly } from "../../../../../utils/categoryFormating";
import apiClient from '@tallel-textile/shared/lib/api';
import config from '@tallel-textile/shared/lib/config';

interface DashboardSingleCategoryProps {
  params: Promise<{ id: string }>;
}

const DashboardSingleCategory = ({ params }: DashboardSingleCategoryProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [categoryInput, setCategoryInput] = useState<{ name: string; image: string }>({
    name: "",
    image: "",
  });
  const router = useRouter();

  const deleteCategory = async () => {
    const requestOptions = {
      method: "DELETE",
    };
    // sending API request for deleting a category
    apiClient
      .delete(`/api/categories/${id}`, requestOptions)
      .then((response) => {
        if (response.status === 204) {
          toast.success("Catégorie supprimée avec succès");
          router.push("/admin/categories");
        } else {
          throw Error("Erreur lors de la suppression de la catégorie");
        }
      })
      .catch(() => {
        toast.error("Erreur lors de la suppression de la catégorie");
      });
  };

  const uploadCategoryImage = async (file: any) => {
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
        setCategoryInput({ ...categoryInput, image: data.filename || data.url });
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
      console.error("Error uploading image:", error);
      const errorMessage = error?.message || "Erreur réseau lors de l'upload de l'image";
      
      // Messages d'erreur plus spécifiques
      if (errorMessage.includes('fetch failed') || errorMessage.includes('ECONNREFUSED')) {
        toast.error("Impossible de se connecter au serveur. Vérifiez que le backend est démarré (cd server && node app.js)");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const updateCategory = async () => {
    if (categoryInput.name.length > 0) {
      try {
        const response = await apiClient.put(`/api/categories/${id}`, {
          name: convertCategoryNameToURLFriendly(categoryInput.name),
          image: categoryInput.image || null,
        });

        if (response.status === 200) {
          await response.json();
          toast.success("Catégorie mise à jour avec succès");
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Erreur lors de la mise à jour de la catégorie");
        }
      } catch (error) {
        console.error("Error updating category:", error);
        toast.error("Erreur lors de la mise à jour de la catégorie");
      }
    } else {
      toast.error("Veuillez entrer un nom pour la catégorie");
      return;
    }
  };

  useEffect(() => {
    // sending API request for getting single categroy
    apiClient
      .get(`/api/categories/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategoryInput({
          name: data?.name || "",
          image: data?.image || "",
        });
      });
  }, [id]);

  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content flex flex-col gap-6">
        <h1 className="page-title">Détails de la catégorie</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Nom de la catégorie:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={formatCategoryName(categoryInput.name)}
              onChange={(e) =>
                setCategoryInput({ ...categoryInput, name: e.target.value })
              }
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Image de la catégorie:</span>
            </div>
            <input
              type="file"
              className="file-input file-input-bordered file-input-lg w-full max-w-sm"
              accept="image/*"
              onChange={(e: any) => {
                if (e.target.files && e.target.files[0]) {
                  uploadCategoryImage(e.target.files[0]);
                }
              }}
            />
            {categoryInput.image && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Image actuelle:</p>
                <Image
                  src={`/${categoryInput.image}`}
                  alt="Image de la catégorie"
                  width={200}
                  height={200}
                  className="rounded-md object-cover"
                />
              </div>
            )}
          </label>
        </div>

        <div className="flex gap-x-2 max-sm:flex-col">
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={updateCategory}
          >
            Mettre à jour la catégorie
          </button>
          <button
            type="button"
            className="btn btn-danger btn-lg"
            onClick={deleteCategory}
          >
            Supprimer la catégorie
          </button>
        </div>
        <p className="text-brand-text-secondary text-base sm:text-lg mt-2" role="note">
          En supprimant cette catégorie, vous supprimerez aussi tous les produits qui y sont associés.
        </p>
      </main>
    </div>
  );
};

export default DashboardSingleCategory;
