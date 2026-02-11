"use client";

import React, { useState, useRef, useEffect } from "react";
import { COUNTRIES } from "@/lib/countries";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export default function CountrySelect({
  value,
  onChange,
  placeholder = "Rechercher ou sélectionner un pays...",
  disabled = false,
  id = "country-select",
  className = "",
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCountries = COUNTRIES.filter((country) =>
    country.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          id={id}
          value={isOpen ? search : value}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setSearch(value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed text-brand-text-primary pr-10"
        />
        <button
          type="button"
          onClick={() => {
            if (!isOpen) setSearch(value);
            else setSearch("");
            setIsOpen(!isOpen);
          }}
          disabled={disabled}
          className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-auto"
        >
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <ul
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          role="listbox"
        >
          {filteredCountries.length === 0 ? (
            <li className="relative cursor-default select-none py-2 px-4 text-gray-500">
              Aucun pays trouvé
            </li>
          ) : (
            filteredCountries.map((country) => (
              <li
                key={country}
                role="option"
                onClick={() => {
                  onChange(country);
                  setSearch("");
                  setIsOpen(false);
                }}
                className={`relative cursor-pointer select-none py-2 px-4 hover:bg-brand-accent/20 ${
                  value === country ? "bg-brand-accent/30" : ""
                }`}
              >
                <span className="block truncate text-brand-text-primary">{country}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
