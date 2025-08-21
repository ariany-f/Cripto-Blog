import axios from 'axios';

export async function getCryptoNews() {
  try {
    const res = await axios.get(`/api/cryptonews?tickers=BTC,ETH,XRP&items=50`);
    return res.data.data.map(item => ({
      title: item.title,
      url: item.news_url,
      summary: item.text,
      publishedAt: item.published_at,
      source: item.source_name,
      tickers: item.tickers
    }));
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    // Retornando dados de exemplo em caso de erro
    return [
      {
        title: 'Bitcoin atinge nova máxima histórica',
        url: 'https://example.com/bitcoin-high',
        summary: 'Bitcoin superou a marca de $50.000 pela primeira vez, impulsionado por adoção institucional.',
        publishedAt: '2024-01-15T10:30:00Z',
        source: 'CryptoNews',
        tickers: ['BTC']
      },
      {
        title: 'Ethereum 2.0 mostra progresso significativo',
        url: 'https://example.com/ethereum-progress',
        summary: 'A transição para Proof of Stake está avançando conforme planejado.',
        publishedAt: '2024-01-15T09:15:00Z',
        source: 'CryptoInsider',
        tickers: ['ETH']
      },
      {
        title: 'Ripple anuncia nova parceria estratégica',
        url: 'https://example.com/ripple-partnership',
        summary: 'XRP ganha adoção em novo mercado emergente.',
        publishedAt: '2024-01-15T08:45:00Z',
        source: 'CryptoDaily',
        tickers: ['XRP']
      }
    ];
  }
} 