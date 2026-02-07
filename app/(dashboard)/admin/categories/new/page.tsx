"use client";
import { DashboardSidebar } from "@/components";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { convertCategoryNameToURLFriendly } from "../../../../../utils/categoryFormating";
import apiClient from "@/lib/api";
import config from "@/lib/config";

const DashboardNewCategoryPage = () => {
  const [categoryInput, setCategoryInput] = useState({
    name: "",
    image: "",
  });

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

  const addNewCategory = async () => {
    if (categoryInput.name.length > 0) {
      try {
        const response = await apiClient.post(`/api/categories`, {
          name: convertCategoryNameToURLFriendly(categoryInput.name),
          image: categoryInput.image || null,
        });

        if (response.status === 201) {
          await response.json();
          toast.success("Catégorie ajoutée avec succès");
          setCategoryInput({
            name: "",
            image: "",
          });
        } else {
          const errorData = await response.json();
          toast.error(
            errorData.error || "Erreur lors de la création de la catégorie"
          );
        }
      } catch (error) {
        console.error("Error creating category:", error);
        toast.error("Erreur lors de la création de la catégorie");
      }
    } else {
      toast.error("Veuillez entrer un nom pour la catégorie");
    }
  };
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:pl-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Add new category</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Nom de la catégorie:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={categoryInput.name}
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
                <p className="text-sm text-gray-600 mb-2">Aperçu:</p>
                <Image
                  src={`/${categoryInput.image}`}
                  alt="Aperçu de l'image"
                  width={200}
                  height={200}
                  className="rounded-md object-cover"
                />
              </div>
            )}
          </label>
        </div>

        <div className="flex gap-x-2">
          <button
            type="button"
            className="uppercase bg-brand-secondary px-10 py-5 text-lg border border-brand-primary font-bold text-white shadow-sm hover:bg-brand-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors duration-300"
            onClick={addNewCategory}
          >
            Create category
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardNewCategoryPage;
