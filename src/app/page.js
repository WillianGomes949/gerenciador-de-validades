"use client";
import { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/api';

const INITIAL_FORM_STATE = { id: '', nome_produto: '', quantidade: '', preco: '', validade: '' };

// ===================================================================================
// NOVA FUNÇÃO UTILITÁRIA - A Solução Centralizada
// ===================================================================================
/**
 * Converte uma string de data (qualquer formato comum) para um objeto Date válido.
 * @param {string | Date} dateStr - A string de data (ex: '2025-09-17', '17/09/2025', ou um ISO completo).
 * @returns {Date | null} - Um objeto Date válido ou null se a conversão falhar.
 */
function parseDate(dateStr) {
  if (!dateStr) return null; // Retorna nulo se a entrada for vazia
  if (dateStr instanceof Date) return dateStr; // Se já for uma data, retorna ela mesma

  let date = new Date(dateStr); // Tenta o formato padrão (ISO) primeiro
  
  // Se a tentativa padrão falhar, tenta o formato DD/MM/AAAA
  if (isNaN(date.getTime())) {
    const parts = String(dateStr).split('T')[0].split('/');
    if (parts.length === 3) {
      // Remonta como AAAA-MM-DD
      const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      date = new Date(isoDate);
    }
  }

  // Retorna a data válida ou null se todas as tentativas falharem
  return isNaN(date.getTime()) ? null : date;
}

// ===================================================================================
// SEU COMPONENTE HomePage - Completo e usando a nova função parseDate
// ===================================================================================
export default function HomePage() {
  // --- Estados do Componente ---
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);

  // --- Funções de Lógica ---
  const getValidadeStatus = (validadeStr) => {
    const dataValidade = parseDate(validadeStr);

    if (!dataValidade) {
      return { cor: 'text-slate-500', texto: 'Data inválida', title: `Formato original não reconhecido: ${validadeStr || 'vazio'}` };
    }
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const diffTime = dataValidade.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const title = `Data de Validade: ${dataValidade.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`;
    let cor, texto;
    
    if (diasRestantes > 30) {
      cor = 'text-green-600 font-semibold';
      texto = `Vence em ${diasRestantes} dias`;
    } else if (diasRestantes > 10) {
      cor = 'text-orange-500 font-semibold';
      texto = `Vence em ${diasRestantes} dias`;
    } else if (diasRestantes >= 0) {
      cor = 'text-red-600 font-semibold';
      if (diasRestantes === 0) {
        texto = 'Vence Hoje!';
        cor += ' animate-pulse font-semibold';
      } else if (diasRestantes === 1) {
        texto = 'Vence amanhã!';
      } else {
        texto = `Vence em ${diasRestantes} dias!`;
      }
    } else {
      cor = 'text-red-800 bg-red-100 p-1 rounded font-semibold animate-pulse';
      texto = `VENCIDO há ${Math.abs(diasRestantes)} dias`;
    }
    return { cor, texto, title }; 
  };
  
  const sortProducts = (list) => {
    return [...list].sort((a, b) => {
      const dateA = parseDate(a.validade);
      const dateB = parseDate(b.validade);

      if (!dateA) return 1;
      if (!dateB) return -1;
      
      if (dateA - dateB !== 0) return dateA - dateB;
      
      return b.quantidade - a.quantidade;
    });
  };

  // --- Funções de Interação com a API (Handlers) ---
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(formState);
      } else {
        await addProduct(formState);
      }
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

  const handleInputChange = (e) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- Efeitos (Lifecycle) ---
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      const dateObj = parseDate(editingProduct.validade);
      const formattedDate = dateObj ? dateObj.toISOString().split('T')[0] : '';
      setFormState({ ...editingProduct, validade: formattedDate });
    } else {
      setFormState(INITIAL_FORM_STATE);
    }
  }, [editingProduct]);

  // --- Renderização do Componente (JSX) ---
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold text-slate-800 text-center mb-8">Controle de Estoque</h1>
        
        {/* Formulário de Adição/Edição */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="id" value={formState.id} onChange={handleInputChange} placeholder="ID (Código de Barras)" required disabled={!!editingProduct} className="p-3 border rounded-md disabled:bg-slate-200"/>
              <input type="text" name="nome_produto" value={formState.nome_produto} onChange={handleInputChange} placeholder="Nome do Produto" required className="p-3 border rounded-md"/>
              <input type="number" name="quantidade" value={formState.quantidade} onChange={handleInputChange} placeholder="Quantidade" required className="p-3 border rounded-md"/>
              <input type="number" name="preco" value={formState.preco} onChange={handleInputChange} placeholder="Preço (ex: 9.99)" step="0.01" required className="p-3 border rounded-md"/>
              <input type="date" name="validade" value={formState.validade} onChange={handleInputChange} required className="p-3 border rounded-md"/>
              <div className="md:col-span-2 flex gap-4 mt-2">
                <button type="submit" className="flex-grow p-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                  {isSubmitting ? 'Salvando...' : (editingProduct ? 'Salvar Alterações' : 'Adicionar Produto')}
                </button>
                {editingProduct && <button type="button" onClick={() => setEditingProduct(null)} className="p-3 bg-slate-500 text-white font-bold rounded-md hover:bg-slate-600">Cancelar</button>}
              </div>
            </fieldset>
          </form>
        </div>

        {/* Lista de Produtos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Lista de Produtos</h2>
          {isLoading ? <p className="text-center text-slate-500">Carregando...</p> : (
            <div className="space-y-4">
              {products.map(product => {
                const status = getValidadeStatus(product.validade);
                return (
                  <div key={product.id} className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center p-4 bg-slate-50 border rounded-md hover:shadow-md transition-shadow">
                    <div className="col-span-2 md:col-span-2">
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
                    <div className="text-center md:col-span-1">
                      <p className="text-xs text-slate-500">Validade</p>
                      <p className={status.cor} title={status.title}>
                        {status.texto}
                      </p>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex justify-end gap-2">
                      <button onClick={() => setEditingProduct(product)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Editar</button>
                      <button onClick={() => handleDelete(product.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">Excluir</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}