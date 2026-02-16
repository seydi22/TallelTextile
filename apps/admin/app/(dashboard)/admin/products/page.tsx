"use client";

import {
  CustomButton,
  DashboardProductTable,
  DashboardSidebar,
} from "../../../../components";
import React from "react";

const DashboardProducts = () => {
  return (
    <div className="dashboard-layout bg-brand-bg-primary">
      <DashboardSidebar />
      <main className="dashboard-content">
        <DashboardProductTable />
      </main>
    </div>
  );
};

export default DashboardProducts;
