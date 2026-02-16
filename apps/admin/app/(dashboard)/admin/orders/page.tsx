"use client";

import { AdminOrders, DashboardSidebar } from "../../../../components";
import React from "react";

const DashboardOrdersPage = () => {
  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content">
        <AdminOrders />
      </main>
    </div>
  );
};

export default DashboardOrdersPage;
