// Script simples para verificar variáveis de ambiente
// Execute: node check-env.js

import { readFileSync } from 'fs'
import { join } from 'path'

function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env')
    const envContent = readFileSync(envPath, 'utf-8')
    const env = {}
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        env[key.trim()] = value.trim()
      }
    })
    
    return env
  } catch (error) {
    console.log('❌ Arquivo .env não encontrado!')
    return {}
  }
}

const env = loadEnv()

console.log('🔍 Verificando variáveis de ambiente...\n')

const apis = [
  { name: 'CoinMarketCap', key: env.VITE_COINMARKETCAP_API_KEY },
  { name: 'Finnhub', key: env.VITE_FINNHUB_API_KEY },
  { name: 'Hugging Face', key: env.VITE_HUGGINGFACE_API_KEY },
  { name: 'Crypto News', key: env.VITE_CRYPTONEWS_API_KEY }
]

apis.forEach(api => {
  const status = api.key && api.key !== 'demo' ? '✅ CONFIGURADA' : '❌ NÃO CONFIGURADA'
  const preview = api.key ? `${api.key.substring(0, 8)}...` : 'N/A'
  
  console.log(`${api.name}: ${status}`)
  console.log(`   Chave: ${preview}\n`)
})

if (!env.VITE_COINMARKETCAP_API_KEY || env.VITE_COINMARKETCAP_API_KEY === 'demo') {
  console.log('📝 Para configurar:')
  console.log('1. Copie env.example para .env')
  console.log('2. Adicione suas chaves reais')
  console.log('3. Reinicie o servidor: npm run dev')
} 