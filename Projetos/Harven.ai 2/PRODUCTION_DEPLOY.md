# 🚀 Harven.AI - Guia de Deploy em Produção

## Opções de Hospedagem

### 🟢 Recomendado para Começar: Railway ou Render
- **Custo:** $0-5/mês (free tier)
- **Facilidade:** ⭐⭐⭐⭐⭐
- **Deploy:** Git push automático
- **SSL:** Grátis e automático

### 🔵 Para Controle Total: VPS (DigitalOcean, AWS, Vultr)
- **Custo:** $5-20/mês
- **Facilidade:** ⭐⭐⭐
- **Deploy:** Manual via Docker
- **SSL:** Configurar Let's Encrypt

---

## Opção 1: Deploy no Railway (MAIS FÁCIL)

### Passo 1: Preparar Repositório
```bash
# 1. Commit todas as alterações
git add .
git commit -m "Prepare for production deploy"
git push origin main

# 2. Criar conta no Railway: https://railway.app/
```

### Passo 2: Deploy do Backend
```bash
# No Railway:
# 1. New Project > Deploy from GitHub
# 2. Selecione o repositório Harven.ai
# 3. Adicione as variáveis de ambiente:

SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon
OPENAI_API_KEY=sk-sua-chave-openai
OPENAI_MODEL=gpt-4o-mini
ENVIRONMENT=production
PORT=8000

# 4. Railway detecta automaticamente o Dockerfile
# 5. Deploy automático em ~3 minutos
```

### Passo 3: Deploy do Frontend
```bash
# No Railway:
# 1. New Service > Empty Service
# 2. Settings > Build Command:
npm install && npm run build

# 3. Start Command:
npx serve -s dist -l 3000

# 4. Adicionar variável:
VITE_API_URL=https://seu-backend.railway.app

# 5. Deploy automático
```

### Passo 4: Configurar Domínio (Opcional)
```bash
# No Railway:
# Settings > Domains > Generate Domain
# Você receberá: harven-frontend-production.up.railway.app
```

**Pronto! ✅ Seu site estará no ar em ~5 minutos.**

---

## Opção 2: Deploy em VPS (DigitalOcean)

### Passo 1: Criar Droplet
```bash
# 1. Acesse DigitalOcean.com
# 2. Create > Droplets
# 3. Escolha:
#    - Ubuntu 22.04 LTS
#    - Basic Plan - $6/mês (1GB RAM)
#    - Datacenter: São Paulo ou New York
# 4. Adicione sua chave SSH
# 5. Create Droplet
```

### Passo 2: Conectar ao Servidor
```bash
# SSH para o servidor
ssh root@seu-ip-aqui

# Atualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
apt install docker-compose -y

# Instalar Git
apt install git -y
```

### Passo 3: Clonar Projeto
```bash
# Clonar repositório
cd /opt
git clone https://github.com/seu-usuario/harven-ai.git
cd harven-ai

# Criar arquivo .env
cp backend/.env.example backend/.env
nano backend/.env  # Editar com suas credenciais
```

### Passo 4: Configurar Firewall
```bash
# Permitir portas HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp  # SSH
ufw enable
```

### Passo 5: Deploy com Docker
```bash
# Dar permissão ao script
chmod +x deploy.sh

# Executar deploy
./deploy.sh

# OU manualmente:
cd harven.ai-platform-mockup
npm install
npm run build
cd ..

docker-compose -f docker-compose.prod.yml up -d --build
```

### Passo 6: Configurar SSL (Let's Encrypt)
```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
certbot --nginx -d seu-dominio.com

# Auto-renovação (já configurado automaticamente)
```

### Passo 7: Configurar Domínio
```bash
# No seu provedor de DNS (GoDaddy, Namecheap, etc):
# Adicione registro A:
#   Nome: @ ou seu-dominio.com
#   Tipo: A
#   Valor: IP-DO-SEU-SERVIDOR
#   TTL: 3600

# Aguarde propagação (5-60 minutos)
```

**Pronto! ✅ Acesse: https://seu-dominio.com**

---

## Opção 3: Deploy no Vercel (Frontend) + Railway (Backend)

### Frontend no Vercel
```bash
# 1. Acesse vercel.com
# 2. Import Project > GitHub
# 3. Selecione harven.ai-platform-mockup
# 4. Configure:
#    Root Directory: harven.ai-platform-mockup
#    Build Command: npm run build
#    Output Directory: dist
# 5. Variáveis de ambiente:
VITE_API_URL=https://seu-backend.railway.app

# Deploy automático!
```

### Backend no Railway
(Seguir passos da Opção 1)

---

## Checklist Pré-Deploy

### ✅ Antes de Fazer Deploy

- [ ] Criar conta no Supabase e configurar banco
- [ ] Criar buckets no Supabase Storage: `courses`, `avatars`
- [ ] Obter chave API da OpenAI (https://platform.openai.com)
- [ ] Configurar variáveis de ambiente no `.env`
- [ ] Testar localmente: `docker-compose up`
- [ ] Fazer commit de todas as alterações
- [ ] Fazer backup do banco de dados (se existir)

### ✅ Configurações de Segurança

- [ ] Configurar CORS para seu domínio específico
- [ ] Ativar HTTPS (SSL)
- [ ] Configurar rate limiting (já incluído no nginx)
- [ ] Adicionar secrets manager para API keys
- [ ] Configurar backups automáticos do Supabase
- [ ] Ativar Row Level Security (RLS) no Supabase

### ✅ Pós-Deploy

- [ ] Testar login na plataforma
- [ ] Testar upload de arquivo
- [ ] Testar geração de perguntas com IA
- [ ] Verificar logs: `docker-compose logs -f`
- [ ] Configurar monitoramento (Sentry, Datadog)
- [ ] Documentar credenciais em local seguro

---

## Monitoramento e Logs

### Ver logs em tempo real
```bash
# Todos os serviços
docker-compose -f docker-compose.prod.yml logs -f

# Apenas backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Apenas nginx
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Verificar status
```bash
# Status dos containers
docker-compose -f docker-compose.prod.yml ps

# Health check
curl http://localhost/health
```

### Reiniciar serviços
```bash
# Reiniciar tudo
docker-compose -f docker-compose.prod.yml restart

# Reiniciar apenas backend
docker-compose -f docker-compose.prod.yml restart backend
```

---

## Troubleshooting

### 🔴 Backend não inicia
```bash
# Verificar logs
docker-compose -f docker-compose.prod.yml logs backend

# Verificar variáveis de ambiente
docker-compose -f docker-compose.prod.yml exec backend env | grep SUPABASE

# Testar conexão com Supabase
docker-compose -f docker-compose.prod.yml exec backend curl https://seu-projeto.supabase.co
```

### 🔴 Frontend mostra erro 502
```bash
# Backend provavelmente não está rodando
docker-compose -f docker-compose.prod.yml restart backend

# Verificar se backend está respondendo
curl http://localhost:8000/health
```

### 🔴 CORS Error
```bash
# Adicionar seu domínio no backend/main.py
# Linha 51-52:
allow_origins=["https://seu-dominio.com"],

# Rebuild
docker-compose -f docker-compose.prod.yml up -d --build backend
```

### 🔴 IA não funciona
```bash
# Verificar chave OpenAI
docker-compose -f docker-compose.prod.yml exec backend env | grep OPENAI

# Testar endpoint
curl -X GET http://localhost/api/ai/status
```

---

## Atualizações

### Atualizar código
```bash
# No servidor
cd /opt/harven-ai
git pull origin main

# Rebuild e restart
./deploy.sh

# OU
docker-compose -f docker-compose.prod.yml up -d --build
```

### Rollback em caso de erro
```bash
# Voltar para commit anterior
git reset --hard HEAD~1

# Rebuild
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## Custos Estimados

### Cenário Básico (100 alunos)
- **Hospedagem VPS:** $6/mês (DigitalOcean)
- **Supabase:** $0/mês (free tier)
- **OpenAI:** $5-10/mês (~1000 interações)
- **Domínio:** $10-15/ano
- **Total:** ~$12-17/mês

### Cenário Médio (500 alunos)
- **Hospedagem VPS:** $12/mês (2GB RAM)
- **Supabase:** $0/mês (ainda no free tier)
- **OpenAI:** $20-40/mês (~5000 interações)
- **Total:** ~$32-52/mês

### Cenário Grande (2000+ alunos)
- **Hospedagem VPS:** $24/mês (4GB RAM)
- **Supabase Pro:** $25/mês
- **OpenAI:** $100-200/mês (~20000 interações)
- **Total:** ~$150-250/mês

---

## Suporte

**Dúvidas?**
- Documentação: `/DEPLOY.md`, `/AI_AGENTS.md`
- Issues: GitHub Issues
- Logs: `docker-compose logs -f`

**Links Úteis:**
- Railway: https://railway.app
- DigitalOcean: https://www.digitalocean.com
- Vercel: https://vercel.com
- Supabase: https://supabase.com
- OpenAI: https://platform.openai.com

---

🎉 **Boa sorte com seu deploy!**
