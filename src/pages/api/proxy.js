
export default async function handler(req, res) {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzwjIRJrTbLZHWRl9nnQdJ7I-KAd_ytRHpl0RwYi55tfby62Ox3RWN_rOGcHpDM5GTQ/exec";

  const fetchOptions = {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
  };

  try {
    const response = await fetch(SCRIPT_URL, fetchOptions);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}
