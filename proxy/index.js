const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Проксі, який читає IP з заголовка
app.use('/api', (req, res, next) => {
  const ip = req.headers['x-target-ip'];

  if (!ip) {
    return res.status(400).json({ error: 'X-Target-IP header is required' });
  }

  const proxy = createProxyMiddleware({
    target: `http://${ip}:3001`,
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
  });

  proxy(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}`);
});
