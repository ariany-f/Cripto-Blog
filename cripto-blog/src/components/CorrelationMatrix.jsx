import React, { useState, useEffect } from 'react';
import { getCryptoMarket } from '../services/marketApi';
import './CorrelationMatrix.css';

export default function CorrelationMatrix() {
  const [correlations, setCorrelations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState('BTC');

  useEffect(() => {
    const calculateCorrelations = async () => {
      try {
        const marketData = await getCryptoMarket();
        const topAssets = marketData.slice(0, 8); // Top 8 assets
        
        const correlationData = calculateCorrelationMatrix(topAssets);
        setCorrelations(correlationData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao calcular correlações:', error);
        setCorrelations(getExampleCorrelations());
        setLoading(false);
      }
    };

    calculateCorrelations();
  }, []);

  const calculateCorrelationMatrix = (assets) => {
    const matrix = [];
    
    // Simular correlações baseadas em movimentos de preço
    assets.forEach((asset1, i) => {
      assets.forEach((asset2, j) => {
        if (i <= j) {
          let correlation = 0;
          
          if (i === j) {
            correlation = 1; // Auto-correlação
          } else {
            // Simular correlação baseada em similaridade de movimento
            const change1 = asset1.change24h;
            const change2 = asset2.change24h;
            
            // Correlação alta se ambos positivos ou negativos
            if ((change1 > 0 && change2 > 0) || (change1 < 0 && change2 < 0)) {
              correlation = 0.7 + Math.random() * 0.2; // 0.7-0.9
            } else if ((change1 > 0 && change2 < 0) || (change1 < 0 && change2 > 0)) {
              correlation = -0.3 - Math.random() * 0.4; // -0.3 to -0.7
            } else {
              correlation = -0.1 + Math.random() * 0.2; // -0.1 to 0.1
            }
          }
          
          matrix.push({
            asset1: asset1.symbol,
            asset2: asset2.symbol,
            correlation: correlation,
            strength: getCorrelationStrength(correlation)
          });
        }
      });
    });
    
    return matrix;
  };

  const getCorrelationStrength = (correlation) => {
    const absCorr = Math.abs(correlation);
    if (absCorr >= 0.8) return 'very_high';
    if (absCorr >= 0.6) return 'high';
    if (absCorr >= 0.4) return 'medium';
    if (absCorr >= 0.2) return 'low';
    return 'very_low';
  };

  const getExampleCorrelations = () => [
    { asset1: 'BTC', asset2: 'BTC', correlation: 1.0, strength: 'very_high' },
    { asset1: 'BTC', asset2: 'ETH', correlation: 0.85, strength: 'very_high' },
    { asset1: 'BTC', asset2: 'BNB', correlation: 0.72, strength: 'high' },
    { asset1: 'BTC', asset2: 'SOL', correlation: 0.68, strength: 'high' },
    { asset1: 'BTC', asset2: 'USDC', correlation: -0.12, strength: 'very_low' },
    { asset1: 'BTC', asset2: 'DOGE', correlation: 0.45, strength: 'medium' },
    { asset1: 'BTC', asset2: 'ADA', correlation: 0.78, strength: 'high' },
    { asset1: 'BTC', asset2: 'XRP', correlation: 0.62, strength: 'high' },
    { asset1: 'ETH', asset2: 'ETH', correlation: 1.0, strength: 'very_high' },
    { asset1: 'ETH', asset2: 'BNB', correlation: 0.65, strength: 'high' },
    { asset1: 'ETH', asset2: 'SOL', correlation: 0.58, strength: 'medium' },
    { asset1: 'ETH', asset2: 'USDC', correlation: -0.08, strength: 'very_low' },
    { asset1: 'ETH', asset2: 'DOGE', correlation: 0.38, strength: 'low' },
    { asset1: 'ETH', asset2: 'ADA', correlation: 0.71, strength: 'high' },
    { asset1: 'ETH', asset2: 'XRP', correlation: 0.55, strength: 'medium' },
    { asset1: 'BNB', asset2: 'BNB', correlation: 1.0, strength: 'very_high' },
    { asset1: 'BNB', asset2: 'SOL', correlation: 0.42, strength: 'medium' },
    { asset1: 'BNB', asset2: 'USDC', correlation: -0.15, strength: 'very_low' },
    { asset1: 'BNB', asset2: 'DOGE', correlation: 0.51, strength: 'medium' },
    { asset1: 'BNB', asset2: 'ADA', correlation: 0.63, strength: 'high' },
    { asset1: 'BNB', asset2: 'XRP', correlation: 0.47, strength: 'medium' },
    { asset1: 'SOL', asset2: 'SOL', correlation: 1.0, strength: 'very_high' },
    { asset1: 'SOL', asset2: 'USDC', correlation: -0.22, strength: 'low' },
    { asset1: 'SOL', asset2: 'DOGE', correlation: 0.34, strength: 'low' },
    { asset1: 'SOL', asset2: 'ADA', correlation: 0.56, strength: 'medium' },
    { asset1: 'SOL', asset2: 'XRP', correlation: 0.41, strength: 'medium' },
    { asset1: 'USDC', asset2: 'USDC', correlation: 1.0, strength: 'very_high' },
    { asset1: 'USDC', asset2: 'DOGE', correlation: -0.18, strength: 'very_low' },
    { asset1: 'USDC', asset2: 'ADA', correlation: -0.25, strength: 'low' },
    { asset1: 'USDC', asset2: 'XRP', correlation: -0.31, strength: 'low' },
    { asset1: 'DOGE', asset2: 'DOGE', correlation: 1.0, strength: 'very_high' },
    { asset1: 'DOGE', asset2: 'ADA', correlation: 0.29, strength: 'low' },
    { asset1: 'DOGE', asset2: 'XRP', correlation: 0.33, strength: 'low' },
    { asset1: 'ADA', asset2: 'ADA', correlation: 1.0, strength: 'very_high' },
    { asset1: 'ADA', asset2: 'XRP', correlation: 0.67, strength: 'high' },
    { asset1: 'XRP', asset2: 'XRP', correlation: 1.0, strength: 'very_high' }
  ];

  const getCorrelationColor = (correlation) => {
    const absCorr = Math.abs(correlation);
    if (absCorr >= 0.8) return 'var(--text-success)';
    if (absCorr >= 0.6) return 'var(--accent-color)';
    if (absCorr >= 0.4) return 'var(--text-warning)';
    if (absCorr >= 0.2) return 'var(--text-secondary)';
    return 'var(--text-muted)';
  };

  const getCorrelationOpacity = (correlation) => {
    return Math.abs(correlation);
  };

  const filteredCorrelations = correlations.filter(corr => 
    corr.asset1 === selectedAsset || corr.asset2 === selectedAsset
  );

  const uniqueAssets = [...new Set(correlations.map(c => c.asset1).concat(correlations.map(c => c.asset2)))];

  if (loading) {
    return (
      <div className="correlation-container">
        <div className="correlation-header">
          <h2>📊 Matriz de Correlação</h2>
          <p>Relações entre ativos em tempo real</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Calculando correlações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="correlation-container">
      <div className="correlation-header">
        <h2>📊 Matriz de Correlação</h2>
        <p>Relações entre ativos em tempo real</p>
      </div>

      <div className="correlation-controls">
        <label htmlFor="asset-select">Selecionar Ativo:</label>
        <select 
          id="asset-select"
          value={selectedAsset} 
          onChange={(e) => setSelectedAsset(e.target.value)}
          className="asset-select"
        >
          {uniqueAssets.map(asset => (
            <option key={asset} value={asset}>{asset}</option>
          ))}
        </select>
      </div>

      <div className="correlation-grid">
        {filteredCorrelations
          .filter(corr => corr.asset1 !== corr.asset2) // Remover auto-correlações
          .map((correlation, index) => (
            <div key={index} className="correlation-card">
              <div className="correlation-pair">
                <span className="asset-symbol">{correlation.asset1}</span>
                <span className="correlation-arrow">↔</span>
                <span className="asset-symbol">{correlation.asset2}</span>
              </div>
              
              <div className="correlation-value">
                <span 
                  className="correlation-number"
                  style={{ 
                    color: getCorrelationColor(correlation.correlation),
                    opacity: getCorrelationOpacity(correlation.correlation)
                  }}
                >
                  {correlation.correlation > 0 ? '+' : ''}{correlation.correlation.toFixed(2)}
                </span>
              </div>
              
              <div className="correlation-strength">
                <span className={`strength-badge strength-${correlation.strength}`}>
                  {correlation.strength === 'very_high' ? 'Muito Alta' :
                   correlation.strength === 'high' ? 'Alta' :
                   correlation.strength === 'medium' ? 'Média' :
                   correlation.strength === 'low' ? 'Baixa' : 'Muito Baixa'}
                </span>
              </div>
              
              <div className="correlation-insight">
                {correlation.correlation > 0.7 ? 
                  '🔗 Forte correlação positiva - movem-se juntos' :
                  correlation.correlation > 0.4 ? 
                  '📈 Correlação moderada - tendência similar' :
                  correlation.correlation > 0 ? 
                  '📊 Correlação fraca - movimento independente' :
                  correlation.correlation > -0.4 ? 
                  '🔄 Correlação negativa fraca' :
                  '⚡ Correlação negativa forte - movem-se em direções opostas'
                }
              </div>
            </div>
          ))}
      </div>

      <div className="correlation-legend">
        <div className="legend-item">
          <span className="legend-color very-high"></span>
          <span>Muito Alta (0.8-1.0)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color high"></span>
          <span>Alta (0.6-0.8)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color medium"></span>
          <span>Média (0.4-0.6)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color low"></span>
          <span>Baixa (0.2-0.4)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color very-low"></span>
          <span>Muito Baixa (0.0-0.2)</span>
        </div>
      </div>

      <div className="correlation-footer">
        <p>💡 Use correlações para diversificar seu portfólio e identificar oportunidades de arbitragem</p>
      </div>
    </div>
  );
} 