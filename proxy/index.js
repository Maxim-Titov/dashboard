const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Дозволити CORS (заміни origin на свій фронт якщо хочеш обмежити)
app.use(cors({
  origin: '*', // Або: 'https://dashboard-0ucl.onrender.com'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Target-IP'],
}));

// Проксі маршрут
app.use('/api', (req, res, next) => {
  const ip = req.headers['x-target-ip'];

  if (!ip) {
    return res.status(400).json({ error: 'X-Target-IP header is required' });
  }

  // Створюємо новий middleware-проксі для кожного запиту
  const proxy = createProxyMiddleware({
    target: `http://${ip}:3001`,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    onProxyReq: (proxyReq, req) => {
      // Не пересилати зайві заголовки
      proxyReq.removeHeader('Origin');
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(502).json({ error: 'Bad Gateway. Check target IP or server availability.' });
    }
  });

  proxy(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}`);
});
