
export default async function handler(req, res) {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxwxtpOv_t2OJEMMtt4FEksjC49HYW5TiMMmzsN2aqR6WWCuPWHnlCebBV3Ag9XY6m4/exec";

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
