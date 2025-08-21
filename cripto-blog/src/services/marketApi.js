import axios from 'axios';
import { getCoinMarketCapData, getCoinMarketCapCoinData } from './coinmarketcapApi';

// Configuração para escolher entre APIs
const USE_COINMARKETCAP = true; // Mude para false para usar apenas CoinGecko
const COINMARKETCAP_LIMIT = 20; // Número de moedas a buscar do CoinMarketCap

export async function getCryptoMarket() {
  try {
    const data = await getCoinMarketCapData();
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados do mercado:', error);
    
    // Dados de exemplo mais robustos
    return [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 45000.00,
        change24h: 2.5,
        marketCap: 850000000000,
        volume24h: 25000000000,
        marketCapDominance: 52.3,
        cmcRank: 1
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3200.00,
        change24h: -1.2,
        marketCap: 380000000000,
        volume24h: 18000000000,
        marketCapDominance: 23.1,
        cmcRank: 2
      },
      {
        symbol: 'BNB',
        name: 'Binance Coin',
        price: 868.97,
        change24h: 4.62,
        marketCap: 130000000000,
        volume24h: 1200000000,
        marketCapDominance: 7.8,
        cmcRank: 3
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        price: 186.12,
        change24h: 2.93,
        marketCap: 75000000000,
        volume24h: 2100000000,
        marketCapDominance: 4.5,
        cmcRank: 4
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        price: 1.0001,
        change24h: -0.01,
        marketCap: 45000000000,
        volume24h: 8000000000,
        marketCapDominance: 2.7,
        cmcRank: 5
      },
      {
        symbol: 'ADA',
        name: 'Cardano',
        price: 0.52,
        change24h: -0.8,
        marketCap: 18000000000,
        volume24h: 450000000,
        marketCapDominance: 1.1,
        cmcRank: 6
      },
      {
        symbol: 'DOT',
        name: 'Polkadot',
        price: 7.85,
        change24h: 1.5,
        marketCap: 9500000000,
        volume24h: 320000000,
        marketCapDominance: 0.6,
        cmcRank: 7
      },
      {
        symbol: 'LINK',
        name: 'Chainlink',
        price: 15.23,
        change24h: 3.2,
        marketCap: 8500000000,
        volume24h: 280000000,
        marketCapDominance: 0.5,
        cmcRank: 8
      },
      {
        symbol: 'UNI',
        name: 'Uniswap',
        price: 8.45,
        change24h: -2.1,
        marketCap: 5100000000,
        volume24h: 150000000,
        marketCapDominance: 0.3,
        cmcRank: 9
      },
      {
        symbol: 'AVAX',
        name: 'Avalanche',
        price: 35.67,
        change24h: 5.8,
        marketCap: 12000000000,
        volume24h: 420000000,
        marketCapDominance: 0.7,
        cmcRank: 10
      },
      {
        symbol: 'MATIC',
        name: 'Polygon',
        price: 0.89,
        change24h: 1.2,
        marketCap: 8500000000,
        volume24h: 280000000,
        marketCapDominance: 0.5,
        cmcRank: 11
      },
      {
        symbol: 'XRP',
        name: 'XRP',
        price: 0.58,
        change24h: -0.5,
        marketCap: 31000000000,
        volume24h: 1200000000,
        marketCapDominance: 1.9,
        cmcRank: 12
      },
      {
        symbol: 'DOGE',
        name: 'Dogecoin',
        price: 0.082,
        change24h: 0.8,
        marketCap: 12000000000,
        volume24h: 380000000,
        marketCapDominance: 0.7,
        cmcRank: 13
      },
      {
        symbol: 'SHIB',
        name: 'Shiba Inu',
        price: 0.0000085,
        change24h: -1.5,
        marketCap: 5000000000,
        volume24h: 120000000,
        marketCapDominance: 0.3,
        cmcRank: 14
      },
      {
        symbol: 'LTC',
        name: 'Litecoin',
        price: 68.45,
        change24h: 0.3,
        marketCap: 4800000000,
        volume24h: 180000000,
        marketCapDominance: 0.3,
        cmcRank: 15
      }
    ];
  }
}

// Função para buscar dados do CoinGecko (fallback)
async function getCoinGeckoData() {
  try {
    const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,cardano,solana,polkadot&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true');
    
    return Object.keys(res.data).map(key => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      symbol: getSymbol(key),
      price: res.data[key].usd,
      change24h: res.data[key].usd_24h_change ? res.data[key].usd_24h_change.toFixed(2) : 0,
      volume24h: res.data[key].usd_24h_vol ? res.data[key].usd_24h_vol : 0,
      marketCap: res.data[key].usd_market_cap ? res.data[key].usd_market_cap : 0,
      cmcRank: null,
      lastUpdated: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Erro ao buscar dados de mercado:', error);
    // Retornando dados de exemplo em caso de erro
    return [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 45000,
        change24h: 2.5,
        volume24h: 25000000000,
        marketCap: 850000000000,
        cmcRank: 1,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        price: 3200,
        change24h: -1.2,
        volume24h: 15000000000,
        marketCap: 380000000000,
        cmcRank: 2,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ripple',
        name: 'Ripple',
        symbol: 'XRP',
        price: 0.85,
        change24h: 5.8,
        volume24h: 3000000000,
        marketCap: 45000000000,
        cmcRank: 3,
        lastUpdated: new Date().toISOString()
      }
    ];
  }
}

// Função auxiliar para obter símbolos das criptomoedas
function getSymbol(id) {
  const symbolMap = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'ripple': 'XRP',
    'cardano': 'ADA',
    'solana': 'SOL',
    'polkadot': 'DOT'
  };
  return symbolMap[id] || id.toUpperCase();
}

// Função para buscar dados históricos (últimos 7 dias)
export async function getHistoricalData(coinId, days = 7) {
  try {
    // Se estiver usando CoinMarketCap, tentar buscar dados específicos
    if (USE_COINMARKETCAP) {
      try {
        const symbol = getSymbol(coinId);
        const cmcData = await getCoinMarketCapCoinData(symbol);
        if (cmcData) {
          // Para dados históricos, usar CoinGecko como fallback
          // pois CoinMarketCap tem limitações no plano gratuito
          return await getCoinGeckoHistoricalData(coinId, days);
        }
      } catch (error) {
        console.log('Usando CoinGecko para dados históricos');
      }
    }
    
    return await getCoinGeckoHistoricalData(coinId, days);
  } catch (error) {
    console.error('Erro ao buscar dados históricos:', error);
    return [];
  }
}

// Função para buscar dados históricos do CoinGecko
async function getCoinGeckoHistoricalData(coinId, days = 7) {
  try {
    const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    
    return res.data.prices.map(price => ({
      date: new Date(price[0]),
      price: price[1]
    }));
  } catch (error) {
    console.error('Erro ao buscar dados históricos do CoinGecko:', error);
    return [];
  }
}

// Função para obter dados de uma criptomoeda específica
export async function getSpecificCoinData(symbol) {
  if (USE_COINMARKETCAP) {
    try {
      const cmcData = await getCoinMarketCapCoinData(symbol);
      if (cmcData) {
        return {
          id: cmcData.id.toString(),
          name: cmcData.name,
          symbol: cmcData.symbol,
          price: cmcData.price,
          change24h: cmcData.change24h,
          volume24h: cmcData.volume24h,
          marketCap: cmcData.marketCap,
          cmcRank: cmcData.cmcRank,
          lastUpdated: cmcData.lastUpdated
        };
      }
    } catch (error) {
      console.log('Usando CoinGecko para dados específicos');
    }
  }
  
  // Fallback para CoinGecko
  try {
    const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`);
    
    if (res.data[symbol.toLowerCase()]) {
      const data = res.data[symbol.toLowerCase()];
      return {
        id: symbol.toLowerCase(),
        name: symbol.charAt(0).toUpperCase() + symbol.slice(1).toLowerCase(),
        symbol: symbol.toUpperCase(),
        price: data.usd,
        change24h: data.usd_24h_change ? data.usd_24h_change.toFixed(2) : 0,
        volume24h: data.usd_24h_vol ? data.usd_24h_vol : 0,
        marketCap: data.usd_market_cap ? data.usd_market_cap : 0,
        cmcRank: null,
        lastUpdated: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Erro ao buscar dados específicos:', error);
  }
  
  return null;
} 