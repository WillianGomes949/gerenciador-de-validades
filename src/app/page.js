// app/page.js
"use client";
import { useState, useEffect, useMemo } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api";
import ProductFormModal from "@/components/ProductFormModal";
import ProductList from "@/components/ProductList";
import { sortProducts } from "@/utils/productUtils";
import ProductListSections from "@/components/ProductListSections";
import ExportButtons from "@/components/ExportButtons";
import LoadingOverlay from "@/components/LoadingOverlay";
import SearchBar from "@/components/SearchBar.js";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    // Se não houver termo de busca, retorna todos os produtos
    if (!searchTerm) {
      return products;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    return products.filter(product => {
      // Verifica se o nome do produto inclui o termo de busca
      const nameMatch = product.nome_produto.toLowerCase().includes(lowercasedTerm);
      // Verifica se o ID (EAN) inclui o termo de busca
      const idMatch = String(product.id).toLowerCase().includes(lowercasedTerm);

      return nameMatch || idMatch;
    });
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(sortProducts(data));
    } catch (e) {
      alert("Erro ao buscar produtos!");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(formData);
      } else {
        await addProduct(formData);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (e) {
      alert("Falha ao salvar produto!");
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (isSubmitting) return;
    if (!confirm("Deseja realmente excluir este produto?")) return;
    setIsSubmitting(true);
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (e) {
      alert("Falha ao excluir produto!");
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const existingSections = useMemo(() => {
    if (!products) return [];
    const sections = new Set(products.map((p) => p.secao).filter(Boolean));
    return Array.from(sections).sort();
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div className="min-h-screen bg-slate-50 text-slate-600 font-sans dark:bg-slate-900 dark:text-slate-200">
        <main className="container mx-auto p-4 md:p-8">
          <section className="mb-8 ">
            {/* Passamos a lista COMPLETA de produtos para ele */}
            {!isLoading && products.length > 0 && (
              <ExportButtons products={products} />
            )}

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-y-4">
              <h1 className="text-3xl font-bold md:text-3xl text-slate-600 dark:text-slate-200">
                Controle de Validade
              </h1>
              <div className="flex flex-col w-full gap-4 md:gap-2 lg:flex-row md:w-80 lg:w-xl lg:justify-end lg:items-center">
                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                <button
                  onClick={handleOpenAddModal}
                  className="px-5 py-3 md:py-2 bg-lime-600 text-white font-bold rounded-md hover:bg-lime-700 transition-colors shadow-sm"
                >
                  Adicionar Produto
                </button>
              </div>
            </div>

            <ProductListSections
              products={filteredProducts}
              isLoading={isLoading}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          </section>
          <section>
            <ProductList
              products={filteredProducts}
              isLoading={isLoading}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          </section>
        </main>

        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productToEdit={editingProduct}
          onSubmitForm={handleFormSubmit}
          isSubmitting={isSubmitting}
          existingSections={existingSections}
        />
      </div>
    </>
  );
}
