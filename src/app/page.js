// app/page.js
"use client";
import { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/api';

const INITIAL_FORM_STATE = { id: '', nome_produto: '', quantidade: '', preco: '', validade: '' };

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // <-- NOVO ESTADO!
  const [editingProduct, setEditingProduct] = useState(null);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar produtos!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      const formattedProduct = {
        ...editingProduct,
        validade: editingProduct.validade ? new Date(editingProduct.validade).toISOString().split('T')[0] : ''
      };
      setFormState(formattedProduct);
    } else {
      setFormState(INITIAL_FORM_STATE);
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // <-- Impede o envio se já estiver em andamento

    setIsSubmitting(true); // <-- Inicia o carregamento
    try {
      if (editingProduct) {
        await updateProduct(formState);
        alert("Produto atualizado com sucesso!");
      } else {
        await addProduct(formState);
        alert("Produto adicionado com sucesso!");
      }
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Falha ao salvar produto!");
    } finally {
      setIsSubmitting(false); // <-- Termina o carregamento, mesmo se der erro
    }
  };

  const handleDelete = async (productId) => {
    if (isSubmitting) return;

    if (confirm("Tem certeza que deseja excluir?")) {
      setIsSubmitting(true);
      try {
        await deleteProduct(productId);
        alert("Produto excluído!");
        fetchProducts();
      } catch (error) {
        console.error(error);
        alert("Falha ao excluir produto!");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold text-slate-800 text-center mb-8">Controle de Estoque</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
          </h2>
          {/* O "fieldset" desabilita todos os inputs de uma vez */}
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="id" value={formState.id} onChange={handleInputChange} placeholder="ID (Código de Barras)" className="p-3 border rounded-md disabled:bg-slate-200" required disabled={!!editingProduct} />
              <input type="text" name="nome_produto" value={formState.nome_produto} onChange={handleInputChange} placeholder="Nome do Produto" className="p-3 border rounded-md disabled:bg-slate-200" required />
              <input type="number" name="quantidade" value={formState.quantidade} onChange={handleInputChange} placeholder="Quantidade" className="p-3 border rounded-md disabled:bg-slate-200" required />
              <input type="number" name="preco" value={formState.preco} onChange={handleInputChange} placeholder="Preço (ex: 5.50)" step="0.01" className="p-3 border rounded-md disabled:bg-slate-200" required />
              <input type="date" name="validade" value={formState.validade} onChange={handleInputChange} className="p-3 border rounded-md disabled:bg-slate-200" required />
              
              <div className="md:col-span-2 flex gap-4 mt-2">
                <button type="submit" className="flex-grow p-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-300">
                  {isSubmitting ? 'Salvando...' : (editingProduct ? 'Salvar Alterações' : 'Adicionar Produto')}
                </button>
                {editingProduct && (
                  <button type="button" onClick={() => setEditingProduct(null)} className="p-3 bg-slate-500 text-white font-bold rounded-md hover:bg-slate-600 disabled:bg-slate-300">
                    Cancelar
                  </button>
                )}
              </div>
            </fieldset>
          </form>
        </div>

        {/* Lista de Produtos Atualizada */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">Lista de Produtos</h2>
            {isLoading ? (<p className="text-center text-slate-500">Carregando...</p>) : (
                <div className="space-y-4">
                    {products.map((product) => (
                        <div key={product.id} className="grid grid-cols-3 md:grid-cols-5 gap-4 items-center p-4 bg-slate-50 border rounded-md">
                            <div className="col-span-3 md:col-span-2">
                                <p className="font-bold text-slate-800">{product.nome_produto}</p>
                                <p className="text-sm text-slate-600">ID: {product.id}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-500">Qtd.</p>
                                <p className="font-semibold text-slate-700">{product.quantidade}</p>
                            </div>
                             <div className="text-center">
                                <p className="text-xs text-slate-500">Preço</p>
                                <p className="font-semibold text-slate-700">R$ {Number(product.preco).toFixed(2)}</p>
                            </div>
                             <div className="text-center">
                                <p className="text-xs text-slate-500">Validade</p>
                                <p className="font-semibold text-slate-700">{new Date(product.validade).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                            </div>
                            <div className="col-span-3 md:col-span-5 flex justify-end gap-2 mt-2 md:mt-0">
                                <button onClick={() => setEditingProduct(product)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Editar</button>
                                <button onClick={() => handleDelete(product.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">Excluir</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </main>
    </div>
  );
}