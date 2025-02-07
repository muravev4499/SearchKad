const express = require('express');
const fetch = require('node-fetch'); // Якщо потрібно
const app = express();
const PORT = process.env.PORT || 3000;

// Додаємо middleware для CORS
app.use((req, res, next) => {
  // Дозволяємо доступ з будь-якого домену
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Дозволяємо певні методи
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  // Дозволяємо певні заголовки
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Ваш існуючий маршрут для проксі
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('No url specified');
  }
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      },
      redirect: 'follow'
    });
    const text = await response.text();
    res.set('Content-Type', 'text/html');
    res.send(text);
  } catch (error) {
    console.error("Error fetching URL:", error);
    res.status(500).send('Error fetching target URL');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
