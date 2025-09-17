"use client";
import { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/api';
import { Tooltip } from 'react-tooltip';

const INITIAL_FORM_STATE = { id: '', nome_produto: '', quantidade: '', preco: '', validade: '' };

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);

  const getValidadeStatus = (validadeStr) => {
    if (!validadeStr) return { cor: 'text-slate-500', texto: 'Sem data', tooltip: '' };
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const dataValidade = new Date(validadeStr+'T00:00:00');
    if (isNaN(dataValidade)) return { cor:'text-slate-500', texto:'Data inválida', tooltip:'' };
    const diffTime = dataValidade.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diffTime / (1000*60*60*24));
    let cor, texto;
    if(diasRestantes>30){cor='text-green-600 font-semibold'; texto=`Vence em ${diasRestantes} dias`}
    else if(diasRestantes>10){cor='text-orange-500 font-semibold'; texto=`Vence em ${diasRestantes} dias`}
    else if(diasRestantes>=0){
      cor='text-red-600 font-bold';
      if(diasRestantes===0) texto='VENCE HOJE!', cor+=' animate-pulse';
      else if(diasRestantes===1) texto='VENCE AMANHÃ!';
      else texto=`VENCE EM ${diasRestantes} DIAS!`;
    } else {cor='text-red-800 bg-red-100 p-1 rounded font-bold animate-pulse'; texto=`VENCIDO há ${Math.abs(diasRestantes)} dias`;}
    return { cor, texto, tooltip: dataValidade.toLocaleDateString() };
  };

  const sortProducts = (list) => [...list].sort((a,b)=>{
    const dateA=new Date(a.validade), dateB=new Date(b.validade);
    if(isNaN(dateA)) return 1; if(isNaN(dateB)) return -1;
    if(dateA-dateB!==0) return dateA-dateB;
    return b.quantidade-a.quantidade;
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(sortProducts(data));
    } catch(e){alert("Erro ao buscar produtos!"); console.error(e);}
    finally{setIsLoading(false);}
  };

  useEffect(()=>{fetchProducts()}, []);
  useEffect(()=>{setFormState(editingProduct?{...editingProduct, validade: editingProduct.validade?new Date(editingProduct.validade).toISOString().split('T')[0]:''}:INITIAL_FORM_STATE)}, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isSubmitting) return;
    setIsSubmitting(true);
    try{
      if(editingProduct){await updateProduct(formState);}
      else{await addProduct(formState);}
      setEditingProduct(null); fetchProducts();
    } catch(e){alert("Falha ao salvar produto!"); console.error(e);}
    finally{setIsSubmitting(false);}
  };

  const handleDelete = async (id) => {
    if(isSubmitting) return;
    if(!confirm("Deseja realmente excluir?")) return;
    setIsSubmitting(true);
    try{await deleteProduct(id); fetchProducts();}
    catch(e){alert("Falha ao excluir produto!"); console.error(e);}
    finally{setIsSubmitting(false);}
  };

  const handleInputChange = (e) => setFormState(prev=>({...prev,[e.target.name]:e.target.value}));

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold text-slate-800 text-center mb-8">Controle de Estoque Premium</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">{editingProduct?'Editar Produto':'Adicionar Novo Produto'}</h2>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="id" value={formState.id} onChange={handleInputChange} placeholder="ID (Código de Barras)" required disabled={!!editingProduct} className="p-3 border rounded-md disabled:bg-slate-200"/>
              <input type="text" name="nome_produto" value={formState.nome_produto} onChange={handleInputChange} placeholder="Nome do Produto" required className="p-3 border rounded-md"/>
              <input type="number" name="quantidade" value={formState.quantidade} onChange={handleInputChange} placeholder="Quantidade" required className="p-3 border rounded-md"/>
              <input type="number" name="preco" value={formState.preco} onChange={handleInputChange} placeholder="Preço" step="0.01" required className="p-3 border rounded-md"/>
              <input type="date" name="validade" value={formState.validade} onChange={handleInputChange} required className="p-3 border rounded-md"/>
              <div className="md:col-span-2 flex gap-4 mt-2">
                <button type="submit" className="flex-grow p-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                  {isSubmitting? 'Salvando...' : editingProduct?'Salvar Alterações':'Adicionar Produto'}
                </button>
                {editingProduct && <button type="button" onClick={()=>setEditingProduct(null)} className="p-3 bg-slate-500 text-white font-bold rounded-md hover:bg-slate-600">Cancelar</button>}
              </div>
            </fieldset>
          </form>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Lista de Produtos</h2>
          {isLoading?<p className="text-center text-slate-500">Carregando...</p>:
            <div className="space-y-4">
              {products.map(product=>{
                const status = getValidadeStatus(product.validade);
                return (
                  <div key={product.id} className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center p-4 bg-slate-50 border rounded-md hover:shadow-md transition-shadow">
                    <div className="col-span-2 md:col-span-2">
                      <p className="font-bold text-slate-800">{product.nome_produto}</p>
                      <p className="text-sm text-slate-600">ID: {product.id}</p>
                    </div>
                    <div className="text-center"><p className="text-xs text-slate-500">Qtd.</p><p className="font-semibold text-slate-700">{product.quantidade}</p></div>
                    <div className="text-center"><p className="text-xs text-slate-500">Preço</p><p className="font-semibold text-slate-700">R$ {Number(product.preco).toFixed(2)}</p></div>
                    <div className="text-center md:col-span-1"><p className="text-xs text-slate-500">Validade</p><p className={status.cor} data-tooltip-id={`tooltip-${product.id}`} data-tooltip-content={status.tooltip}>{status.texto}</p><Tooltip id={`tooltip-${product.id}`}/></div>
                    <div className="col-span-2 md:col-span-1 flex justify-end gap-2">
                      <button onClick={()=>setEditingProduct(product)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Editar</button>
                      <button onClick={()=>handleDelete(product.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">Excluir</button>
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </div>
      </main>
    </div>
  );
}
