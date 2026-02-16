"use client";

import { DashboardSidebar, StatsElement } from "../../../components";
import React, { useEffect, useState } from "react";
import apiClient from "@tallel-textile/shared/lib/api";
import { formatPriceMRU } from "@tallel-textile/shared/lib/formatPrice";

interface DashboardStats {
  products: { total: number };
  orders: {
    total: number;
    today: number;
    byStatus: { pending: number; processing: number; shipped: number; delivered: number; cancelled: number };
  };
  revenue: { total: number };
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get("/api/stats");
        if (!response.ok) throw new Error("Erreur chargement des statistiques");
        const data = await response.json();
        setStats(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-layout bg-brand-bg-primary">
        <DashboardSidebar />
        <main className="dashboard-content flex flex-col items-center justify-center gap-4 min-h-[50vh]">
          <p className="text-brand-text-secondary">Chargement des statistiques…</p>
        </main>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="dashboard-layout bg-brand-bg-primary">
        <DashboardSidebar />
        <main className="dashboard-content flex flex-col items-center justify-center gap-4 min-h-[50vh]">
          <p className="text-red-600">{error || "Aucune donnée disponible"}</p>
        </main>
      </div>
    );
  }

  const { products, orders, revenue } = stats;

  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content flex flex-col gap-6">
        <h1 className="text-2xl font-serif font-semibold text-brand-text-primary">Tableau de bord</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsElement
            title="Nombre de produits"
            value={products.total}
          />
          <StatsElement
            title="Total des commandes"
            value={orders.total}
          />
          <StatsElement
            title="Commandes du jour"
            value={orders.today}
          />
          <StatsElement
            title="Chiffre d'affaires total"
            value={formatPriceMRU(revenue.total)}
          />
        </div>

        <section className="w-full card card-body" aria-label="Commandes par statut">
          <h2 className="text-xl font-serif font-semibold text-brand-text-primary mb-4">
            Répartition des commandes
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-brand-text-secondary">En attente</p>
              <p className="text-xl font-bold text-amber-800">{orders.byStatus.pending}</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-brand-text-secondary">En cours</p>
              <p className="text-xl font-bold text-blue-800">{orders.byStatus.processing}</p>
            </div>
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="text-sm text-brand-text-secondary">Expédiées</p>
              <p className="text-xl font-bold text-indigo-800">{orders.byStatus.shipped}</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-brand-text-secondary">Livrées</p>
              <p className="text-xl font-bold text-green-800">{orders.byStatus.delivered}</p>
            </div>
            <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg">
              <p className="text-sm text-brand-text-secondary">Annulées</p>
              <p className="text-xl font-bold text-gray-700">{orders.byStatus.cancelled}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
