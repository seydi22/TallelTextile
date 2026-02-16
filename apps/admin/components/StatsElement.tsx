"use client";

import React from "react";

interface StatsElementProps {
  title: string;
  value: string | number;
  subtitle?: string | null;
}

const StatsElement = ({ title, value, subtitle }: StatsElementProps) => {
  return (
    <article className="w-full sm:min-w-[200px] flex-1 max-w-xs h-32 bg-brand-secondary text-white flex flex-col justify-center items-center rounded-lg shadow-md p-4">
      <h4 className="text-lg sm:text-xl font-serif font-semibold text-white text-center">{title}</h4>
      <p className="text-2xl font-bold text-brand-accent mt-1">{value}</p>
      {subtitle != null && subtitle !== "" && (
        <p className="text-brand-accent text-sm mt-0.5 text-center">{subtitle}</p>
      )}
    </article>
  );
};

export default StatsElement;
