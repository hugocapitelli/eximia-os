# 🔧 Solução para Erros 404

## ❌ Problema:
```
Failed to load resource: 404 (Not Found)
- /auth/login
- /admin/settings
- /api/ai/status
```

## ✅ Causa:
O backend que está rodando é uma **versão antiga do código** (sem os endpoints atualizados).

## 🎯 Solução DEFINITIVA:

### **Clique DUAS VEZES neste arquivo:**
```
INICIAR_COMPLETO.bat
```

Este script faz TUDO automaticamente:
1. ✅ Para TODOS os processos antigos (Python e Node)
2. ✅ Inicia backend ATUALIZADO (com todos os endpoints)
3. ✅ Inicia frontend ATUALIZADO (porta correta 8000)
4. ✅ Abre 2 janelas separadas para você ver os logs

---

## ⏱️ Passo a Passo:

### 1️⃣ Clique em: `INICIAR_COMPLETO.bat`

Você verá:
```
[PASSO 1/3] Parando processos antigos...
[OK] Processos antigos parados

[PASSO 2/3] Iniciando Backend (porta 8000)...
[OK] Backend iniciado!

[PASSO 3/3] Iniciando Frontend (porta 3000)...

Plataforma Iniciada com Sucesso!
```

### 2️⃣ Aguarde 15 segundos

Duas janelas vão abrir:
- **Janela 1:** Backend (vai aparecer "Uvicorn running on...")
- **Janela 2:** Frontend (vai aparecer "Local: http://localhost:3000")

### 3️⃣ Acesse: `http://localhost:3000`

---

## ✅ Como Saber se Funcionou:

### Teste 1: Backend está atualizado?

Abra PowerShell e execute:
```powershell
curl http://localhost:8000/health
```

**Deve retornar:**
```json
{"status":"healthy"}
```

### Teste 2: Endpoints de IA funcionam?

```powershell
curl http://localhost:8000/api/ai/status
```

**Deve retornar:**
```json
{
  "enabled": true,
  "agents": ["creator", "socrates", "analyst", "editor", "tester", "organizer"],
  "model": "gpt-4o-mini"
}
```

### Teste 3: Login funciona?

```powershell
curl -X POST http://localhost:8000/auth/login -H "Content-Type: application/json" -d '{\"ra\":\"ADMIN001\",\"password\":\"test\"}'
```

**NÃO deve retornar 404!**

---

## 🐛 Se AINDA Tiver Erro 404:

### Opção A: Parar Manualmente

1. **Feche TODAS as janelas de terminal/CMD abertas**
2. Abra **Gerenciador de Tarefas** (Ctrl+Shift+Esc)
3. Procure e **finalize** estes processos:
   - `python.exe`
   - `py.exe`
   - `node.exe`
4. Execute novamente: `INICIAR_COMPLETO.bat`

### Opção B: Use o Script de Parar

```
1. Clique: PARAR_TUDO.bat
2. Aguarde 5 segundos
3. Clique: INICIAR_COMPLETO.bat
```

---

## 📊 Verificação dos Endpoints:

O backend TEM estes endpoints (confirmado no código):

✅ Linha 58: `@app.get("/")`
✅ Linha 164: `@app.post("/auth/login")`
✅ Linha 450: `@app.get("/admin/settings")`
✅ Linha 472: `@app.post("/admin/settings")`
✅ Linha 1249: `@app.get("/api/ai/status")`
✅ Linha 1267: `@app.post("/api/ai/creator/generate")`

**Se ainda está dando 404, é porque o backend rodando é ANTIGO!**

---

## 🎯 Checklist de Verificação:

Antes de acessar o frontend:

- [ ] ✅ Executei `INICIAR_COMPLETO.bat`
- [ ] ✅ Aguardei 15 segundos
- [ ] ✅ Vejo duas janelas abertas (Backend + Frontend)
- [ ] ✅ Backend mostra "Uvicorn running on http://0.0.0.0:8000"
- [ ] ✅ Frontend mostra "Local: http://localhost:3000"
- [ ] ✅ Testei `curl http://localhost:8000/health` e retornou `{"status":"healthy"}`
- [ ] ✅ Testei `curl http://localhost:8000/api/ai/status` e retornou JSON

Se TODOS os itens acima estão OK → **Pode acessar http://localhost:3000**

---

## 💡 Por Que Isso Acontece?

Quando você:
1. Faz mudanças no código
2. Mas o servidor já está rodando
3. O servidor continua com o código ANTIGO

**Solução:** Sempre reiniciar o servidor após mudanças!

---

## 🚀 Próximos Passos:

Depois de reiniciar corretamente:

1. ✅ Faça login
2. ✅ Crie uma disciplina
3. ✅ Faça upload de arquivo
4. ✅ Clique em "Gerar Perguntas com IA"
5. ✅ Veja as perguntas socráticas geradas!

---

## 🆘 Última Opção:

Se NADA funcionar, me diga:

1. O que aparece quando você executa:
   ```
   cd backend
   py main.py
   ```

2. Cole aqui as primeiras 20 linhas que aparecem

Eu vou te ajudar a debugar!

---

🎉 **Execute agora: `INICIAR_COMPLETO.bat` e teste novamente!**
