"use client";
import React, { useEffect, useState, use, useCallback } from "react";
import DashboardSidebar from '../../../../../components/DashboardSidebar';
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from '@tallel-textile/shared/lib/api';
import { toast } from "react-hot-toast";
import { formatPriceMRU } from "@tallel-textile/shared/lib/formatPrice";

interface Product {
  id: string;
  title: string;
  price: number;
  inStock: number;
}

interface Merchant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  status: string;
  products: Product[];
}

interface MerchantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MerchantDetailPage({
  params,
}: MerchantDetailPageProps) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    status: "ACTIVE",
  });

  const router = useRouter();

  const fetchMerchant = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/merchants/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/admin/merchant");
          return;
        }
        throw new Error("Impossible de charger le marchand");
      }
      
      const data = await response.json();
      setMerchant(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        description: data.description || "",
        status: data.status || "ACTIVE",
      });
    } catch (error) {
      console.error("Error fetching merchant:", error);
      toast.error("Impossible de charger les détails du marchand");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchMerchant();
  }, [fetchMerchant]); 

const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    // This is the correct way to use apiClient.put
    // It should just take the URL and the data object
    const response = await apiClient.put(`/api/merchants/${id}`, formData);

    if (!response.ok) {
      throw new Error("Impossible de mettre à jour le marchand");
    }

    toast.success("Marchand mis à jour avec succès");
    fetchMerchant(); // Refresh data
  } catch (error) {
    console.error("Error updating merchant:", error);
    toast.error("Impossible de mettre à jour le marchand");
  }
};

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce marchand ?")) {
      return;
    }
    try {
      const response = await apiClient.delete(`/api/merchants/${id}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Impossible de supprimer le marchand");
      }
      toast.success("Marchand supprimé avec succès");
      router.push("/admin/merchant");
    } catch (error) {
      console.error("Error deleting merchant:", error);
      const msg = typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : "Impossible de supprimer le marchand";
      toast.error(msg ?? "Impossible de supprimer le marchand");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout bg-brand-bg-primary">
        <DashboardSidebar />
        <main className="dashboard-content flex items-center justify-center">
          <p className="text-brand-text-secondary">Chargement des détails du marchand…</p>
        </main>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="dashboard-layout bg-brand-bg-primary">
        <DashboardSidebar />
        <main className="dashboard-content flex items-center justify-center">
          <p className="text-brand-text-secondary">Marchand introuvable.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="page-title mb-0">Détails du marchand</h1>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/merchant" className="btn btn-ghost btn-md">
              Retour aux marchands
            </Link>
            <button type="button" onClick={handleDelete} className="btn btn-danger btn-md">
              Supprimer le marchand
            </button>
          </div>
        </div>

        <section className="card mb-6">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="merchant-name" className="form-label">Nom</label>
                <input
                  id="merchant-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="merchant-email" className="form-label">E-mail</label>
                <input
                  id="merchant-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="merchant-phone" className="form-label">Téléphone</label>
                <input
                  id="merchant-phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="merchant-status" className="form-label">Statut</label>
                <select
                  id="merchant-status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="ACTIVE">Actif</option>
                  <option value="INACTIVE">Inactif</option>
                </select>
              </div>
              <div className="md:col-span-2 form-group">
                <label htmlFor="merchant-address" className="form-label">Adresse</label>
                <input
                  id="merchant-address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="md:col-span-2 form-group">
                <label htmlFor="merchant-description" className="form-label">Description</label>
                <textarea
                  id="merchant-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows={5}
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="btn btn-secondary btn-md">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="card">
          <div className="card-body">
            <h2 className="text-xl font-semibold text-brand-text-primary mb-4">Produits du marchand</h2>
            {merchant.products.length > 0 ? (
              <div className="table-wrapper overflow-x-auto">
                <table className="table-admin">
                  <thead>
                    <tr>
                      <th scope="col">Titre</th>
                      <th scope="col">Prix</th>
                      <th scope="col">En stock</th>
                      <th scope="col">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchant.products.map((product) => (
                      <tr key={product.id}>
                        <td className="font-medium text-brand-text-primary">{product.title}</td>
                        <td>{formatPriceMRU(product.price)}</td>
                        <td>{product.inStock}</td>
                        <td>
                          <Link href={`/admin/products/${product.id}`} className="btn btn-ghost btn-sm">
                            Voir
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-brand-text-secondary">Aucun produit pour ce marchand pour le moment.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}