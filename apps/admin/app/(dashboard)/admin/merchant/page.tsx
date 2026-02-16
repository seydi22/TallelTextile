"use client";

import React, { useEffect, useState } from "react";
import DashboardSidebar from "../../../../components/DashboardSidebar";
import Link from "next/link";
import apiClient from "@tallel-textile/shared/lib/api";
import { toast } from "react-hot-toast";

interface Merchant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  status: string;
  products: any[];
}

const statusLabels: Record<string, string> = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
};

export default function MerchantPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/merchants");
      if (!response.ok) throw new Error("Impossible de charger les marchands");
      const data = await response.json();
      setMerchants(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED") || msg.includes("non disponible")) {
        toast.error("Le serveur backend n'est pas disponible. Veuillez démarrer le serveur.");
      } else {
        toast.error("Échec du chargement des marchands");
      }
      setMerchants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="page-title mb-0">Marchands</h1>
          <Link href="/admin/merchant/new" className="btn btn-secondary btn-md">
            Ajouter un marchand
          </Link>
        </div>
        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-12 text-brand-text-secondary">Chargement des marchands…</div>
            ) : merchants.length > 0 ? (
              <div className="table-wrapper overflow-x-auto">
                <table className="table-admin">
                  <thead>
                    <tr>
                      <th scope="col">Nom</th>
                      <th scope="col">E-mail</th>
                      <th scope="col">Statut</th>
                      <th scope="col">Produits</th>
                      <th scope="col">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchants.map((merchant) => (
                      <tr key={merchant.id}>
                        <td className="font-medium text-brand-text-primary">{merchant.name}</td>
                        <td>{merchant.email ?? "—"}</td>
                        <td>
                          <span
                            className={`badge ${merchant.status === "ACTIVE" ? "badge-success" : "badge-error"}`}
                          >
                            {statusLabels[merchant.status] ?? merchant.status}
                          </span>
                        </td>
                        <td>{merchant.products?.length ?? 0}</td>
                        <td>
                          <Link href={`/admin/merchant/${merchant.id}`} className="btn btn-ghost btn-sm mr-2">
                            Voir
                          </Link>
                          <Link href={`/admin/merchant/${merchant.id}`} className="btn btn-ghost btn-sm">
                            Modifier
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-brand-text-secondary">Aucun marchand trouvé.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
