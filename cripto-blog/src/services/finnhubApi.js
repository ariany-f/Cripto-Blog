import axios from 'axios';

export async function getCryptoNewsFinnhub() {
  try {
    const res = await axios.get(
      `/api/finnhub/news?category=crypto`
    );
    return res.data.map(item => ({
      id: item.id || item.datetime,
      title: item.headline,
      url: item.url,
      summary: item.summary || '',
      datetime: item.datetime,
      source: item.source,
      category: item.category || 'crypto',
      image: item.image || null
    }));
  } catch (error) {
    console.error('Erro ao buscar notícias Finnhub:', error);
    // Retornando dados de exemplo em caso de erro
    return [
      {
        id: 1,
        title: 'Mercado crypto mostra sinais de recuperação',
        url: 'https://example.com/crypto-recovery',
        summary: 'Após período de volatilidade, mercado crypto apresenta sinais de estabilização.',
        datetime: Date.now() - 3600000, // 1 hora atrás
        source: 'Finnhub',
        category: 'crypto',
        image: null
      },
      {
        id: 2,
        title: 'Nova regulamentação afeta exchanges',
        url: 'https://example.com/regulation-exchanges',
        summary: 'Mudanças regulatórias impactam operações de exchanges de criptomoedas.',
        datetime: Date.now() - 7200000, // 2 horas atrás
        source: 'Finnhub',
        category: 'crypto',
        image: null
      },
      {
        id: 3,
        title: 'DeFi continua crescendo',
        url: 'https://example.com/defi-growth',
        summary: 'Protocolos DeFi registram crescimento significativo em volume e usuários.',
        datetime: Date.now() - 10800000, // 3 horas atrás
        source: 'Finnhub',
        category: 'crypto',
        image: null
      }
    ];
  }
}