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

interface Order {
  id: string;
  adress?: string;
  apartment?: string;
  company?: string;
  dateTime: string;
  email?: string;
  lastname: string;
  name: string;
  phone: string;
  postalCode?: string;
  city?: string;
  country?: string;
  desiredDeliveryDate?: string | null;
  orderNotice?: string;
  status: "processing" | "delivered" | "canceled" | "pending" | "shipped" | "cancelled";
  total: number;
}

const AdminSingleOrder = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>();
  const [order, setOrder] = useState<Order>({
    id: "",
    adress: "",
    apartment: "",
    company: "",
    dateTime: "",
    email: "",
    lastname: "",
    name: "",
    phone: "",
    postalCode: "",
    city: "",
    country: "",
    desiredDeliveryDate: null,
    orderNotice: "",
    status: "processing",
    total: 0,
  });
  const params = useParams<{ id: string }>();

  const router = useRouter();

  useEffect(() => {
    const fetchOrderData = async () => {
      const response = await apiClient.get(
        `/api/orders/${params?.id}`
      );
      const data: Order = await response.json();
      setOrder(data);
    };

    const fetchOrderProducts = async () => {
      const response = await apiClient.get(
        `/api/order-product/${params?.id}`
      );
      const data: OrderProduct[] = await response.json();
      setOrderProducts(data);
    };

    fetchOrderData();
    fetchOrderProducts();
  }, [params?.id]);

  const updateOrder = async () => {
    if (
      order?.name?.trim().length > 0 &&
      order?.lastname?.trim().length > 0 &&
      order?.phone?.trim().length > 0
    ) {
      if (!isValidNameOrLastname(order?.name)) {
        toast.error("Format du prénom invalide");
        return;
      }

      if (!isValidNameOrLastname(order?.lastname)) {
        toast.error("Format du nom invalide");
        return;
      }

      if (order?.email?.trim() && !isValidEmailAddressFormat(order.email)) {
        toast.error("Format de l'e-mail invalide");
        return;
      }

      apiClient.put(`/api/orders/${order?.id}`, order)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Commande mise à jour avec succès");
          } else {
            throw Error("Erreur lors de la mise à jour de la commande");
          }
        })
        .catch(() =>
          toast.error("Erreur lors de la mise à jour de la commande")
        );
    } else {
      toast.error("Veuillez remplir tous les champs obligatoires");
    }
  };

  const deleteOrder = async () => {
    const requestOptions = {
      method: "DELETE",
    };

    apiClient.delete(
      `/api/order-product/${order?.id}`,
      requestOptions
    ).then((response) => {
      apiClient.delete(
        `/api/orders/${order?.id}`,
        requestOptions
      ).then((response) => {
        toast.success("Commande supprimée avec succès");
        router.push("/admin/orders");
      });
    });
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
              value={order?.email}
              onChange={(e) => setOrder({ ...order, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="order-company" className="form-label">Société (optionnel)</label>
            <input
              id="order-company"
              type="text"
              className="form-input max-w-xs"
              value={order?.company}
              onChange={(e) => setOrder({ ...order, company: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="order-address" className="form-label">Adresse</label>
              <input
                id="order-address"
                type="text"
                className="form-input max-w-xs"
                value={order?.adress}
                onChange={(e) => setOrder({ ...order, adress: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="order-apartment" className="form-label">Appartement, étage, etc.</label>
              <input
                id="order-apartment"
                type="text"
                className="form-input max-w-xs"
                value={order?.apartment}
                onChange={(e) => setOrder({ ...order, apartment: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-group">
              <label htmlFor="order-city" className="form-label">Ville</label>
              <input
                id="order-city"
                type="text"
                className="form-input max-w-xs"
                value={order?.city}
                onChange={(e) => setOrder({ ...order, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="order-country" className="form-label">Pays</label>
              <input
                id="order-country"
                type="text"
                className="form-input max-w-xs"
                value={order?.country}
                onChange={(e) => setOrder({ ...order, country: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="order-postal" className="form-label">Code postal</label>
              <input
                id="order-postal"
                type="text"
                className="form-input max-w-xs"
                value={order?.postalCode ?? ""}
                onChange={(e) => setOrder({ ...order, postalCode: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="order-delivery" className="form-label">Date de livraison souhaitée</label>
              <input
                id="order-delivery"
                type="date"
                className="form-input max-w-xs"
                value={order?.desiredDeliveryDate ? order.desiredDeliveryDate.split("T")[0] : ""}
                onChange={(e) => setOrder({ ...order, desiredDeliveryDate: e.target.value || null })}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="order-status" className="form-label">Statut de la commande</label>
            <select
              id="order-status"
              className="form-select max-w-xs"
              value={order?.status}
              onChange={(e) =>
                setOrder({
                  ...order,
                  status: e.target.value as "processing" | "delivered" | "canceled",
                })
              }
            >
              <option value="processing">En cours</option>
              <option value="delivered">Livrée</option>
              <option value="canceled">Annulée</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="order-notice" className="form-label">Remarque commande</label>
            <textarea
              id="order-notice"
              className="form-textarea max-w-xl h-24"
              value={order?.orderNotice || ""}
              onChange={(e) => setOrder({ ...order, orderNotice: e.target.value })}
            />
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
