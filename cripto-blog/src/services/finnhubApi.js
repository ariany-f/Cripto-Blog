import axios from 'axios';

export async function getCryptoNewsFinnhub(page = 1, limit = 5) {
  try {
    const res = await axios.get(
      `/api/finnhub/news?category=crypto&page=${page}&limit=${limit}`
    );
    
    // Se a API retornar dados paginados
    if (res.data.data && Array.isArray(res.data.data)) {
      return {
        news: res.data.data.map(item => ({
          id: item.id || item.datetime,
          title: item.headline,
          url: item.url,
          summary: item.summary || '',
          datetime: item.datetime,
          source: item.source,
          category: item.category || 'crypto',
          image: item.image || null,
          publishedAt: new Date(item.datetime * 1000).toISOString(),
          sentiment: 'positive' // Placeholder - seria calculado pelo backend
        })),
        total: res.data.total || res.data.data.length,
        page: res.data.page || page,
        totalPages: res.data.totalPages || Math.ceil((res.data.total || res.data.data.length) / limit)
      };
    }
    
    // Fallback para API que não suporta paginação
    const allData = res.data.map(item => ({
      id: item.id || item.datetime,
      title: item.headline,
      url: item.url,
      summary: item.summary || '',
      datetime: item.datetime,
      source: item.source,
      category: item.category || 'crypto',
      image: item.image || null,
      publishedAt: new Date(item.datetime * 1000).toISOString(),
      sentiment: 'positive'
    }));
    
    // Paginação client-side como fallback
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = allData.slice(startIndex, endIndex);
    
    return {
      news: paginatedData,
      total: allData.length,
      page: page,
      totalPages: Math.ceil(allData.length / limit)
    };
    
  } catch (error) {
    console.error('Erro ao buscar notícias Finnhub:', error);
    
    // Dados de exemplo com paginação
    const exampleNews = [
      {
        id: 1,
        title: 'Bitcoin atinge nova máxima do ano',
        url: 'https://example.com/bitcoin-high',
        summary: 'BTC supera resistência importante e atinge $45k, impulsionado por adoção institucional',
        datetime: Date.now() - 3600000,
        source: 'CryptoNews',
        category: 'crypto',
        image: null,
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        sentiment: 'positive'
      },
      {
        id: 2,
        title: 'Ethereum enfrenta correção técnica',
        url: 'https://example.com/ethereum-correction',
        summary: 'ETH cai 1.2% após teste de suporte, mas fundamentos permanecem sólidos',
        datetime: Date.now() - 7200000,
        source: 'CoinDesk',
        category: 'crypto',
        image: null,
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        sentiment: 'negative'
      },
      {
        id: 3,
        title: 'Solana mostra força no mercado',
        url: 'https://example.com/solana-strength',
        summary: 'SOL lidera altcoins com alta de 2.9%, beneficiando-se de melhorias na rede',
        datetime: Date.now() - 10800000,
        source: 'CryptoSlate',
        category: 'crypto',
        image: null,
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        sentiment: 'positive'
      },
      {
        id: 4,
        title: 'Regulamentação crypto avança na Europa',
        url: 'https://example.com/europe-regulation',
        summary: 'Nova legislação MiCA traz clareza regulatória para o mercado europeu',
        datetime: Date.now() - 14400000,
        source: 'CoinTelegraph',
        category: 'crypto',
        image: null,
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        sentiment: 'positive'
      },
      {
        id: 5,
        title: 'Binance anuncia novos produtos DeFi',
        url: 'https://example.com/binance-defi',
        summary: 'Exchange lança plataforma de yield farming e staking avançado',
        datetime: Date.now() - 18000000,
        source: 'CryptoNews',
        category: 'crypto',
        image: null,
        publishedAt: new Date(Date.now() - 18000000).toISOString(),
        sentiment: 'positive'
      },
      {
        id: 6,
        title: 'Cardano implementa atualização importante',
        url: 'https://example.com/cardano-update',
        summary: 'ADA ativa nova funcionalidade de smart contracts na rede principal',
        datetime: Date.now() - 21600000,
        source: 'CoinDesk',
        category: 'crypto',
        image: null,
        publishedAt: new Date(Date.now() - 21600000).toISOString(),
        sentiment: 'positive'
      },
      {
        id: 7,
        title: 'Polkadot anuncia parceria estratégica',
        url: 'https://example.com/polkadot-partnership',
        summary: 'DOT firma acordo com empresa de tecnologia tradicional',
        datetime: Date.now() - 25200000,
        source: 'CryptoSlate',
        category: 'crypto',
        image: null,
        publishedAt: new Date(Date.now() - 25200000).toISOString(),
        sentiment: 'positive'
      },
      {
        id: 8,
        title: 'Chainlink expande oráculos',
        url: 'https://example.com/chainlink-oracles',
        summary: 'LINK adiciona novos feeds de dados para DeFi',
        datetime: Date.now() - 28800000,
        source: 'CoinTelegraph',
        category: 'crypto',
        image: null,
        publishedAt: new Date(Date.now() - 28800000).toISOString(),
        sentiment: 'positive'
      },
      {
        id: 9,
        title: 'Uniswap v4 em desenvolvimento',
        url: 'https://example.com/uniswap-v4',
        summary: 'UNI prepara nova versão com recursos avançados de liquidez',
        datetime: Date.now() - 32400000,
        source: 'CryptoNews',
        category: 'crypto',
        image: null,
        publishedAt: new Date(Date.now() - 32400000).toISOString(),
        sentiment: 'positive'
      },
      {
        id: 10,
        title: 'Avalanche enfrenta competição',
        url: 'https://example.com/avalanche-competition',
        summary: 'AVAX perde market share para concorrentes Layer 1',
        datetime: Date.now() - 36000000,
        source: 'CoinDesk',
        category: 'crypto',
        image: null,
        publishedAt: new Date(Date.now() - 36000000).toISOString(),
        sentiment: 'negative'
      }
    ];
    
    // Paginação server-side simulada
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = exampleNews.slice(startIndex, endIndex);
    
    return {
      news: paginatedData,
      total: exampleNews.length,
      page: page,
      totalPages: Math.ceil(exampleNews.length / limit)
    };
  }
}