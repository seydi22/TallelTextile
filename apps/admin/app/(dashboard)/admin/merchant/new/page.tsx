"use client";

import React, { useState } from "react";
import DashboardSidebar from "../../../../../components/DashboardSidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@tallel-textile/shared/lib/api";
import { toast } from "react-hot-toast";

export default function NewMerchantPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    status: "ACTIVE",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Le nom du marchand est obligatoire");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/api/merchants", formData);
      if (!response.ok) {
        let errorMessage = "Impossible de créer le marchand";
        try {
          const errorData = await response.json();
          if (errorData?.error) errorMessage = errorData.error;
        } catch {}
        throw new Error(errorMessage);
      }
      const data = await response.json();
      toast.success("Marchand créé avec succès");
      router.push(`/admin/merchant/${data.id}`);
    } catch (error) {
      console.error("Error creating merchant:", error);
      toast.error("Impossible de créer le marchand");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="page-title mb-0">Ajouter un marchand</h1>
          <Link href="/admin/merchant" className="btn btn-ghost btn-md">
            Annuler
          </Link>
        </div>
        <section className="card">
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
                  required
                  className="form-input"
                  placeholder="Nom du marchand"
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
                  placeholder="email@exemple.com"
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
                  placeholder="Numéro de téléphone"
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
                  placeholder="Adresse du marchand"
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
                  placeholder="Description du marchand"
                  rows={5}
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-secondary btn-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Création…" : "Créer le marchand"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
