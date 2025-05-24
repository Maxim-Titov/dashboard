const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Target-IP'],
}));

// Проксі-кеш: зберігаємо проксі по IP
const proxyCache = {};

app.use('/api', (req, res, next) => {
  const ip = req.headers['x-target-ip'];
  if (!ip) {
    return res.status(400).json({ error: 'X-Target-IP header is required' });
  }

  if (!proxyCache[ip]) {
    console.log(`[HPM] Creating new proxy for IP: ${ip}`);
    proxyCache[ip] = createProxyMiddleware({
      target: `http://${ip}:3001`,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
      onProxyReq: (proxyReq, req) => {
        proxyReq.removeHeader('Origin');
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(502).json({ error: 'Bad Gateway' });
      }
    });
  }

  proxyCache[ip](req, res, next);
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});
