// src/components/ProductList.js
"use client";
import ProductItem from "../PoductItem";

export default function ProductList({ products, isLoading, onEdit, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-slate-800 dark:text-slate-200">
      <h2 className="text-center sm:text-left text-2xl font-semibold text-slate-700 mb-4 dark:text-slate-200">Lista de Produtos</h2>
      {isLoading ? (
        <p className="text-center text-slate-500">Carregando...</p>
      ) : (
        <div className="space-y-4">
          {products.length > 0 ? (
            products.map(product => (
              <ProductItem
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <p className="text-center text-slate-500">Nenhum produto cadastrado.</p>
          )}
        </div>
      )}
    </div>
  );
}