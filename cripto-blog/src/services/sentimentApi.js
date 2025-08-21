import axios from 'axios';

export async function analyzeSentiment(text) {
  try {
    const response = await axios.post('/api/huggingface/models/cardiffnlp/twitter-roberta-base-sentiment', {
      inputs: text
    });
    return response.data[0];
  } catch (error) {
    console.error('Erro na análise de sentimento:', error);
    
    // Fallback: análise simples baseada em palavras-chave
    const positiveWords = ['alta', 'cresce', 'positivo', 'sucesso', 'lucro', 'ganho', 'forte', 'bom', 'ótimo', 'excelente', 'supera', 'atinge', 'avança', 'progresso', 'melhora'];
    const negativeWords = ['queda', 'cai', 'negativo', 'perda', 'problema', 'fraco', 'ruim', 'pior', 'correção', 'queda', 'enfrenta', 'competição', 'risco'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) {
      return [{ label: 'POSITIVE', score: 0.8 }];
    } else if (negativeCount > positiveCount) {
      return [{ label: 'NEGATIVE', score: 0.7 }];
    } else {
      return [{ label: 'NEUTRAL', score: 0.6 }];
    }
  }
}

export async function analyzeMultipleSentiments(newsArray) {
  try {
    const sentiments = await Promise.all(
      newsArray.slice(0, 10).map(news => analyzeSentiment(news.title + ' ' + news.summary))
    );
    
    const positive = sentiments.filter(s => s[0]?.label === 'POSITIVE').length;
    const negative = sentiments.filter(s => s[0]?.label === 'NEGATIVE').length;
    const neutral = sentiments.filter(s => s[0]?.label === 'NEUTRAL').length;
    const total = sentiments.length;
    
    return [
      { label: 'Positivo', value: Math.round((positive / total) * 100), color: '#34a853' },
      { label: 'Neutro', value: Math.round((neutral / total) * 100), color: '#9aa0a6' },
      { label: 'Negativo', value: Math.round((negative / total) * 100), color: '#ea4335' }
    ];
  } catch (error) {
    console.error('Erro na análise múltipla de sentimento:', error);
    
    // Fallback com dados de exemplo
    return [
      { label: 'Positivo', value: 60, color: '#34a853' },
      { label: 'Neutro', value: 25, color: '#9aa0a6' },
      { label: 'Negativo', value: 15, color: '#ea4335' }
    ];
  }
} 