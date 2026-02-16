"use client";

import { DashboardSidebar, StatsElement } from "../../../components";
import React from "react";
import { FaArrowUp } from "react-icons/fa6";

const AdminDashboardPage = () => {
  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content flex flex-col items-center gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row justify-between w-full gap-4 flex-wrap">
          <StatsElement title="Nouveaux produits" value="2 230" subtitle="12,5 % depuis le mois dernier" />
          <StatsElement title="Commandes du jour" value="48" subtitle="8 % depuis hier" />
          <StatsElement title="Revenus du mois" value="1,2 M" subtitle="15 % depuis le mois dernier" />
        </div>
        <section className="w-full card card-body" aria-label="Statistiques des visiteurs">
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-brand-text-primary mb-2">
            Nombre de visiteurs aujourd&apos;hui
          </h2>
          <p className="text-3xl font-bold text-brand-primary">1 200</p>
          <p className="text-brand-text-secondary flex gap-x-1 items-center mt-1">
            <FaArrowUp aria-hidden /> 12,5 % depuis le mois dernier
          </p>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
