import axios from 'axios';

const COINMARKETCAP_API_KEY = import.meta.env.VITE_COINMARKETCAP_API_KEY || 'demo'; // Usa variável de ambiente
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora em millisegundos
const CACHE_KEY_PREFIX = 'coinmarketcap_cache_';

// Funções de cache
const getCacheKey = (endpoint, params = {}) => {
  const paramString = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  return `${CACHE_KEY_PREFIX}${endpoint}${paramString ? `?${paramString}` : ''}`;
};

const saveToCache = (key, data) => {
  try {
    const cacheEntry = {
      data: data,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Erro ao salvar no cache:', error);
  }
};

const getFromCache = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const cacheEntry = JSON.parse(cached);
    if (Date.now() > cacheEntry.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return cacheEntry.data;
  } catch (error) {
    console.error('Erro ao ler do cache:', error);
    return null;
  }
};

const cleanExpiredCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        const cached = localStorage.getItem(key);
        if (cached) {
          const cacheEntry = JSON.parse(cached);
          if (Date.now() > cacheEntry.expiresAt) {
            localStorage.removeItem(key);
          }
        }
      }
    });
  } catch (error) {
    console.error('Erro ao limpar cache expirado:', error);
  }
};

export async function getCoinMarketCapData(limit = 20) {
  const cacheKey = getCacheKey('market_data', { limit });
  const cachedData = getFromCache(cacheKey);
  if (cachedData) return cachedData;

  try {
    cleanExpiredCache();
    const response = await axios.get('/api/coinmarketcap/cryptocurrency/listings/latest', {
      params: {
        limit: limit,
        convert: 'USD'
      }
    });

    const data = response.data.data.map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.quote.USD.price,
      change24h: coin.quote.USD.percent_change_24h,
      volume24h: coin.quote.USD.volume_24h,
      marketCap: coin.quote.USD.market_cap,
      cmcRank: coin.cmc_rank,
      lastUpdated: coin.last_updated
    }));

    saveToCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados do CoinMarketCap:', error);
    return [
      {
        id: 1,
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 45000.00,
        change24h: 2.5,
        volume24h: 25000000000,
        marketCap: 850000000000,
        cmcRank: 1,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Ethereum',
        symbol: 'ETH',
        price: 3200.00,
        change24h: -1.2,
        volume24h: 15000000000,
        marketCap: 380000000000,
        cmcRank: 2,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Binance Coin',
        symbol: 'BNB',
        price: 380.00,
        change24h: 0.8,
        volume24h: 2000000000,
        marketCap: 58000000000,
        cmcRank: 3,
        lastUpdated: new Date().toISOString()
      }
    ];
  }
}

export async function getCoinMarketCapCoinData(symbol) {
  const cacheKey = getCacheKey('coin_data', { symbol });
  const cachedData = getFromCache(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await axios.get('/api/coinmarketcap/cryptocurrency/quotes/latest', {
      params: {
        symbol: symbol,
        convert: 'USD'
      }
    });

    const coin = response.data.data[symbol];
    const data = {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.quote.USD.price,
      change24h: coin.quote.USD.percent_change_24h,
      volume24h: coin.quote.USD.volume_24h,
      marketCap: coin.quote.USD.market_cap,
      cmcRank: coin.cmc_rank,
      lastUpdated: coin.last_updated
    };

    saveToCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Erro ao buscar dados da moeda ${symbol}:`, error);
    return null;
  }
}

export async function getCoinMarketCapHistoricalData(symbol, timeStart, timeEnd) {
  const cacheKey = getCacheKey('historical_data', { symbol, timeStart, timeEnd });
  const cachedData = getFromCache(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await axios.get('/api/coinmarketcap/cryptocurrency/quotes/historical', {
      params: {
        symbol: symbol,
        time_start: timeStart,
        time_end: timeEnd,
        count: 100,
        interval: 'daily',
        convert: 'USD'
      }
    });

    const data = response.data.data.quotes.map(quote => ({
      timestamp: quote.timestamp,
      price: quote.quote.USD.price,
      volume: quote.quote.USD.volume_24h,
      marketCap: quote.quote.USD.market_cap
    }));

    saveToCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Erro ao buscar dados históricos de ${symbol}:`, error);
    return [];
  }
}

// Funções de gerenciamento de cache
export function clearAllCache() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('Cache limpo com sucesso');
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  }
}

export function getCacheInfo() {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX));
    
    const cacheInfo = {
      totalEntries: cacheKeys.length,
      expiredEntries: 0,
      totalSize: 0
    };

    cacheKeys.forEach(key => {
      const cached = localStorage.getItem(key);
      if (cached) {
        cacheInfo.totalSize += cached.length;
        const cacheEntry = JSON.parse(cached);
        if (Date.now() > cacheEntry.expiresAt) {
          cacheInfo.expiredEntries++;
        }
      }
    });

    return cacheInfo;
  } catch (error) {
    console.error('Erro ao obter informações do cache:', error);
    return { totalEntries: 0, expiredEntries: 0, totalSize: 0 };
  }
} 