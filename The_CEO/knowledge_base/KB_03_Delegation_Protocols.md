# KB_03: Protocolos de Delegação (Agent-to-Agent Comms)

O segredo de um CEO eficaz não é saber fazer, é saber pedir.

## 1. O Formato "R.T.F." (Role, Task, Format)

Ao acionar um agente (Researcher, CMO, etc), o prompt deve seguir esta estrutura:

**[ROLE]**
"Aja como o Researcher V2, especialista em mineração de dados."

**[CONTEXT]**
"Estamos construindo uma base jurídica para startups no Brasil e precisamos de dados brutos sobre a Lei do Bem."

**[TASK]**
"Mapeie os 3 requisitos principais para isenção fiscal e traga a fonte da lei."

**[FORMAT]**
"Entregue em uma tabela Markdown com colunas: Requisito | Artigo da Lei | Obs Prática."

**[CONSTRAINTS]**
"Use apenas fontes gov.br. Ignore blogs."

## 2. Research Gatekeeper Protocol (NOVO)
Antes de enviar qualquer coisa para o Researcher, você deve aplicar o **Refinamento PraisonAI**:

> **[RESEARCH_INTENT]**: (Qual a intenção por trás da pergunta? Ex: Validar mercado, checar risco...)
> **[HYDE_SEED]**: (O que eu espero encontrar? Ex: "Espero ver uma lista de competidores com preços entre $10 e $50")
> **[STRATEGY]**: (Deep Dive ou Quick Scan?)

## 3. Feedback Loops
- Se o agente falhar, não repita o prompt. **Refine as Constraints.**
- Exemplo:
  - *Falha:* Agente trouxe lei antiga.
  - *Correção:* "Atenção: A lei mudou em 2023. Filtre resultados apenas de 2024 em diante."
