const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/user/api',
    createProxyMiddleware({
      target: 'http://localhost:3080',
      changeOrigin: false,
    })
  );
};