"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@tallel-textile/shared/lib/api";

interface Order {
  id: string;
  name: string;
  country?: string | null;
  status: string;
  total: number;
  dateTime: string;
}

const statusLabels: Record<string, string> = {
  processing: "En cours",
  delivered: "Livrée",
  canceled: "Annulée",
  cancelled: "Annulée",
  pending: "En attente",
  shipped: "Expédiée",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await apiClient.get("/api/orders");
      const data = await response.json();
      setOrders(data?.orders ?? []);
    };
    fetchOrders();
  }, []);

  return (
    <section className="w-full" aria-labelledby="orders-heading">
      <h1 id="orders-heading" className="page-title text-center">
        Toutes les commandes
      </h1>
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
              <th scope="col">N° commande</th>
              <th scope="col">Client et pays</th>
              <th scope="col">Statut</th>
              <th scope="col">Sous-total</th>
              <th scope="col">Date</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <label className="cursor-pointer">
                      <input type="checkbox" className="form-checkbox" aria-label={`Sélectionner la commande ${order.id}`} />
                    </label>
                  </td>
                  <td>
                    <span className="font-semibold">#{order.id.slice(0, 8)}</span>
                  </td>
                  <td>
                    <div>
                      <span className="font-medium text-brand-text-primary">{order.name}</span>
                      <div className="text-sm text-brand-text-secondary">{order.country ?? "—"}</div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </td>
                  <td>{order.total} MRU</td>
                  <td>{new Date(Date.parse(order.dateTime)).toLocaleDateString("fr-FR")}</td>
                  <td>
                    <Link href={`/admin/orders/${order.id}`} className="btn btn-ghost btn-sm">
                      Détails
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-brand-text-secondary">
                  Aucune commande pour le moment.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th scope="col"></th>
              <th scope="col">N° commande</th>
              <th scope="col">Client et pays</th>
              <th scope="col">Statut</th>
              <th scope="col">Sous-total</th>
              <th scope="col">Date</th>
              <th scope="col"></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};

export default AdminOrders;
