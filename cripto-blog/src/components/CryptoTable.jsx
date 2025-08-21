import React, { useState, useMemo } from 'react';
import './CryptoTable.css';

export default function CryptoTable({ data }) {
  const [sortBy, setSortBy] = useState('cmcRank');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterMarketCap, setFilterMarketCap] = useState('all');
  const [filterChange24h, setFilterChange24h] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Garantir que data seja sempre um array
  const safeData = Array.isArray(data) ? data : [];

  const formatNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...safeData];

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(coin => 
        coin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por Market Cap
    if (filterMarketCap !== 'all') {
      switch (filterMarketCap) {
        case 'large':
          filtered = filtered.filter(coin => (coin.marketCap || 0) >= 10e9); // $10B+
          break;
        case 'medium':
          filtered = filtered.filter(coin => (coin.marketCap || 0) >= 1e9 && (coin.marketCap || 0) < 10e9); // $1B-$10B
          break;
        case 'small':
          filtered = filtered.filter(coin => (coin.marketCap || 0) < 1e9); // <$1B
          break;
        default:
          break;
      }
    }

    // Filtro por Variação 24h
    if (filterChange24h !== 'all') {
      switch (filterChange24h) {
        case 'gainers':
          filtered = filtered.filter(coin => (coin.change24h || 0) > 5); // >5%
          break;
        case 'losers':
          filtered = filtered.filter(coin => (coin.change24h || 0) < -5); // <-5%
          break;
        case 'stable':
          filtered = filtered.filter(coin => (coin.change24h || 0) >= -5 && (coin.change24h || 0) <= 5); // -5% to 5%
          break;
        default:
          break;
      }
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || 0;
      let bValue = b[sortBy] || 0;

      if (sortBy === 'name' || sortBy === 'symbol') {
        aValue = (aValue || '').toLowerCase();
        bValue = (bValue || '').toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [safeData, sortBy, sortOrder, filterMarketCap, filterChange24h, searchTerm]);

  const getSortIcon = (column) => {
    if (sortBy !== column) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  // Se não há dados, mostrar mensagem
  if (safeData.length === 0) {
    return (
      <div className="crypto-table-container">
        <div className="no-data-message">
          <p>📊 Nenhum dado de mercado disponível no momento.</p>
          <p>Tente atualizar a página ou verificar sua conexão.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crypto-table-container">
      {/* Filtros */}
      <div className="table-filters">
        <div className="filter-group">
          <label>🔍 Buscar:</label>
          <input
            type="text"
            placeholder="Nome ou símbolo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>💰 Market Cap:</label>
          <select
            value={filterMarketCap}
            onChange={(e) => setFilterMarketCap(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos os tamanhos</option>
            <option value="large">Large Cap (&gt;$10B)</option>
            <option value="medium">Mid Cap ($1B-$10B)</option>
            <option value="small">Small Cap (&lt;$1B)</option>
          </select>
        </div>

        <div className="filter-group">
          <label>📈 Variação 24h:</label>
          <select
            value={filterChange24h}
            onChange={(e) => setFilterChange24h(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas as variações</option>
            <option value="gainers">Gainers (&gt;5%)</option>
            <option value="losers">Losers (&lt;-5%)</option>
            <option value="stable">Estáveis (-5% a 5%)</option>
          </select>
        </div>

        <div className="filter-group">
          <label>📊 Resultados:</label>
          <span className="results-count">
            {filteredAndSortedData.length} de {safeData.length} moedas
          </span>
        </div>
      </div>

      {/* Tabela */}
      <div className="table-container">
        <table className="crypto-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('cmcRank')} className="sortable">
                RANK {getSortIcon('cmcRank')}
              </th>
              <th onClick={() => handleSort('name')} className="sortable">
                MOEDA {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('symbol')} className="sortable">
                SÍMBOLO {getSortIcon('symbol')}
              </th>
              <th onClick={() => handleSort('price')} className="sortable">
                PREÇO ATUAL {getSortIcon('price')}
              </th>
              <th onClick={() => handleSort('change24h')} className="sortable">
                VARIAÇÃO 24H {getSortIcon('change24h')}
              </th>
              <th onClick={() => handleSort('volume24h')} className="sortable">
                VOLUME 24H {getSortIcon('volume24h')}
              </th>
              <th onClick={() => handleSort('marketCap')} className="sortable">
                MARKET CAP {getSortIcon('marketCap')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((coin, index) => (
              <tr key={`${coin.symbol}-${index}`}>
                <td className="rank-cell">
                  <span className="rank-number">#{coin.cmcRank || index + 1}</span>
                </td>
                <td className="name-cell">
                  <div className="coin-info">
                    <span className="coin-name">{coin.name || 'N/A'}</span>
                  </div>
                </td>
                <td className="symbol-cell">
                  <span className="coin-symbol">{coin.symbol || 'N/A'}</span>
                </td>
                <td className="price-cell">
                  <span className="price-value">{formatNumber(coin.price || 0)}</span>
                </td>
                <td className={`change-cell ${getChangeColor(coin.change24h || 0)}`}>
                  <span className="change-value">
                    {(coin.change24h || 0) >= 0 ? '+' : ''}{(coin.change24h || 0).toFixed(2)}%
                  </span>
                </td>
                <td className="volume-cell">
                  <span className="volume-value">{formatNumber(coin.volume24h || 0)}</span>
                </td>
                <td className="market-cap-cell">
                  <span className="market-cap-value">{formatNumber(coin.marketCap || 0)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredAndSortedData.length === 0 && (
        <div className="no-results-message">
          <p>🔍 Nenhuma moeda encontrada com os filtros aplicados.</p>
          <p>Tente ajustar os filtros ou a busca.</p>
        </div>
      )}
    </div>
  );
} 