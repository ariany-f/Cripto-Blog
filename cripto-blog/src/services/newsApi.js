import axios from 'axios';

export async function getCryptoNews() {
  try {
    const res = await axios.get('/api/cryptonews?tickers=BTC,ETH,XRP&items=50');
    return res.data.data || res.data;
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    
    // Dados de exemplo mais robustos
    return [
      {
        title: 'Bitcoin atinge nova máxima do ano',
        summary: 'BTC supera resistência importante e atinge $45k, impulsionado por adoção institucional e ETF approvals',
        sentiment: 'positive',
        source: 'CryptoNews',
        publishedAt: '2024-01-15T10:30:00Z',
        url: 'https://example.com/bitcoin-high'
      },
      {
        title: 'Ethereum enfrenta correção técnica',
        summary: 'ETH cai 1.2% após teste de suporte, mas fundamentos permanecem sólidos com upgrade Shanghai',
        sentiment: 'negative',
        source: 'CoinDesk',
        publishedAt: '2024-01-15T09:15:00Z',
        url: 'https://example.com/ethereum-correction'
      },
      {
        title: 'Solana mostra força no mercado',
        summary: 'SOL lidera altcoins com alta de 2.9%, beneficiando-se de melhorias na rede e adoção DeFi',
        sentiment: 'positive',
        source: 'CryptoSlate',
        publishedAt: '2024-01-15T08:45:00Z',
        url: 'https://example.com/solana-strength'
      },
      {
        title: 'Regulamentação crypto avança na Europa',
        summary: 'Nova legislação MiCA traz clareza regulatória para o mercado europeu de criptomoedas',
        sentiment: 'positive',
        source: 'CoinTelegraph',
        publishedAt: '2024-01-15T07:30:00Z',
        url: 'https://example.com/europe-regulation'
      },
      {
        title: 'Binance anuncia novos produtos DeFi',
        summary: 'Exchange lança plataforma de yield farming e staking avançado para usuários institucionais',
        sentiment: 'positive',
        source: 'CryptoNews',
        publishedAt: '2024-01-15T06:15:00Z',
        url: 'https://example.com/binance-defi'
      },
      {
        title: 'Cardano implementa atualização importante',
        summary: 'ADA ativa nova funcionalidade de smart contracts na rede principal com melhor performance',
        sentiment: 'positive',
        source: 'CoinDesk',
        publishedAt: '2024-01-15T05:00:00Z',
        url: 'https://example.com/cardano-update'
      },
      {
        title: 'Polkadot anuncia parceria estratégica',
        summary: 'DOT firma acordo com empresa de tecnologia tradicional para interoperabilidade',
        sentiment: 'positive',
        source: 'CryptoSlate',
        publishedAt: '2024-01-15T04:45:00Z',
        url: 'https://example.com/polkadot-partnership'
      },
      {
        title: 'Chainlink expande oráculos',
        summary: 'LINK adiciona novos feeds de dados para DeFi com maior precisão e confiabilidade',
        sentiment: 'positive',
        source: 'CoinTelegraph',
        publishedAt: '2024-01-15T03:30:00Z',
        url: 'https://example.com/chainlink-oracles'
      },
      {
        title: 'Uniswap v4 em desenvolvimento',
        summary: 'UNI prepara nova versão com recursos avançados de liquidez e melhor UX',
        sentiment: 'positive',
        source: 'CryptoNews',
        publishedAt: '2024-01-15T02:15:00Z',
        url: 'https://example.com/uniswap-v4'
      },
      {
        title: 'Avalanche enfrenta competição',
        summary: 'AVAX perde market share para concorrentes Layer 1, mas mantém vantagens técnicas',
        sentiment: 'negative',
        source: 'CoinDesk',
        publishedAt: '2024-01-15T01:00:00Z',
        url: 'https://example.com/avalanche-competition'
      }
    ];
  }
} 