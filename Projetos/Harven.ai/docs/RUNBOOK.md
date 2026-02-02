# Harven.AI - Operations Runbook

## Índice

1. [Alta Latência](#1-alta-latência)
2. [Error Rate Alto](#2-error-rate-alto)
3. [Falha de Autenticação](#3-falha-de-autenticação)
4. [OpenAI Quota Exceeded](#4-openai-quota-exceeded)
5. [Database Issues](#5-database-issues)
6. [Rollback de Deploy](#6-rollback-de-deploy)
7. [Contatos de Escalação](#7-contatos-de-escalação)

---

## 1. Alta Latência

### Sintomas
- p95 > 3 segundos
- Usuários relatando lentidão
- Alerta do Grafana disparado

### Diagnóstico

```bash
# 1. Verificar métricas no Grafana
# Dashboard: Harven.AI - API Overview
# URL: https://grafana.harven.eximiaventures.com.br

# 2. Verificar latência por endpoint
curl -s "http://prometheus:9090/api/v1/query?query=histogram_quantile(0.95,sum(rate(http_request_duration_seconds_bucket[5m]))by(le,handler))"

# 3. Verificar OpenAI status
curl -s https://status.openai.com/api/v2/status.json | jq '.status.description'

# 4. Verificar Redis
docker exec -it harven-redis redis-cli ping
docker exec -it harven-redis redis-cli info memory
```

### Ações

| Causa | Ação |
|-------|------|
| OpenAI lento | Verificar status.openai.com, considerar fallback |
| DB queries lentas | Verificar Supabase dashboard, adicionar índices |
| Redis saturado | Limpar cache: `docker exec harven-redis redis-cli FLUSHALL` |
| Muitas requisições | Escalar replicas: `docker-compose up -d --scale backend=3` |

---

## 2. Error Rate Alto

### Sintomas
- Error rate > 5%
- Muitos erros 5xx nos logs
- Alerta de Sentry disparado

### Diagnóstico

```bash
# 1. Verificar Sentry
# URL: https://sentry.io/organizations/harven/issues/

# 2. Ver logs recentes
docker logs harven-backend --tail=100 | grep -i error

# 3. Verificar métricas de erro
curl -s "http://prometheus:9090/api/v1/query?query=sum(rate(http_requests_total{status=~'5..'}[5m]))"

# 4. Verificar health dos serviços
docker-compose ps
```

### Ações

| Causa | Ação |
|-------|------|
| Bug no código | Verificar Sentry, rollback se necessário |
| Supabase down | Verificar status.supabase.com |
| OpenAI rate limit | Verificar quotas, implementar retry |
| Memory leak | Restart do container: `docker-compose restart backend` |

### Rollback Imediato

```bash
# Voltar para versão anterior
docker-compose down
git checkout HEAD~1
docker-compose up -d --build
```

---

## 3. Falha de Autenticação

### Sintomas
- Usuários não conseguem fazer login
- Erros 401/403 em massa
- JWT validation failures

### Diagnóstico

```bash
# 1. Verificar Supabase Auth
curl -s "https://SEU-PROJETO.supabase.co/auth/v1/health"

# 2. Verificar JWT secret
docker exec harven-backend env | grep JWT_SECRET

# 3. Verificar rate limiting
docker exec harven-redis redis-cli keys "rate_limit:*" | head -20
```

### Ações

| Causa | Ação |
|-------|------|
| JWT secret incorreto | Verificar variáveis de ambiente no Coolify |
| Supabase Auth down | Verificar status.supabase.com |
| Rate limit atingido | Limpar rate limits: `redis-cli DEL rate_limit:*` |
| Token expirado | Verificar lógica de refresh token |

---

## 4. OpenAI Quota Exceeded

### Sintomas
- Erro 429 da OpenAI
- Agentes AI não respondem
- Alerta de billing

### Diagnóstico

```bash
# 1. Verificar uso no dashboard OpenAI
# URL: https://platform.openai.com/usage

# 2. Verificar logs de AI
docker logs harven-backend --tail=100 | grep -i openai

# 3. Verificar cache de AI
docker exec harven-redis redis-cli keys "ai:*" | wc -l
```

### Ações

1. **Imediato**: Implementar fallback para gpt-3.5-turbo
2. **Curto prazo**: Aumentar agressividade do cache
3. **Médio prazo**: Contatar finance para aumentar limite

```python
# Fallback temporário em services/ai_service.py
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")  # fallback
```

---

## 5. Database Issues

### Sintomas
- Erros de conexão com Supabase
- Queries timeout
- Dados inconsistentes

### Diagnóstico

```bash
# 1. Verificar status Supabase
curl -s "https://SEU-PROJETO.supabase.co/rest/v1/" \
  -H "apikey: SUA_KEY" \
  -H "Authorization: Bearer SUA_KEY"

# 2. Verificar conexões ativas
# No Supabase Dashboard > Database > Connections

# 3. Verificar logs de DB no backend
docker logs harven-backend --tail=100 | grep -i supabase
```

### Ações

| Causa | Ação |
|-------|------|
| Muitas conexões | Verificar connection pooling |
| Query lenta | Adicionar índices, otimizar query |
| Supabase down | Verificar status.supabase.com |
| RLS blocking | Verificar policies no dashboard |

---

## 6. Rollback de Deploy

### Processo Completo

```bash
# 1. Identificar versão anterior
git log --oneline -10

# 2. Parar serviços atuais
docker-compose down

# 3. Checkout versão anterior
git checkout <commit-hash>

# 4. Rebuild e deploy
docker-compose up -d --build

# 5. Verificar health
docker-compose ps
curl -s http://localhost:8000/ | jq

# 6. Monitorar por 10 minutos
watch -n 5 'docker-compose ps && curl -s http://localhost:8000/metrics | grep http_requests'
```

### Rollback via Coolify

1. Acesse o painel Coolify
2. Vá para o projeto Harven.AI
3. Clique em "Deployments"
4. Selecione um deployment anterior
5. Clique em "Redeploy"

---

## 7. Contatos de Escalação

| Nível | Responsável | Contato | Quando |
|-------|-------------|---------|--------|
| L1 | DevOps de Plantão | devops@harven.ai | Primeiro contato |
| L2 | Tech Lead | techlead@harven.ai | Após 30min sem resolução |
| L3 | CTO | cto@harven.ai | Incidentes críticos (>1h downtime) |

### Fornecedores

| Serviço | Suporte | SLA |
|---------|---------|-----|
| Supabase | support@supabase.com | Enterprise |
| OpenAI | help.openai.com | Standard |
| Coolify | Discord community | Community |
| Sentry | support@sentry.io | Team |

---

## Checklists

### Deploy Checklist

- [ ] Testes passando localmente
- [ ] PR aprovado
- [ ] Security scan limpo
- [ ] Backup recente do DB
- [ ] Horário de baixo tráfego
- [ ] Equipe de plantão avisada

### Incident Checklist

- [ ] Identificar sintomas
- [ ] Verificar dashboards (Grafana, Sentry)
- [ ] Comunicar stakeholders
- [ ] Isolar o problema
- [ ] Aplicar fix ou rollback
- [ ] Documentar no post-mortem
- [ ] Criar action items

---

*Última atualização: 2026-01-28*
*Versão: 1.0*
