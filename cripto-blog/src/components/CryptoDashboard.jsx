import React, { useState, useEffect } from 'react';
import CryptoTable from './CryptoTable';
import { getCryptoMarket } from '../services/marketApi';
import './CryptoDashboard.css';

export default function CryptoDashboard() {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const market = await getCryptoMarket();
      setMarketData(market);
      setLastUpdate(new Date());
      setIsOnline(true);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados. Verificando conexão...');
      setIsOnline(false);
      
      // Dados de exemplo em caso de erro
      setMarketData([
        { symbol: 'BTC', name: 'Bitcoin', price: 45000, change24h: 2.5, marketCap: 850000000000, volume24h: 25000000000, marketCapDominance: 52.3 },
        { symbol: 'ETH', name: 'Ethereum', price: 3200, change24h: -1.2, marketCap: 380000000000, volume24h: 18000000000, marketCapDominance: 23.1 },
        { symbol: 'BNB', name: 'Binance Coin', price: 868.97, change24h: 4.62, marketCap: 130000000000, volume24h: 1200000000, marketCapDominance: 7.8 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const formatLastUpdate = (date) => {
    if (!date) return 'Nunca';
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Dados para as sidebars
  const topCoins = marketData.slice(0, 5);
  const totalMarketCap = marketData.reduce((sum, coin) => sum + (coin.marketCap || 0), 0);
  const totalVolume = marketData.reduce((sum, coin) => sum + (coin.volume24h || 0), 0);
  const upCoins = marketData.filter(coin => coin.change24h > 0).length;
  const downCoins = marketData.filter(coin => coin.change24h < 0).length;

  if (loading && marketData.length === 0) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando dados do mercado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Barra de Status */}
      <div className="status-bar">
        <div className="status-content">
          <div className="status-info">
            <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}></div>
            <span>
              {isOnline ? 'Sistemas Online' : 'Verificando Conexão'}
            </span>
          </div>
          <div className="last-update">
            Última atualização: {formatLastUpdate(lastUpdate)}
          </div>
        </div>
        <button className="refresh-button" onClick={handleRefresh}>
          🔄 Atualizar
        </button>
      </div>

      {error && (
        <div className="error-container">
          <p>{error}</p>
        </div>
      )}

      {/* Layout Principal - 3 Colunas */}
      <div className="dashboard-layout">
        {/* Sidebar Esquerda */}
        <div className="sidebar-left">
          <div className="sidebar-card">
            <h3>🏆 Top 5 Moedas</h3>
            <div className="data-context">
              <span className="context-label">📊 Ranking por Market Cap</span>
              <span className="context-time">ATUALIZADO AGORA</span>
            </div>
            {topCoins.map((coin, index) => (
              <div key={coin.symbol} className="top-coin-item">
                <div className="coin-info">
                  <span className="coin-rank">#{index + 1}</span>
                  <span className="coin-symbol">{coin.symbol}</span>
                </div>
                <span className="coin-price">${coin.price.toLocaleString()}</span>
                <div className={`coin-change ${coin.change24h >= 0 ? 'positive' : 'negative'}`}>
                  <span>{coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%</span>
                  <span className="change-period">24h</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-card">
            <h3>📊 Estatísticas do Mercado</h3>
            <div className="data-context">
              <span className="context-label">📈 Baseado em {marketData.length} criptomoedas</span>
              <span className="context-time">ÚLTIMAS 24 HORAS</span>
            </div>
            <div className="market-stat">
              <span className="stat-label">EM ALTA (&gt;0%):</span>
              <span className="stat-value positive">{upCoins} moedas</span>
            </div>
            <div className="market-stat">
              <span className="stat-label">EM BAIXA (&lt;0%):</span>
              <span className="stat-value negative">{downCoins} moedas</span>
            </div>
            <div className="market-stat">
              <span className="stat-label">ESTÁVEIS (=0%):</span>
              <span className="stat-value">{marketData.length - upCoins - downCoins} moedas</span>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal - Tabela de Dados */}
        <div className="main-content-area">
          <div className="main-section">
            <CryptoTable marketData={marketData} />
          </div>
        </div>

        {/* Sidebar Direita */}
        <div className="sidebar-right">
          <div className="sidebar-card">
            <h3>💰 Market Cap Total</h3>
            <div className="data-context">
              <span className="context-label">💵 Soma de todas as criptomoedas</span>
              <span className="context-time">ATUALIZADO AGORA</span>
            </div>
            <div className="market-stat">
              <span className="stat-label">TOTAL:</span>
              <span className="stat-value">${(totalMarketCap / 1000000000000).toFixed(2)}T</span>
            </div>
            <div className="market-stat">
              <span className="stat-label">VOLUME 24H:</span>
              <span className="stat-value">${(totalVolume / 1000000000).toFixed(2)}B</span>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>📈 Tendências do Mercado</h3>
            <div className="data-context">
              <span className="context-label">📊 Baseado em variação de preço</span>
              <span className="context-time">ÚLTIMAS 24 HORAS</span>
            </div>
            <div className="market-stat">
              <span className="stat-label">EM ALTA (&gt;0%):</span>
              <span className="stat-value positive">{upCoins} moedas</span>
            </div>
            <div className="market-stat">
              <span className="stat-label">EM BAIXA (&lt;0%):</span>
              <span className="stat-value negative">{downCoins} moedas</span>
            </div>
            <div className="market-stat">
              <span className="stat-label">ESTÁVEIS (=0%):</span>
              <span className="stat-value">{marketData.length - upCoins - downCoins} moedas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 