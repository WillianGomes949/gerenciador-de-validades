// app/page.js
"use client";
import { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/api';
import ProductFormModal from '@/components/ProductFormModal';
import ProductList from '@/components/ProductList';
import { sortProducts } from '@/utils/productUtils';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans dark:bg-slate-900 dark:text-slate-200">
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-y-4">
          <h1 className="text-3xl font-bold sm:text-4xl font-bold text-slate-800 dark:text-slate-200">Controle de Validades</h1>
          <button 
            onClick={handleOpenAddModal}
            className="px-5 py-3 bg-lime-600 text-white font-bold rounded-md hover:bg-lime-700 transition-colors shadow-sm"
          >
            Adicionar Produto
          </button>
        </div>
        
        <ProductList
            products={products}
            isLoading={isLoading}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
        />

      </main>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={editingProduct}
        onSubmitForm={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}