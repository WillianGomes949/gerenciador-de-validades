// src/components/ProductListWithFilters.js
"use client";
import ProductItem from "../PoductItem"; // Verifique se o caminho está correto
import { useState, useMemo, useEffect } from 'react';

export default function ProductListSections({ products, isLoading, onEdit, onDelete }) {
  // NOVO ESTADO: para guardar a seção que está selecionada
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Podemos exibir menos itens por página para seções menores

  // 1. Agrupamos TODOS os produtos por seção, não apenas os da página atual.
  // Isso nos permite criar os botões de filtro para todas as seções existentes.
  const groupedProducts = useMemo(() => {
    return products.reduce((acc, product) => {
      const section = product.secao || 'Sem Seção';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(product);
      return acc;
    }, {});
  }, [products]); // A dependência agora é a lista completa de produtos

  const sectionNames = Object.keys(groupedProducts);

  // 2. Filtramos os produtos que devem ser exibidos com base na seção selecionada.
  const productsOfSelectedSection = useMemo(() => {
    if (!selectedSection) return []; // Se nenhuma seção estiver selecionada, a lista é vazia.
    return groupedProducts[selectedSection] || [];
  }, [selectedSection, groupedProducts]);

  // 3. A paginação agora é calculada com base na lista de produtos FILTRADA.
  const totalPages = Math.ceil(productsOfSelectedSection.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProductsToDisplay = productsOfSelectedSection.slice(indexOfFirstItem, indexOfLastItem);

  // EFEITO IMPORTANTE: Reseta a página para 1 sempre que uma nova seção é selecionada.
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSection]);

  const handleSectionClick = (sectionName) => {
    setSelectedSection(sectionName);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-slate-800">
      <h2 className="text-center sm:text-left text-2xl font-semibold text-slate-700 mb-4 dark:text-slate-200">
        Lista de Produtos
      </h2>

      {isLoading ? (
        <p className="text-center text-slate-500">Carregando...</p>
      ) : (
        <>
          {/* 4. Botões de Filtro por Seção */}
          <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-3">Filtrar por Seção:</h3>
            <div className="flex flex-wrap gap-2">
              {sectionNames.map(name => (
                <button
                  key={name}
                  onClick={() => handleSectionClick(name)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 
                    ${selectedSection === name 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
                    }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          
          {/* 5. Renderização Condicional dos Produtos */}
          {selectedSection ? (
            productsOfSelectedSection.length > 0 ? (
              <div className="space-y-4">
                {currentProductsToDisplay.map(product => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400">Nenhum produto encontrado nesta seção.</p>
            )
          ) : (
             <p className="text-center text-slate-500 dark:text-slate-400 py-8">Selecione uma seção acima para ver os produtos.</p>
          )}

          {/* 6. Controles da Paginação (só aparecem se uma seção for selecionada e tiver mais de uma página) */}
          {selectedSection && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-md disabled:opacity-50">Anterior</button>
              <span className="font-semibold dark:text-slate-200">Página {currentPage} de {totalPages}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-md disabled:opacity-50">Próxima</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}