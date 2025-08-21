import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para Crypto News API
      '/api/cryptonews': {
        target: 'https://cryptonews-api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cryptonews/, '/api/v1'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Adicionar token como query parameter
            const url = new URL(req.url, 'http://localhost');
            if (!url.searchParams.has('token')) {
              url.searchParams.set('token', process.env.VITE_CRYPTONEWS_API_KEY || 'demo');
              proxyReq.path = url.pathname + url.search;
            }
          });
        }
      },
      // Proxy para CoinMarketCap API
      '/api/coinmarketcap': {
        target: 'https://pro-api.coinmarketcap.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coinmarketcap/, '/v1'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Adicionar header de autorização
            proxyReq.setHeader('X-CMC_PRO_API_KEY', process.env.VITE_COINMARKETCAP_API_KEY || 'demo');
          });
        }
      },
      // Proxy para Finnhub API
      '/api/finnhub': {
        target: 'https://finnhub.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/finnhub/, '/api/v1'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Adicionar token como query parameter
            const url = new URL(req.url, 'http://localhost');
            if (!url.searchParams.has('token')) {
              url.searchParams.set('token', process.env.VITE_FINNHUB_API_KEY || 'demo');
              proxyReq.path = url.pathname + url.search;
            }
          });
        }
      },
      // Proxy para Hugging Face API
      '/api/huggingface': {
        target: 'https://api-inference.huggingface.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/huggingface/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Adicionar header de autorização
            proxyReq.setHeader('Authorization', `Bearer ${process.env.VITE_HUGGINGFACE_API_KEY || 'hf_demo'}`);
            proxyReq.setHeader('Content-Type', 'application/json');
          });
        }
      }
    }
  }
})
