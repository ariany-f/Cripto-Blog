import axios from 'axios';
import { getCoinMarketCapData, getCoinMarketCapCoinData } from './coinmarketcapApi';

// Configuração para escolher entre APIs
const USE_COINMARKETCAP = true; // Mude para false para usar apenas CoinGecko
const COINMARKETCAP_LIMIT = 20; // Número de moedas a buscar do CoinMarketCap

export async function getCryptoMarket() {
  if (USE_COINMARKETCAP) {
    try {
      // Tentar usar CoinMarketCap primeiro
      const cmcData = await getCoinMarketCapData(COINMARKETCAP_LIMIT);
      return cmcData.map(coin => ({
        id: coin.id.toString(),
        name: coin.name,
        symbol: coin.symbol,
        price: coin.price,
        change24h: coin.change24h,
        volume24h: coin.volume24h,
        marketCap: coin.marketCap,
        cmcRank: coin.cmcRank,
        lastUpdated: coin.lastUpdated
      }));
    } catch (error) {
      console.error('Erro ao buscar dados do CoinMarketCap, usando CoinGecko como fallback:', error);
      // Fallback para CoinGecko
      return await getCoinGeckoData();
    }
  } else {
    // Usar apenas CoinGecko
    return await getCoinGeckoData();
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