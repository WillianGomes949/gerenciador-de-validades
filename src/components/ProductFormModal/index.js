// src/components/ProductFormModal.js
"use client";

import { useState, useEffect } from "react";
import { INITIAL_FORM_STATE } from "@/utils/productUtils";
import { RiCloseCircleFill } from "@remixicon/react";
import LeitorQrCode from "@/components/LeitorQrCode";

export default function ProductFormModal({
  isOpen,
  onClose,
  productToEdit,
  onSubmitForm,
  isSubmitting,
  existingSections = [],
}) {
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [isAddingNewSection, setIsAddingNewSection] = useState(false);

  // <-- AJUSTE: A função de scan agora atualiza o formulário diretamente
  const handleScanSuccess = (decodedText, decodedResult) => {
    console.log(`Código lido: ${decodedText}`);
    // Atualiza o campo 'id' (EAN) do formulário com o código lido
    setFormState((prev) => ({ ...prev, id: decodedText }));
  };

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        const formattedDate = productToEdit.validade
          ? new Date(productToEdit.validade).toISOString().split("T")[0]
          : "";
        setFormState({ ...productToEdit, validade: formattedDate });

        const sectionExists =
          productToEdit.secao && existingSections.includes(productToEdit.secao);
        if (productToEdit.secao && !sectionExists) {
          setIsAddingNewSection(true);
        } else {
          setIsAddingNewSection(false);
        }
      } else {
        setFormState(INITIAL_FORM_STATE);
        setIsAddingNewSection(false);
      }
    }
  }, [productToEdit, isOpen, existingSections]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "secao" && value === "--add-new--") {
      setIsAddingNewSection(true);
      setFormState((prev) => ({ ...prev, secao: "" }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCancelAddNewSection = () => {
    setIsAddingNewSection(false);
    setFormState((prev) => ({ ...prev, secao: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitForm(formState);
  };

  if (!isOpen) return null;

  const isEditing = !!productToEdit;

  return (
    <div
      className="dark:bg-slate-900 dark:text-slate-200 dark:bg-opacity-60 fixed inset-0 bg-black/50 z-40 flex justify-center items-center"
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
          <button onClick={onClose} className="">
            <RiCloseCircleFill
              size={36}
              className="text-lime-600 hover:text-lime-700 transition-colors duration-200"
            />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* <-- AJUSTE: Leitor de código movido para dentro do formulário e simplificado */}
          {!isEditing && (
            <div className="mb-4 p-4 border rounded-lg dark:border-slate-700">
              <h3 className="text-center text-slate-600 dark:text-slate-400 mb-2">
                Escanear Código de Barras
              </h3>
              <LeitorQrCode onScanSuccess={handleScanSuccess} />
            </div>
          )}

          <fieldset
            disabled={isSubmitting}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="id"
              // O valor agora vem do formState, que é atualizado pelo scanner ou manualmente
              value={formState.id}
              onChange={handleInputChange}
              placeholder="EAN (Código de Barras)"
              required
              // Desabilitado na edição para não alterar o ID do produto
              disabled={isEditing}
            />

            <input
              type="text"
              name="nome_produto"
              value={formState.nome_produto}
              onChange={handleInputChange}
              placeholder="Nome do Produto"
              required
            />

            <input
              type="number"
              name="quantidade"
              value={formState.quantidade}
              onChange={handleInputChange}
              placeholder="Quantidade"
              required
            />

            <input
              type="number"
              name="preco"
              value={formState.preco}
              onChange={handleInputChange}
              placeholder="Preço (ex: 9,99)"
              step="0.01"
              required
            />
            
            {/* Lógica condicional para o campo de Seção */}
            {isAddingNewSection ? (
              <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                <input
                  type="text"
                  name="secao"
                  value={formState.secao}
                  onChange={handleInputChange}
                  placeholder="Nome da Nova Seção"
                  required
                />
                <button
                  type="button"
                  onClick={handleCancelAddNewSection}
                  className="p-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-700"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <select
                name="secao"
                value={formState.secao}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Selecione uma seção...
                </option>
                {existingSections.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option
                  value="--add-new--"
                  className="font-bold text-indigo-600"
                >
                  + Adicionar Nova Seção...
                </option>
              </select>
            )}

            <div className="col-span-2">
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