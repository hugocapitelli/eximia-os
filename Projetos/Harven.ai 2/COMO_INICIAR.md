# 🚀 Como Iniciar a Plataforma Harven.AI

## ✅ Status: TUDO CONFIGURADO!

- ✅ Supabase configurado
- ✅ OpenAI configurada e **testada** (funcionando!)
- ✅ Backend pronto
- ✅ Frontend pronto
- ✅ Scripts de deploy criados

---

## 🎯 Escolha Como Iniciar:

### 🟢 Opção A: SEM DOCKER (Recomendado para Testar)

**Vantagens:**
- ⚡ Mais rápido
- 🐛 Fácil debug
- 📝 Logs claros
- 🔄 Hot reload

**Como fazer:**

1. **Abra 2 terminais/PowerShell**

2. **Terminal 1 - Backend:**
   ```
   Clique duas vezes em: INICIAR_BACKEND.bat
   ```
   Vai abrir em: http://localhost:8000

3. **Terminal 2 - Frontend:**
   ```
   Clique duas vezes em: INICIAR_FRONTEND.bat
   ```
   Vai abrir em: http://localhost:3000

4. **Acesse:** http://localhost:3000

👉 **Guia Completo:** `INICIAR_SEM_DOCKER.md`

---

### 🔵 Opção B: COM DOCKER (Para Produção)

**Vantagens:**
- 📦 Tudo em containers
- 🔒 Ambiente isolado
- 🌐 Nginx incluído

**Como fazer:**

```
Clique duas vezes em: deploy.bat
```

**NOTA:** O Docker Desktop precisa estar rodando e saudável!

Se der erro 502:
1. Reinicie o Docker Desktop
2. Tente novamente

---

## 🧪 Testar a Plataforma

### 1. Teste de API (Backend)

```bash
# Abra PowerShell e execute:
curl http://localhost:8000/health

# Deve retornar: {"status":"ok"}
```

### 2. Teste de IA

Já testamos e funcionou! ✅

```
Modelo: gpt-4o-mini-2024-07-18
Tokens usados: 14
Status: SUCESSO
```

### 3. Teste Completo na Interface

1. Acesse: http://localhost:3000
2. Faça login (ADMIN001 + senha do Supabase)
3. Crie uma disciplina
4. Adicione conteúdo
5. Clique em "Gerar Perguntas com IA"
6. Veja as perguntas socráticas geradas!

---

## 📊 Monitorar Custos OpenAI

Durante os testes:

- Acesse: https://platform.openai.com/usage
- Cada teste de IA: ~$0.01-0.03
- Configure alertas de gasto

---

## 🐛 Problemas?

### Docker não funciona?
```
Use a Opção A (SEM DOCKER)
Veja: INICIAR_SEM_DOCKER.md
```

### Erro de dependências?
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd harven.ai-platform-mockup
npm install
```

### Porta já está em uso?
```bash
# Windows - Ver processos nas portas
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Matar processo (substitua [PID])
taskkill /PID [numero] /F
```

---

## 📚 Documentação Disponível

| Arquivo | Propósito |
|---------|-----------|
| **COMO_INICIAR.md** | 👈 Este arquivo |
| **INICIAR_SEM_DOCKER.md** | Guia detalhado sem Docker |
| **PRONTO_PARA_PUBLICAR.md** | Resumo geral |
| **SETUP.md** | Configuração completa |
| **QUICK_START.md** | Deploy em Railway/Vercel |
| **PRODUCTION_DEPLOY.md** | Deploy em VPS |
| **AI_AGENTS.md** | Como funcionam os 6 agentes |

---

## 🚀 Próximos Passos

### Para Desenvolvimento/Teste:
```
1. Use Opção A (Sem Docker)
2. Teste todas as funcionalidades
3. Se tudo funcionar → Publicar!
```

### Para Publicar:
```
1. Teste localmente primeiro
2. Escolha onde hospedar:
   - Railway (5 min) → QUICK_START.md
   - VPS (controle total) → PRODUCTION_DEPLOY.md
3. Configure domínio (opcional)
4. Monitore custos OpenAI
```

---

## ✅ Checklist de Teste

Antes de publicar, teste:

- [ ] Backend inicia sem erros
- [ ] Frontend carrega corretamente
- [ ] Login funciona
- [ ] Criar disciplina funciona
- [ ] Upload de arquivos funciona
- [ ] **Gerar perguntas com IA funciona**
- [ ] Diálogo socrático funciona
- [ ] Dashboard mostra métricas

Se todos funcionarem → **PODE PUBLICAR!** 🎉

---

## 💡 Dica Final

**Para desenvolvimento:**
- Use Opção A (Sem Docker) ⚡
- Mais rápido e fácil de debugar

**Para produção:**
- Use Docker (deploy.bat) ou Railway
- Mais profissional e escalável

---

🎉 **ESTÁ TUDO PRONTO! Escolha uma opção acima e comece a usar!**

**Recomendação:** Comece com a **Opção A (Sem Docker)** para testar rapidamente!

```
1. Clique: INICIAR_BACKEND.bat
2. Clique: INICIAR_FRONTEND.bat
3. Acesse: http://localhost:3000
```
