"use client";

import { DashboardSidebar } from "../../../../components";
import BulkUploadHistory from "../../../../components/BulkUploadHistory";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { FaFileUpload, FaDownload, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface UploadResult {
  success: boolean;
  message: string;
  details?: {
    processed: number;
    successful: number;
    failed: number;
    errors?: string[];
  };
}

const BulkUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv"))) {
      setFile(droppedFile);
      setUploadResult(null);
    } else {
      toast.error("Veuillez déposer un fichier CSV");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv"))) {
      setFile(selectedFile);
      setUploadResult(null);
    } else {
      toast.error("Veuillez sélectionner un fichier CSV");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Veuillez d'abord sélectionner un fichier CSV");
      return;
    }
    setUploading(true);
    setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:5000/api/bulk-upload", { method: "POST", body: formData });
      const data = await response.json();
      if (response.ok) {
        setUploadResult({
          success: true,
          message: data.message || "Produits importés avec succès.",
          details: data.details,
        });
        toast.success("Import en masse terminé.");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setUploadResult({
          success: false,
          message: data.error || "Échec de l'import",
          details: data.details,
        });
        toast.error(data.error || "Échec de l'import");
      }
    } catch {
      setUploadResult({ success: false, message: "Erreur réseau lors de l'import." });
      toast.error("Erreur réseau.");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `title,price,manufacturer,inStock,mainImage,description,slug,categoryId
Produit exemple,99.99,Fabricant exemple,10,https://exemple.com/image.jpg,Description exemple,produit-exemple,uuid-categorie
Autre produit,149.99,Autre fabricant,5,https://exemple.com/image2.jpg,Autre description,autre-produit,uuid-categorie`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modele-produits.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Modèle téléchargé.");
  };

  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content w-full p-4 sm:p-6 xl:p-10">
        <h1 className="page-title mb-6">Import en masse de produits</h1>

        <div className="alert-info mb-6">
          <h2 className="text-lg font-semibold mb-2 text-brand-text-primary">Instructions</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-brand-text-secondary">
            <li>Téléchargez le modèle CSV ci-dessous</li>
            <li>Remplissez les données (titre, prix, fabricant, stock, URL image, description, slug, categoryId)</li>
            <li>Enregistrez en CSV et déposez le fichier ici</li>
            <li>Taille maximale : 5 Mo</li>
          </ul>
        </div>

        <div className="mb-6">
          <button
            type="button"
            onClick={downloadTemplate}
            className="btn btn-primary btn-md inline-flex items-center gap-2"
          >
            <FaDownload aria-hidden /> Télécharger le modèle CSV
          </button>
        </div>

        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
              dragActive ? "border-brand-primary bg-brand-accent/20" : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FaFileUpload className="text-5xl sm:text-6xl text-gray-400 mx-auto mb-4" aria-hidden />
            <p className="text-base sm:text-lg mb-4">
              {file ? (
                <span className="font-semibold text-brand-primary">
                  Fichier choisi : {file.name} ({(file.size / 1024).toFixed(2)} Ko)
                </span>
              ) : (
                "Glissez-déposez un fichier CSV ici, ou cliquez pour choisir"
              )}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="btn btn-secondary btn-md cursor-pointer inline-flex">
              Choisir un fichier CSV
            </label>
          </div>
        </div>

        {file && (
          <div className="mb-6">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full btn btn-md ${uploading ? "btn-ghost opacity-70 cursor-not-allowed" : "btn-secondary"}`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner h-5 w-5 border-2" /> Import en cours…
                </span>
              ) : (
                "Importer les produits"
              )}
            </button>
          </div>
        )}

        {uploadResult && (
          <div
            className={`border-l-4 p-6 rounded-lg ${
              uploadResult.success ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex items-start gap-3">
              {uploadResult.success ? (
                <FaCheckCircle className="text-3xl text-green-500 flex-shrink-0 mt-1" aria-hidden />
              ) : (
                <FaTimesCircle className="text-3xl text-red-500 flex-shrink-0 mt-1" aria-hidden />
              )}
              <div className="flex-1 min-w-0">
                <h3 className={`text-xl font-bold mb-2 ${uploadResult.success ? "text-green-800" : "text-red-800"}`}>
                  {uploadResult.success ? "Import réussi" : "Échec de l'import"}
                </h3>
                <p className={uploadResult.success ? "text-green-700" : "text-red-700"}>{uploadResult.message}</p>
                {uploadResult.details && (
                  <div className="bg-white rounded p-4 mt-4 space-y-2">
                    <p className="font-semibold text-brand-text-primary">Statistiques :</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-brand-primary">{uploadResult.details.processed}</p>
                        <p className="text-sm text-brand-text-secondary">Traités</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{uploadResult.details.successful}</p>
                        <p className="text-sm text-brand-text-secondary">Réussis</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{uploadResult.details.failed}</p>
                        <p className="text-sm text-brand-text-secondary">Échecs</p>
                      </div>
                    </div>
                    {uploadResult.details.errors && uploadResult.details.errors.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold text-red-700 mb-2">Erreurs :</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-red-600 max-h-40 overflow-y-auto">
                          {uploadResult.details.errors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <section className="mt-8 card">
          <div className="card-body">
            <h2 className="text-xl font-bold text-brand-text-primary mb-4">Guide du format CSV</h2>
            <div className="overflow-x-auto">
              <table className="table-admin">
                <thead>
                  <tr>
                    <th scope="col">Colonne</th>
                    <th scope="col">Obligatoire</th>
                    <th scope="col">Type</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="font-mono">title</td><td>Oui</td><td>Texte</td><td>Nom du produit</td></tr>
                  <tr><td className="font-mono">price</td><td>Oui</td><td>Nombre</td><td>Prix (ex. 99.99)</td></tr>
                  <tr><td className="font-mono">manufacturer</td><td>Oui</td><td>Texte</td><td>Marque / fabricant</td></tr>
                  <tr><td className="font-mono">inStock</td><td>Non</td><td>Nombre</td><td>Quantité en stock (défaut : 0)</td></tr>
                  <tr><td className="font-mono">mainImage</td><td>Non</td><td>URL</td><td>URL de l'image</td></tr>
                  <tr><td className="font-mono">description</td><td>Oui</td><td>Texte</td><td>Description du produit</td></tr>
                  <tr><td className="font-mono">slug</td><td>Oui</td><td>Texte</td><td>Identifiant pour l'URL</td></tr>
                  <tr><td className="font-mono">categoryId</td><td>Oui</td><td>UUID</td><td>ID de la catégorie (base de données)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <BulkUploadHistory />
        </div>
      </main>
    </div>
  );
};

export default BulkUploadPage;
