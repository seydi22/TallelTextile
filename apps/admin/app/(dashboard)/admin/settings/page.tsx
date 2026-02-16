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
        setHeroBanner("/apartman banner.jpeg");
      }
    } catch {
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
      const uploadResponse = await fetch("/api/upload-banner", { method: "POST", body: formData });

      if (uploadResponse.ok) {
        const contentType = uploadResponse.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          toast.error("Erreur : réponse serveur invalide");
          return;
        }
        const uploadData = await uploadResponse.json();
        const imageUrl = uploadData.secure_url || uploadData.filename || uploadData.url;
        if (!imageUrl) throw new Error("Aucune URL d'image reçue");

        const settingsResponse = await apiClient.put("/api/settings/hero_banner", {
          key: "hero_banner",
          value: imageUrl,
          description: "Bannière de la page d'accueil (Cloudinary)",
        });
        if (!settingsResponse.ok) {
          const errorData = await settingsResponse.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || "Erreur lors de la sauvegarde");
        }
        setHeroBanner(imageUrl);
        toast.success("Bannière mise à jour avec succès et stockée sur Cloudinary");
      } else {
        let errorMessage = `Erreur HTTP ${uploadResponse.status}`;
        try {
          if (uploadResponse.headers.get("content-type")?.includes("application/json")) {
            const errorData = await uploadResponse.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          }
          if (uploadResponse.status === 404) errorMessage = "Endpoint non trouvé. Le backend est-il démarré ?";
        } catch {}
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const msg = err?.message || "Erreur réseau lors de l'upload";
      if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED")) {
        toast.error("Impossible de se connecter au serveur. Vérifiez que le backend est démarré.");
      } else {
        toast.error(msg);
      }
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout bg-brand-bg-primary">
        <DashboardSidebar />
        <main className="dashboard-content flex items-center justify-center">
          <p className="text-brand-text-secondary">Chargement des paramètres…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content">
        <div className="max-w-4xl mx-auto">
          <h1 className="page-title">Paramètres</h1>
          <section className="card mb-6" aria-labelledby="banner-heading">
            <div className="card-body">
              <h2 id="banner-heading" className="text-xl font-semibold text-brand-text-primary mb-2">
                Bannière de la page d&apos;accueil
              </h2>
              <p className="text-brand-text-secondary mb-4">
                Modifiez l&apos;image de bannière affichée sur la première page du site.
              </p>
              <div className="form-group">
                <label htmlFor="banner-file" className="form-label">
                  Nouvelle bannière
                </label>
                <input
                  id="banner-file"
                  type="file"
                  accept="image/*"
                  className="form-input block w-full max-w-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:font-semibold file:bg-brand-primary file:text-white file:cursor-pointer hover:file:bg-brand-primary-hover"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadBannerImage(f);
                  }}
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-brand-text-secondary mt-2">Envoi en cours…</p>}
              </div>
              {heroBanner && (
                <div className="mt-6">
                  <p className="text-sm text-brand-text-secondary mb-2">Bannière actuelle :</p>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={getImageUrl(heroBanner)}
                      alt="Bannière actuelle du site"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                  </div>
                  <p className="text-xs text-brand-text-secondary mt-2 break-all">
                    {heroBanner.startsWith("http") ? (
                      <>
                        <span className="font-semibold text-green-600">✓ Stocké sur Cloudinary</span>
                        <br />
                        URL : {heroBanner}
                      </>
                    ) : (
                      <>Chemin local : {heroBanner}</>
                    )}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
