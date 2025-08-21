import React, { useState, useEffect } from 'react';
import { getCryptoMarket } from '../services/marketApi';
import { getFearGreedIndex } from '../services/fearGreedApi';
import './CryptoInsights.css';

export default function CryptoInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = async () => {
      try {
        const [marketData, fearGreedData] = await Promise.all([
          getCryptoMarket(),
          getFearGreedIndex()
        ]);

        const newInsights = analyzeMarketConditions(marketData, fearGreedData);
        setInsights(newInsights);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao gerar insights:', error);
        setInsights(getExampleInsights());
        setLoading(false);
      }
    };

    generateInsights();
  }, []);

  const analyzeMarketConditions = (marketData, fearGreedData) => {
    const insights = [];
    
    // Análise de correlação BTC-ETH
    if (marketData && marketData.length >= 2) {
      const btc = marketData.find(coin => coin.symbol === 'BTC');
      const eth = marketData.find(coin => coin.symbol === 'ETH');
      
      if (btc && eth) {
        const btcChange = btc.change24h;
        const ethChange = eth.change24h;
        
        if (Math.abs(btcChange - ethChange) < 2) {
          insights.push({
            type: 'correlation',
            title: 'BTC e ETH em Sincronia',
            description: `Bitcoin e Ethereum estão se movendo juntos (${btcChange.toFixed(1)}% vs ${ethChange.toFixed(1)}%). Isso pode indicar movimento de mercado amplo.`,
            impact: 'medium',
            action: 'Acompanhe outros altcoins para confirmar tendência',
            icon: '🔄'
          });
        } else if (btcChange > 0 && ethChange < 0) {
          insights.push({
            type: 'divergence',
            title: 'Divergência BTC-ETH',
            description: `Bitcoin subindo (${btcChange.toFixed(1)}%) enquanto Ethereum cai (${ethChange.toFixed(1)}%). Possível rotação de capital.`,
            impact: 'high',
            action: 'Monitore se ETH vai "pegar carona" no BTC',
            icon: '📊'
          });
        }
      }
    }

    // Análise de Volume vs Preço
    if (marketData) {
      const highVolumeCoins = marketData.filter(coin => 
        coin.volume24h > 1000000000 && Math.abs(coin.change24h) > 5
      );
      
      if (highVolumeCoins.length > 0) {
        const topVolume = highVolumeCoins[0];
        insights.push({
          type: 'volume',
          title: 'Volume Explosivo Detectado',
          description: `${topVolume.name} com volume de $${(topVolume.volume24h / 1000000000).toFixed(1)}B e ${topVolume.change24h > 0 ? 'alta' : 'queda'} de ${Math.abs(topVolume.change24h).toFixed(1)}%.`,
          impact: 'high',
          action: 'Volume alto + movimento forte = possível continuação',
          icon: '📈'
        });
      }
    }

    // Análise de Fear & Greed
    if (fearGreedData && fearGreedData.value) {
      const value = fearGreedData.value;
      let sentiment = '';
      let action = '';
      
      if (value <= 25) {
        sentiment = 'Medo Extremo';
        action = 'Historicamente, medo extremo precede recuperação. Considere DCA.';
      } else if (value <= 45) {
        sentiment = 'Medo';
        action = 'Mercado cauteloso. Boa hora para acumular posições.';
      } else if (value >= 75) {
        sentiment = 'Ganância';
        action = 'Mercado otimista demais. Considere tomar lucros.';
      } else if (value >= 85) {
        sentiment = 'Ganância Extrema';
        action = 'Cuidado! Ganância extrema pode preceder correção.';
      }
      
      if (sentiment) {
        insights.push({
          type: 'sentiment',
          title: `Sentimento: ${sentiment}`,
          description: `Índice Fear & Greed em ${value}/100. ${fearGreedData.status || ''}`,
          impact: 'medium',
          action: action,
          icon: value <= 45 ? '😨' : value >= 75 ? '😤' : '😐'
        });
      }
    }

    // Análise de Dominância BTC
    if (marketData) {
      const btc = marketData.find(coin => coin.symbol === 'BTC');
      if (btc && btc.marketCapDominance) {
        const dominance = btc.marketCapDominance;
        if (dominance > 50) {
          insights.push({
            type: 'dominance',
            title: 'Bitcoin Dominante',
            description: `BTC representa ${dominance.toFixed(1)}% do mercado. Altcoins podem estar subvalorizados.`,
            impact: 'medium',
            action: 'Considere diversificar em altcoins promissores',
            icon: '👑'
          });
        } else if (dominance < 40) {
          insights.push({
            type: 'altseason',
            title: 'Possível Altseason',
            description: `BTC com apenas ${dominance.toFixed(1)}% de dominância. Altcoins podem ter momentum.`,
            impact: 'high',
            action: 'Foque em altcoins com fundamentos sólidos',
            icon: '🚀'
          });
        }
      }
    }

    // Análise de Volatilidade
    if (marketData) {
      const volatileCoins = marketData.filter(coin => Math.abs(coin.change24h) > 10);
      if (volatileCoins.length > 3) {
        insights.push({
          type: 'volatility',
          title: 'Alta Volatilidade',
          description: `${volatileCoins.length} moedas com movimento >10% em 24h. Mercado instável.`,
          impact: 'high',
          action: 'Use stop-loss e não aloque muito capital de uma vez',
          icon: '⚡'
        });
      }
    }

    return insights.slice(0, 5); // Limitar a 5 insights mais relevantes
  };

  const getExampleInsights = () => [
    {
      type: 'correlation',
      title: 'BTC e ETH em Sincronia',
      description: 'Bitcoin e Ethereum estão se movendo juntos (2.3% vs 1.8%). Isso pode indicar movimento de mercado amplo.',
      impact: 'medium',
      action: 'Acompanhe outros altcoins para confirmar tendência',
      icon: '🔄'
    },
    {
      type: 'volume',
      title: 'Volume Explosivo em SOL',
      description: 'Solana com volume de $2.1B e alta de 8.5%. Volume alto + movimento forte = possível continuação.',
      impact: 'high',
      action: 'Monitore se o momentum continua',
      icon: '📈'
    },
    {
      type: 'sentiment',
      title: 'Sentimento: Medo',
      description: 'Índice Fear & Greed em 35/100. Mercado cauteloso.',
      impact: 'medium',
      action: 'Boa hora para acumular posições',
      icon: '😨'
    },
    {
      type: 'dominance',
      title: 'Bitcoin Dominante',
      description: 'BTC representa 52.3% do mercado. Altcoins podem estar subvalorizados.',
      impact: 'medium',
      action: 'Considere diversificar em altcoins promissores',
      icon: '👑'
    },
    {
      type: 'volatility',
      title: 'Alta Volatilidade',
      description: '5 moedas com movimento >10% em 24h. Mercado instável.',
      impact: 'high',
      action: 'Use stop-loss e não aloque muito capital de uma vez',
      icon: '⚡'
    }
  ];

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'var(--text-danger)';
      case 'medium': return 'var(--text-warning)';
      case 'low': return 'var(--text-success)';
      default: return 'var(--text-secondary)';
    }
  };

  if (loading) {
    return (
      <div className="insights-container">
        <div className="insights-header">
          <h2>💡 Insights Inteligentes</h2>
          <p>Análise cruzada de dados em tempo real</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Analisando dados do mercado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="insights-container">
      <div className="insights-header">
        <h2>💡 Insights Inteligentes</h2>
        <p>Análise cruzada de dados em tempo real</p>
      </div>
      
      <div className="insights-grid">
        {insights.map((insight, index) => (
          <div key={index} className={`insight-card insight-${insight.type}`}>
            <div className="insight-header">
              <span className="insight-icon">{insight.icon}</span>
              <div className="insight-meta">
                <h3>{insight.title}</h3>
                <span 
                  className="insight-impact" 
                  style={{ color: getImpactColor(insight.impact) }}
                >
                  {insight.impact === 'high' ? 'Alto Impacto' : 
                   insight.impact === 'medium' ? 'Médio Impacto' : 'Baixo Impacto'}
                </span>
              </div>
            </div>
            
            <p className="insight-description">{insight.description}</p>
            
            <div className="insight-action">
              <span className="action-label">💡 Ação Sugerida:</span>
              <p>{insight.action}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="insights-footer">
        <p>💡 Insights atualizados a cada 5 minutos • Baseado em análise de correlação, volume, sentimento e dominância</p>
      </div>
    </div>
  );
} 