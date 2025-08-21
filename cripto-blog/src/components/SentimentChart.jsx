import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './SentimentChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SentimentChart({ sentimentData }) {
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positivo':
        return 'rgba(16, 185, 129, 0.8)';
      case 'negativo':
        return 'rgba(239, 68, 68, 0.8)';
      default:
        return 'rgba(107, 114, 128, 0.8)';
    }
  };

  const getBorderColor = (sentiment) => {
    switch (sentiment) {
      case 'positivo':
        return 'rgba(16, 185, 129, 1)';
      case 'negativo':
        return 'rgba(239, 68, 68, 1)';
      default:
        return 'rgba(107, 114, 128, 1)';
    }
  };

  const data = {
    labels: sentimentData.map(d => d.coin || d.name),
    datasets: [
      {
        label: 'Sentimento Positivo',
        data: sentimentData.map(d => d.positiveScore || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Sentimento Neutro',
        data: sentimentData.map(d => d.neutralScore || 0),
        backgroundColor: 'rgba(107, 114, 128, 0.8)',
        borderColor: 'rgba(107, 114, 128, 1)',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Sentimento Negativo',
        data: sentimentData.map(d => d.negativeScore || 0),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      title: {
        display: true,
        text: '📈 Análise de Sentimento por Criptomoeda',
        font: {
          size: 16,
          weight: '700'
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
            return `${context.dataset.label}: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            weight: '600'
          },
          color: '#374151'
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          },
          color: '#6b7280',
          callback: function(value) {
            return value + '%';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // Se não houver dados, mostrar mensagem
  if (!sentimentData || sentimentData.length === 0) {
    return (
      <div className="sentiment-chart-container">
        <div className="no-data-message">
          <h3>📊 Análise de Sentimento</h3>
          <p>Nenhum dado de sentimento disponível no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sentiment-chart-container">
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
      
      <div className="sentiment-summary">
        <h4>📋 Resumo do Sentimento</h4>
        <div className="summary-stats">
          {sentimentData.map((item, index) => (
            <div key={index} className="summary-item">
              <span className="summary-coin">{item.coin || item.name}</span>
              <span className="summary-dominant">
                Dominante: {item.dominantSentiment || 'N/A'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 