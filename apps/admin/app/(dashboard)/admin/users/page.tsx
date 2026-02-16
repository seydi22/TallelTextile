"use client";

import { CustomButton, DashboardSidebar } from "../../../../components";
import apiClient from "@tallel-textile/shared/lib/api";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  role: string | null;
}

const roleLabels: Record<string, string> = {
  admin: "Administrateur",
  user: "Utilisateur",
};

const DashboardUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    apiClient
      .get("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="page-title mb-0 text-center sm:text-left">Tous les utilisateurs</h1>
          <Link href="/admin/users/new">
            <CustomButton buttonType="button" text="Ajouter un utilisateur" variant="secondary" className="btn-md" />
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
                <th scope="col">E-mail</th>
                <th scope="col">Rôle</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <label className="cursor-pointer">
                        <input type="checkbox" className="form-checkbox" aria-label={`Sélectionner ${user.email}`} />
                      </label>
                    </td>
                    <td>
                      <p className="font-medium text-brand-text-primary">{user.email}</p>
                    </td>
                    <td>
                      <span className="badge badge-primary">{roleLabels[user?.role ?? ""] ?? user?.role ?? "—"}</span>
                    </td>
                    <td>
                      <Link href={`/admin/users/${user.id}`} className="btn btn-ghost btn-sm">
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-brand-text-secondary">
                    Aucun utilisateur.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <th scope="col"></th>
                <th scope="col">E-mail</th>
                <th scope="col">Rôle</th>
                <th scope="col"></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DashboardUsers;
