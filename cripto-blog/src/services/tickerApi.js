import axios from 'axios';

export async function getTickerData() {
  try {
    const response = await axios.get('/api/coinmarketcap/cryptocurrency/listings/latest?limit=10&convert=USD');
    return response.data.data.map(coin => ({
      symbol: coin.symbol,
      price: coin.quote.USD.price,
      change24h: coin.quote.USD.percent_change_24h
    }));
  } catch (error) {
    console.error('Erro ao buscar dados do ticker:', error);
    
    // Dados de exemplo mais robustos
    return [
      { symbol: 'BTC', price: 45000.00, change24h: 2.5 },
      { symbol: 'ETH', price: 3200.00, change24h: -1.2 },
      { symbol: 'BNB', price: 868.97, change24h: 4.62 },
      { symbol: 'SOL', price: 186.12, change24h: 2.93 },
      { symbol: 'ADA', price: 0.52, change24h: -0.8 },
      { symbol: 'DOT', price: 7.85, change24h: 1.5 },
      { symbol: 'LINK', price: 15.23, change24h: 3.2 },
      { symbol: 'UNI', price: 8.45, change24h: -2.1 },
      { symbol: 'AVAX', price: 35.67, change24h: 5.8 },
      { symbol: 'MATIC', price: 0.89, change24h: 1.2 },
      { symbol: 'XRP', price: 0.58, change24h: -0.5 },
      { symbol: 'DOGE', price: 0.082, change24h: 0.8 },
      { symbol: 'SHIB', price: 0.0000085, change24h: -1.5 },
      { symbol: 'LTC', price: 68.45, change24h: 0.3 },
      { symbol: 'BCH', price: 245.67, change24h: 1.8 }
    ];
  }
}

function getCoinIcon(symbol) {
  const iconMap = {
    'BTC': '₿',
    'ETH': 'Ξ',
    'BNB': '🟡',
    'SOL': '🟣',
    'USDC': '🔵',
    'DOGE': '🐕',
    'TRX': '🔴',
    'ADA': '❄️',
    'LINK': '🔗',
    'XRP': '⚡',
    'DOT': '🔴',
    'MATIC': '🟣',
    'AVAX': '🔴',
    'UNI': '🦄',
    'LTC': '⚡',
    'BCH': '₿',
    'XLM': '⭐',
    'ATOM': '⚛️',
    'FTT': '🔥',
    'FIL': '📁'
  };
  
  return iconMap[symbol] || '🪙';
}

function getExampleTickerData() {
  return [
    { symbol: 'BTC', name: 'Bitcoin', price: 45000.00, change24h: 2.5, icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', price: 3200.00, change24h: -1.2, icon: 'Ξ' },
    { symbol: 'BNB', name: 'Binance Coin', price: 868.97, change24h: 4.62, icon: '🟡' },
    { symbol: 'SOL', name: 'Solana', price: 186.12, change24h: 2.93, icon: '🟣' },
    { symbol: 'USDC', name: 'USD Coin', price: 1.0001, change24h: -0.01, icon: '🔵' },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.2204, change24h: 4.26, icon: '🐕' },
    { symbol: 'TRX', name: 'Tron', price: 0.3531, change24h: 1.23, icon: '🔴' },
    { symbol: 'ADA', name: 'Cardano', price: 0.8739, change24h: 2.91, icon: '❄️' },
    { symbol: 'LINK', name: 'Chainlink', price: 25.87, change24h: 3.45, icon: '🔗' },
    { symbol: 'XRP', name: 'Ripple', price: 0.85, change24h: 1.78, icon: '⚡' },
    { symbol: 'DOT', name: 'Polkadot', price: 12.34, change24h: -0.5, icon: '🔴' },
    { symbol: 'MATIC', name: 'Polygon', price: 2.15, change24h: 5.67, icon: '🟣' },
    { symbol: 'AVAX', name: 'Avalanche', price: 45.67, change24h: 2.34, icon: '🔴' },
    { symbol: 'UNI', name: 'Uniswap', price: 15.89, change24h: -1.23, icon: '🦄' },
    { symbol: 'LTC', name: 'Litecoin', price: 78.90, change24h: 0.89, icon: '⚡' }
  ];
} 