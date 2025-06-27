// api/proxy.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Imposta qui i CORS header
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    console.log("Proxy riceve:", req.body);

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxrVxuiSRrsevbSXW9xx-tfiNuLUyqBc7tX3KzZ1ZJRrgtauUZ3zkSYMJGzFfQMk5C0/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    const text = await response.text();
    console.log("GAS risponde (raw):", text);

    res.status(response.status).send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: err.toString() });
  }
}
