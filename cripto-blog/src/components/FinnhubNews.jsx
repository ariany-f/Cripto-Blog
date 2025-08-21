import React, { useState, useEffect } from 'react';
import { getCryptoNewsFinnhub } from '../services/finnhubApi';
import './FinnhubNews.css';

export default function FinnhubNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const newsData = await getCryptoNewsFinnhub();
      setNews(newsData);
      setTotalNews(newsData.length);
      setTotalPages(Math.ceil(newsData.length / itemsPerPage));
      setCurrentPage(1);
    } catch (err) {
      console.error('Erro ao buscar notícias Finnhub:', err);
      setError('Erro ao carregar notícias. Usando dados de exemplo.');
      
      // Dados de exemplo
      const exampleNews = [
        {
          title: 'Bitcoin atinge nova máxima do ano',
          summary: 'BTC supera resistência importante e atinge $45k, impulsionado por adoção institucional',
          url: '#',
          source: 'CryptoNews',
          publishedAt: '2024-01-15T10:30:00Z',
          sentiment: 'positive'
        },
        {
          title: 'Ethereum enfrenta correção técnica',
          summary: 'ETH cai 1.2% após teste de suporte, mas fundamentos permanecem sólidos',
          url: '#',
          source: 'CoinDesk',
          publishedAt: '2024-01-15T09:15:00Z',
          sentiment: 'negative'
        },
        {
          title: 'Solana mostra força no mercado',
          summary: 'SOL lidera altcoins com alta de 2.9%, beneficiando-se de melhorias na rede',
          url: '#',
          source: 'CryptoSlate',
          publishedAt: '2024-01-15T08:45:00Z',
          sentiment: 'positive'
        },
        {
          title: 'Regulamentação crypto avança na Europa',
          summary: 'Nova legislação MiCA traz clareza regulatória para o mercado europeu',
          url: '#',
          source: 'CoinTelegraph',
          publishedAt: '2024-01-15T07:30:00Z',
          sentiment: 'positive'
        },
        {
          title: 'Binance anuncia novos produtos DeFi',
          summary: 'Exchange lança plataforma de yield farming e staking avançado',
          url: '#',
          source: 'CryptoNews',
          publishedAt: '2024-01-15T06:15:00Z',
          sentiment: 'positive'
        },
        {
          title: 'Cardano implementa atualização importante',
          summary: 'ADA ativa nova funcionalidade de smart contracts na rede principal',
          url: '#',
          source: 'CoinDesk',
          publishedAt: '2024-01-15T05:00:00Z',
          sentiment: 'positive'
        },
        {
          title: 'Polkadot anuncia parceria estratégica',
          summary: 'DOT firma acordo com empresa de tecnologia tradicional',
          url: '#',
          source: 'CryptoSlate',
          publishedAt: '2024-01-15T04:30:00Z',
          sentiment: 'positive'
        },
        {
          title: 'Chainlink expande oráculos',
          summary: 'LINK adiciona novos feeds de dados para DeFi',
          url: '#',
          source: 'CoinTelegraph',
          publishedAt: '2024-01-15T03:45:00Z',
          sentiment: 'positive'
        },
        {
          title: 'Uniswap v4 em desenvolvimento',
          summary: 'UNI prepara nova versão com recursos avançados de liquidez',
          url: '#',
          source: 'CryptoNews',
          publishedAt: '2024-01-15T02:20:00Z',
          sentiment: 'positive'
        },
        {
          title: 'Avalanche enfrenta competição',
          summary: 'AVAX perde market share para concorrentes Layer 1',
          url: '#',
          source: 'CoinDesk',
          publishedAt: '2024-01-15T01:10:00Z',
          sentiment: 'negative'
        }
      ];
      
      setNews(exampleNews);
      setTotalNews(exampleNews.length);
      setTotalPages(Math.ceil(exampleNews.length / itemsPerPage));
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Agora mesmo';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d atrás`;
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return '📈';
      case 'negative':
        return '📉';
      default:
        return '📊';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'var(--text-success)';
      case 'negative':
        return 'var(--text-danger)';
      default:
        return 'var(--text-secondary)';
    }
  };

  // Calcular notícias da página atual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = news.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="finnhub-container">
        <div className="finnhub-header">
          <h2>📰 Notícias Financeiras</h2>
          <p>Últimas notícias do mercado crypto</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="finnhub-container">
      <div className="finnhub-header">
        <h2>📰 Notícias Financeiras</h2>
        <p>Últimas notícias do mercado crypto</p>
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      <div className="news-grid">
        {currentNews.map((newsItem, index) => (
          <div key={index} className="news-card">
            <div className="news-header">
              <div className="news-meta">
                <span className="news-source">{newsItem.source}</span>
                <span className="news-time">{formatDate(newsItem.publishedAt)}</span>
              </div>
              <span 
                className="sentiment-indicator"
                style={{ color: getSentimentColor(newsItem.sentiment) }}
              >
                {getSentimentIcon(newsItem.sentiment)}
              </span>
            </div>
            
            <h3 className="news-title">
              <a href={newsItem.url} target="_blank" rel="noopener noreferrer">
                {newsItem.title}
              </a>
            </h3>
            
            <p className="news-summary">{newsItem.summary}</p>
            
            <div className="news-footer">
              <a 
                href={newsItem.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="read-more-btn"
              >
                Ler mais →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <span>
              Mostrando {startIndex + 1}-{Math.min(endIndex, totalNews)} de {totalNews} notícias
            </span>
          </div>
          
          <div className="pagination-controls">
            <button 
              className="pagination-btn"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              ← Anterior
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button 
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Próxima →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}