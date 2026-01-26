# 🔧 Harven.AI - Guia de Configuração Completo

## ⚠️ ATENÇÃO: Configure Antes de Publicar!

Este guia vai te ajudar a configurar tudo que é necessário para colocar a plataforma no ar.

---

## 📋 Checklist Pré-Configuração

Antes de começar, certifique-se de ter:

- [ ] ✅ Conta criada no Supabase (https://supabase.com)
- [ ] ✅ Conta criada na OpenAI (https://platform.openai.com)
- [ ] ✅ Créditos adicionados na OpenAI ($5-10 recomendado)
- [ ] ✅ Docker instalado (se for fazer deploy local)

---

## 🔑 PASSO 1: Configurar OpenAI (OBRIGATÓRIO)

### 1.1. Obter Chave API

1. Acesse: https://platform.openai.com/api-keys
2. Clique em **"Create new secret key"**
3. Copie a chave (começa com `sk-proj-...` ou `sk-...`)
4. **IMPORTANTE:** Guarde em local seguro, só aparece uma vez!

### 1.2. Adicionar Créditos

1. Vá em: https://platform.openai.com/settings/organization/billing
2. Clique em **"Add payment method"**
3. Adicione cartão de crédito
4. Adicione **$5-10 de crédito inicial**

### 1.3. Configurar no Projeto

Abra o arquivo `backend/.env` e substitua:

```bash
# ANTES (NÃO FUNCIONA):
OPENAI_API_KEY=sua-chave-aqui

# DEPOIS (substitua pela sua chave real):
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxx
```

---

## 🗄️ PASSO 2: Configurar Supabase (JÁ CONFIGURADO ✅)

Seu Supabase já está configurado! Mas vamos verificar:

### 2.1. Verificar Buckets de Storage

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: `kllkgrkjmxqdlsrhyrun`
3. Vá em **Storage** no menu lateral
4. Verifique se existem 2 buckets:
   - ✅ **courses** (para PDFs, vídeos, etc)
   - ✅ **avatars** (para fotos de perfil)

### 2.2. Se os Buckets Não Existirem

Execute o script de setup:

```bash
# Entre na pasta backend
cd backend

# Execute o script
python setup_supabase.py
```

---

## 🚀 PASSO 3: Escolher Forma de Deploy

Você tem **3 opções** para publicar a plataforma:

### 🟢 Opção A: Railway (RECOMENDADO - Mais Rápido)

**Vantagens:** Deploy automático, HTTPS grátis, $0-5/mês

**Passos Rápidos:**
1. Acesse: https://railway.app
2. Login com GitHub
3. Clique em **"Deploy from GitHub"**
4. Selecione o repositório `harven-ai`
5. Configure variáveis de ambiente (copie do `.env`)
6. Pronto! Site no ar em 5 minutos

👉 **Guia Detalhado:** Veja `QUICK_START.md` → Opção 1

---

### 🔵 Opção B: VPS (DigitalOcean, Vultr, AWS)

**Vantagens:** Controle total, domínio personalizado

**Passos Rápidos:**
1. Compre um VPS (Ubuntu 22.04, 1GB RAM, $5-6/mês)
2. Conecte via SSH: `ssh root@seu-ip`
3. Instale Docker: `curl -fsSL https://get.docker.com | sh`
4. Clone o projeto no servidor
5. Execute: `./deploy.sh`

👉 **Guia Detalhado:** Veja `PRODUCTION_DEPLOY.md` → Opção 2

---

### 🟡 Opção C: Local (Desenvolvimento)

**Vantagens:** Testar antes de publicar, grátis

**Passos Rápidos:**

```bash
# 1. Configure o .env (já feito acima)

# 2. Execute o deploy local
deploy.bat   # Windows
./deploy.sh  # Linux/Mac

# 3. Acesse: http://localhost
```

---

## ✅ PASSO 4: Testar a Plataforma

Após o deploy, teste:

### 4.1. Verificar Backend
```bash
curl http://seu-site.com/health
# Deve retornar: {"status": "ok"}
```

### 4.2. Testar Upload
1. Faça login na plataforma
2. Vá em **"Criação de Conteúdo"**
3. Tente fazer upload de um PDF
4. Verifique se aparece na lista

### 4.3. Testar IA
1. Crie uma disciplina de teste
2. Adicione conteúdo de teste
3. Clique em **"Gerar Perguntas com IA"**
4. Verifique se as perguntas são geradas

---

## 🔒 PASSO 5: Segurança (IMPORTANTE!)

### 5.1. Nunca Commite o .env

O arquivo `.env` contém suas chaves secretas. **NUNCA** faça commit dele no Git!

```bash
# Verifique se está no .gitignore
cat .gitignore | grep .env

# Se não estiver, adicione:
echo "backend/.env" >> .gitignore
```

### 5.2. Configure CORS em Produção

No arquivo `backend/main.py`, atualize a linha 51:

```python
# DESENVOLVIMENTO (aceita qualquer origem):
allow_origins=["*"]

# PRODUÇÃO (apenas seu domínio):
allow_origins=["https://seu-dominio.com"]
```

### 5.3. Ative HTTPS

Se estiver usando VPS, configure SSL com Let's Encrypt:

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d seu-dominio.com
```

---

## 💰 PASSO 6: Monitorar Custos

### 6.1. Monitorar OpenAI

Acesse: https://platform.openai.com/usage

- Veja quanto está gastando em tempo real
- Configure alertas de gasto
- Defina limite mensal ($20, $50, etc)

### 6.2. Custos Estimados

**100 alunos/mês:**
- Hospedagem: $0-6
- Supabase: $0 (free tier)
- OpenAI: $5-10
- **Total: ~$5-16/mês**

**500 alunos/mês:**
- Hospedagem: $12
- Supabase: $0
- OpenAI: $20-40
- **Total: ~$32-52/mês**

---

## 🆘 Problemas Comuns

### ❌ "Banco de dados desconectado"
```bash
# Verifique as credenciais no .env
cat backend/.env | grep SUPABASE
```

### ❌ "OpenAI API key não configurada"
```bash
# Verifique se a chave está correta
cat backend/.env | grep OPENAI_API_KEY

# A chave deve começar com "sk-"
# NÃO pode ser "sua-chave-aqui"
```

### ❌ "Upload failed: No storage bucket"
```bash
# Execute o script de setup do Supabase
cd backend
python setup_supabase.py
```

### ❌ "CORS Error"
```bash
# Configure FRONTEND_URL no .env
echo "FRONTEND_URL=https://seu-dominio.com" >> backend/.env

# Reinicie o servidor
docker-compose -f docker-compose.prod.yml restart
```

---

## 📚 Próximos Passos

Depois de configurar tudo:

1. **Teste localmente primeiro:**
   ```bash
   deploy.bat  # ou ./deploy.sh
   ```

2. **Se funcionou, publique:**
   - Railway: Deploy automático via GitHub
   - VPS: Execute deploy.sh no servidor

3. **Configure domínio (opcional):**
   - Compre domínio (GoDaddy, Namecheap, etc)
   - Aponte para o IP do servidor
   - Configure SSL

4. **Monitore:**
   - OpenAI Usage Dashboard
   - Logs do servidor: `docker-compose logs -f`
   - Supabase Dashboard

---

## 📞 Suporte

**Documentação:**
- `README.md` - Visão geral
- `QUICK_START.md` - Deploy rápido
- `PRODUCTION_DEPLOY.md` - Deploy detalhado
- `AI_AGENTS.md` - Como a IA funciona

**Links Úteis:**
- Supabase: https://supabase.com/dashboard
- OpenAI: https://platform.openai.com
- Railway: https://railway.app

---

## ✅ Checklist Final

Antes de publicar, confirme:

- [ ] ✅ OpenAI API Key configurada no `.env`
- [ ] ✅ Testou localmente e funcionou
- [ ] ✅ Buckets do Supabase criados
- [ ] ✅ Créditos na conta OpenAI
- [ ] ✅ `.env` não está no Git
- [ ] ✅ Escolheu a plataforma de deploy
- [ ] ✅ Leu a documentação de deploy

---

🎉 **Pronto! Agora é só fazer o deploy e usar a plataforma!**

**Comando para deploy local:**
```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

**Depois acesse:** http://localhost
