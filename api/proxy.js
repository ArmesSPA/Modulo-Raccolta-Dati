export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxrVxuiSRrsevbSXW9xx-tfiNuLUyqBc7tX3KzZ1ZJRrgtauUZ3zkSYMJGzFfQMk5C0/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body), // 🔥 CORRETTO QUI
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
