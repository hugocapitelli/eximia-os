# 08. Boas Práticas e Antipadrões

## ✅ Boas Práticas (Do's)
1.  **Single Responsibility Principle:** Um agente deve fazer UMA coisa bem feita. Se o prompt está com 3 páginas, quebre em dois agentes.
2.  **Verbose Outputs:** Peça para os agentes "pensarem em voz alta" (Chain of Thought). Isso ajuda no debug e permite que outros agentes entendam o raciocínio.
3.  **Human in the Loop:** Para ações críticas (ex: enviar email, deploy), sempre coloque uma etapa de aprovação humana no Manager.
4.  **Fail Gracefully:** Se o Researcher não achar nada, ele deve dizer "Não encontrei" em vez de alucinar. Treine o prompt para isso.

## ❌ Antipadrões (Don'ts)
1.  **The God Agent (O Herói):** Tentar criar um "Super Agente" que pesquisa, coda, testa e deploya.
    *   *Por que falha?* O contexto estoura, ele se confunde e a qualidade cai.
2.  **Micro-Management:** Criar um agente para tasks triviais (ex: "Agente de Somar Números").
    *   *Custo:* Latência e custo de token desnecessário. Use Code Interpreter para lógica determinística.
3.  **Context Overload:** Jogar todo o histórico de conversas para todos os agentes o tempo todo.
    *   *Solução:* Use MCP ou resumidores para passar apenas o necessário.
4.  **Infinite Loops:** Dois agentes conversando entre si sem critério de parada.
    *   *Solução:* Defina `max_turns` ou um Agente Manager que encerra a discussão.


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Pesquisas]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->