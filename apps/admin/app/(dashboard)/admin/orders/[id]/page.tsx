"use client";
import { DashboardSidebar } from '../../../../../components';
import apiClient from '@tallel-textile/shared/lib/api';
import { isValidEmailAddressFormat, isValidNameOrLastname } from "@tallel-textile/shared/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatPriceMRU } from "@tallel-textile/shared/lib/formatPrice";
import { getImageUrl } from '../../../../../utils/imageUtils';

interface OrderProduct {
  id: string;
  customerOrderId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    title: string;
    mainImage: string;
    price: number;
    rating: number;
    description: string;
    manufacturer: string;
    inStock: number;
    categoryId: string;
  };
}

const MEASURE_LABELS: Record<string, string> = {
  epaule: "Épaule (cm)",
  manche: "Manche (cm)",
  cou: "Cou (cm)",
  poitrine: "Poitrine (cm)",
  ceinture: "Ceinture (cm)",
  fesse: "Fesse (cm)",
  cuisse: "Cuisse (cm)",
  longueurPantalon: "Longueur pantalon (cm)",
  longueurDemiSaison: "Longueur demi-saison (cm)",
  longueurBoubou: "Longueur boubou (cm)",
  poignet: "Poignet (cm)",
  tourDeBras: "Tour de bras (cm)",
};

interface Order {
  id: string;
  dateTime: string;
  email?: string;
  lastname: string;
  name: string;
  phone: string;
  country?: string;
  desiredDeliveryDate?: string | null;
  orderNotice?: string;
  status: "processing" | "delivered" | "cancelled" | "pending" | "shipped";
  total: number;
  measurements?: Record<string, number> | null;
}

const AdminSingleOrder = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>();
  const [order, setOrder] = useState<Order>({
    id: "",
    dateTime: "",
    email: "",
    lastname: "",
    name: "",
    phone: "",
    country: "",
    desiredDeliveryDate: null,
    orderNotice: "",
    status: "pending",
    total: 0,
  });
  const params = useParams<{ id: string }>();

  const router = useRouter();

  useEffect(() => {
    const fetchOrderData = async () => {
      const response = await apiClient.get(`/api/orders/${params?.id}`);
      const data = await response.json();
      let orderNoticeClean = data.orderNotice ?? "";
      let measurements: Record<string, number> | null = data.measurements ?? null;
      if (!measurements && typeof data.orderNotice === "string" && data.orderNotice.includes("MESURES:")) {
        const match = data.orderNotice.match(/MESURES:\s*(\{[\s\S]*?\})/);
        if (match) {
          try {
            measurements = JSON.parse(match[1]);
          } catch {}
          orderNoticeClean = data.orderNotice.replace(/\n?MESURES:.*/s, "").trim();
        }
      }
      setOrder({
        ...data,
        orderNotice: orderNoticeClean,
        measurements: measurements ?? undefined,
      });
    };

    const fetchOrderProducts = async () => {
      const response = await apiClient.get(`/api/order-product/${params?.id}`);
      const data: OrderProduct[] = await response.json();
      setOrderProducts(data);
    };

    fetchOrderData();
    fetchOrderProducts();
  }, [params?.id]);

  const updateOrder = async () => {
    if (!order?.name?.trim() || !order?.lastname?.trim() || !order?.phone?.trim()) {
      toast.error("Veuillez remplir le prénom, le nom et le téléphone");
      return;
    }
    if (!isValidNameOrLastname(order.name)) {
      toast.error("Format du prénom invalide");
      return;
    }
    if (!isValidNameOrLastname(order.lastname)) {
      toast.error("Format du nom invalide");
      return;
    }
    if (order.email?.trim() && !isValidEmailAddressFormat(order.email)) {
      toast.error("Format de l'e-mail invalide");
      return;
    }
    try {
      const payload = {
        name: order.name.trim(),
        lastname: order.lastname.trim(),
        phone: order.phone.trim(),
        email: order.email?.trim() || null,
        country: order.country?.trim() || null,
        desiredDeliveryDate: order.desiredDeliveryDate || null,
        status: order.status,
        total: Number(order.total),
        orderNotice: order.orderNotice ?? "",
      };
      const response = await apiClient.put(`/api/orders/${order.id}`, payload);
      if (response.ok) {
        toast.success("Commande mise à jour avec succès");
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(err?.details || "Erreur lors de la mise à jour");
      }
    } catch {
      toast.error("Erreur lors de la mise à jour de la commande");
    }
  };

  const deleteOrder = async () => {
    if (!order?.id) return;
    if (!confirm("Supprimer cette commande ? Cette action est irréversible.")) return;
    try {
      await apiClient.delete(`/api/order-product/${order.id}`);
      const res = await apiClient.delete(`/api/orders/${order.id}`);
      if (res.ok || res.status === 204) {
        toast.success("Commande supprimée avec succès");
        router.push("/admin/orders");
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch {
      toast.error("Erreur lors de la suppression de la commande");
    }
  };

  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content flex flex-col gap-6">
        <h1 className="page-title">Détails de la commande</h1>
        <div className="card card-body">
          <p className="mb-4">
            <span className="text-lg font-bold text-brand-text-primary">N° commande :</span>
            <span className="ml-2">{order?.id}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="order-name" className="form-label">Prénom</label>
              <input
                id="order-name"
                type="text"
                className="form-input max-w-xs"
                value={order?.name}
                onChange={(e) => setOrder({ ...order, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="order-lastname" className="form-label">Nom</label>
              <input
                id="order-lastname"
                type="text"
                className="form-input max-w-xs"
                value={order?.lastname}
                onChange={(e) => setOrder({ ...order, lastname: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="order-phone" className="form-label">Téléphone</label>
            <input
              id="order-phone"
              type="text"
              className="form-input max-w-xs"
              value={order?.phone}
              onChange={(e) => setOrder({ ...order, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="order-email" className="form-label">Adresse e-mail</label>
            <input
              id="order-email"
              type="email"
              className="form-input max-w-xs"
              value={order?.email ?? ""}
              onChange={(e) => setOrder({ ...order, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="order-country" className="form-label">Pays</label>
              <input
                id="order-country"
                type="text"
                className="form-input max-w-xs"
                value={order?.country ?? ""}
                onChange={(e) => setOrder({ ...order, country: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="order-delivery" className="form-label">Date de livraison souhaitée</label>
              <input
                id="order-delivery"
                type="date"
                className="form-input max-w-xs"
                value={order?.desiredDeliveryDate ? String(order.desiredDeliveryDate).split("T")[0] : ""}
                onChange={(e) => setOrder({ ...order, desiredDeliveryDate: e.target.value || null })}
              />
            </div>
          </div>
          {/* Mesures client : un champ par mesure (lecture seule) */}
          {(order?.measurements && Object.keys(order.measurements).length > 0) && (
            <div className="form-group mt-6">
              <h3 className="text-lg font-semibold text-brand-text-primary mb-3">Mesures client (cm)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg">
                {Object.entries(order.measurements).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm text-brand-text-secondary block">{MEASURE_LABELS[key] ?? key}</span>
                    <span className="font-medium text-brand-text-primary">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="order-status" className="form-label">Statut de la commande</label>
            <select
              id="order-status"
              className="form-select max-w-xs"
              value={order?.status}
              onChange={(e) =>
                setOrder({
                  ...order,
                  status: e.target.value as Order["status"],
                })
              }
            >
              <option value="pending">En attente</option>
              <option value="processing">En cours</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="order-notice" className="form-label">Remarques de la commande</label>
            <textarea
              id="order-notice"
              className="form-textarea max-w-xl h-24"
              value={order?.orderNotice ?? ""}
              onChange={(e) => setOrder({ ...order, orderNotice: e.target.value })}
            />
            <p className="text-sm text-brand-text-secondary mt-1">Les mesures client sont affichées dans la section « Mesures client » ci-dessus, pas ici.</p>
          </div>
        </div>
        <section className="card card-body" aria-label="Articles de la commande">
          <h2 className="text-xl font-semibold text-brand-text-primary mb-4">Articles</h2>
          {orderProducts?.map((product) => (
            <div className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0" key={product?.id}>
              <Image
                src={getImageUrl(product?.product?.mainImage)}
                alt=""
                width={50}
                height={50}
                className="rounded object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <Link href={`/product/${product?.product?.slug}`} className="font-medium text-brand-primary hover:underline">
                  {product?.product?.title}
                </Link>
                <p className="text-sm text-brand-text-secondary">
                  {formatPriceMRU(product?.product?.price)} × {product?.quantity} article{product?.quantity > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
          <div className="mt-6 pt-4 border-t border-gray-200 space-y-1">
            <p className="text-lg">Sous-total : {formatPriceMRU(order?.total)}</p>
            <p className="text-lg">Taxe 20 % : {formatPriceMRU(order?.total / 5)}</p>
            <p className="text-lg">Livraison : {formatPriceMRU(5)}</p>
            <p className="text-2xl font-semibold text-brand-text-primary">
              Total : {formatPriceMRU(order?.total + order?.total / 5 + 5)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <button type="button" className="btn btn-secondary btn-md" onClick={updateOrder}>
              Mettre à jour la commande
            </button>
            <button type="button" className="btn btn-danger btn-md" onClick={deleteOrder}>
              Supprimer la commande
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminSingleOrder;
