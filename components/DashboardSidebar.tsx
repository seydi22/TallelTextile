// *********************
// Role of the component: Sidebar on admin dashboard page
// Name of the component: DashboardSidebar.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <DashboardSidebar />
// Input parameters: no input parameters
// Output: sidebar for admin dashboard page
// *********************

import React from "react";
import { MdDashboard } from "react-icons/md";
import { FaTable } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { FaStore } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";

import Link from "next/link";

const DashboardSidebar = () => {
  return (
    <div className="xl:w-[400px] bg-brand-secondary h-full max-xl:w-full">
      <Link href="/admin">
        <div className="flex gap-x-2 w-full hover:bg-brand-primary cursor-pointer items-center py-6 pl-5 text-xl text-white transition-colors duration-300">
          <MdDashboard className="text-2xl" />{" "}
          <span className="font-normal">Tableau de bord</span>
        </div>
      </Link>
      <Link href="/admin/orders">
        <div className="flex gap-x-2 w-full hover:bg-brand-primary cursor-pointer items-center py-6 pl-5 text-xl text-white transition-colors duration-300">
          <FaBagShopping className="text-2xl" />{" "}
          <span className="font-normal">Commandes</span>
        </div>
      </Link>
      <Link href="/admin/products">
        <div className="flex gap-x-2 w-full hover:bg-brand-primary cursor-pointer items-center py-6 pl-5 text-xl text-white transition-colors duration-300">
          <FaTable className="text-2xl" />{" "}
          <span className="font-normal">Produits</span>
        </div>
      </Link>
      <Link href="/admin/bulk-upload">
        <div className="flex gap-x-2 w-full hover:bg-brand-primary cursor-pointer items-center py-6 pl-5 text-xl text-white transition-colors duration-300">
          <FaFileUpload className="text-2xl" />{" "}
          <span className="font-normal">Téléchargement en masse</span>
        </div>
      </Link>
      <Link href="/admin/categories">
        <div className="flex gap-x-2 w-full hover:bg-brand-primary cursor-pointer items-center py-6 pl-5 text-xl text-white transition-colors duration-300">
          <MdCategory className="text-2xl" />{" "}
          <span className="font-normal">Catégories</span>
        </div>
      </Link>
      <Link href="/admin/users">
        <div className="flex gap-x-2 w-full hover:bg-brand-primary cursor-pointer items-center py-6 pl-5 text-xl text-white transition-colors duration-300">
          <FaRegUser className="text-2xl" />{" "}
          <span className="font-normal">Utilisateurs</span>
        </div>
      </Link>
      <Link href="/admin/merchant">
        <div className="flex gap-x-2 w-full hover:bg-brand-primary cursor-pointer items-center py-6 pl-5 text-xl text-white transition-colors duration-300">
          <FaStore className="text-2xl" />{" "}
          <span className="font-normal">Marchand</span>
        </div>
      </Link>
        <Link href="/admin/settings">
            <div className="flex gap-x-2 w-full hover:bg-brand-primary cursor-pointer items-center py-6 pl-5 text-xl text-white transition-colors duration-300">
                <FaGear className="text-2xl" />{" "}
                <span className="font-normal">Paramètres</span>
            </div>
        </Link>
    </div>
  );
};

export default DashboardSidebar;
