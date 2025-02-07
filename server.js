const express = require('express');
const puppeteer = require('puppeteer'); // Переконайтеся, що у package.json зазначено "puppeteer"
const app = express();
const PORT = process.env.PORT || 3000;

// Додамо CORS-заголовки, щоб дозволити доступ з будь-якого домену
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // дозволяємо доступ для всіх доменів
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Ендпоінт, який використовує headless браузер для рендерингу сторінки
app.get('/render', async (req, res) => {
  const cadnum = req.query.cadnum;
  if (!cadnum) {
    return res.status(400).send("No cadnum provided");
  }
  
  // Формуємо URL до сторінки з kadastr.live
  const targetUrl = "https://kadastr.live/parcel/" + encodeURIComponent(cadnum);
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    // Завантаження сторінки та очікування завершення завантаження мережевих ресурсів
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    // Якщо потрібний елемент завантажується асинхронно, можна додатково чекати, наприклад:
    // await page.waitForSelector('div.col-md-8 table.table', { timeout: 10000 });

    // Отримуємо повністю відрендерений HTML (можна змінити логіку, щоб вибрати лише потрібну частину)
    const content = await page.evaluate(() => {
      // Повертаємо текстове наповнення всього body
      return document.body.innerText;
    });
    await browser.close();
    res.setHeader("Content-Type", "text/plain");
    res.send(content);
  } catch (error) {
    console.error("Error rendering page:", error);
    res.status(500).send("Error rendering page: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Headless render server listening on port ${PORT}`);
});
