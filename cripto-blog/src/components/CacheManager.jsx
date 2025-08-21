import React, { useState, useEffect } from 'react';
import { getCacheInfo, clearAllCache } from '../services/coinmarketcapApi';
import './CacheManager.css';

export default function CacheManager() {
  const [cacheInfo, setCacheInfo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    updateCacheInfo();
  }, []);

  const updateCacheInfo = () => {
    const info = getCacheInfo();
    setCacheInfo(info);
  };

  const handleClearCache = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o cache? Isso forçará novas requisições à API.')) {
      clearAllCache();
      updateCacheInfo();
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  if (!isVisible) {
    return (
      <div className="cache-manager-toggle">
        <button 
          className="cache-toggle-btn"
          onClick={() => setIsVisible(true)}
          title="Gerenciar Cache"
        >
          💾 Cache
        </button>
      </div>
    );
  }

  return (
    <div className="cache-manager-overlay">
      <div className="cache-manager-modal">
        <div className="cache-manager-header">
          <h3>💾 Gerenciador de Cache</h3>
          <button 
            className="close-btn"
            onClick={() => setIsVisible(false)}
          >
            ✕
          </button>
        </div>

        <div className="cache-manager-content">
          {cacheInfo ? (
            <>
              <div className="cache-stats">
                <div className="stat-item">
                  <span className="stat-label">Total de Entradas:</span>
                  <span className="stat-value">{cacheInfo.totalEntries}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Entradas Expiradas:</span>
                  <span className="stat-value expired">{cacheInfo.expiredEntries}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Tamanho Total:</span>
                  <span className="stat-value">{formatBytes(cacheInfo.totalSize)}</span>
                </div>
              </div>

              <div className="cache-actions">
                <button 
                  className="refresh-cache-btn"
                  onClick={updateCacheInfo}
                >
                  🔄 Atualizar
                </button>
                <button 
                  className="clear-cache-btn"
                  onClick={handleClearCache}
                >
                  🗑️ Limpar Cache
                </button>
              </div>

              {cacheInfo.entries.length > 0 && (
                <div className="cache-entries">
                  <h4>Entradas do Cache:</h4>
                  <div className="entries-list">
                    {cacheInfo.entries.map((entry, index) => (
                      <div 
                        key={index} 
                        className={`cache-entry ${entry.isExpired ? 'expired' : 'active'}`}
                      >
                        <div className="entry-key">
                          {entry.key.replace('coinmarketcap_cache_', '')}
                        </div>
                        <div className="entry-details">
                          <span className="entry-size">
                            {formatBytes(entry.dataSize)}
                          </span>
                          <span className={`entry-status ${entry.isExpired ? 'expired' : 'active'}`}>
                            {entry.isExpired ? 'Expirado' : 'Ativo'}
                          </span>
                          <span className="entry-expires">
                            Expira: {formatDate(entry.expiresAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-cache">
              <p>Nenhuma informação de cache disponível.</p>
            </div>
          )}
        </div>

        <div className="cache-manager-footer">
          <p className="cache-info">
            💡 O cache é atualizado automaticamente a cada hora para otimizar as requisições à API.
          </p>
        </div>
      </div>
    </div>
  );
} 