# ExímIA.OS Migration Guide

Este guia descreve o processo passo-a-passo para migrar o sistema **ExímIA.OS** para um novo computador com **Zero Perda de Dados**.

---

## 1. Pré-Migração (No PC Antigo)

Antes de desligar o PC antigo, garanta que você tem tudo o que o Git não salva.

### 1.1 Backup de Segredos (CRÍTICO 🚨)
O arquivo `.env` contém suas chaves de API e **NÃO** viaja com o código.
- [ ] Copie o arquivo `eximIA.OS/eximIA.OS/.env` para um Pen Drive, Google Drive seguro ou Password Manager.

### 1.2 Dados Locais (Não Versionados ⚠️)
Verifique se você precisa fazer backup manual destas pastas (caso não estejam confirmadas no Supabase):
- [ ] `FINANCE/2026/` (Documentos financeiros, PDFs de boletos)
- [ ] `00_Codex/eximia_data/` (Arquivos originais do Codex)
- [ ] `*.pdf` soltos na raiz ou em pastas de projetos.

### 1.3 Estado do Git
- [ ] Rode `git status` e verifique se não há código importante não commitado.
- [ ] Faça `git push` de tudo.

---

### 1.4 Configuração do Repositório (Caso não tenha)
Como você ainda não configurou o repositório remoto:
1.  Crie um novo repositório **privado** no GitHub (ex: `eximia-os`).
2.  No terminal deste PC, rode:
    ```powershell
    git init # Se ainda não iniciou
    git add .
    git commit -m "Initial backup for migration"
    git branch -M main
    git remote add origin <URL_DO_NOVO_REPO>
    git push -u origin main
    ```
    > **Nota**: Após fazer isso, substitua `<URL_DO_NOVO_REPO>` nos comandos abaixo pela URL real.

---

## 2. Migração (No Novo PC)

### 2.1 Preparação do Ambiente
Instale o básico antes de tudo:
1. [ ] **Git**: [Download](https://git-scm.com/download/win)
2. [ ] **VS Code**: [Download](https://code.visualstudio.com/)
3. [ ] **Python 3.11+**: [Download](https://www.python.org/downloads/) (Marque "Add to PATH" na instalação!)
4. [ ] **Node.js (LTS)**: [Download](https://nodejs.org/)

### 2.2 Clone e Restauração
1. [ ] Abra o Terminal (PowerShell) na pasta onde deseja instalar (ex: `Documents`).
2. [ ] Clone o repositório:
   ```powershell
   git clone <URL_DO_SEU_REPO> eximIA.OS
   cd eximIA.OS/eximIA.OS
   ```
3. [ ] **Restaure o Secrets**:
   - Pegue o arquivo `.env` do seu backup e cole na raiz (`eximIA.OS/eximIA.OS/.env`).

### 2.3 Hidratação Automática (O Mágico 🧙‍♂️)
Execute o script que instala tudo (Python libs, Node libs, Drivers):

```powershell
./setup_device.ps1
```

> **O script irá sugerir a instalação de:**
> - `Tesseract OCR` (via winget)
> - `Poppler` (via winget)
> - `Ollama` (se não detectado)

### 2.4 Pós-Setup
- [ ] Abra um novo terminal e rode `ollama serve`.
- [ ] Teste a conexão: `python -m eximia_runtime.run --health` (ou comando equivalente de teste).

---

## 3. Verificação

Para garantir que está tudo 100%:
- [ ] Verifique se o **The_CFO** consegue ler um PDF (Testa Tesseract/Poppler).
- [ ] Verifique se o **Codex** consegue listar arquivos (Testa Supabase Connection).
