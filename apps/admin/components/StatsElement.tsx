"use client";

import React from "react";
import { FaArrowUp } from "react-icons/fa6";

interface StatsElementProps {
  title?: string;
  value?: string | number;
  subtitle?: string;
}

const StatsElement = ({
  title = "Nouveaux produits",
  value = "2 230",
  subtitle = "12,5 % depuis le mois dernier",
}: StatsElementProps) => {
  return (
    <article className="w-full sm:w-72 h-32 bg-brand-secondary text-white flex flex-col justify-center items-center rounded-lg shadow-md p-4">
      <h4 className="text-lg sm:text-xl font-serif font-semibold text-white">{title}</h4>
      <p className="text-2xl font-bold text-brand-accent mt-1">{value}</p>
      <p className="text-brand-accent flex gap-x-1 items-center text-sm mt-0.5">
        <FaArrowUp aria-hidden /> {subtitle}
      </p>
    </article>
  );
};

export default StatsElement;
