# 🔧 Configuração das Variáveis de Ambiente

## 📝 Passo a Passo

### 1. Criar arquivo `.env`

Na raiz do projeto (`cripto-blog/`), crie um arquivo chamado `.env` com o seguinte conteúdo:

```env
# CoinMarketCap API Key
VITE_COINMARKETCAP_API_KEY=c3f90724-13c6-4539-8eef-779c3e5cf730

# Crypto News API Key (opcional)
VITE_CRYPTO_NEWS_API_KEY=sua_api_key_aqui

# Hugging Face API Key (opcional)
VITE_HUGGING_FACE_API_KEY=sua_api_key_aqui

# Finnhub API Key (opcional)
VITE_FINNHUB_API_KEY=sua_api_key_aqui
```

### 2. Como criar o arquivo `.env`

#### No Windows (PowerShell):
```powershell
cd cripto-blog
echo "VITE_COINMARKETCAP_API_KEY=c3f90724-13c6-4539-8eef-779c3e5cf730" > .env
```

#### No Windows (CMD):
```cmd
cd cripto-blog
echo VITE_COINMARKETCAP_API_KEY=c3f90724-13c6-4539-8eef-779c3e5cf730 > .env
```

#### No Linux/Mac:
```bash
cd cripto-blog
echo "VITE_COINMARKETCAP_API_KEY=c3f90724-13c6-4539-8eef-779c3e5cf730" > .env
```

#### Manualmente:
1. Abra o VS Code ou seu editor preferido
2. Navegue até a pasta `cripto-blog/`
3. Crie um novo arquivo chamado `.env`
4. Cole o conteúdo acima
5. Salve o arquivo

### 3. Verificar se funcionou

Após criar o arquivo `.env`, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

Você deve ver no console do navegador mensagens indicando que está usando a API do CoinMarketCap.

### 4. Segurança

- ✅ O arquivo `.env` está no `.gitignore` e não será commitado
- ✅ Suas API keys estão protegidas
- ✅ O projeto funciona mesmo sem API keys (dados de exemplo)

### 5. Deploy

Para fazer deploy, configure as variáveis de ambiente no seu provedor:

#### Vercel:
1. Vá para Settings > Environment Variables
2. Adicione `VITE_COINMARKETCAP_API_KEY` com o valor da sua API key

#### Netlify:
1. Vá para Site Settings > Environment Variables
2. Adicione `VITE_COINMARKETCAP_API_KEY` com o valor da sua API key

## 🎯 Pronto!

Agora seu projeto está configurado com a API key do CoinMarketCap e pronto para usar dados reais de mercado! 🚀 