"use client";

import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import apiClient from "@tallel-textile/shared/lib/api";
import { sanitize } from "../lib/sanitize";
import { formatPriceMRU } from "@tallel-textile/shared/lib/formatPrice";
import { getImageUrl } from "../utils/imageUtils";

interface Product {
  id: string;
  title: string;
  mainImage: string;
  price: number;
  manufacturer: string;
  inStock: number;
}

const DashboardProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    apiClient
      .get("/api/products?mode=admin", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []));
  }, []);

  return (
    <section className="w-full" aria-labelledby="products-heading">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 id="products-heading" className="page-title mb-0 text-center sm:text-left">
          Tous les produits
        </h1>
        <Link href="/admin/products/new">
          <CustomButton
            buttonType="button"
            text="Ajouter un produit"
            variant="secondary"
            className="btn-md"
          />
        </Link>
      </div>
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
              <th scope="col">Produit</th>
              <th scope="col">Disponibilité</th>
              <th scope="col">Prix</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <label className="cursor-pointer">
                      <input type="checkbox" className="form-checkbox" aria-label={`Sélectionner ${sanitize(product.title)}`} />
                    </label>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          width={48}
                          height={48}
                          src={getImageUrl(product.mainImage)}
                          alt=""
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-brand-text-primary truncate">
                          {sanitize(product.title)}
                        </div>
                        <div className="text-sm text-brand-text-secondary truncate">
                          {sanitize(product.manufacturer)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {product.inStock > 0 ? (
                      <span className="badge badge-success">En stock</span>
                    ) : (
                      <span className="badge badge-error">Rupture</span>
                    )}
                  </td>
                  <td>{formatPriceMRU(product.price)}</td>
                  <td>
                    <Link href={`/admin/products/${product.id}`} className="btn btn-ghost btn-sm">
                      Détails
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-brand-text-secondary">
                  Aucun produit. Ajoutez-en un pour commencer.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th scope="col"></th>
              <th scope="col">Produit</th>
              <th scope="col">Disponibilité</th>
              <th scope="col">Prix</th>
              <th scope="col"></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};

export default DashboardProductTable;
