import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './SentimentChart.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function SentimentChart({ data = [] }) {
  // Verificar se data existe e é um array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="sentiment-chart-container">
        <div className="chart-header">
          <h3>📊 Análise de Sentimento</h3>
          <p>Dados de sentimento das notícias</p>
        </div>
        <div className="no-data-message">
          <p>📈 Nenhum dado de sentimento disponível no momento.</p>
        </div>
      </div>
    );
  }

  // Preparar dados para o gráfico de pizza
  const chartData = {
    labels: data.map(item => item.label || 'Desconhecido'),
    datasets: [
      {
        data: data.map(item => item.value || 0),
        backgroundColor: data.map(item => item.color || '#9ca3af'),
        borderColor: data.map(item => item.color || '#9ca3af'),
        borderWidth: 2,
        hoverOffset: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600',
            family: 'Google Sans, Manrope, sans-serif'
          },
          color: '#374151'
        }
      },
      title: {
        display: true,
        text: '📊 Distribuição de Sentimento das Notícias',
        font: {
          size: 16,
          weight: '700',
          family: 'Google Sans, Manrope, sans-serif'
        },
        color: '#1f2937',
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    radius: '90%'
  };

  return (
    <div className="sentiment-chart-container">
      <div className="chart-header">
        <h3>📊 Análise de Sentimento</h3>
        <p>Distribuição do sentimento das notícias analisadas</p>
      </div>
      
      <div className="chart-content">
        <div className="chart-wrapper">
          <Doughnut data={chartData} options={options} />
        </div>
        
        <div className="sentiment-summary">
          <h4>📈 Resumo</h4>
          <div className="summary-stats">
            {data.map((item, index) => (
              <div key={index} className="summary-stat">
                <div className="stat-color" style={{ backgroundColor: item.color }}></div>
                <div className="stat-info">
                  <span className="stat-label">{item.label}</span>
                  <span className="stat-value">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 