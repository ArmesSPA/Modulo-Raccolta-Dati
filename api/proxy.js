import fetch from 'node-fetch';

export default async function handler(req, res) {
  const url = 'https://script.google.com/macros/s/AKfycbxrVxuiSRrsevbSXW9xx-tfiNuLUyqBc7tX3KzZ1ZJRrgtauUZ3zkSYMJGzFfQMk5C0/exec';
  
  const response = await fetch(url, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
  });
  
  const data = await response.text();
  res.status(200).send(data);
}
