import React, { useState, useMemo } from 'react';
import './CryptoTable.css';

export default function CryptoTable({ data }) {
  const [sortBy, setSortBy] = useState('cmcRank');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterMarketCap, setFilterMarketCap] = useState('all');
  const [filterChange24h, setFilterChange24h] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
    let filtered = [...data];

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por Market Cap
    if (filterMarketCap !== 'all') {
      switch (filterMarketCap) {
        case 'large':
          filtered = filtered.filter(coin => coin.marketCap >= 10e9); // $10B+
          break;
        case 'medium':
          filtered = filtered.filter(coin => coin.marketCap >= 1e9 && coin.marketCap < 10e9); // $1B-$10B
          break;
        case 'small':
          filtered = filtered.filter(coin => coin.marketCap < 1e9); // <$1B
          break;
        default:
          break;
      }
    }

    // Filtro por Variação 24h
    if (filterChange24h !== 'all') {
      switch (filterChange24h) {
        case 'gainers':
          filtered = filtered.filter(coin => coin.change24h > 5); // >5%
          break;
        case 'losers':
          filtered = filtered.filter(coin => coin.change24h < -5); // <-5%
          break;
        case 'stable':
          filtered = filtered.filter(coin => coin.change24h >= -5 && coin.change24h <= 5); // -5% to 5%
          break;
        default:
          break;
      }
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'name' || sortBy === 'symbol') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [data, sortBy, sortOrder, filterMarketCap, filterChange24h, searchTerm]);

  const getSortIcon = (column) => {
    if (sortBy !== column) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

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
            <option value="gainers">Gainers (&gt;+5%)</option>
            <option value="losers">Losers (&lt;-5%)</option>
            <option value="stable">Estáveis (-5% a +5%)</option>
          </select>
        </div>

        <div className="filter-group">
          <label>📊 Resultados:</label>
          <span className="results-count">{filteredAndSortedData.length} de {data.length} moedas</span>
        </div>
      </div>

      <div className="crypto-table">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('cmcRank')} className="sortable">
                Rank {getSortIcon('cmcRank')}
              </th>
              <th onClick={() => handleSort('name')} className="sortable">
                Moeda {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('symbol')} className="sortable">
                Símbolo {getSortIcon('symbol')}
              </th>
              <th onClick={() => handleSort('price')} className="sortable">
                Preço Atual {getSortIcon('price')}
              </th>
              <th onClick={() => handleSort('change24h')} className="sortable">
                Variação 24h {getSortIcon('change24h')}
              </th>
              <th onClick={() => handleSort('volume24h')} className="sortable">
                Volume 24h {getSortIcon('volume24h')}
              </th>
              <th onClick={() => handleSort('marketCap')} className="sortable">
                Market Cap {getSortIcon('marketCap')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((coin) => (
              <tr key={coin.id} className="crypto-row">
                <td className="rank-column">
                  <span className="rank-badge">
                    {coin.cmcRank || 'N/A'}
                  </span>
                </td>
                <td className="name-column">
                  <div className="coin-info">
                    <span className="coin-icon">🪙</span>
                    <span className="coin-name">{coin.name}</span>
                  </div>
                </td>
                <td className="symbol-column">
                  <span className="symbol-badge">{coin.symbol}</span>
                </td>
                <td className="price-column">
                  <span className="coin-price">{formatNumber(coin.price)}</span>
                </td>
                <td className="change-column">
                  <div className="change-info">
                    <span className={`change-value ${getChangeColor(coin.change24h)}`}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="volume-column">
                  <span className="coin-volume">{formatNumber(coin.volume24h)}</span>
                </td>
                <td className="market-cap-column">
                  <span className="coin-market-cap">{formatNumber(coin.marketCap)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedData.length === 0 && (
        <div className="no-results">
          <p>Nenhuma criptomoeda encontrada com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
} 