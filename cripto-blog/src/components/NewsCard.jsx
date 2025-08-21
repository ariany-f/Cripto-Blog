import React, { useState, useMemo } from 'react';
import './NewsCard.css';

export default function NewsCard({ newsData = [], sentimentData = [] }) {
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'positive';
      case 'negative': return 'negative';
      default: return 'neutral';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '📈';
      case 'negative': return '📉';
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

  // Filtrar notícias
  const filteredNews = useMemo(() => {
    return newsData.filter(news => {
      // Filtro por sentimento
      if (filterSentiment !== 'all' && news.sentiment !== filterSentiment) {
        return false;
      }

      // Filtro por fonte
      if (filterSource !== 'all' && news.source !== filterSource) {
        return false;
      }

      // Filtro por busca
      if (searchTerm && !news.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !news.summary.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [newsData, filterSentiment, filterSource, searchTerm]);

  // Obter fontes únicas para o filtro
  const uniqueSources = useMemo(() => {
    return [...new Set(newsData.map(news => news.source))];
  }, [newsData]);

  return (
    <div className="news-card-container">
      <div className="news-header">
        <h2>📰 Notícias Principais</h2>
        <p>Últimas notícias do mercado de criptomoedas com análise de sentimento</p>
      </div>

      {/* Filtros */}
      <div className="news-filters">
        <div className="filter-group">
          <label>🔍 Buscar:</label>
          <input
            type="text"
            placeholder="Buscar notícias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>📊 Sentimento:</label>
          <select
            value={filterSentiment}
            onChange={(e) => setFilterSentiment(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos</option>
            <option value="positive">Positivo</option>
            <option value="negative">Negativo</option>
            <option value="neutral">Neutro</option>
          </select>
        </div>

        <div className="filter-group">
          <label>📰 Fonte:</label>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas</option>
            {uniqueSources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Gráfico de Sentimento */}
      {sentimentData.length > 0 && (
        <div className="sentiment-overview">
          <h3>📊 Análise de Sentimento Geral</h3>
          <div className="sentiment-stats">
            {sentimentData.map((item, index) => (
              <div key={index} className="sentiment-stat">
                <span className="sentiment-label">{item.label}</span>
                <span className="sentiment-value" style={{ color: item.color }}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Notícias */}
      <div className="news-grid">
        {filteredNews.map((news, index) => (
          <div key={index} className={`news-item ${index === 0 ? 'featured' : ''}`}>
            <div className="news-item-header">
              <span className="news-source">{news.source}</span>
              <span className="news-date">{formatDate(news.publishedAt)}</span>
            </div>
            
            {index === 0 && (
              <div className="featured-badge">
                <span>🔥 DESTAQUE</span>
              </div>
            )}
            
            <h3 className="news-title">
              <a href={news.url || '#'} target="_blank" rel="noopener noreferrer">
                {news.title}
              </a>
            </h3>
            
            <p className="news-summary">{news.summary}</p>
            
            <div className="news-sentiment">
              <div className="sentiment-info">
                <span className={`sentiment-label ${getSentimentColor(news.sentiment)}`}>
                  {getSentimentIcon(news.sentiment)} {news.sentiment}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="no-news">
          <p>🔍 Nenhuma notícia encontrada com os filtros aplicados.</p>
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