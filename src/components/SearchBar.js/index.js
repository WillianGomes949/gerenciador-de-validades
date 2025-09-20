// src/components/SearchBar.js
"use client";

import { RiSearchEyeLine, RiCloseCircleFill } from "@remixicon/react";

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <>
      <div className="relative">
        <div className="flex pointer-events-none absolute inset-y-0 left-0 items-center p-2">
          <RiSearchEyeLine
            size={20}
            className="text-slate-600 dark:text-slate-200"
          />
        </div>

        <input
          type="text" // Usar type="search" adiciona um "x" para limpar o campo em muitos navegadores
          name="search"
          id="search"
          className="block rounded-md border p-2 px-10 text-gray-600 dark:text-gray-200 ring-1 ring-inset ring-gray-300 dark:ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
          placeholder="Buscar produto..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="button" // Evita que o botão envie um formulário
            onClick={() => onSearchChange('')} // Limpa o estado no componente pai
            aria-label="Limpar busca" // Para acessibilidade
            className="focus:outline-none"
          >
            <RiCloseCircleFill
              size={20}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
            />
          </button>
        </div>
      )}
      </div>
    </>
  );
}
