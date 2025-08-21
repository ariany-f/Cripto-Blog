import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './NewsDetail.css';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simular busca da notícia pelo ID
    // Em um caso real, você faria uma chamada API
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Dados de exemplo - em produção viria da API
        const exampleNews = {
          id: id,
          title: 'Bitcoin atinge nova máxima do ano',
          summary: 'BTC supera resistência importante e atinge $45k, impulsionado por adoção institucional e ETF approvals. O Bitcoin demonstrou força técnica significativa ao romper a resistência de $44,000, marcando uma nova máxima anual e consolidando a tendência de alta iniciada no final do ano passado.',
          content: `
            <h2>Análise Técnica</h2>
            <p>O Bitcoin demonstrou força técnica significativa ao romper a resistência de $44,000, marcando uma nova máxima anual e consolidando a tendência de alta iniciada no final do ano passado. Os indicadores técnicos mostram momentum positivo, com o RSI em níveis saudáveis e volume de negociação robusto.</p>
            
            <h2>Fatores Fundamentais</h2>
            <p>A aprovação dos ETFs de Bitcoin nos Estados Unidos tem sido um catalisador importante para o movimento de alta. A entrada de capital institucional através desses veículos tem proporcionado liquidez adicional e legitimidade ao mercado crypto.</p>
            
            <h2>Impacto no Mercado</h2>
            <p>O movimento do Bitcoin tem arrastado outras criptomoedas, com o Ethereum e altcoins também registrando ganhos significativos. O sentimento geral do mercado tem melhorado, com o Fear & Greed Index indicando "Greed" moderado.</p>
            
            <h2>Perspectivas Futuras</h2>
            <p>Analistas projetam que o Bitcoin pode testar a resistência de $50,000 nos próximos meses, especialmente se a adoção institucional continuar crescendo e os fundamentos macroeconômicos permanecerem favoráveis.</p>
          `,
          sentiment: 'positive',
          source: 'CryptoNews',
          publishedAt: '2024-01-15T10:30:00Z',
          url: 'https://example.com/bitcoin-high',
          author: 'João Silva',
          readTime: '5 min',
          category: 'Mercado',
          tags: ['Bitcoin', 'ETF', 'Análise Técnica', 'Mercado']
        };
        
        setNews(exampleNews);
      } catch (err) {
        setError('Erro ao carregar notícia');
        console.error('Erro ao buscar notícia:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'var(--text-success)';
      case 'negative': return 'var(--text-danger)';
      default: return 'var(--text-secondary)';
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

  if (loading) {
    return (
      <div className="news-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando notícia...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="news-detail-container">
        <div className="error-container">
          <h2>❌ Erro ao carregar notícia</h2>
          <p>{error || 'Notícia não encontrada'}</p>
          <button onClick={() => navigate('/')} className="back-button">
            ← Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-detail-container">
      <div className="news-detail-header">
        <Link to="/" className="back-link">
          ← Voltar ao Dashboard
        </Link>
        
        <div className="news-meta">
          <span className="news-source">{news.source}</span>
          <span className="news-date">{formatDate(news.publishedAt)}</span>
          <span className="news-read-time">{news.readTime}</span>
        </div>
      </div>

      <article className="news-content">
        <header className="news-header">
          <div className="news-category">
            <span className="category-badge">{news.category}</span>
          </div>
          
          <h1 className="news-title">{news.title}</h1>
          
          <p className="news-summary">{news.summary}</p>
          
          <div className="news-author">
            <span>Por {news.author}</span>
          </div>
          
          <div className="news-sentiment">
            <span 
              className="sentiment-indicator"
              style={{ color: getSentimentColor(news.sentiment) }}
            >
              {getSentimentIcon(news.sentiment)} {news.sentiment}
            </span>
          </div>
        </header>

        <div className="news-tags">
          {news.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>

        <div 
          className="news-body"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        <footer className="news-footer">
          <a 
            href={news.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="external-link"
          >
            Ler notícia original →
          </a>
        </footer>
      </article>
    </div>
  );
} 