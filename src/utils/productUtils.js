// src/utils/productUtils.js

export const INITIAL_FORM_STATE = { id: '', nome_produto: '', quantidade: '', preco: '', validade: '', secao: '' };

export function parseDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;

  let date = new Date(dateStr);
  
  if (isNaN(date.getTime())) {
    const parts = String(dateStr).split('T')[0].split('/');
    if (parts.length === 3) {
      const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      date = new Date(isoDate);
    }
  }
  return isNaN(date.getTime()) ? null : date;
}

export const getValidadeStatus = (validadeStr) => {
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
    cor = 'text-green-600 bg-green-100 p-1 rounded font-bold';
    texto = `Vence em ${diasRestantes} dias`;
  } else if (diasRestantes > 10) {
    cor = 'text-orange-500 bg-orange-100 p-1 rounded font-bold';
    texto = `Vence em ${diasRestantes} dias`;
  } else if (diasRestantes >= 0) {
    cor = 'text-red-600 font-bold';
    if (diasRestantes === 0) {
      texto = 'Vence Hoje!';
      cor += ' bg-red-100 p-1 rounded animate-pulse';
    } else if (diasRestantes === 1) {
      texto = 'Vence Amanhã!';
      cor += ' bg-red-100 p-1 rounded';
    } else {
      cor += ' bg-red-100 p-1 rounded';
      texto = `Vence em ${diasRestantes} dias!`;
    }
  } else {
    cor = 'text-violet-800 bg-violet-100 p-1 rounded font-bold';
    texto = `Vencido há ${Math.abs(diasRestantes)} dias`;
  }
  return { cor, texto, title }; 
};

export const sortProducts = (list) => {
  return [...list].sort((a, b) => {
    const dateA = parseDate(a.validade);
    const dateB = parseDate(b.validade);

    if (!dateA) return 1;
    if (!dateB) return -1;
    
    if (dateA - dateB !== 0) return dateA - dateB;
    
    return b.quantidade - a.quantidade;
  });
};