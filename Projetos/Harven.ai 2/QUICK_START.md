# 🚀 Harven.AI - Quick Start Guide

## 3 Formas de Publicar Seu Site (Escolha Uma)

---

## ⚡ Opção 1: Railway (MAIS RÁPIDO - 5 minutos)

### ✅ Melhor Para:
- Quem quer colocar no ar **AGORA**
- Não quer lidar com servidor
- SSL/HTTPS automático
- $0-5/mês

### 📝 Passos:

**1. Crie conta no Railway**
- Acesse: https://railway.app/
- Login com GitHub

**2. Deploy do Backend**
```
1. New Project → Deploy from GitHub
2. Selecione: harven-ai
3. Root Directory: backend
4. Adicione variáveis:
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua-chave-anon
   OPENAI_API_KEY=sk-sua-chave
   OPENAI_MODEL=gpt-4o-mini
   ENVIRONMENT=production
```

**3. Deploy do Frontend**
```
1. Add Service → GitHub Repo
2. Root Directory: harven.ai-platform-mockup
3. Build Command: npm install && npm run build
4. Start Command: npx serve -s dist -l 3000
5. Adicione variável:
   VITE_API_URL=https://backend-production-xxxx.railway.app
```

**4. Pronto! ✅**
- Frontend: `https://frontend-production-xxxx.railway.app`
- Backend: `https://backend-production-xxxx.railway.app`

---

## 🖥️ Opção 2: Servidor Próprio (VPS)

### ✅ Melhor Para:
- Quer controle total
- Precisa de domínio personalizado
- Tem experiência com servidores
- $5-20/mês

### 📝 Passos:

**1. Compre um VPS**
- DigitalOcean: https://digitalocean.com ($6/mês)
- Vultr: https://vultr.com ($5/mês)
- AWS Lightsail: https://aws.amazon.com/lightsail ($5/mês)

**Configuração Mínima:**
- Ubuntu 22.04
- 1GB RAM
- 1 vCPU
- 25GB SSD

**2. Conecte ao Servidor**
```bash
ssh root@seu-ip-aqui
```

**3. Instale Docker**
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
apt install docker-compose git -y
```

**4. Clone e Configure**
```bash
# Clone o projeto
cd /opt
git clone https://github.com/seu-usuario/harven-ai.git
cd harven-ai

# Configure variáveis
cp backend/.env.example backend/.env
nano backend/.env  # Edite aqui

# Configure firewall
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

**5. Deploy**
```bash
# Dar permissão ao script
chmod +x deploy.sh

# Executar
./deploy.sh
```

**6. Configurar Domínio (Opcional)**
```bash
# No seu provedor de DNS:
# Adicione registro A apontando para: SEU-IP-VPS

# Aguarde 5-60 minutos para propagação

# Instalar SSL (Let's Encrypt)
apt install certbot python3-certbot-nginx -y
certbot --nginx -d seu-dominio.com
```

**7. Pronto! ✅**
- Acesse: `http://seu-ip` ou `https://seu-dominio.com`

---

## 🌐 Opção 3: Vercel + Railway (Híbrido)

### ✅ Melhor Para:
- Frontend super rápido (CDN global)
- Backend no Railway
- Deploy automático via Git
- $0-5/mês

### 📝 Passos:

**1. Backend no Railway**
- Siga os passos da **Opção 1** para o backend

**2. Frontend no Vercel**
```
1. Acesse: https://vercel.com
2. Import Project → GitHub
3. Selecione: harven-ai
4. Root Directory: harven.ai-platform-mockup
5. Build Command: npm run build
6. Output Directory: dist
7. Adicione variável:
   VITE_API_URL=https://backend-production-xxxx.railway.app
```

**3. Pronto! ✅**
- Frontend: `https://harven-ai.vercel.app`
- Backend: `https://backend-production-xxxx.railway.app`

---

## 🔧 Configuração Inicial (TODAS AS OPÇÕES)

### 1️⃣ Criar Banco de Dados (Supabase)

**Passo 1:** Criar Projeto
```
1. Acesse: https://supabase.com
2. New Project
3. Nome: harven-ai
4. Database Password: [gere uma senha forte]
5. Region: South America (São Paulo)
```

**Passo 2:** Criar Buckets de Storage
```
1. Storage → New Bucket
2. Criar 2 buckets:
   - Nome: courses (Public)
   - Nome: avatars (Public)
```

**Passo 3:** Copiar Credenciais
```
Settings → API

Você precisa de:
- Project URL: https://xxxx.supabase.co
- anon public key: eyJhbGci...
```

### 2️⃣ Obter Chave OpenAI

```
1. Acesse: https://platform.openai.com/api-keys
2. Create new secret key
3. Copie: sk-proj-xxxxx
4. Adicione $5-10 de crédito (Settings → Billing)
```

### 3️⃣ Testar Localmente (Opcional mas Recomendado)

```bash
# 1. Clone
git clone https://github.com/seu-usuario/harven-ai.git
cd harven-ai

# 2. Configure backend/.env
cp backend/.env.example backend/.env
# Edite com suas credenciais

# 3. Teste com Docker
docker-compose up

# 4. Acesse:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

---

## 📋 Checklist Pré-Deploy

Antes de fazer deploy, certifique-se de ter:

- [ ] ✅ Conta no Supabase criada
- [ ] ✅ Projeto Supabase configurado
- [ ] ✅ Buckets `courses` e `avatars` criados
- [ ] ✅ Chave API OpenAI obtida
- [ ] ✅ Crédito na conta OpenAI ($5-10)
- [ ] ✅ Variáveis de ambiente anotadas:
  - `SUPABASE_URL`
  - `SUPABASE_KEY`
  - `OPENAI_API_KEY`
- [ ] ✅ Código commitado no GitHub (se usar Railway/Vercel)

---

## 🆘 Problemas Comuns

### ❌ "Banco de dados desconectado"
```
Solução: Verifique SUPABASE_URL e SUPABASE_KEY
```

### ❌ "OpenAI API key não configurada"
```
Solução: Adicione OPENAI_API_KEY nas variáveis de ambiente
```

### ❌ "CORS Error"
```
Solução: Configure FRONTEND_URL no backend com a URL correta
```

### ❌ "Upload failed: No storage bucket"
```
Solução: Crie os buckets 'courses' e 'avatars' no Supabase
```

### ❌ "502 Bad Gateway"
```
Solução: Backend provavelmente não está rodando
Verifique os logs: docker-compose logs backend
```

---

## 💰 Custos Mensais

### Setup Básico (100 alunos)
- Railway/Vercel: **$0-5** (free tier)
- Supabase: **$0** (free tier - 500MB)
- OpenAI: **$5-10** (~1000 interações)
- **Total: $5-15/mês**

### Setup Médio (500 alunos)
- VPS: **$6-12** (DigitalOcean/Vultr)
- Supabase: **$0** (ainda no free)
- OpenAI: **$20-40** (~5000 interações)
- **Total: $26-52/mês**

### Setup Grande (2000+ alunos)
- VPS: **$24** (4GB RAM)
- Supabase Pro: **$25**
- OpenAI: **$100-200**
- **Total: $150-250/mês**

---

## 📚 Próximos Passos

Depois do deploy:

1. **Configure usuários**
   - Acesse: `/admin`
   - Login: ADMIN001 / senha-do-banco
   - Criar professores e alunos

2. **Crie primeiro curso**
   - Upload de PDF/vídeo
   - Gere perguntas com IA
   - Teste o diálogo socrático

3. **Configure domínio personalizado**
   - Compre domínio (Namecheap, GoDaddy)
   - Configure DNS
   - Ative SSL

4. **Monitore uso**
   - OpenAI Dashboard: https://platform.openai.com/usage
   - Supabase Dashboard: Storage e Database size
   - Logs da aplicação

---

## 🎯 Links Importantes

- **Railway:** https://railway.app
- **Vercel:** https://vercel.com
- **DigitalOcean:** https://www.digitalocean.com
- **Supabase:** https://supabase.com
- **OpenAI:** https://platform.openai.com

- **Documentação Completa:** `/PRODUCTION_DEPLOY.md`
- **Arquitetura IA:** `/AI_AGENTS.md`
- **Deploy Docker:** `/DEPLOY.md`

---

🎉 **Sucesso! Agora vá lá e lance seu produto!**
