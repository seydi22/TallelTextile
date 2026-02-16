"use client";
import { DashboardSidebar } from '../../../../../components';
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { isValidEmailAddressFormat } from "@tallel-textile/shared/lib/utils";
import apiClient from '@tallel-textile/shared/lib/api';

interface DashboardUserDetailsProps {
  params: Promise<{ id: string }>;
}

const DashboardSingleUserPage = ({ params }: DashboardUserDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [userInput, setUserInput] = useState<{
    email: string;
    newPassword: string;
    role: string;
  }>({
    email: "",
    newPassword: "",
    role: "",
  });
  const router = useRouter();

  const deleteUser = async () => {
    const requestOptions = {
      method: "DELETE",
    };
    apiClient
      .delete(`/api/users/${id}`, requestOptions)
      .then((response) => {
        if (response.status === 204) {
          toast.success("Utilisateur supprimé avec succès");
          router.push("/admin/users");
        } else {
          throw Error("Erreur lors de la suppression de l'utilisateur");
        }
      })
      .catch(() => {
        toast.error("Erreur lors de la suppression de l'utilisateur");
      });
  };

  const updateUser = async () => {
    if (
      userInput.email.length > 3 &&
      userInput.role.length > 0 &&
      userInput.newPassword.length > 0
    ) {
      if (!isValidEmailAddressFormat(userInput.email)) {
        toast.error("Format d'adresse e-mail invalide");
        return;
      }

      if (userInput.newPassword.length > 7) {
        try {
          const response = await apiClient.put(`/api/users/${id}`, {
            email: userInput.email,
            password: userInput.newPassword,
            role: userInput.role,
          });

          if (response.status === 200) {
            await response.json();
            toast.success("Utilisateur mis à jour avec succès");
          } else {
            const errorData = await response.json();
            toast.error(errorData.error || "Erreur lors de la mise à jour de l'utilisateur");
          }
        } catch (error) {
          console.error("Error updating user:", error);
          toast.error("Erreur lors de la mise à jour de l'utilisateur");
        }
      } else {
        toast.error("Le mot de passe doit contenir au moins 8 caractères");
        return;
      }
    } else {
      toast.error("Veuillez remplir tous les champs pour mettre à jour l'utilisateur");
      return;
    }
  };

  useEffect(() => {
    // sending API request for a single user
    apiClient
      .get(`/api/users/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserInput({
          email: data?.email,
          newPassword: "",
          role: data?.role,
        });
      });
  }, [id]);

  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content flex flex-col gap-6">
        <h1 className="page-title">Détails de l&apos;utilisateur</h1>
        <div className="form-group">
          <label htmlFor="user-email" className="form-label">E-mail</label>
          <input
            id="user-email"
            type="email"
            className="form-input max-w-xs"
            value={userInput.email}
            onChange={(e) =>
              setUserInput({ ...userInput, email: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="user-new-password" className="form-label">Nouveau mot de passe</label>
          <input
            id="user-new-password"
            type="password"
            className="form-input max-w-xs"
            onChange={(e) =>
              setUserInput({ ...userInput, newPassword: e.target.value })
            }
            value={userInput.newPassword}
          />
        </div>

        <div className="form-group">
          <label htmlFor="user-role" className="form-label">Rôle</label>
          <select
            id="user-role"
            className="form-select max-w-xs"
            value={userInput.role}
            onChange={(e) =>
              setUserInput({ ...userInput, role: e.target.value })
            }
          >
            <option value="admin">Administrateur</option>
            <option value="user">Utilisateur</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-secondary btn-md" onClick={updateUser}>
            Mettre à jour l&apos;utilisateur
          </button>
          <button type="button" className="btn btn-danger btn-md" onClick={deleteUser}>
            Supprimer l&apos;utilisateur
          </button>
        </div>
      </main>
    </div>
  );
};

export default DashboardSingleUserPage;
