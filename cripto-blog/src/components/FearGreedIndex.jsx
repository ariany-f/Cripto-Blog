import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { getFearGreedIndex, getBitcoinData } from '../services/fearGreedApi';
import './FearGreedIndex.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function FearGreedIndex() {
  const [fearGreedData, setFearGreedData] = useState(null);
  const [bitcoinData, setBitcoinData] = useState(null);
  const [timeframe, setTimeframe] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fearGreedResult, bitcoinResult] = await Promise.all([
        getFearGreedIndex(),
        getBitcoinData()
      ]);
      setFearGreedData(fearGreedResult);
      setBitcoinData(bitcoinResult);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    if (!fearGreedData?.historical) return [];
    
    let filtered = fearGreedData.historical;
    
    // Filtro por timeframe
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;
    const threeMonths = 90 * oneDay;
    
    switch (timeframe) {
      case '1d':
        filtered = filtered.filter(item => (now - new Date(item.date)) <= oneDay);
        break;
      case '1w':
        filtered = filtered.filter(item => (now - new Date(item.date)) <= oneWeek);
        break;
      case '1m':
        filtered = filtered.filter(item => (now - new Date(item.date)) <= oneMonth);
        break;
      case '3m':
        filtered = filtered.filter(item => (now - new Date(item.date)) <= threeMonths);
        break;
      default:
        break;
    }
    
    // Filtro por sentimento
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(item => {
        const sentiment = getSentiment(item.value);
        return sentiment === sentimentFilter;
      });
    }
    
    return filtered;
  };

  const formatNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const getSentiment = (value) => {
    if (value >= 0 && value <= 25) return 'Extreme Fear';
    if (value > 25 && value <= 45) return 'Fear';
    if (value > 45 && value <= 55) return 'Neutral';
    if (value > 55 && value <= 75) return 'Greed';
    return 'Extreme Greed';
  };

  const getSentimentColor = (value) => {
    if (value >= 0 && value <= 25) return '#ff4444';
    if (value > 25 && value <= 45) return '#ffaa00';
    if (value > 45 && value <= 55) return '#ffff00';
    if (value > 55 && value <= 75) return '#00ff88';
    return '#00ff00';
  };

  const chartData = {
    labels: getFilteredData().map(item => new Date(item.date).toLocaleDateString('pt-BR')),
    datasets: [
      {
        label: 'Fear & Greed Index',
        data: getFilteredData().map(item => item.value),
        borderColor: getSentimentColor(fearGreedData?.current?.value || 50),
        backgroundColor: getSentimentColor(fearGreedData?.current?.value || 50) + '20',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: getFilteredData().map(item => getSentimentColor(item.value)),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#00ff88',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return `Data: ${context[0].label}`;
          },
          label: function(context) {
            const value = context.parsed.y;
            const sentiment = getSentiment(value);
            return `Índice: ${value} (${sentiment})`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff',
          maxRotation: 45
        }
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff',
          callback: function(value) {
            return value + ' (' + getSentiment(value) + ')';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  if (loading) {
    return (
      <div className="fear-greed-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando Fear & Greed Index...</p>
        </div>
      </div>
    );
  }

  if (!fearGreedData) {
    return (
      <div className="fear-greed-container">
        <div className="error-message">
          <p>Erro ao carregar dados do Fear & Greed Index</p>
          <button onClick={fetchData}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fear-greed-container">
      <div className="fear-greed-header">
        <h2>📊 CMC Crypto Fear and Greed Index</h2>
        <button className="refresh-button" onClick={fetchData}>🔄 Atualizar</button>
      </div>

      {/* Filtros */}
      <div className="fear-greed-filters">
        <div className="filter-group">
          <label>📅 Período:</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todo o período disponível</option>
            <option value="1d">Últimas 24 horas</option>
            <option value="1w">Última semana (7 dias)</option>
            <option value="1m">Último mês (30 dias)</option>
            <option value="3m">Últimos 3 meses (90 dias)</option>
          </select>
        </div>

        <div className="filter-group">
          <label>😊 Sentimento:</label>
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos os sentimentos</option>
            <option value="Extreme Fear">Extreme Fear 😱 (0-25)</option>
            <option value="Fear">Fear 😨 (26-45)</option>
            <option value="Neutral">Neutral 😐 (46-55)</option>
            <option value="Greed">Greed 😏 (56-75)</option>
            <option value="Extreme Greed">Extreme Greed 😈 (76-100)</option>
          </select>
        </div>

        <div className="filter-group">
          <label>📊 Pontos:</label>
          <span className="results-count">{getFilteredData().length} pontos de dados</span>
        </div>
      </div>

      <div className="fear-greed-content">
        <div className="indicators-panel">
          {/* Main Gauge */}
          <div className="main-gauge">
            <div className="gauge-container">
              <div className="gauge-fill" style={{ 
                width: `${fearGreedData.current.value}%`,
                backgroundColor: fearGreedData.current.color 
              }}></div>
              <div className="gauge-center">
                <span className="gauge-value">{fearGreedData.current.value}</span>
                <span className="gauge-sentiment">{fearGreedData.current.sentiment}</span>
              </div>
            </div>
          </div>

          {/* Market Metrics */}
          {fearGreedData.marketMetrics && (
            <div className="market-metrics">
              <h3>📈 Métricas de Mercado</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Market Cap Total:</span>
                  <span className="metric-value">{formatNumber(fearGreedData.marketMetrics.totalMarketCap)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Volume 24h:</span>
                  <span className="metric-value">{formatNumber(fearGreedData.marketMetrics.totalVolume24h)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Dominância BTC:</span>
                  <span className="metric-value">{fearGreedData.marketMetrics.btcDominance.toFixed(2)}%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Dominância ETH:</span>
                  <span className="metric-value">{fearGreedData.marketMetrics.ethDominance.toFixed(2)}%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Criptomoedas Ativas:</span>
                  <span className="metric-value">{fearGreedData.marketMetrics.activeCryptocurrencies.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bitcoin Data */}
          {bitcoinData && (
            <div className="bitcoin-metrics">
              <h3>₿ Bitcoin</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Preço:</span>
                  <span className="metric-value">{formatNumber(bitcoinData.price)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Volume 24h:</span>
                  <span className="metric-value">{formatNumber(bitcoinData.volume24h)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Market Cap:</span>
                  <span className="metric-value">{formatNumber(bitcoinData.marketCap)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Variação 24h:</span>
                  <span className={`metric-value ${bitcoinData.change24h >= 0 ? 'positive' : 'negative'}`}>
                    {bitcoinData.change24h >= 0 ? '+' : ''}{bitcoinData.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Historical Values */}
          <div className="historical-values">
            <h3>📊 Valores Históricos</h3>
            <div className="values-grid">
              {fearGreedData.historical.slice(-5).map((item, index) => (
                <div key={index} className="historical-item">
                  <span className="historical-date">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                  <span className="historical-value" style={{ color: getSentimentColor(item.value) }}>
                    {item.value} ({getSentiment(item.value)})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Yearly Extremes */}
          <div className="yearly-extremes">
            <h3>🏆 Extremos do Ano</h3>
            <div className="extremes-grid">
              <div className="extreme-item">
                <span className="extreme-label">Maior Valor:</span>
                <span className="extreme-value positive">
                  {fearGreedData.yearly?.max?.value || 'N/A'} ({fearGreedData.yearly?.max?.sentiment || 'N/A'})
                </span>
              </div>
              <div className="extreme-item">
                <span className="extreme-label">Menor Valor:</span>
                <span className="extreme-value negative">
                  {fearGreedData.yearly?.min?.value || 'N/A'} ({fearGreedData.yearly?.min?.sentiment || 'N/A'})
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-panel">
          <div className="chart-header">
            <h3>📈 Evolução do Índice</h3>
            <div className="timeframe-selector">
              <button 
                className={`timeframe-btn ${timeframe === 'all' ? 'active' : ''}`}
                onClick={() => setTimeframe('all')}
              >
                Tudo
              </button>
              <button 
                className={`timeframe-btn ${timeframe === '1m' ? 'active' : ''}`}
                onClick={() => setTimeframe('1m')}
              >
                1M
              </button>
              <button 
                className={`timeframe-btn ${timeframe === '1w' ? 'active' : ''}`}
                onClick={() => setTimeframe('1w')}
              >
                1S
              </button>
              <button 
                className={`timeframe-btn ${timeframe === '1d' ? 'active' : ''}`}
                onClick={() => setTimeframe('1d')}
              >
                1D
              </button>
            </div>
          </div>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#ff4444' }}></span>
              <span>Extreme Fear (0-25)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#ffaa00' }}></span>
              <span>Fear (26-45)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#ffff00' }}></span>
              <span>Neutral (46-55)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#00ff88' }}></span>
              <span>Greed (56-75)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#00ff00' }}></span>
              <span>Extreme Greed (76-100)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 