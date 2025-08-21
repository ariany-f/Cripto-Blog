# 🔧 Configuração das APIs

Para que o projeto funcione corretamente, você precisa configurar as chaves de API. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

## 📝 Arquivo .env

```env
# CoinMarketCap API Key
# Obtenha em: https://coinmarketcap.com/api/
VITE_COINMARKETCAP_API_KEY=sua_chave_aqui

# Crypto News API Key
# Obtenha em: https://cryptonews-api.com/
VITE_CRYPTONEWS_API_KEY=sua_chave_aqui

# Finnhub API Key
# Obtenha em: https://finnhub.io/
VITE_FINNHUB_API_KEY=sua_chave_aqui

# Hugging Face API Key
# Obtenha em: https://huggingface.co/settings/tokens
VITE_HUGGINGFACE_API_KEY=sua_chave_aqui
```

## 🔑 Como obter as chaves:

### 1. CoinMarketCap API
- Acesse: https://coinmarketcap.com/api/
- Faça login/cadastro
- Copie sua chave de API

### 2. Crypto News API
- Acesse: https://cryptonews-api.com/
- Faça login/cadastro
- Copie sua chave de API

### 3. Finnhub API
- Acesse: https://finnhub.io/
- Faça login/cadastro
- Copie sua chave de API

### 4. Hugging Face API
- Acesse: https://huggingface.co/settings/tokens
- Faça login/cadastro
- Crie um novo token
- Copie o token

## ⚠️ Importante

- **NUNCA** commite o arquivo `.env` no Git
- O arquivo `.env` já está no `.gitignore`
- Sem as chaves válidas, o app usará dados de exemplo
- As APIs gratuitas têm limites de requisições

## 🚀 Após configurar

1. Salve o arquivo `.env`
2. Reinicie o servidor de desenvolvimento: `npm run dev`
3. As APIs devem funcionar corretamente 