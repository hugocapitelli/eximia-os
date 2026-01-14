---
description: Verifica o status de saúde dos agentes e do sistema Eximia
---
1. Chame `eximia_runtime.list_agents` para obter todos os agentes.
2. Para cada agente, verifique se tem `ready: true`.
3. Mostre um resumo:
   - Total de agentes
   - Agentes prontos (com prompt)
   - Agentes com Knowledge Base
4. Liste agentes incompletos que precisam de atenção.
5. Opcionalmente, verifique se o ChromaDB está acessível e quantos chunks estão indexados.
