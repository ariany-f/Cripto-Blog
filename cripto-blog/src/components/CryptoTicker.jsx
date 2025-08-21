import React, { useState, useEffect } from 'react';
import { getTickerData } from '../services/tickerApi';
import './CryptoTicker.css';

export default function CryptoTicker() {
  const [tickerData, setTickerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTickerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTickerData();
      setTickerData(data);
    } catch (err) {
      console.error('Erro ao buscar dados do ticker:', err);
      setError('Erro ao carregar ticker. Usando dados de exemplo.');
      
      // Dados de exemplo para o ticker
      setTickerData([
        { symbol: 'BTC', price: 45000, change24h: 2.5 },
        { symbol: 'ETH', price: 3200, change24h: -1.2 },
        { symbol: 'BNB', price: 868.97, change24h: 4.62 },
        { symbol: 'SOL', price: 186.12, change24h: 2.93 },
        { symbol: 'ADA', price: 0.52, change24h: -0.8 },
        { symbol: 'DOT', price: 7.85, change24h: 1.5 },
        { symbol: 'LINK', price: 15.23, change24h: 3.2 },
        { symbol: 'UNI', price: 8.45, change24h: -2.1 },
        { symbol: 'AVAX', price: 35.67, change24h: 5.8 },
        { symbol: 'MATIC', price: 0.89, change24h: 1.2 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickerData();
    // Removendo o intervalo automático para evitar rate limiting
    // const interval = setInterval(loadTickerData, 30 * 1000);
    // return () => clearInterval(interval);
  }, []);

  const getCoinIcon = (symbol) => {
    const icons = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'BNB': '🟡',
      'SOL': '◎',
      'ADA': '₳',
      'DOT': '●',
      'LINK': '🔗',
      'UNI': '🦄',
      'AVAX': '❄️',
      'MATIC': '💜'
    };
    return icons[symbol] || '🪙';
  };

  const formatPrice = (price) => {
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(1)}K`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(4)}`;
    }
  };

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  if (loading && tickerData.length === 0) {
    return (
      <div className="ticker-container">
        <div className="ticker-loading">
          <div className="loading-spinner"></div>
          <span>Carregando preços...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ticker-container">
      <div className="ticker-content">
        <div className="ticker-scroll">
          {tickerData.map((coin, index) => (
            <div key={`${coin.symbol}-${index}`} className="ticker-item">
              <span className="coin-icon">{getCoinIcon(coin.symbol)}</span>
              <span className="coin-symbol">{coin.symbol}</span>
              <span className="coin-price">{formatPrice(coin.price)}</span>
              <span className={`coin-change ${coin.change24h >= 0 ? 'positive' : 'negative'}`}>
                {formatChange(coin.change24h)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {error && (
        <div className="ticker-error">
          <span>⚠️ {error}</span>
        </div>
      )}
    </div>
  );
} 