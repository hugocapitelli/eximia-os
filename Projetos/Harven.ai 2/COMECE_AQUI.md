# 🚀 COMECE AQUI - Harven.AI

## ⚠️ VOCÊ ESTÁ TENDO ERROS 404?

**Clique neste arquivo:**
```
INICIAR_COMPLETO.bat
```

Aguarde 15 segundos e acesse: `http://localhost:3000`

---

## 📂 Guia Rápido de Arquivos

### 🟢 Para INICIAR a Plataforma:

| Arquivo | Quando Usar |
|---------|-------------|
| **INICIAR_COMPLETO.bat** | ⭐ **USE ESTE!** Para + Reinicia tudo |
| INICIAR_BACKEND.bat | Apenas backend (porta 8000) |
| INICIAR_FRONTEND.bat | Apenas frontend (porta 3000) |
| PARAR_TUDO.bat | Para todos os processos |

### 🔴 Se Estiver com Problemas:

| Arquivo | Quando Usar |
|---------|-------------|
| **SOLUCAO_404.md** | ❌ Erros 404 no console |
| PROBLEMA_RESOLVIDO.md | ⚠️ Erros de porta/conexão |
| INICIAR_SEM_DOCKER.md | 🐳 Docker não funciona |

### 📖 Documentação:

| Arquivo | Conteúdo |
|---------|----------|
| **COMO_INICIAR.md** | 📚 Guia completo de inicialização |
| PRONTO_PARA_PUBLICAR.md | 🌐 Como publicar online |
| QUICK_START.md | ☁️ Deploy na nuvem (Railway) |
| PRODUCTION_DEPLOY.md | 🖥️ Deploy em VPS |
| AI_AGENTS.md | 🤖 Como funcionam os 6 agentes |
| SETUP.md | ⚙️ Configuração detalhada |

---

## 🎯 Fluxo Recomendado:

### 1️⃣ Primeira Vez:

```
1. Clique: INICIAR_COMPLETO.bat
2. Aguarde aparecer duas janelas
3. Aguarde mais 15 segundos
4. Acesse: http://localhost:3000
```

### 2️⃣ Se der ERRO 404:

```
1. Leia: SOLUCAO_404.md
2. Execute: PARAR_TUDO.bat
3. Execute: INICIAR_COMPLETO.bat
4. Teste: curl http://localhost:8000/health
```

### 3️⃣ Para Testar a Plataforma:

```
1. Login: ADMIN001 (senha do Supabase)
2. Crie uma disciplina
3. Faça upload de um PDF
4. Clique em "Gerar Perguntas com IA"
5. Veja as perguntas socráticas!
```

### 4️⃣ Para Publicar Online:

```
1. Teste localmente primeiro
2. Leia: QUICK_START.md (Railway - 5 min)
3. OU: PRODUCTION_DEPLOY.md (VPS)
4. Configure domínio (opcional)
```

---

## ✅ Status da Configuração:

- ✅ Supabase: Configurado
- ✅ OpenAI: Configurada e testada
- ✅ Backend: 6 agentes de IA prontos
- ✅ Frontend: Interface completa
- ✅ API: Porta 8000 (corrigida)
- ✅ Scripts: Todos criados

---

## 🆘 Problemas Comuns:

### "Erro 404 ao fazer login"
→ Execute: `INICIAR_COMPLETO.bat`
→ Leia: `SOLUCAO_404.md`

### "Port already in use"
→ Execute: `PARAR_TUDO.bat`
→ Depois: `INICIAR_COMPLETO.bat`

### "Docker não funciona"
→ Leia: `INICIAR_SEM_DOCKER.md`
→ Use os scripts .bat diretamente

### "IA não está gerando perguntas"
→ Verifique: `backend/.env` tem chave OpenAI
→ Teste: `curl http://localhost:8000/api/ai/status`

---

## 📊 Custos (Referência):

**Desenvolvimento Local:**
- Hospedagem: $0 (local)
- Supabase: $0 (free tier)
- OpenAI: ~$0.01 por teste

**Produção (100 alunos):**
- Total: $5-16/mês

---

## 💡 Dicas:

1. **Sempre aguarde 15 segundos** após iniciar antes de acessar
2. **Use `INICIAR_COMPLETO.bat`** ao invés de scripts separados
3. **Verifique os logs** nas janelas que abrem (Backend + Frontend)
4. **Teste a API primeiro** antes de testar o frontend:
   ```
   curl http://localhost:8000/health
   curl http://localhost:8000/api/ai/status
   ```

---

## 🎯 AÇÃO RÁPIDA:

Se você quer simplesmente **FAZER FUNCIONAR AGORA:**

```
1. Clique duas vezes: INICIAR_COMPLETO.bat
2. Aguarde 15 segundos (crucial!)
3. Abra navegador: http://localhost:3000
4. Faça login e teste!
```

Se funcionar → 🎉 Sucesso!
Se não funcionar → Leia `SOLUCAO_404.md`

---

## 📞 Precisa de Ajuda?

Me envie:
1. O erro exato que aparece no navegador (F12 → Console)
2. O que aparece na janela do Backend
3. Resultado de: `curl http://localhost:8000/health`

---

🚀 **Comece agora: Clique em `INICIAR_COMPLETO.bat`**
