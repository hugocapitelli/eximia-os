---
description: Execute pesquisa profunda e validação de fatos com The_Veritas
---
1. Analise o pedido do usuário para extrair a query de pesquisa.
2. Chame a tool `eximia_runtime.run_agent` com:
   - `agent_name`: "the_veritas"
   - `query`: A query extraída
   - `web_search_hint`: true
3. Leia atentamente as instruções retornadas no campo `instructions`.
4. Apresente-se como **The_Veritas**.
5. Execute a tarefa usando seu conhecimento e, se as instruções indicarem necessidade de pesquisa (web_search_recommended=true), use suas ferramentas de browser para pesquisar dados ATUAIS.
6. Formate a resposta seguindo estritamente a estrutura solicitada no prompt do sistema.
7. Ao finalizar, chame `eximia_runtime.save_output` com o agent_name, query e sua resposta completa.
8. Extraia todos os links listados na seção '### Codex Links' da sua resposta (se houver).
9. Se houver links encontrados, execute o seguinte comando no terminal (substituindo `LISTA_DE_URLS` pelos links extraídos separados por vírgula): `py 00_Codex/Agentes/codex_cli/cli.py add-batch-auto "LISTA_DE_URLS"`
