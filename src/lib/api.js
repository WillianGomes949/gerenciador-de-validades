// lib/api.js

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzwjIRJrTbLZHWRl9nnQdJ7I-KAd_ytRHpl0RwYi55tfby62Ox3RWN_rOGcHpDM5GTQ/exec";
async function postToAction(action, data) {
    const response = await fetch(SCRIPT_URL, {
        
        method: 'POST',
        // O corpo da requisição é redirecionado para evitar problemas de CORS com Apps Script
        redirect: "follow", 
        body: JSON.stringify({ action, data }),
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        }
    });
    if (!response.ok) {
        throw new Error(`Falha na ação: ${action}`);
    }
    return response.json();
}

// Busca os produtos
export async function getProducts() {
  const response = await fetch(SCRIPT_URL);
  if (!response.ok) throw new Error('Falha ao buscar dados.');
  return response.json();
}

// Adiciona um novo produto
export async function addProduct(newProduct) {
  // O ID agora virá do formulário, então não geramos mais um aqui
  return postToAction('ADD', newProduct);
}

// Atualiza um produto
export async function updateProduct(productData) {
  return postToAction('UPDATE', productData);
}

// Deleta um produto
export async function deleteProduct(productId) {
  return postToAction('DELETE', { id: productId });
}