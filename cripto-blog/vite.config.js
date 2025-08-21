import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { join } from 'path'

// Função para carregar variáveis de ambiente manualmente
function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env')
    console.log('📁 Tentando carregar .env de:', envPath)
    const envContent = readFileSync(envPath, 'utf-8')
    const env = {}
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        env[key.trim()] = value.trim()
      }
    })
    
    console.log('✅ Arquivo .env carregado com sucesso')
    console.log('🔑 Variáveis encontradas:', Object.keys(env).filter(k => k.startsWith('VITE_')))
    return env
  } catch (error) {
    console.log('❌ Erro ao carregar .env:', error.message)
    console.log('⚠️ Usando variáveis do sistema')
    return process.env
  }
}

const env = loadEnv()

// Log das variáveis de ambiente
console.log('\n🔍 Status das APIs:')
console.log('CoinMarketCap:', env.VITE_COINMARKETCAP_API_KEY ? '✅ Configurada' : '❌ Não configurada')
console.log('Finnhub:', env.VITE_FINNHUB_API_KEY ? '✅ Configurada' : '❌ Não configurada')
console.log('Hugging Face:', env.VITE_HUGGINGFACE_API_KEY ? '✅ Configurada' : '❌ Não configurada')
console.log('Crypto News:', env.VITE_CRYPTONEWS_API_KEY ? '✅ Configurada' : '❌ Não configurada')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para Crypto News API (SEM CHAVE - usando dados de exemplo)
      '/api/cryptonews': {
        target: 'https://cryptonews-api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cryptonews/, '/api/v1'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🌐 Proxy Crypto News acionado:', req.url)
            const apiKey = env.VITE_CRYPTONEWS_API_KEY;
            
            if (apiKey && apiKey !== 'demo') {
              const url = new URL(req.url, 'http://localhost');
              url.searchParams.set('token', apiKey);
              proxyReq.path = url.pathname + url.search;
              console.log('🔑 Usando API key real para Crypto News');
            } else {
              console.log('⚠️ Crypto News API: SEM CHAVE - usando dados de exemplo');
            }
          });
        }
      },
      // Proxy para CoinMarketCap API (COM CHAVE - API REAL)
      '/api/coinmarketcap': {
        target: 'https://pro-api.coinmarketcap.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coinmarketcap/, '/v1'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🌐 Proxy CoinMarketCap acionado:', req.url)
            const apiKey = env.VITE_COINMARKETCAP_API_KEY;
            
            if (apiKey && apiKey !== 'demo') {
              proxyReq.setHeader('X-CMC_PRO_API_KEY', apiKey);
              console.log('🔑 Usando API key real para CoinMarketCap:', apiKey.substring(0, 8) + '...');
            } else {
              proxyReq.setHeader('X-CMC_PRO_API_KEY', 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c');
              console.log('⚠️ CoinMarketCap: SEM CHAVE - usando dados de exemplo');
            }
          });
        }
      },
      // Proxy para Finnhub API (COM CHAVE - API REAL)
      '/api/finnhub': {
        target: 'https://finnhub.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/finnhub/, '/api/v1'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🌐 Proxy Finnhub acionado:', req.url)
            const apiKey = env.VITE_FINNHUB_API_KEY;
            
            if (apiKey && apiKey !== 'demo') {
              // Adicionar token como query parameter
              const url = new URL(req.url, 'http://localhost');
              if (!url.searchParams.has('token')) {
                url.searchParams.set('token', apiKey);
              }
              proxyReq.path = url.pathname + url.search;
              console.log('🔑 Usando API key real para Finnhub:', apiKey.substring(0, 8) + '...');
              console.log('🔗 URL final:', proxyReq.path);
            } else {
              // Adicionar token demo como fallback
              const url = new URL(req.url, 'http://localhost');
              if (!url.searchParams.has('token')) {
                url.searchParams.set('token', 'demo');
              }
              proxyReq.path = url.pathname + url.search;
              console.log('⚠️ Finnhub: SEM CHAVE - usando dados de exemplo');
              console.log('🔗 URL final:', proxyReq.path);
            }
          });
        }
      },
      // Proxy para Hugging Face API (COM CHAVE - API REAL)
      '/api/huggingface': {
        target: 'https://api-inference.huggingface.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/huggingface/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🌐 Proxy Hugging Face acionado:', req.url)
            const apiKey = env.VITE_HUGGINGFACE_API_KEY;
            
            if (apiKey && apiKey !== 'demo') {
              proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
              console.log('🔑 Usando API key real para Hugging Face:', apiKey.substring(0, 8) + '...');
            } else {
              proxyReq.setHeader('Authorization', 'Bearer hf_demo');
              console.log('⚠️ Hugging Face: SEM CHAVE - usando dados de exemplo');
            }
            proxyReq.setHeader('Content-Type', 'application/json');
          });
        }
      }
    }
  }
})
