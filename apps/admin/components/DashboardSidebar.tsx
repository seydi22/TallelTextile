"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { FaTable, FaRegUser, FaGear, FaBagShopping, FaStore } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: MdDashboard },
  { href: "/admin/orders", label: "Commandes", icon: FaBagShopping },
  { href: "/admin/products", label: "Produits", icon: FaTable },
  { href: "/admin/bulk-upload", label: "Téléchargement en masse", icon: FaFileUpload },
  { href: "/admin/categories", label: "Catégories", icon: MdCategory },
  { href: "/admin/users", label: "Utilisateurs", icon: FaRegUser },
  { href: "/admin/merchant", label: "Marchands", icon: FaStore },
  { href: "/admin/settings", label: "Paramètres", icon: FaGear },
];

const DashboardSidebar = () => {
  const pathname = usePathname();
  return (
    <aside
      className="xl:w-[320px] xl:min-w-[320px] w-full bg-brand-secondary flex-shrink-0"
      aria-label="Navigation principale"
    >
      <nav className="flex flex-col" role="navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`nav-link ${isActive ? "bg-brand-primary" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="text-xl flex-shrink-0" aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
