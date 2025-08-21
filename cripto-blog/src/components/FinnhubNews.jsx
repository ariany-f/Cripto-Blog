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
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchNews(1);
  }, []);

  const fetchNews = async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setIsLoadingPage(true);
      }
      setError(null);
      
      const response = await getCryptoNewsFinnhub(page, itemsPerPage);
      
      setNews(response.news);
      setTotalNews(response.total);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
    } catch (err) {
      console.error('Erro ao buscar notícias Finnhub:', err);
      setError('Erro ao carregar notícias. Usando dados de exemplo.');
    } finally {
      setLoading(false);
      setIsLoadingPage(false);
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

  const handlePageChange = async (page) => {
    if (page !== currentPage) {
      await fetchNews(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = async () => {
    if (currentPage > 1) {
      await handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      await handlePageChange(currentPage + 1);
    }
  };

  // Função para gerar números de página inteligentes
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7; // Máximo de páginas visíveis
    
    if (totalPages <= maxVisiblePages) {
      // Se há poucas páginas, mostra todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Se há muitas páginas, mostra um subconjunto inteligente
      if (currentPage <= 4) {
        // Páginas iniciais: 1, 2, 3, 4, 5, ..., totalPages
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Páginas finais: 1, ..., totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Páginas do meio: 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
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

      {isLoadingPage && (
        <div className="page-loading">
          <div className="loading-spinner"></div>
          <span>Carregando página...</span>
        </div>
      )}

      <div className="news-grid">
        {news.map((newsItem, index) => (
          <div key={`${newsItem.id}-${currentPage}-${index}`} className="news-card">
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
              Página {currentPage} de {totalPages} • {totalNews} notícias no total
            </span>
          </div>
          
          <div className="pagination-controls">
            <button 
              className="pagination-btn"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || isLoadingPage}
            >
              ← Anterior
            </button>
            
            <div className="page-numbers">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  className={`page-btn ${currentPage === page ? 'active' : ''} ${page === '...' ? 'separator' : ''}`}
                  onClick={() => page !== '...' ? handlePageChange(page) : null}
                  disabled={isLoadingPage || page === '...'}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button 
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || isLoadingPage}
            >
              Próxima →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}