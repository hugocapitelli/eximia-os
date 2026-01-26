---
description: Gerenciar banco de ideias com Memo
---
1. **Analise o comando:**
   - `/memo "text"` → Adicionar nova ideia atômica
   - `/memo cluster` → Formar clusters de ideias relacionadas
   - `/memo insights` → Gerar insights de alto nível
   - `/memo graph` → Visualizar grafo de conexões
   - `/memo recall [query]` → Relembrar ideias similares
   - `/memo list [page]` → Listar todas as ideias (25 por página)

2. **Carregar Knowledge Bases:**
   - `Z_Squad/outputs/Memo/02_profile/knowledge_base/KB_01_Zettelkasten_Method.md`
   - `Z_Squad/outputs/Memo/02_profile/knowledge_base/KB_02_Graph_Theory.md`
   - `Z_Squad/outputs/Memo/02_profile/knowledge_base/KB_03_Codex_Integration.md`

3. **Executar o agente:**
   - Ler o prompt operacional: `Z_Squad/outputs/Memo/03_prompt/prompt_operacional.md`
   - Passar o comando do usuário como contexto
   - O agente irá:
     a. Analisar a ideia (se modo "add")
     b. Buscar ideias similares no Codex (semantic search)
     c. Propor conexões com scores de similaridade
     d. **NOTIFY_USER** com sugestão de save
     e. Aguardar aprovação antes de salvar

4. **Duplo Salvamento:**
   - **No Codex:** `category: "ideas"` (banco de dados)
   - **Em Arquivo:** `00_Codex/eximia_data/04_IDEAS/{id}_{slug}.md` (backup físico)

5. **Aprovação Obrigatória:**
   - O agente NUNCA salva sem aprovação explícita do usuário
