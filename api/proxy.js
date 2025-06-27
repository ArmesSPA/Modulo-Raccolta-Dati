import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const response = await fetch("https://script.google.com/macros/s/AKfycbxrVxuiSRrsevbSXW9xx-tfiNuLUyqBc7tX3KzZ1ZJRrgtauUZ3zkSYMJGzFfQMk5C0/exec", {
      method: "POST",
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
      },
      body: req.body,
    });

    const data = await response.text();

    if (!response.ok) {
      return res.status(response.status).send(data);
    }

    res.status(200).send(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
