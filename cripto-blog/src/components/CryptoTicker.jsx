import React, { useState, useEffect } from 'react';
import { getTickerData } from '../services/tickerApi';
import './CryptoTicker.css';

export default function CryptoTicker() {
  const [tickerData, setTickerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickerData = async () => {
      try {
        const data = await getTickerData();
        setTickerData(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados do ticker:', error);
        setLoading(false);
      }
    };

    loadTickerData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadTickerData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

  if (loading) {
    return (
      <div className="crypto-ticker">
        <div className="ticker-content">
          <div className="ticker-item loading">
            <span>Carregando preços...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crypto-ticker">
      <div className="ticker-content">
        {tickerData.map((coin, index) => (
          <div key={`${coin.symbol}-${index}`} className="ticker-item">
            <div className="coin-icon">{coin.icon}</div>
            <div className="coin-info">
              <span className="coin-symbol">{coin.symbol}</span>
              <span className="coin-price">{formatPrice(coin.price)}</span>
            </div>
            <div className={`coin-change ${coin.change24h >= 0 ? 'positive' : 'negative'}`}>
              {formatChange(coin.change24h)}
            </div>
          </div>
        ))}
        {/* Duplicar itens para criar efeito de loop infinito */}
        {tickerData.map((coin, index) => (
          <div key={`${coin.symbol}-duplicate-${index}`} className="ticker-item">
            <div className="coin-icon">{coin.icon}</div>
            <div className="coin-info">
              <span className="coin-symbol">{coin.symbol}</span>
              <span className="coin-price">{formatPrice(coin.price)}</span>
            </div>
            <div className={`coin-change ${coin.change24h >= 0 ? 'positive' : 'negative'}`}>
              {formatChange(coin.change24h)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 