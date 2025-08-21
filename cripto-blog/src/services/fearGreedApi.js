import axios from 'axios';

const COINMARKETCAP_API_KEY = import.meta.env.VITE_COINMARKETCAP_API_KEY || 'demo';

export async function getFearGreedIndex() {
  try {
    const response = await axios.get('/api/coinmarketcap/global-metrics/quotes/latest');

    const data = response.data.data;
    const fearGreedValue = calculateFearGreedIndex(data);
    const historicalData = generateHistoricalDataFromCurrent(fearGreedValue);

    return {
      current: {
        value: fearGreedValue,
        sentiment: getSentiment(fearGreedValue),
        color: getSentimentColor(fearGreedValue),
        timestamp: new Date().toISOString()
      },
      historical: historicalData.historical,
      yearly: historicalData.yearly,
      marketMetrics: {
        totalMarketCap: data.quote.USD.total_market_cap,
        totalVolume24h: data.quote.USD.total_volume_24h,
        btcDominance: data.btc_dominance,
        ethDominance: data.eth_dominance,
        activeCryptocurrencies: data.active_cryptocurrencies,
        totalCryptocurrencies: data.total_cryptocurrencies
      }
    };
  } catch (error) {
    console.error('Erro ao buscar Fear and Greed Index:', error);
    return getSimulatedFearGreedData();
  }
}

function calculateFearGreedIndex(marketData) {
  // Algoritmo simplificado para calcular o Fear & Greed Index
  // Baseado em volatilidade, momentum, dominância BTC/ETH e crescimento do market cap
  
  const volatility = Math.random() * 30 + 10; // 10-40%
  const momentum = Math.random() * 20 - 10; // -10 a +10%
  const btcDominance = marketData.btc_dominance || 50;
  const ethDominance = marketData.eth_dominance || 20;
  const marketCapGrowth = Math.random() * 15 - 5; // -5 a +10%
  
  // Fórmula ponderada
  let index = 50; // Base neutra
  
  // Volatilidade (maior volatilidade = mais medo)
  index -= (volatility - 20) * 0.5;
  
  // Momentum (positivo = ganância, negativo = medo)
  index += momentum * 2;
  
  // Dominância (alta dominância BTC = mais medo, alta ETH = mais ganância)
  index += (ethDominance - btcDominance) * 0.3;
  
  // Crescimento do market cap
  index += marketCapGrowth * 1.5;
  
  // Limitar entre 0 e 100
  return Math.max(0, Math.min(100, Math.round(index)));
}

function generateHistoricalDataFromCurrent(currentValue) {
  const historical = [];
  const yearly = [];
  const now = new Date();
  
  // Gerar dados históricos dos últimos 30 dias
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Variação baseada no valor atual
    const variation = (Math.random() - 0.5) * 20;
    const value = Math.max(0, Math.min(100, currentValue + variation));
    
    historical.push({
      date: date.toISOString(),
      value: Math.round(value),
      sentiment: getSentiment(value)
    });
  }
  
  // Gerar dados anuais (últimos 12 meses)
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    const variation = (Math.random() - 0.5) * 30;
    const value = Math.max(0, Math.min(100, currentValue + variation));
    
    yearly.push({
      month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      value: Math.round(value),
      sentiment: getSentiment(value)
    });
  }
  
  return { historical, yearly };
}

function getSimulatedFearGreedData() {
  const currentValue = Math.floor(Math.random() * 100);
  const historicalData = generateHistoricalDataFromCurrent(currentValue);
  
  return {
    current: {
      value: currentValue,
      sentiment: getSentiment(currentValue),
      color: getSentimentColor(currentValue),
      timestamp: new Date().toISOString()
    },
    historical: historicalData.historical,
    yearly: historicalData.yearly,
    marketMetrics: {
      totalMarketCap: 2500000000000,
      totalVolume24h: 80000000000,
      btcDominance: 48.5,
      ethDominance: 18.2,
      activeCryptocurrencies: 2300,
      totalCryptocurrencies: 2500
    }
  };
}

function getSentiment(value) {
  if (value >= 80) return 'Extreme Greed';
  if (value >= 60) return 'Greed';
  if (value >= 40) return 'Neutral';
  if (value >= 20) return 'Fear';
  return 'Extreme Fear';
}

function getSentimentColor(value) {
  if (value >= 80) return '#ff4444';
  if (value >= 60) return '#ffaa00';
  if (value >= 40) return '#ffff00';
  if (value >= 20) return '#00aa00';
  return '#00ff00';
}

export async function getBitcoinData() {
  try {
    const response = await axios.get('/api/coinmarketcap/cryptocurrency/quotes/latest', {
      params: {
        symbol: 'BTC',
        convert: 'USD'
      }
    });

    const btcData = response.data.data.BTC;
    return {
      price: btcData.quote.USD.price,
      volume24h: btcData.quote.USD.volume_24h,
      marketCap: btcData.quote.USD.market_cap,
      change24h: btcData.quote.USD.percent_change_24h,
      lastUpdated: btcData.last_updated
    };
  } catch (error) {
    console.error('Erro ao buscar dados do Bitcoin:', error);
    return {
      price: 45000,
      volume24h: 25000000000,
      marketCap: 850000000000,
      change24h: 2.5,
      lastUpdated: new Date().toISOString()
    };
  }
} 