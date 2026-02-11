"use client";
import React, { useEffect, useState } from "react";
import DashboardSidebar from "../../../../components/DashboardSidebar";
import apiClient from "@tallel-textile/shared/lib/api";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { getImageUrl } from "../../../../utils/imageUtils";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [heroBanner, setHeroBanner] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get("/api/settings/hero_banner");
      if (response.ok) {
        const data = await response.json();
        setHeroBanner(data.value || "/apartman banner.jpeg");
      } else {
        // Si le paramètre n'existe pas encore, utiliser la valeur par défaut
        setHeroBanner("/apartman banner.jpeg");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setHeroBanner("/apartman banner.jpeg");
    } finally {
      setLoading(false);
    }
  };

  const uploadBannerImage = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("uploadedFile", file);

      // Utiliser la route API Next.js qui proxy vers le backend (évite les problèmes d'URL)
      const uploadResponse = await fetch("/api/upload-banner", {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        // Vérifier le Content-Type avant de parser
        const contentType = uploadResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await uploadResponse.text();
          console.error("Non-JSON response:", text.substring(0, 200));
          toast.error("Erreur: Réponse serveur invalide");
          return;
        }
        
        const uploadData = await uploadResponse.json();
        // Prioriser secure_url (URL Cloudinary complète), puis filename, puis url
        const imageUrl = uploadData.secure_url || uploadData.filename || uploadData.url;
        
        console.log('📸 [Banner Upload] Cloudinary response:', {
          secure_url: uploadData.secure_url,
          filename: uploadData.filename,
          url: uploadData.url,
          public_id: uploadData.public_id,
          selected: imageUrl
        });

        if (!imageUrl) {
          throw new Error("Aucune URL d'image reçue du serveur");
        }

        // Sauvegarder l'URL Cloudinary dans les paramètres
        const settingsResponse = await apiClient.put("/api/settings/hero_banner", {
          key: "hero_banner",
          value: imageUrl, // Stocker l'URL Cloudinary complète
          description: "Bannière de la page d'accueil (Cloudinary)",
        });

        if (!settingsResponse.ok) {
          const errorData = await settingsResponse.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || "Erreur lors de la sauvegarde des paramètres");
        }

        setHeroBanner(imageUrl);
        toast.success("Bannière mise à jour avec succès et stockée sur Cloudinary");
      } else {
        // Gérer les erreurs HTTP
        let errorMessage = `Erreur HTTP ${uploadResponse.status}`;
        try {
          const contentType = uploadResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await uploadResponse.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            const text = await uploadResponse.text();
            console.error("Error response (non-JSON):", text.substring(0, 200));
            if (uploadResponse.status === 404) {
              errorMessage = "Endpoint non trouvé. Le backend est-il démarré ?";
            }
          }
        } catch (e) {
          console.error("Could not parse error response:", e);
        }
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error uploading banner:", error);
      const errorMessage = error?.message || "Erreur réseau lors de l'upload de l'image";
      
      // Messages d'erreur plus spécifiques
      if (errorMessage.includes('fetch failed') || errorMessage.includes('ECONNREFUSED')) {
        toast.error("Impossible de se connecter au serveur. Vérifiez que le backend est démarré (cd server && node app.js)");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-10 flex items-center justify-center">
          Chargement des paramètres...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Paramètres</h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Bannière de la page d&apos;accueil</h2>
            <p className="text-gray-600 mb-4">
              Changez l&apos;image de bannière qui s&apos;affiche sur la première page du site.
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Nouvelle bannière
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full max-w-xs"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    uploadBannerImage(e.target.files[0]);
                  }
                }}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-gray-500 mt-2">Upload en cours...</p>
              )}
            </div>

            {heroBanner && (
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Bannière actuelle:</p>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={getImageUrl(heroBanner)}
                    alt="Bannière actuelle"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 break-all">
                  {heroBanner.startsWith('http') ? (
                    <>
                      <span className="font-semibold text-green-600">✓ Stocké sur Cloudinary</span>
                      <br />
                      URL: {heroBanner}
                    </>
                  ) : (
                    <>Chemin local: {heroBanner}</>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
