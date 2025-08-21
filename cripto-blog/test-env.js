// Script para testar se as variáveis de ambiente estão sendo carregadas
// Execute: node test-env.js

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
config({ path: join(__dirname, '.env') });

console.log('🔍 Testando variáveis de ambiente...\n');

const apis = [
  { name: 'CoinMarketCap', key: process.env.VITE_COINMARKETCAP_API_KEY },
  { name: 'Finnhub', key: process.env.VITE_FINNHUB_API_KEY },
  { name: 'Hugging Face', key: process.env.VITE_HUGGINGFACE_API_KEY },
  { name: 'Crypto News', key: process.env.VITE_CRYPTONEWS_API_KEY }
];

apis.forEach(api => {
  const status = api.key && api.key !== 'demo' ? '✅ CONFIGURADA' : '❌ NÃO CONFIGURADA';
  const preview = api.key ? `${api.key.substring(0, 8)}...` : 'N/A';
  
  console.log(`${api.name}: ${status}`);
  console.log(`   Chave: ${preview}\n`);
});

console.log('📝 Para configurar as APIs:');
console.log('1. Copie env.example para .env');
console.log('2. Adicione suas chaves reais');
console.log('3. Reinicie o servidor: npm run dev'); 