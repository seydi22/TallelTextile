"use client";

import { CustomButton, DashboardSidebar } from "../../../../components";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import apiClient from "@tallel-textile/shared/lib/api";

const DashboardCategory = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get("/api/categories");
        if (!response.ok) {
          let errorMessage = `Erreur HTTP ${response.status}`;
          const contentType = response.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            const text = await response.text();
            if (response.status >= 500) errorMessage = `Erreur serveur (${response.status}) : le backend est-il démarré ?`;
          }
          throw new Error(errorMessage);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          throw new Error("Réponse serveur invalide. Le backend est-il démarré ?");
        }
        const data = await response.json();
        let categoriesData: any[] = [];
        if (Array.isArray(data)) categoriesData = data;
        else if (data.categories && Array.isArray(data.categories)) categoriesData = data.categories;
        else {
          setError("Format de données invalide reçu de l'API");
          setCategories([]);
          return;
        }
        setCategories(categoriesData);
        if (data._debug?.connection_error) {
          setError(`Erreur de connexion : ${data._debug.connection_error.message}`);
        } else if (categoriesData.length === 0 && !data._debug?.raw_category_count) {
          setError("Aucune catégorie trouvée. Créez-en une pour commencer.");
        }
      } catch (err: any) {
        setError(err?.message || "Erreur lors du chargement des catégories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="page-title mb-0 text-center sm:text-left">Toutes les catégories</h1>
          <Link href="/admin/categories/new">
            <CustomButton buttonType="button" text="Ajouter une catégorie" variant="secondary" className="btn-md" />
          </Link>
        </div>
        {loading && (
          <div className="text-center py-8 text-brand-text-secondary">Chargement des catégories…</div>
        )}
        {error && (
          <div className="alert-warning-box mx-0 mb-6 flex items-start gap-3" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-semibold">{error}</p>
              <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                <li>Vérifiez que le serveur backend est démarré</li>
                <li>Vérifiez la connexion à la base de données</li>
                <li>Ouvrez la console du navigateur (F12) pour plus de détails</li>
              </ul>
            </div>
          </div>
        )}
        <div className="table-wrapper overflow-x-auto max-h-[80vh]">
          <table className="table-admin" role="grid">
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Sélection</span>
                  <label className="cursor-pointer">
                    <input type="checkbox" className="form-checkbox" aria-label="Tout sélectionner" />
                  </label>
                </th>
                <th scope="col">Nom</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category: any) => (
                  <tr key={category?.id || nanoid()}>
                    <td>
                      <label className="cursor-pointer">
                        <input type="checkbox" className="form-checkbox" aria-label={`Sélectionner ${category?.name || "catégorie"}`} />
                      </label>
                    </td>
                    <td>
                      <p className="font-medium text-brand-text-primary">{category?.name || category?.title || "Sans nom"}</p>
                    </td>
                    <td>
                      <Link href={`/admin/categories/${category?.id}`} className="btn btn-ghost btn-sm">
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-brand-text-secondary">
                    Aucune catégorie trouvée.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <th scope="col"></th>
                <th scope="col">Nom</th>
                <th scope="col"></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DashboardCategory;
