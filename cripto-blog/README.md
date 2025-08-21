# 🚀 Blog de Criptomoedas

Um dashboard completo de criptomoedas com notícias em tempo real, análise de sentimento, dados de mercado e sistema de cache inteligente.

## ✨ Funcionalidades

- 📰 **Notícias em Tempo Real**: Últimas notícias de criptomoedas
- 🧠 **Análise de Sentimento**: IA analisa o sentimento das notícias (positivo, neutro, negativo)
- 📊 **Dados de Mercado**: Preços, variações e volumes das principais criptomoedas
- 📈 **Gráficos Interativos**: Visualização do sentimento por criptomoeda
- 🔄 **Atualização Automática**: Dados atualizados a cada 5 minutos
- 💾 **Sistema de Cache**: Otimização de requisições com localStorage
- 🏆 **Ranking CoinMarketCap**: Posicionamento das criptomoedas
- 📱 **Design Responsivo**: Funciona perfeitamente em desktop e mobile

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework principal
- **Vite** - Build tool e dev server
- **Axios** - Requisições HTTP
- **Chart.js + React-Chartjs-2** - Gráficos interativos
- **localStorage** - Sistema de cache
- **CSS3** - Estilização moderna e responsiva

## 🚀 Como Executar

1. **Clone o repositório**:
```bash
git clone <seu-repositorio>
cd cripto-blog
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Configure as variáveis de ambiente**:
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas API keys
```

4. **Execute o projeto**:
```bash
npm run dev
```

5. **Acesse no navegador**:
```
http://localhost:5173
```

## 🔧 Configuração de APIs

### 1. CoinMarketCap API (Recomendado)
Para dados de mercado mais precisos, obtenha uma API key em: https://coinmarketcap.com/api/

Adicione ao arquivo `.env`:
```env
VITE_COINMARKETCAP_API_KEY=sua_api_key_aqui
```

**Vantagens do CoinMarketCap:**
- Dados mais precisos e atualizados
- Ranking oficial das criptomoedas
- Informações detalhadas de supply
- Sistema de cache integrado

### 2. Crypto News API
Para notícias reais, obtenha uma API key em: https://cryptonews-api.com/

Adicione ao arquivo `.env`:
```env
VITE_CRYPTO_NEWS_API_KEY=sua_api_key_aqui
```

### 3. Hugging Face Inference API
Para análise de sentimento real, obtenha uma API key em: https://huggingface.co/

Adicione ao arquivo `.env`:
```env
VITE_HUGGING_FACE_API_KEY=sua_api_key_aqui
```

### 4. Finnhub API
Para notícias adicionais, obtenha uma API key em: https://finnhub.io/

Adicione ao arquivo `.env`:
```env
VITE_FINNHUB_API_KEY=sua_api_key_aqui
```

### 5. CoinGecko API
A API do CoinGecko é gratuita e não requer configuração adicional. É usada como fallback.

## 💾 Sistema de Cache

O projeto inclui um sistema inteligente de cache que:

- **Armazena dados** no localStorage por 1 hora
- **Reduz requisições** à API do CoinMarketCap
- **Melhora performance** e velocidade de carregamento
- **Gerenciamento visual** através do botão "💾 Cache"

### Como Funciona:
1. Primeira requisição: busca dados da API e salva no cache
2. Requisições subsequentes: usa dados do cache se ainda válidos
3. Cache expira: automaticamente busca novos dados
4. Limpeza automática: remove entradas expiradas

### Gerenciar Cache:
- Clique no botão "💾 Cache" no canto inferior direito
- Visualize estatísticas do cache
- Limpe manualmente o cache se necessário
- Monitore entradas ativas e expiradas

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── CryptoDashboard.jsx    # Componente principal
│   ├── NewsCard.jsx          # Card de notícias
│   ├── CryptoTable.jsx       # Tabela de dados de mercado
│   ├── SentimentChart.jsx    # Gráfico de sentimento
│   ├── FinnhubNews.jsx       # Notícias Finnhub
│   ├── CacheManager.jsx      # Gerenciador de cache
│   └── *.css                 # Estilos dos componentes
├── services/
│   ├── coinmarketcapApi.js   # API CoinMarketCap com cache
│   ├── marketApi.js          # API de dados de mercado
│   ├── newsApi.js           # API de notícias
│   ├── sentimentApi.js      # API de análise de sentimento
│   └── finnhubApi.js        # API Finnhub
├── App.jsx                  # Componente raiz
└── main.jsx                # Ponto de entrada
```

## 🎨 Componentes

### NewsCard
Exibe notícias com:
- Título e link
- Resumo da notícia
- Análise de sentimento com indicador visual
- Fonte e data de publicação
- Tags das criptomoedas relacionadas

### CryptoTable
Tabela com dados de mercado:
- Ranking CoinMarketCap
- Preço atual
- Variação 24h
- Volume de negociação
- Market cap
- Indicadores visuais de alta/baixa

### SentimentChart
Gráfico de barras mostrando:
- Distribuição de sentimento por criptomoeda
- Percentuais de positivo, neutro e negativo
- Resumo do sentimento dominante

### CacheManager
Gerenciador de cache com:
- Estatísticas de uso
- Visualização de entradas
- Limpeza manual
- Informações de expiração

## 🔄 Fluxo de Dados

1. **Verificação de Cache**: Verifica se dados estão em cache
2. **Busca de Dados**: Se não em cache, busca da API
3. **Armazenamento**: Salva dados no cache com timestamp
4. **Análise de Sentimento**: Processa notícias com IA
5. **Renderização**: Atualiza interface com novos dados
6. **Atualização Automática**: Processo se repete a cada 5 minutos

## 🎯 Funcionalidades Principais

### Sistema de Cache Inteligente
- Cache automático por 1 hora
- Limpeza de entradas expiradas
- Interface de gerenciamento
- Otimização de requisições

### Dados de Mercado Avançados
- Ranking oficial CoinMarketCap
- Dados de supply (circulante, total, máximo)
- Informações detalhadas de volume
- Fallback para CoinGecko

### Análise de Sentimento
- Usa modelo de IA para classificar notícias
- Calcula impacto percentual
- Agrupa por criptomoeda
- Determina sentimento dominante

### Interface Responsiva
- Design adaptável para mobile
- Animações suaves
- Indicadores visuais intuitivos
- Loading states elegantes

## 🔐 Segurança

- **Variáveis de ambiente**: API keys protegidas no arquivo `.env`
- **Gitignore**: Arquivo `.env` não é commitado no repositório
- **Fallback**: Sistema funciona mesmo sem API keys (dados de exemplo)
- **Cache seguro**: Dados sensíveis não são expostos

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Deploy automático a cada push

### Netlify
1. Build: `npm run build`
2. Publish directory: `dist`
3. Configure as variáveis de ambiente no painel do Netlify

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Configure as variáveis de ambiente
4. Commit suas mudanças
5. Push para a branch
6. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Se encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as dependências estão instaladas
2. Confirme se as variáveis de ambiente estão configuradas
3. Verifique o console do navegador para erros
4. Use o gerenciador de cache para diagnosticar problemas
5. Abra uma issue no repositório

## 🔮 Próximas Funcionalidades

- [ ] Alertas de preço
- [ ] Portfolio tracker
- [ ] Mais indicadores técnicos
- [ ] Notificações push
- [ ] Modo escuro
- [ ] Mais criptomoedas
- [ ] Histórico de preços
- [ ] Comparação de moedas
- [ ] Exportação de dados
- [ ] Widgets personalizáveis

---

**Desenvolvido com ❤️ para a comunidade crypto**
