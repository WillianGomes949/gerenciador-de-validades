const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyNErWAa1-Wkg7tOMW-em3Jc2C8BIdESMa2Z6G1heqR6KJJdDjJ2e8hVVU-ZW3o0Hmc/exec";

async function postToAction(action, data) {
  if (!action || !data) throw new Error("Ação e dados são obrigatórios.");
  
  const response = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data }),
    redirect: "follow",
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Falha na ação ${action}: ${responseText || "Erro desconhecido"}`);
  }

  return responseText ? JSON.parse(responseText) : { status: "success", data };
}

export async function getProducts() {
  const response = await fetch(SCRIPT_URL, { redirect: "follow" });
  if (!response.ok) throw new Error("Falha ao buscar produtos.");
  return response.json();
}

export const addProduct = (product) => postToAction("ADD", product);
export const updateProduct = (product) => postToAction("UPDATE", product);
export const deleteProduct = (productId) => postToAction("DELETE", { id: productId });
