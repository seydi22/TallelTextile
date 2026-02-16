"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileAlt,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";

interface BatchHistory {
  id: string;
  fileName: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: string;
  uploadedBy: string;
  uploadedAt: string;
  errors?: string[];
}

const statusLabels: Record<string, string> = {
  COMPLETED: "Terminé",
  FAILED: "Échec",
  PARTIAL: "Partiel",
  PENDING: "En attente",
};

const BulkUploadHistory = () => {
  const [batches, setBatches] = useState<BatchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingBatchId, setDeletingBatchId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<{ id: string; fileName: string } | null>(null);
  const [deleteProducts, setDeleteProducts] = useState(false);

  const fetchBatchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/bulk-upload");
      if (response.ok) {
        const data = await response.json();
        setBatches(data.batches || []);
      } else {
        setError("Impossible de charger l'historique des imports");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchHistory();
  }, []);

  const handleDeleteClick = (batchId: string, fileName: string) => {
    setBatchToDelete({ id: batchId, fileName });
    setDeleteProducts(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!batchToDelete) return;
    setDeletingBatchId(batchToDelete.id);
    setShowDeleteModal(false);
    try {
      const response = await fetch(
        `http://localhost:5000/api/bulk-upload/${batchToDelete.id}?deleteProducts=${deleteProducts}`,
        { method: "DELETE" }
      );
      const contentType = response.headers.get("content-type");
      let data: { error?: string } | null = null;
      if (contentType?.includes("application/json")) {
        const text = await response.text();
        if (text) try { data = JSON.parse(text); } catch {}
      }
      if (response.ok) {
        toast.success(
          deleteProducts
            ? "Lot et produits supprimés avec succès."
            : "Lot supprimé (produits conservés)."
        );
        await fetchBatchHistory();
      } else {
        toast.error(data?.error || `Échec de la suppression (${response.status})`);
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setDeletingBatchId(null);
      setBatchToDelete(null);
      setDeleteProducts(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setBatchToDelete(null);
    setDeleteProducts(false);
  };

  const getStatusIcon = (status: string) => {
    const upper = status.toUpperCase();
    if (upper === "COMPLETED") return <FaCheckCircle className="text-green-500 text-xl" aria-hidden />;
    if (upper === "FAILED") return <FaTimesCircle className="text-red-500 text-xl" aria-hidden />;
    if (upper === "PARTIAL") return <FaExclamationTriangle className="text-yellow-500 text-xl" aria-hidden />;
    if (upper === "PENDING") return <FaClock className="text-blue-500 text-xl" aria-hidden />;
    return <FaFileAlt className="text-gray-500 text-xl" aria-hidden />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="spinner h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert-error-box" role="alert">
        {error}
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-brand-text-secondary">
        <FaFileAlt className="text-4xl mx-auto mb-2 text-gray-400" aria-hidden />
        <p>Aucun historique d'import pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Historique des imports</h2>

      {showDeleteModal && batchToDelete && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-batch-title"
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-yellow-500 text-3xl flex-shrink-0" aria-hidden />
              <h3 id="delete-batch-title" className="text-xl font-bold text-brand-text-primary">
                Supprimer ce lot d'import
              </h3>
            </div>
            <p className="text-brand-text-secondary mb-4">
              Voulez-vous vraiment supprimer <strong>{batchToDelete.fileName}</strong> ?
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deleteProducts}
                  onChange={(e) => setDeleteProducts(e.target.checked)}
                  className="mt-1 form-checkbox"
                />
                <div className="text-sm">
                  <span className="font-semibold text-amber-800">
                    Supprimer aussi tous les produits créés par ce lot
                  </span>
                  <p className="text-amber-700 text-xs mt-1">
                    Les produits déjà présents dans des commandes ne pourront pas être supprimés.
                  </p>
                </div>
              </label>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={handleDeleteCancel} className="btn btn-ghost btn-md flex-1">
                Annuler
              </button>
              <button type="button" onClick={handleDeleteConfirm} className="btn btn-danger btn-md flex-1">
                {deleteProducts ? "Supprimer lot et produits" : "Supprimer le lot uniquement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {batches.map((batch) => (
        <article
          key={batch.id}
          className="card card-body hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex items-start gap-3 min-w-0">
              {getStatusIcon(batch.status)}
              <div className="min-w-0">
                <h3 className="font-semibold text-lg text-brand-text-primary truncate">{batch.fileName}</h3>
                <p className="text-sm text-brand-text-secondary">
                  Importé par {batch.uploadedBy} • {formatDate(batch.uploadedAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`badge ${
                  batch.status === "COMPLETED"
                    ? "badge-success"
                    : batch.status === "FAILED"
                    ? "badge-error"
                    : batch.status === "PARTIAL"
                    ? "badge-warning"
                    : "badge-primary"
                }`}
              >
                {statusLabels[batch.status] ?? batch.status}
              </span>
              <button
                type="button"
                onClick={() => handleDeleteClick(batch.id, batch.fileName)}
                disabled={deletingBatchId === batch.id}
                className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Supprimer le lot"
                aria-label="Supprimer le lot"
              >
                {deletingBatchId === batch.id ? (
                  <span className="spinner h-5 w-5 border-2 block" />
                ) : (
                  <FaTrash aria-hidden />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-50 rounded p-3 text-center">
              <p className="text-2xl font-bold text-brand-text-primary">{batch.totalRecords}</p>
              <p className="text-xs text-brand-text-secondary">Total</p>
            </div>
            <div className="bg-green-50 rounded p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{batch.successfulRecords}</p>
              <p className="text-xs text-brand-text-secondary">Réussis</p>
            </div>
            <div className="bg-red-50 rounded p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{batch.failedRecords}</p>
              <p className="text-xs text-brand-text-secondary">Échecs</p>
            </div>
            <div className="bg-blue-50 rounded p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {batch.totalRecords > 0
                  ? Math.round((batch.successfulRecords / batch.totalRecords) * 100)
                  : 0}
                %
              </p>
              <p className="text-xs text-brand-text-secondary">Taux de réussite</p>
            </div>
          </div>

          {batch.errors && batch.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="font-semibold text-red-700 text-sm mb-2">
                Erreurs ({batch.errors.length}) :
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-red-600 max-h-24 overflow-y-auto">
                {batch.errors.slice(0, 5).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
                {batch.errors.length > 5 && (
                  <li className="text-red-500 font-semibold">
                    … et {batch.errors.length - 5} autre(s) erreur(s)
                  </li>
                )}
              </ul>
            </div>
          )}
        </article>
      ))}
    </div>
  );
};

export default BulkUploadHistory;
