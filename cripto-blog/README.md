# CryptoNews - Análise de Mercado e Notícias em Tempo Real

Um dashboard completo para acompanhar o mercado de criptomoedas com dados em tempo real, notícias e análises.

## 🚀 Funcionalidades

- **📊 Dados de Mercado**: Preços, volumes e variações das principais criptomoedas
- **📰 Notícias**: Feed de notícias crypto com paginação
- **📈 Ticker**: Preços em tempo real com scroll automático
- **🎯 Filtros**: Busca e filtros por market cap, variação 24h e sentimento
- **📱 Responsivo**: Design adaptável para mobile e desktop
- **⚡ Performance**: Cache inteligente e otimizações

## 🛠️ Tecnologias

- **React 18** - Interface de usuário
- **Vite** - Build tool e dev server
- **Axios** - Cliente HTTP
- **Chart.js** - Gráficos interativos
- **CSS3** - Estilização moderna com Google Material Design

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd cripto-blog
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as APIs** (Opcional)
Crie um arquivo `.env` na raiz do projeto:

```env
# CoinMarketCap API (https://coinmarketcap.com/api/)
VITE_COINMARKETCAP_API_KEY=sua_chave_aqui

# Crypto News API (https://cryptonews-api.com/)
VITE_CRYPTONEWS_API_KEY=sua_chave_aqui

# Finnhub API (https://finnhub.io/)
VITE_FINNHUB_API_KEY=sua_chave_aqui

# Hugging Face API (https://huggingface.co/)
VITE_HUGGINGFACE_API_KEY=sua_chave_aqui
```

4. **Execute o projeto**
```bash
npm run dev
```

## 🔑 Como Obter as Chaves das APIs

### CoinMarketCap API (Gratuita)
1. Acesse [https://coinmarketcap.com/api/](https://coinmarketcap.com/api/)
2. Faça login/cadastro
3. Copie sua API key
4. Limite: 10.000 requests/mês

### Crypto News API (Gratuita)
1. Acesse [https://cryptonews-api.com/](https://cryptonews-api.com/)
2. Faça cadastro gratuito
3. Copie sua API key
4. Limite: 100 requests/dia

### Finnhub API (Gratuita)
1. Acesse [https://finnhub.io/](https://finnhub.io/)
2. Faça cadastro gratuito
3. Copie sua API key
4. Limite: 60 requests/minuto

### Hugging Face API (Gratuita)
1. Acesse [https://huggingface.co/](https://huggingface.co/)
2. Faça cadastro
3. Vá em Settings > Access Tokens
4. Crie um novo token
5. Limite: 30.000 requests/mês

## ⚠️ Importante

- **NÃO** commite o arquivo `.env` no repositório
- O projeto funciona com dados de exemplo se as APIs não estiverem configuradas
- As APIs gratuitas têm limites de requests - use com moderação

## 🎨 Design System

O projeto utiliza o **Google Material Design 3** com:
- Paleta de cores profissional (azul, cinza, branco)
- Tipografia Google Sans + Manrope
- Sistema de espaçamento 8pt
- Sombras e bordas consistentes
- Animações suaves

## 📱 Responsividade

- **Desktop**: Layout 3 colunas com sidebars
- **Tablet**: Layout adaptativo
- **Mobile**: Layout em coluna única

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar código
```

## 🐛 Solução de Problemas

### Erro 401/403/429 nas APIs
- Verifique se as chaves estão corretas no `.env`
- Aguarde alguns minutos se atingiu o limite de requests
- O app funciona com dados de exemplo

### Erro "data is not iterable"
- Já corrigido no código atual
- Garantia de que marketData seja sempre um array

### Performance lenta
- Removido intervalos automáticos para evitar rate limiting
- Use o botão "Atualizar" manualmente

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para a comunidade crypto**
