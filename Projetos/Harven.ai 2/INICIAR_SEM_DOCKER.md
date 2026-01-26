# 🚀 Harven.AI - Iniciar Sem Docker (Desenvolvimento)

## O Docker está com problemas? Sem problema!

Você pode executar a plataforma diretamente sem Docker. É mais rápido para desenvolvimento!

---

## ✅ Pré-requisitos

- Python 3.11+ instalado
- Node.js 18+ instalado
- Chave OpenAI configurada no `backend/.env` ✅ (já configurado!)

---

## 🎯 PASSO 1: Iniciar o Backend (API + IA)

### Abra um terminal/PowerShell e execute:

```bash
# Entre na pasta backend
cd backend

# Instale as dependências (só na primeira vez)
pip install -r requirements.txt

# Inicie o servidor
python main.py
```

**O backend vai iniciar em:** `http://localhost:8000`

**Deixe esta janela aberta!**

---

## 🎨 PASSO 2: Iniciar o Frontend (React)

### Abra OUTRO terminal/PowerShell e execute:

```bash
# Entre na pasta frontend
cd harven.ai-platform-mockup

# Instale dependências (se ainda não fez)
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

**O frontend vai iniciar em:** `http://localhost:3000`

---

## ✅ PRONTO! Acesse a Plataforma

Abra seu navegador em: **http://localhost:3000**

### Para Testar:

1. **Login:**
   - Usuário: ADMIN001
   - Senha: (a senha do seu Supabase)

2. **Criar Disciplina:**
   - Vá em "Criação de Conteúdo"
   - Crie uma nova disciplina
   - Adicione conteúdo

3. **Testar IA:**
   - Clique em "Gerar Perguntas com IA"
   - Aguarde alguns segundos
   - As perguntas socráticas serão geradas!

---

## 🛑 Para Parar

- **Backend:** Pressione `Ctrl+C` no terminal do backend
- **Frontend:** Pressione `Ctrl+C` no terminal do frontend

---

## 🐛 Problemas Comuns

### ❌ "Porta 8000 já está em uso"

```bash
# Windows - Matar processo na porta 8000
netstat -ano | findstr :8000
taskkill /PID [numero_do_pid] /F
```

### ❌ "Porta 3000 já está em uso"

```bash
# Windows - Matar processo na porta 3000
netstat -ano | findstr :3000
taskkill /PID [numero_do_pid] /F
```

### ❌ "ModuleNotFoundError: No module named 'X'"

```bash
# Reinstale as dependências
cd backend
pip install -r requirements.txt --force-reinstall
```

### ❌ "npm command not found"

Instale o Node.js em: https://nodejs.org

---

## 📊 Monitorar Uso da OpenAI

Durante os testes, monitore quanto está gastando:

- Acesse: https://platform.openai.com/usage
- Cada geração de perguntas usa ~$0.01-0.03
- Cada diálogo socrático usa ~$0.005-0.01

---

## 🔄 Quando o Docker Funcionar Novamente

Quando quiser usar Docker:

1. Reinicie o Docker Desktop
2. Execute: `deploy.bat`
3. Acesse: `http://localhost`

---

## 💡 Dica Pro

**Para desenvolvimento, é MELHOR rodar sem Docker porque:**
- ✅ Mais rápido para testar mudanças
- ✅ Logs mais fáceis de ler
- ✅ Hot reload automático
- ✅ Debugger funciona melhor

**Docker é melhor para produção/deploy!**

---

## ✅ Checklist de Teste

Teste estas funcionalidades:

- [ ] Login funciona
- [ ] Criar nova disciplina
- [ ] Adicionar conteúdo à disciplina
- [ ] Gerar perguntas com IA
- [ ] Ver perguntas geradas
- [ ] Testar diálogo socrático
- [ ] Ver dashboard de métricas

Se tudo funcionar, a plataforma está pronta para publicar!

---

🎉 **Boa! Agora você pode desenvolver e testar sem depender do Docker!**
