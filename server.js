// server.js
const express = require('express');
const fetch = require('node-fetch'); // Якщо використовуєте Node.js < 18. Для Node.js 18+ fetch доступний глобально.
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('No url specified');
  }
  try {
    const response = await fetch(targetUrl);
    const text = await response.text();
    res.set('Content-Type', 'text/html');
    res.send(text);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching target URL');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
