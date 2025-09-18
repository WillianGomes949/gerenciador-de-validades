// src/components/ProductFormModal.js
"use client";
import { useState, useEffect } from "react";
import { INITIAL_FORM_STATE } from "@/utils/productUtils";

export default function ProductFormModal({
  isOpen,
  onClose,
  productToEdit,
  onSubmitForm,
  isSubmitting,
}) {
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    if (productToEdit) {
      const formattedDate = productToEdit.validade
        ? new Date(productToEdit.validade).toISOString().split("T")[0]
        : "";
      setFormState({ ...productToEdit, validade: formattedDate });
    } else {
      setFormState(INITIAL_FORM_STATE);
    }
  }, [productToEdit, isOpen]);

  const handleInputChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitForm(formState);
  };

  if (!isOpen) return null;

  const isEditing = !!productToEdit;

  return (
    <div
      className="dark:bg-slate-900 dark:text-slate-200 dark:bg-black/50 dark:bg-opacity-60 fixed inset-0 bg-black/50 z-40 flex justify-center items-center "
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg m-4 dark:bg-slate-800 dark:text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
            {isEditing ? "Editar Produto" : "Adicionar Novo Produto"}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-slate-800"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <fieldset
            disabled={isSubmitting}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="id"
              value={formState.id}
              onChange={handleInputChange}
              placeholder="EAN (Código de Barras)"
              required
              disabled={isEditing}
              className="p-3 border-lime-300 border-1 rounded-md disabled:bg-slate-200 dark:disabled:bg-slate-700 col-span-2 md:col-span-1"
            />

            <input
              type="text"
              name="nome_produto"
              value={formState.nome_produto}
              onChange={handleInputChange}
              placeholder="Nome do Produto"
              required
              className="p-3 border-lime-300 border-1 rounded-md col-span-2 md:col-span-1"
            />

            <input
              type="number"
              name="quantidade"
              value={formState.quantidade}
              onChange={handleInputChange}
              placeholder="Quantidade"
              required
              className="p-3 border-lime-300 border-1 rounded-md col-span-2 md:col-span-1"
            />

            <input
              type="number"
              name="preco"
              value={formState.preco}
              onChange={handleInputChange}
              placeholder="Preço (ex: 9.99)"
              step="0.01"
              required
              className="p-3 border-lime-300 border-1 rounded-md col-span-2 md:col-span-1"
            />

            <div className="col-span-2 md:col-span-2">
              <label
                htmlFor="validade"
                className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-500 md:sr-only"
              >
                Data de Validade
              </label>
              <input
                id="validade"
                type="date"
                name="validade"
                value={formState.validade}
                onChange={handleInputChange}
                required
                className="p-3 border-lime-300 border-1 rounded-md w-full min-h-[48px] text-base "
              />
            </div>

            <div className="md:col-span-2 flex gap-4 mt-2 col-span-2">
              <button
                type="submit"
                className="flex-grow p-3 bg-lime-600 text-white font-bold rounded-md hover:bg-lime-700 disabled:bg-lime-300 "
              >
                {isSubmitting
                  ? "Salvando..."
                  : isEditing
                  ? "Salvar Alterações"
                  : "Adicionar Produto"}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
