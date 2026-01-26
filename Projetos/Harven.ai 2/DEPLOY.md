# Harven.AI - Guia de Deploy

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     Harven.AI Platform                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │  Frontend   │    │   Backend   │    │  Supabase   │    │
│  │   (React)   │───>│  (FastAPI)  │───>│    (DB)     │    │
│  │  Port 3000  │    │  Port 8000  │    │   (Cloud)   │    │
│  └─────────────┘    └──────┬──────┘    └─────────────┘    │
│                            │                               │
│                            v                               │
│                    ┌─────────────┐                        │
│                    │   OpenAI    │                        │
│                    │    API      │                        │
│                    └─────────────┘                        │
│                                                             │
│  Agentes IA:                                               │
│  - Harven_Creator (gera perguntas)                        │
│  - Harven_Socrates (dialogo socratico)                    │
│  - Harven_Analyst (detecta IA)                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Pre-requisitos

- Docker e Docker Compose
- Conta Supabase (banco de dados)
- Chave API OpenAI

## Variaveis de Ambiente

Crie um arquivo `.env` na pasta `backend/`:

```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-aqui

# OpenAI
OPENAI_API_KEY=sk-sua-chave-openai
OPENAI_MODEL=gpt-4o-mini

# Producao
ENVIRONMENT=production
FRONTEND_URL=https://seu-dominio.com
```

## Deploy Local (Docker)

```bash
# Na raiz do projeto
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar
docker-compose down
```

Acesse:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Deploy em Producao

### Opcao 1: Railway / Render

1. Conecte seu repositorio
2. Configure as variaveis de ambiente
3. Deploy automatico

### Opcao 2: VPS (DigitalOcean, AWS EC2)

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clonar projeto
git clone seu-repo
cd harven.ai

# Criar .env
cp backend/.env.example backend/.env
nano backend/.env  # editar variaveis

# Build e deploy
docker-compose -f docker-compose.yml up -d --build
```

### Opcao 3: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
1. Importe o projeto `harven.ai-platform-mockup`
2. Configure build command: `npm run build`
3. Configure output: `dist`
4. Adicione variavel: `VITE_API_URL=https://seu-backend.railway.app`

**Backend (Railway):**
1. Importe a pasta `backend`
2. Configure variaveis de ambiente
3. Deploy automatico via Dockerfile

## Endpoints da API de IA

| Endpoint | Metodo | Descricao |
|----------|--------|-----------|
| `/api/ai/status` | GET | Verifica status do servico |
| `/api/ai/creator/generate` | POST | Gera perguntas socraticas |
| `/api/ai/socrates/dialogue` | POST | Dialogo socratico |
| `/api/ai/analyst/detect` | POST | Detecta conteudo IA |

### Exemplo: Gerar Perguntas

```bash
curl -X POST http://localhost:8000/api/ai/creator/generate \
  -H "Content-Type: application/json" \
  -d '{
    "chapter_content": "A gestao de riscos e fundamental...",
    "chapter_title": "Gestao de Riscos",
    "max_questions": 3
  }'
```

## Custos Estimados

| Servico | Custo Mensal |
|---------|--------------|
| Supabase Free | $0 |
| OpenAI (1000 geracoes) | ~$10-30 |
| Railway/Render Free | $0 |
| **Total minimo** | **~$10/mes** |

## Seguranca

- [ ] Configure HTTPS (obrigatorio em producao)
- [ ] Restrinja CORS para seu dominio
- [ ] Use secrets manager para API keys
- [ ] Configure rate limiting
- [ ] Ative logs de auditoria

## Monitoramento

Recomendados:
- Sentry (erros)
- Datadog/New Relic (metricas)
- Cloudflare (CDN/WAF)

## Suporte

Para duvidas, abra uma issue no repositorio.
