// src/components/ProductItem.js
"use client";
import { getValidadeStatus } from "@/utils/productUtils";

export default function ProductItem({ product, onEdit, onDelete }) {
  const status = getValidadeStatus(product.validade);

  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 bg-slate-50 border-slate-200 border-2 rounded-md hover:shadow-md transition-shadow
sm:grid-cols-4 lg:grid-cols-6 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
    >
      {/* Nome e ID (Sempre no topo em telas menores) */}
      <div className="col-span-2 sm:col-span-4 lg:col-span-2">
        <p className="font-bold text-slate-800 dark:text-slate-200">{product.nome_produto}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 ">ID: {product.id}</p>
      </div>

      {/* Quantidade */}
      <div className="text-center sm:text-left lg:text-center">
        <p className="text-xs text-slate-500">Qtd.</p>
        <p className="font-semibold text-slate-700 dark:text-slate-200">{product.quantidade}</p>
      </div>

      {/* Preço */}
      <div className="text-center sm:text-left lg:text-center">
        <p className="text-xs text-slate-500">Preço</p>
        <p className="font-semibold text-slate-700 dark:text-slate-200">
          R$ {Number(product.preco).toFixed(2)}
        </p>
      </div>

      {/* Validade */}
      <div className="col-span-2 text-center sm:col-span-1 sm:text-left lg:text-center">
        <p className="text-xs text-slate-500">Validade</p>
        <p className={status.cor} title={status.title}>
          {status.texto}
        </p>
      </div>

      {/* Botões de Ação */}
      <div className="col-span-2 sm:col-span-1 flex justify-end items-center gap-2">
        <button
          onClick={() => onEdit(product)}
          className="px-3 py-1 text-sm bg-lime-600 text-white rounded-md hover:bg-lime-700 "
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
