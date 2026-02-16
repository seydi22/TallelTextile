"use client";
import { DashboardSidebar } from '../../../../../components';
import apiClient from '@tallel-textile/shared/lib/api';
import { isValidEmailAddressFormat } from "@tallel-textile/shared/lib/utils";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { sanitizeFormData } from '../../../../../lib/form-sanitize';

const DashboardCreateNewUser = () => {
  const [userInput, setUserInput] = useState<{
    email: string;
    password: string;
    role: string;
  }>({
    email: "",
    password: "",
    role: "user",
  });

  const addNewUser = async () => {
    if (userInput.email === "" || userInput.password === "") {
      toast.error("Veuillez remplir tous les champs pour ajouter un utilisateur");
      return;
    }

    if (!isValidEmailAddressFormat(userInput.email)) {
      toast.error("Format d'adresse e-mail invalide");
      return;
    }

    if (userInput.password.length <= 7) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      // Sanitize form data before sending to API
      const sanitizedUserInput = sanitizeFormData(userInput);
      
      const response = await apiClient.post(`/api/users`, sanitizedUserInput);

      if (response.status === 201) {
        toast.success("Utilisateur ajouté avec succès");
        setUserInput({
          email: "",
          password: "",
          role: "user",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erreur lors de la création de l'utilisateur");
      }
    } catch (error) {
      toast.error("Une erreur inattendue s'est produite.");
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content flex flex-col gap-6">
        <h1 className="page-title">Ajouter un utilisateur</h1>
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
          <label htmlFor="user-password" className="form-label">Mot de passe</label>
          <input
            id="user-password"
            type="password"
            className="form-input max-w-xs"
            value={userInput.password}
            onChange={(e) =>
              setUserInput({ ...userInput, password: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="user-role" className="form-label">Rôle</label>
          <select
            id="user-role"
            className="form-select max-w-xs"
            defaultValue={userInput.role}
            onChange={(e) =>
              setUserInput({ ...userInput, role: e.target.value })
            }
          >
            <option value="admin">Administrateur</option>
            <option value="user">Utilisateur</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="btn btn-secondary btn-md"
            onClick={addNewUser}
          >
            Créer l&apos;utilisateur
          </button>
        </div>
      </main>
    </div>
  );
};

export default DashboardCreateNewUser;
