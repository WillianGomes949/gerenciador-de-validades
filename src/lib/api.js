const SCRIPT_URL = "/api/proxy";

// Função genérica para POST
async function postToAction(action, data) {
  const response = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha na ação: ${action}. Resposta: ${errorText}`);
  }

  const responseText = await response.text();
  return responseText ? JSON.parse(responseText) : { status: "success", message: "Operação realizada com sucesso." };
}

// GET produtos
export async function getProducts() {
  const response = await fetch(SCRIPT_URL);
  if (!response.ok) throw new Error("Falha ao buscar produtos.");
  return response.json();
}

// Funções CRUD
export async function addProduct(newProduct) {
  return postToAction("ADD", newProduct);
}

export async function updateProduct(productData) {
  return postToAction("UPDATE", productData);
}

export async function deleteProduct(productId) {
  return postToAction("DELETE", { id: productId });
}
