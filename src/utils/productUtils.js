// src/utils/productUtils.js

export const INITIAL_FORM_STATE = { id: '', nome_produto: '', quantidade: '', preco: '', validade: '' };

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
    cor = 'text-green-600 font-semibold';
    texto = `Vence em ${diasRestantes} dias`;
  } else if (diasRestantes > 10) {
    cor = 'text-orange-500 font-semibold';
    texto = `Vence em ${diasRestantes} dias`;
  } else if (diasRestantes >= 0) {
    cor = 'text-red-600 font-bold';
    if (diasRestantes === 0) {
      texto = 'Vence Hoje!';
      cor += ' animate-[bounce_0.8s_ease-in-out_infinite]';
    } else if (diasRestantes === 1) {
      texto = 'Vence Amanhã!';
    } else {
      texto = `Vence em ${diasRestantes} dias!`;
    }
  } else {
    cor = 'text-red-800 bg-red-100 p-1 rounded font-bold animate-pulse';
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