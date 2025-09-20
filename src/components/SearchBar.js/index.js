// src/components/SearchBar.js
"use client";

import { RiSearchEyeLine } from "@remixicon/react";

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <>
      <div className="relative">
        {/* Ícone de Lupa (opcional, para estética) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <RiSearchEyeLine
            size={20}
            className="text-lime-600 hover:text-lime-700 transition-colors duration-200"
          />
        </div>

        <input
          type="search" // Usar type="search" adiciona um "x" para limpar o campo em muitos navegadores
          name="search"
          id="search"
          className="block rounded-md border-0 bg-white dark:bg-slate-700 py-2.5 pl-10 pr-3 text-gray-900 dark:text-gray-200 ring-1 ring-inset ring-gray-300 dark:ring-slate-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Buscar produto..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </>
  );
}
