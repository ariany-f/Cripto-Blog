import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CryptoDashboard from './components/CryptoDashboard';
import CryptoTicker from './components/CryptoTicker';
import NewsDetail from './components/NewsDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="main-header">
          <div className="header-container">
            <div className="logo-section">
              <h1 className="site-logo">CryptoNews</h1>
              <p className="site-tagline">Análise de mercado e notícias em tempo real</p>
            </div>
            <nav className="main-nav">
              <ul>
                <li><a href="#dashboard">Dashboard</a></li>
                <li><a href="#noticias">Notícias</a></li>
                <li><a href="#mercado">Mercado</a></li>
                <li><a href="#sentimento">Sentimento</a></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Ticker de Criptomoedas */}
        <CryptoTicker />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<CryptoDashboard />} />
            <Route path="/news/:id" element={<NewsDetail />} />
          </Routes>
        </main>

        <footer className="main-footer">
          <div className="footer-container">
            <div className="footer-section">
              <h3>Recursos</h3>
              <p>Dados em tempo real, análise de sentimento, notícias atualizadas e muito mais para acompanhar o mercado crypto.</p>
            </div>
            <div className="footer-section">
              <h3>APIs Utilizadas</h3>
              <p>CoinMarketCap, Crypto News API, Finnhub e Hugging Face para dados precisos e análises avançadas.</p>
            </div>
            <div className="footer-section">
              <h3>Tecnologias</h3>
              <p>React, Vite, Chart.js e design moderno para uma experiência de usuário excepcional.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 CryptoNews. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
