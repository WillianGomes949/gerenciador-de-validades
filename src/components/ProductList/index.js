// src/components/ProductList.js
"use client";
import ProductItem from "../PoductItem";
import { useState } from 'react';

export default function ProductList({ products, isLoading, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Lógica da paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Funções para os botões
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-slate-800 dark:text-slate-200">
      <h2 className="text-center sm:text-left text-2xl font-semibold text-slate-600 mb-4 dark:text-slate-200">Lista de Produtos</h2>
      {isLoading ? (
        <p className="text-center text-slate-600">Carregando...</p>
      ) : (
        <div className="space-y-4">
          {products.length > 0 ? (
            currentProducts.map(product => (
              <ProductItem
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <p className="text-center text-slate-600">Nenhum produto cadastrado.</p>
          )}
          {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="font-semibold">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      )}
        </div>
      )}
    </div>
  );
}