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
            const apiKey = process.env.VITE_CRYPTONEWS_API_KEY;
            
            if (!url.searchParams.has('token')) {
              if (apiKey && apiKey !== 'demo') {
                url.searchParams.set('token', apiKey);
                console.log('🔑 Usando API key real para Crypto News');
              } else {
                url.searchParams.set('token', 'demo');
                console.log('⚠️ Usando token demo para Crypto News - configure VITE_CRYPTONEWS_API_KEY');
              }
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
            const apiKey = process.env.VITE_COINMARKETCAP_API_KEY;
            
            if (apiKey && apiKey !== 'demo') {
              proxyReq.setHeader('X-CMC_PRO_API_KEY', apiKey);
              console.log('🔑 Usando API key real para CoinMarketCap');
            } else {
              proxyReq.setHeader('X-CMC_PRO_API_KEY', 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'); // Token de exemplo
              console.log('⚠️ Usando token de exemplo para CoinMarketCap - configure VITE_COINMARKETCAP_API_KEY');
            }
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
            const apiKey = process.env.VITE_FINNHUB_API_KEY;
            
            if (!url.searchParams.has('token')) {
              if (apiKey && apiKey !== 'demo') {
                url.searchParams.set('token', apiKey);
                console.log('🔑 Usando API key real para Finnhub');
              } else {
                url.searchParams.set('token', 'demo');
                console.log('⚠️ Usando token demo para Finnhub - configure VITE_FINNHUB_API_KEY');
              }
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
            const apiKey = process.env.VITE_HUGGINGFACE_API_KEY;
            
            if (apiKey && apiKey !== 'demo') {
              proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
              console.log('🔑 Usando API key real para Hugging Face');
            } else {
              proxyReq.setHeader('Authorization', 'Bearer hf_demo');
              console.log('⚠️ Usando token demo para Hugging Face - configure VITE_HUGGINGFACE_API_KEY');
            }
            proxyReq.setHeader('Content-Type', 'application/json');
          });
        }
      }
    }
  }
})
