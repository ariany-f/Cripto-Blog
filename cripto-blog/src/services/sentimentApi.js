import axios from 'axios';

export async function analyzeSentiment(text) {
  try {
    const res = await axios.post(
      '/api/huggingface/models/cardiffnlp/twitter-roberta-base-sentiment',
      { inputs: text }
    );
    const label = res.data[0].label;
    const score = res.data[0].score;
    const sentimentMap = { 'LABEL_0': 'negativo', 'LABEL_1': 'neutro', 'LABEL_2': 'positivo' };
    return { sentiment: sentimentMap[label] || 'neutro', score: score, impact: Math.round(score * 100) };
  } catch (error) {
    console.error('Erro na análise de sentimento:', error);
    return { sentiment: 'neutro', score: 0.5, impact: 50 };
  }
}

export async function analyzeMultipleSentiments(newsArray) {
  const results = [];
  for (const news of newsArray) {
    const sentiment = await analyzeSentiment(news.title + ' ' + news.summary);
    results.push({ ...news, sentiment: sentiment.sentiment, sentimentScore: sentiment.score, impact: sentiment.impact });
  }
  return results;
} 