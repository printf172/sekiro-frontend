const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/sekiro-api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:5612',
      changeOrigin: true,
      pathRewrite: {
        "^/sekiro-api": "/sekiro-api"
      }
    })
  );
};
