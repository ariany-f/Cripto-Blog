import React, { useState, useMemo } from 'react';
import './NewsCard.css';

export default function NewsCard({ title, url, summary, sentiment, impact, source, publishedAt, tickers, isFeatured = false }) {
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [filterTicker, setFilterTicker] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positivo': return 'positive';
      case 'negativo': return 'negative';
      default: return 'neutral';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positivo': return '📈';
      case 'negativo': return '📉';
      default: return '➡️';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtros aplicados ao componente pai
  const shouldShow = useMemo(() => {
    // Filtro por sentimento
    if (filterSentiment !== 'all' && sentiment !== filterSentiment) {
      return false;
    }

    // Filtro por fonte
    if (filterSource !== 'all' && source !== filterSource) {
      return false;
    }

    // Filtro por ticker
    if (filterTicker !== 'all' && (!tickers || !tickers.includes(filterTicker))) {
      return false;
    }

    // Filtro por busca
    if (searchTerm && !title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !summary.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  }, [filterSentiment, filterSource, filterTicker, searchTerm, sentiment, source, tickers, title, summary]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className={`news-card ${isFeatured ? 'featured' : ''}`}>
      <div className="news-header">
        <span className="news-source">{source}</span>
        <span className="news-date">{formatDate(publishedAt)}</span>
      </div>
      
      {isFeatured && (
        <div className="featured-badge">
          <span>🔥 DESTAQUE</span>
        </div>
      )}
      
      <h3 className="news-title">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </h3>
      
      <p className="news-summary">{summary}</p>
      
      <div className="news-sentiment">
        <div className="sentiment-info">
          <span className={`sentiment-label ${getSentimentColor(sentiment)}`}>
            {getSentimentIcon(sentiment)} {sentiment}
          </span>
        </div>
        <div className="impact-score">
          <span>Impacto: </span>
          <span className="impact-value">{impact}%</span>
        </div>
      </div>

      {tickers && tickers.length > 0 && (
        <div className="news-tickers">
          {tickers.map((ticker, index) => (
            <span key={index} className="ticker-tag">{ticker}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente de filtros para ser usado pelo componente pai
export function NewsFilters({ 
  news, 
  onFilterChange, 
  filters = {}, 
  sources = [], 
  tickers = [] 
}) {
  const [localFilters, setLocalFilters] = useState({
    sentiment: 'all',
    source: 'all',
    ticker: 'all',
    search: ''
  });

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...localFilters, [filterType]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const filteredCount = news.filter(item => {
    if (localFilters.sentiment !== 'all' && item.sentiment !== localFilters.sentiment) return false;
    if (localFilters.source !== 'all' && item.source !== localFilters.source) return false;
    if (localFilters.ticker !== 'all' && (!item.tickers || !item.tickers.includes(localFilters.ticker))) return false;
    if (localFilters.search && !item.title.toLowerCase().includes(localFilters.search.toLowerCase()) && 
        !item.summary.toLowerCase().includes(localFilters.search.toLowerCase())) return false;
    return true;
  }).length;

  return (
    <div className="news-filters">
      <div className="filter-group">
        <label>🔍 Buscar:</label>
        <input
          type="text"
          placeholder="Título ou resumo..."
          value={localFilters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>😊 Sentimento:</label>
        <select
          value={localFilters.sentiment}
          onChange={(e) => handleFilterChange('sentiment', e.target.value)}
          className="filter-select"
        >
          <option value="all">Todos os sentimentos</option>
          <option value="positivo">Positivo 📈</option>
          <option value="negativo">Negativo 📉</option>
          <option value="neutro">Neutro ➡️</option>
        </select>
      </div>

      <div className="filter-group">
        <label>📰 Fonte:</label>
        <select
          value={localFilters.source}
          onChange={(e) => handleFilterChange('source', e.target.value)}
          className="filter-select"
        >
          <option value="all">Todas as fontes</option>
          {sources.map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>🪙 Criptomoeda:</label>
        <select
          value={localFilters.ticker}
          onChange={(e) => handleFilterChange('ticker', e.target.value)}
          className="filter-select"
        >
          <option value="all">Todas as criptomoedas</option>
          {tickers.map(ticker => (
            <option key={ticker} value={ticker}>{ticker}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>📊 Resultados:</label>
        <span className="results-count">{filteredCount} de {news.length} notícias</span>
      </div>
    </div>
  );
} 