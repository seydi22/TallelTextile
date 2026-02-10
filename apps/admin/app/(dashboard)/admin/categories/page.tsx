"use client";
import { CustomButton, DashboardSidebar } from '../../../../components';
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import apiClient from '@tallel-textile/shared/lib/api';

const DashboardCategory = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // getting all categories to be displayed on the all categories page
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get('/api/categories');
        
        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            // Vérifier le Content-Type avant de parser
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } else {
              // Si ce n'est pas du JSON, lire le texte
              const text = await response.text();
              console.error("Non-JSON error response:", text.substring(0, 200));
              errorMessage = `Erreur serveur (${response.status}): Réponse non-JSON reçue`;
            }
          } catch (e) {
            console.warn("Could not parse error response:", e);
            errorMessage = `Erreur serveur (${response.status})`;
          }
          throw new Error(errorMessage);
        }
        
        // Vérifier le Content-Type avant de parser la réponse
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error("Non-JSON response received:", text.substring(0, 200));
          throw new Error('La réponse du serveur n\'est pas au format JSON. Le backend est-il démarré ?');
        }
        
        const data = await response.json();
        console.log("Raw API response:", data);
        
        // Afficher les informations de debug
        if (data._debug) {
          console.log("🔍 Debug Info:", {
            category_count: data._debug.category_count,
            prisma_findMany_count: data._debug.prisma_findMany_count,
            connection_status: data._debug.connection_status,
            database_name: data._debug.database_name,
            connection_error: data._debug.connection_error,
          });
          
          // Si category_count > 0 mais prisma_findMany_count = 0, il y a un problème
          if (data._debug.category_count > 0 && data._debug.prisma_findMany_count === 0) {
            console.error("⚠️ PROBLÈME DÉTECTÉ: La base de données contient des catégories mais Prisma ne les trouve pas!");
            setError(`Problème de synchronisation: ${data._debug.category_count} catégories dans la DB mais Prisma en trouve 0`);
          } else if (data._debug.category_count === 0) {
            console.log("ℹ️ Aucune catégorie dans la base de données");
            setError("Aucune catégorie trouvée dans la base de données. Créez-en une d'abord.");
          } else if (data._debug.connection_error) {
            console.error("❌ Erreur de connexion:", data._debug.connection_error);
            setError(`Erreur de connexion: ${data._debug.connection_error.message}`);
          }
        }
        
        // Handle both array format and object format (for backward compatibility)
        let categoriesData;
        if (Array.isArray(data)) {
          // API returns array directly
          categoriesData = data;
        } else if (data.categories && Array.isArray(data.categories)) {
          // API returns object with categories property
          categoriesData = data.categories;
        } else {
          // Invalid format
          console.error("Data received from /api/categories is not an array:", data);
          console.error("Full response data:", data);
          setError("Format de données invalide reçu de l'API");
          setCategories([]);
          return;
        }
        
        // Validate that we have a valid array
        if (!Array.isArray(categoriesData)) {
          console.error("categoriesData is not an array:", categoriesData);
          setError("Format de données invalide reçu de l'API");
          setCategories([]);
        } else {
          console.log(`✅ Found ${categoriesData.length} categories:`, categoriesData);
          setCategories(categoriesData);
          if (categoriesData.length === 0 && !data._debug?.raw_category_count) {
            setError("Aucune catégorie trouvée dans la base de données");
          }
        }
      } catch (error: any) {
        console.error("Failed to fetch categories:", error);
        setError(`Erreur lors du chargement: ${error.message || 'Erreur inconnue'}`);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col max-xl:h-fit max-xl:gap-y-4">
      <DashboardSidebar />
      <div className="w-full">
        <h1 className="text-3xl font-semibold text-center mb-5">
          All Categories
        </h1>
        <div className="flex justify-end mb-5">
          <Link href="/admin/categories/new">
            <CustomButton
              buttonType="button"
              customWidth="110px"
              paddingX={10}
              paddingY={5}
              textSize="base"
              text="Add new category"
            />
          </Link>
        </div>
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Chargement des catégories...</p>
          </div>
        )}
        {error && (
          <div className="alert alert-warning mx-5 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
            <div className="text-sm mt-2">
              <p>Vérifiez que :</p>
              <ul className="list-disc list-inside">
                <li>Le serveur backend est démarré (cd server && node app.js)</li>
                <li>La base de données est connectée</li>
                <li>Ouvrez la console du navigateur (F12) pour plus de détails</li>
              </ul>
            </div>
          </div>
        )}
        <div className="xl:ml-5 w-full max-xl:mt-5 overflow-auto w-full h-[80vh]">
          <table className="table table-md table-pin-cols">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories && categories.length > 0 ? (
                categories.map((category: any) => (
                  <tr key={category?.id || nanoid()}>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>

                    <td>
                      <div>
                        <p>{category?.name || category?.title || "Catégorie sans nom"}</p>
                      </div>
                    </td>

                    <th>
                      <Link
                        href={`/admin/categories/${category?.id}`}
                        className="btn btn-ghost btn-xs"
                      >
                        details
                      </Link>
                    </th>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8">
                    <p className="text-gray-500">Aucune catégorie trouvée</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Vérifiez la console du navigateur pour plus de détails
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th></th>
                <th>Name</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardCategory;
