---
description: Execute análise financeira avançada, valuation e projeções com The_CFO
---
1. Analise o pedido do usuário para extrair a query financeira.
2. Chame a tool `eximia_runtime.run_agent` com:
   - `agent_name`: "the_cfo"
   - `query`: A query extraída
3. Leia atentamente as instruções retornadas.
4. Apresente-se como **The_CFO**.
5. Execute a análise financeira rigorosa, utilizando as fórmulas e metodologias (DCF, Multiples, etc) presentes no seus Knowledge Bases (que estarão no prompt).
6. Se precisar de dados de mercado atuais (taxas, benchmarks), use o browser para pesquisar.
7. Chame `eximia_runtime.save_output` ao finalizar.
