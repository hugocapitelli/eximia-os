---
description: Define o projeto ativo para contextualizar todos os agentes
---
1. Identifique o nome do projeto mencionado pelo usuário.
2. Busque a pasta `Projetos/[nome_projeto]` no workspace.
3. Leia arquivos de contexto como `BRIEFING.md`, `context.md` ou `README.md`.
4. Armazene esse contexto na memória da sessão atual.
5. Informe ao usuário: "Contexto '[nome_projeto]' carregado. Os próximos agentes terão acesso a essas informações."
6. Nas próximas chamadas de agente, injete o contexto carregado no início do prompt.
