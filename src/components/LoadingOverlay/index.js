// src/components/LoadingOverlay.js
"use client";

import { HashLoader } from "react-spinners";

export default function LoadingOverlay({ isLoading }) {
  // Se não estiver carregando, o componente não renderiza nada.
  if (!isLoading) {
    return null;
  }

  return (
    // O container principal que cobre a tela inteira
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* O spinner animado da biblioteca */}
        <HashLoader color="#5ea500" size={30} />
        <p className="text-lime-600 text-center dark:text-slate-200 font-semibold text-lg m-4">
          Carregando Dados...
        </p>
      </div>
    </div>
  );
}