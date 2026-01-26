# Copy Debate Task - Multi-Perspective Copywriting Debate

## Metadata

```yaml
task_id: copy-debate
version: 2.0
tier: TOOL
category: Quality Assurance
estimated_time: 45-90 minutes
difficulty: Advanced
dependencies:
  - Active briefing or copy piece
  - 2-4 copywriter personas selected
outputs:
  - Structured debate transcript
  - Synthesis document
  - Final copy recommendation
  - Lessons learned
```

---

## Purpose

Facilitar um debate estruturado entre 2-4 copywriters lendários sobre a melhor abordagem para um briefing específico, culminando em uma síntese do Copy Chief que extrai o melhor de cada perspectiva e produz copy superior ao que qualquer abordagem individual alcançaria.

Este processo combina:
- **Método Socrático** - Questionamento profundo de premissas
- **Pragma-Dialética** - Estrutura formal de discussão crítica
- **Steel-Manning** - Representar argumentos em sua forma mais forte
- **Devil's Advocate** - Desafiar sistematicamente cada abordagem
- **Síntese CODM** - Consensus-Oriented Decision Making

---

## When to Use

### Cenários Ideais

| Cenário | Benefício do Debate |
|---------|---------------------|
| Dúvida sobre abordagem | Explorar alternativas sistematicamente |
| Briefing complexo/ambíguo | Múltiplas perspectivas revelam insights |
| Projeto de alto valor | Investir tempo em qualidade superior |
| Aprendizado | Expor diferentes filosofias de copy |
| Copy não está convertendo | Diagnóstico por múltiplas lentes |
| Lançamento importante | Minimizar risco com escrutínio |

### Quando NÃO Usar

- Copy simples e direto
- Deadline extremamente curto
- Já há direção clara e validada
- Projeto de baixo impacto

---

## Inputs

```yaml
required:
  briefing:
    description: Briefing completo do projeto
    includes:
      - Produto/serviço
      - Avatar detalhado
      - Objetivo de conversão
      - Constraints (prazo, formato, tom)

  copywriters:
    description: Lista de 2-4 copywriters para participar
    minimum: 2
    maximum: 4
    options:
      - gary-halbert
      - david-ogilvy
      - eugene-schwartz
      - dan-kennedy
      - jon-benson
      - claude-hopkins
      - joe-sugarman
      - alex-hormozi
      - ramit-sethi
      - frank-kern
      - gary-bencivenga
      - dan-koe
      - todd-brown

  question:
    description: Pergunta central ou tópico do debate
    examples:
      - "Qual a melhor abordagem de hook para este VSL?"
      - "Como estruturar a oferta para máxima conversão?"
      - "Storytelling ou direto ao ponto para este avatar?"

optional:
  copy_type:
    description: Tipo de peça em discussão
    options:
      - sales_page
      - email_sequence
      - vsl
      - headline
      - lead_magnet
      - webinar_script
      - ad_copy
      - landing_page
    default: inferred_from_briefing

  debate_focus:
    description: Foco específico do debate
    options:
      - approach      # Abordagem geral
      - structure     # Estrutura do copy
      - tone          # Tom e voz
      - hook          # Abertura/hook
      - offer         # Estrutura da oferta
      - all           # Debate completo
    default: all

  constraints:
    description: Restrições ou requisitos obrigatórios
    examples:
      - "Máximo 500 palavras"
      - "Tom profissional, não casual"
      - "Sem urgência artificial"

  winning_criteria:
    description: Como determinar a abordagem vencedora
    default: "Maior probabilidade de conversão para o avatar específico"
```

---

## Debate Methodology

### Framework Teórico

O debate segue princípios estabelecidos de argumentação e tomada de decisão:

**1. Pragma-Dialética (van Eemeren & Grootendorst)**
```
4 Estágios da Discussão Crítica:
1. CONFRONTAÇÃO - Identificar diferença de opinião
2. ABERTURA - Estabelecer regras e pontos comuns
3. ARGUMENTAÇÃO - Troca de argumentos e contra-argumentos
4. CONCLUSÃO - Determinar resultado
```

**2. Método Socrático**
```
6 Tipos de Perguntas:
1. Clarificação - "O que você quer dizer com...?"
2. Suposições - "O que você está assumindo?"
3. Evidência - "Que dados suportam isso?"
4. Perspectivas - "Como alguém que discorda veria?"
5. Implicações - "Quais as consequências?"
6. Meta - "Por que essa pergunta importa?"
```

**3. Steel-Manning (Daniel Dennett)**
```
4 Passos:
1. Reformular posição do oponente tão bem que ele concorde
2. Listar pontos de concordância
3. Mencionar o que aprendeu com a posição
4. Só então criticar
```

---

## Debate Structure (4 Rounds)

### Round 1: OPENING STATEMENTS (Apresentação)

**Objetivo:** Cada copywriter apresenta sua abordagem proposta para o briefing.

**Duração:** ~300-400 palavras por copywriter

**Estrutura por Copywriter:**

```markdown
### **[NOME DO COPYWRITER]:**

**1. Análise do Briefing:**
- Pontos-chave identificados no produto/avatar/objetivo
- Insights específicos que informam minha abordagem
- O que considero mais importante neste caso

**2. Abordagem Proposta:**
- Estrutura geral (abertura → corpo → oferta → CTA)
- Tom e voz recomendados
- Ângulo principal de ataque

**3. Justificativa:**
- Por que esta abordagem funciona para ESTE caso específico
- Precedentes ou evidências que suportam
- Conexão com psicologia do avatar

**4. Técnicas Específicas:**
- Lista de técnicas que serão usadas
- Como cada técnica serve ao objetivo

**5. Preview de Abertura:**
```
[Primeiras linhas do copy proposto - demonstração concreta]
```
```

**Critérios de Qualidade Round 1:**
- [ ] Voz distintiva do copywriter
- [ ] Análise específica (não genérica)
- [ ] Abordagem genuinamente diferente dos outros
- [ ] Técnicas características presentes
- [ ] Preview convincente

---

### Round 2: CROSS-EXAMINATION (Críticas)

**Objetivo:** Cada copywriter identifica pontos fracos nas abordagens dos outros.

**Duração:** ~150-200 palavras por crítica

**Regras de Engajamento:**

```
✓ PERMITIDO:
- Críticas técnicas e específicas
- Baseadas em princípios de copywriting
- Identificar riscos genuínos
- Questionar premissas

✗ NÃO PERMITIDO:
- Ataques pessoais
- Críticas vagas ("não é bom")
- Preferência pessoal sem fundamento
- Strawman (distorcer argumento do outro)
```

**Formato de Crítica:**

```markdown
### **[COPYWRITER A] critica [COPYWRITER B]:**

**Ponto Fraco Identificado:**
[Descrição específica da fraqueza]

**Risco Associado:**
[Consequência potencial negativa]

**Evidência:**
[Por que acredito que isso é um problema]
- Dados de mercado
- Comportamento do avatar
- Precedentes conhecidos

**Pergunta Socrática:**
[Questão que desafia a premissa]
```

**Técnica: Devil's Advocate**

Cada copywriter age como "advogado do diabo" para os outros:

```
PREMISSAS A QUESTIONAR:
- "E se o avatar NÃO pensar assim?"
- "E se o mercado já estiver saturado deste ângulo?"
- "O que acontece se as primeiras 5 palavras não captarem?"
- "E se lerem apenas o P.S.?"

CENÁRIOS ADVERSOS:
- "E se a taxa de abertura for 50% menor?"
- "E se scrollarem direto para o preço?"
- "E se o concorrente lançar algo similar amanhã?"
```

**Matriz de Cross-Examination (3 copywriters):**

```
Halbert → critica Ogilvy e Kennedy
Ogilvy → critica Halbert e Kennedy
Kennedy → critica Halbert e Ogilvy
```

**Critérios de Qualidade Round 2:**
- [ ] Críticas específicas e técnicas
- [ ] Baseadas em princípios reais
- [ ] Cobrem riscos genuínos
- [ ] Tom profissional (não pessoal)
- [ ] Cada abordagem foi examinada

---

### Round 3: REBUTTALS (Defesas)

**Objetivo:** Cada copywriter defende sua abordagem das críticas recebidas.

**Duração:** ~200-250 palavras por defesa

**Técnica: Steel-Manning**

Antes de defender, demonstrar que ENTENDEU a crítica:

```markdown
### **[COPYWRITER] responde às críticas:**

**Para crítica de [OUTRO COPYWRITER]:**

**Reconheço o Ponto Válido:**
[Demonstrar que entendeu a crítica - steel-manning]
"Você está correto que [aspecto da crítica]. Isso é uma
preocupação legítima porque [razão]."

**Porém, Considere:**
[Contra-argumento substantivo]
"No entanto, minha abordagem mitiga isso através de [técnica]
porque [razão]."

**Mitigação/Adaptação:**
[Como o risco será evitado ou se a proposta foi ajustada]
"Para endereçar essa preocupação, ajusto minha proposta para
incluir [modificação]."

**Reforço do Ponto Forte:**
[Por que a abordagem ainda é válida]
"O que minha abordagem oferece de único é [diferencial]."
```

**Quando Ceder vs Manter Posição:**

| Situação | Ação |
|----------|------|
| Crítica identifica falha fatal | Ajustar proposta significativamente |
| Crítica identifica risco gerenciável | Mitigar com técnica específica |
| Crítica é preferência pessoal | Manter posição com rationale |
| Crítica revela insight novo | Incorporar insight |

**Critérios de Qualidade Round 3:**
- [ ] Críticas foram adequadamente endereçadas
- [ ] Defesas são substantivas (não dismissivas)
- [ ] Houve adaptação quando apropriado
- [ ] Posições mantidas têm justificativa válida
- [ ] Steel-manning foi aplicado

---

### Round 4: SYNTHESIS (Síntese do Copy Chief)

**Objetivo:** Copy Chief analisa imparcialmente e determina melhor caminho.

**Duração:** Completa (análise + copy final)

**Estrutura da Síntese:**

```markdown
## ⚖️ SÍNTESE DO COPY CHIEF

### 1. ANÁLISE COMPARATIVA

**Matriz de Avaliação:**

| Copywriter | Hook (1-10) | Estrutura (1-10) | Prova (1-10) | Fit c/ Avatar (1-10) | TOTAL |
|------------|-------------|------------------|--------------|----------------------|-------|
| [A] | | | | | |
| [B] | | | | | |
| [C] | | | | | |

**Pontos Fortes por Abordagem:**

**[COPYWRITER A]:**
- [Força 1]
- [Força 2]
- [Força 3]

**[COPYWRITER B]:**
- [Força 1]
- [Força 2]
- [Força 3]

**Pontos Fracos Confirmados:**

| Abordagem | Fraqueza | Severidade | Mitigável? |
|-----------|----------|------------|------------|
| [A] | [Desc] | Alta/Média/Baixa | Sim/Não |
| [B] | [Desc] | Alta/Média/Baixa | Sim/Não |

**Fit com Briefing:**
[Análise de qual abordagem melhor atende aos requisitos específicos]

---

### 2. DECISÃO: WINNING APPROACH

**Escolha:** [Abordagem X / Híbrido de X+Y+Z]

**Rationale Completo:**
[Explicação detalhada de por que esta escolha]

**Elementos Incorporados de Cada:**

| Copywriter | Elemento Usado | Por Quê |
|------------|----------------|---------|
| [A] | [Elemento] | [Razão] |
| [B] | [Elemento] | [Razão] |
| [C] | [Elemento] | [Razão] |

**Elementos Deliberadamente NÃO Incluídos:**

| Elemento | Fonte | Razão para Exclusão |
|----------|-------|---------------------|
| [Elemento] | [Copywriter] | [Razão] |

---

### 3. COPY FINAL

```
[Copy completo implementando a abordagem vencedora,
incorporando os melhores elementos de cada perspectiva,
evitando os riscos identificados]
```

---

### 4. DOCUMENTAÇÃO

**Por que esta síntese é superior:**
[Explicação de como a síntese supera qualquer abordagem individual]

**Riscos Mitigados:**
- [Risco 1] → [Como foi endereçado]
- [Risco 2] → [Como foi endereçado]

**Trade-offs Aceitos:**
- [Trade-off] → [Justificativa]
```

**Critérios de Qualidade Round 4:**
- [ ] Análise imparcial (não favorece um copywriter)
- [ ] Decisão claramente justificada
- [ ] Melhores elementos de cada foram incorporados
- [ ] Copy final é coeso (não "Frankenstein")
- [ ] Rationale completo documentado

---

## Copywriter Perspective Frameworks

### Lentes de Avaliação por Copywriter

Cada copywriter avalia copy através de uma "lente" característica:

**GARY HALBERT - Conexão Humana**
```yaml
foco_principal: Storytelling e empatia
perguntas_características:
  - "Isso fala com UMA pessoa específica?"
  - "Há uma história que cria conexão imediata?"
  - "O leitor pode se ver nesta situação?"
  - "As primeiras palavras capturam atenção?"
critérios:
  - Personalização extrema
  - Storytelling emocional
  - Vulnerabilidade autêntica
  - Hook irresistível
técnicas_preferidas:
  - Cartas pessoais
  - Histórias de "rock bottom"
  - Linguagem conversacional
  - Conexão um-para-um
```

**DAVID OGILVY - Pesquisa e Clareza**
```yaml
foco_principal: Dados e informação
perguntas_características:
  - "Qual dado suporta esta claim?"
  - "O headline contém benefício claro?"
  - "Cada fato está verificado?"
  - "A mensagem é absolutamente clara?"
critérios:
  - Research-backed
  - Headline forte com benefício
  - Informação específica
  - Clareza cristalina
técnicas_preferidas:
  - Headlines factuais
  - Long-form informativo
  - Testimonials verificáveis
  - Brand image consistente
```

**EUGENE SCHWARTZ - Níveis de Consciência**
```yaml
foco_principal: Market awareness e sophistication
perguntas_características:
  - "Em que nível de consciência está o avatar?"
  - "O copy encontra o leitor onde ele está?"
  - "A promessa é proporcional ao awareness?"
  - "O mecanismo único está claro?"
critérios:
  - Awareness-appropriate
  - Mecanismo explicado
  - Desejo canalizado (não criado)
  - Market sophistication matched
técnicas_preferidas:
  - Intensificação de headlines
  - Mechanism copy
  - Desejo existente → produto
  - Sofisticação progressiva
```

**DAN KENNEDY - Urgência e Resultado**
```yaml
foco_principal: Ação imediata e ROI
perguntas_características:
  - "Por que comprar AGORA?"
  - "Qual a consequência de não agir?"
  - "O CTA é direto e claro?"
  - "Há escassez ou deadline real?"
critérios:
  - Urgência real (não artificial)
  - Consequência clara
  - CTA direto
  - Zero enrolação
técnicas_preferidas:
  - Deadlines concretos
  - Consequência de inação
  - CTAs múltiplos e diretos
  - Bonuses com deadline
```

**JON BENSON - Formato Moderno**
```yaml
foco_principal: Mobile e atenção curta
perguntas_características:
  - "Funciona em dispositivo móvel?"
  - "O ritmo mantém scroll?"
  - "Cada slide tem propósito?"
  - "A promessa é visível em 3 segundos?"
critérios:
  - Mobile-optimized
  - Ritmo acelerado
  - Visualmente escaneável
  - Promessa imediata
técnicas_preferidas:
  - VSL format
  - Micro-compromissos
  - Pattern interrupts visuais
  - Short paragraphs
```

**CLAUDE HOPKINS - Abordagem Científica**
```yaml
foco_principal: Testabilidade e dados
perguntas_características:
  - "Isso pode ser testado?"
  - "Qual claim é mais forte baseada em dados?"
  - "O que testes anteriores mostraram?"
  - "Há razão específica para acreditar?"
critérios:
  - Testável
  - Data-driven
  - Específico (números, fatos)
  - Reason-why presente
técnicas_preferidas:
  - Cuponing/tracking
  - Headlines testáveis
  - Claims específicas
  - Sampling strategies
```

**ALEX HORMOZI - Valor Percebido**
```yaml
foco_principal: Oferta irresistível
perguntas_características:
  - "A oferta parece no-brainer?"
  - "Os bonuses superam objeções?"
  - "O preço está ancorado corretamente?"
  - "Há stack de valor?"
critérios:
  - Grand slam offer
  - Value stack
  - Price anchoring
  - Garantia poderosa
técnicas_preferidas:
  - Oferta > 10x do preço
  - Bonuses estratégicos
  - Garantia que remove risco
  - Urgência genuína
```

**JOE SUGARMAN - Slippery Slide**
```yaml
foco_principal: Leitura contínua
perguntas_características:
  - "Cada frase faz querer ler a próxima?"
  - "Há 'escorregador' do início ao fim?"
  - "Os curiosity loops estão funcionando?"
  - "O momentum é mantido?"
critérios:
  - Fluxo irresistível
  - Curiosity loops
  - Transições suaves
  - Engagement constante
técnicas_preferidas:
  - Seeds of curiosity
  - Storytelling extenso
  - Transições que puxam
  - Momentum building
```

**GARY BENCIVENGA - Persuasão Profunda**
```yaml
foco_principal: Psicologia e persuasão
perguntas_características:
  - "Qual o insight psicológico aqui?"
  - "A persuasão é sutil ou óbvia?"
  - "Há layers de significado?"
  - "O leitor sente que decidiu sozinho?"
critérios:
  - Psicologia profunda
  - Persuasão elegante
  - Múltiplos níveis
  - Autonomia preservada
técnicas_preferidas:
  - Fascinations
  - Implied conclusions
  - Social proof sofisticado
  - Reason-why advertising
```

---

## Debate Combinations Matrix

### Debates por Tipo de Projeto

| Tipo de Projeto | Copywriters Recomendados | Razão |
|-----------------|-------------------------|-------|
| **VSL** | Benson, Halbert, Kennedy | Formato, emoção, urgência |
| **Sales Page Longa** | Sugarman, Schwartz, Ogilvy | Flow, awareness, credibilidade |
| **Email Sequence** | Sethi, Halbert, Kennedy | Relação, história, ação |
| **Landing Page** | Hormozi, Kennedy, Benson | Oferta, urgência, formato |
| **Headline/Hook** | Halbert, Benson, Schwartz | Hooks diferentes |
| **Oferta/Pricing** | Hormozi, Kennedy, Bencivenga | Valor, urgência, psicologia |
| **B2B/Formal** | Ogilvy, Hopkins, Bencivenga | Credibilidade, dados, persuasão |
| **Curso/Educação** | Sethi, Sugarman, Halbert | Transformação, engagement, conexão |

### Debates de Alto Contraste (Recomendados)

Debates com maior contraste filosófico produzem insights mais ricos:

```
TRADICIONAL vs MODERNO:
├── Hopkins vs Hormozi (Scientific vs $100M Offers)
├── Ogilvy vs Kern (Formal vs Casual)
└── Schwartz vs Benson (Print vs Digital)

EMOCIONAL vs RACIONAL:
├── Halbert vs Hopkins (História vs Dados)
├── Benson vs Ogilvy (VSL emocional vs Copy factual)
└── Kern vs Sugarman (Casual vs Meticulous)

CURTO vs LONGO:
├── Kennedy vs Sugarman (Direto vs Slippery Slide)
└── Hormozi vs Schwartz (Punchy vs Extensive)

URGÊNCIA vs RELAÇÃO:
├── Kennedy vs Sethi (Deadline vs Nurture)
└── Kern vs Halbert (Fast CTA vs Deep Connection)
```

### Combinações por Tema do Debate

| Tema | Trio Sugerido | Por quê |
|------|---------------|---------|
| Hook/Abertura | Halbert, Benson, Kern | 3 filosofias de hook distintas |
| Estrutura VSL | Benson, Schwartz, Kennedy | Formato, awareness, urgência |
| Long vs Short | Ogilvy, Sugarman, Kennedy | Informação vs flow vs direto |
| Emoção vs Lógica | Halbert, Hopkins, Ogilvy | Espectro emocional completo |
| Storytelling | Halbert, Benson, Sugarman | 3 estilos de narrativa |
| Urgência/CTA | Kennedy, Kern, Halbert | Níveis de pressão variados |
| Ofertas | Hormozi, Kennedy, Schwartz | Valor, urgência, sofisticação |
| Emails | Sethi, Halbert, Sugarman | Relação, história, engagement |

---

## Critique Frameworks

### Framework SLICE para Feedback

```yaml
S - SPECIFIC (Específico):
  bad: "Não gostei do hook"
  good: "O hook 'E se você pudesse...' está saturado neste mercado de crypto"

L - LINKED (Ligado aos Objetivos):
  format: "Dado que o objetivo é [X], isso [ajuda/prejudica] porque [Y]"
  example: "Dado que o objetivo é CTR >3%, hook atual pode não ser disruptivo"

I - IMPACT (Focado em Impacto):
  format: "Se mantivermos [X], provavelmente veremos [consequência mensurável]"
  example: "Se mantivermos CTA fraco, conversão pode cair 30-40%"

C - CONSTRUCTIVE (Construtivo):
  format: "Em vez de [atual], considere [alternativa] porque [razão]"
  example: "Em vez de 'Clique aqui', considere 'Garanta sua vaga agora' para criar urgência"

E - EMPOWERING (Empoderante):
  format: "Isso é uma perspectiva - você tem mais contexto sobre [aspecto]"
  purpose: Preservar autonomia criativa
```

### Framework Three C's (Context, Content, Craft)

```yaml
CONTEXT (Contexto - O onde/quando/por quê):
  questions:
    - Onde a pessoa verá isso? (feed, email, busca)
    - Em que momento da jornada? (awareness level)
    - Por que ela se importaria? (problema, desejo)
    - Qual ação queremos? (click, leia, compre)
  evaluation:
    - O copy faz sentido NESTE contexto?
    - Considera as limitações do meio?

CONTENT (Conteúdo - A mensagem):
  questions:
    - Mensagem principal está clara?
    - Benefício é óbvio?
    - Promessa é crível?
    - Prova é suficiente?
  evaluation:
    - Entenderia em 5 segundos?
    - Mensagem é diferenciada?

CRAFT (Execução - A qualidade):
  questions:
    - Headline captura atenção?
    - Ritmo mantém leitura?
    - Voz é consistente?
    - Há erros?
  evaluation:
    - Flui naturalmente?
    - Cada palavra trabalha?
```

### Framework Head-Heart-Body

```yaml
HEAD (Cabeça - Pré-Criativo):
  when: Antes de criar, revisando briefing
  focus:
    - Problema bem definido?
    - Audiência clara?
    - Insight verdadeiro?
    - Estratégia sólida?

HEART (Coração - Conceito):
  when: Primeira apresentação criativa
  focus:
    - Conceito distintivo?
    - Ressoa emocionalmente?
    - É executável?
    - Alinha com marca?

BODY (Corpo - Execução):
  when: Revisão de versão final
  focus:
    - Conteúdo correto?
    - Qualidade técnica?
    - Consistência?
    - Erros eliminados?
```

---

## Quality Checklists

### Pre-Debate Checklist

```markdown
□ Briefing está completo e claro
□ 2-4 copywriters foram selecionados
□ Pergunta central está definida
□ Constraints estão documentadas
□ Tempo adequado está disponível
□ Critérios de winning estão claros
```

### Round 1 - Opening Statements

```markdown
□ Cada copywriter tem voz distintiva?
□ Abordagens são genuinamente diferentes?
□ Técnicas características estão presentes?
□ Preview de execução é convincente?
□ Justificativas são fundamentadas?
□ Análise do briefing é específica?
```

### Round 2 - Cross-Examination

```markdown
□ Críticas são específicas e técnicas?
□ Baseadas em princípios, não preferência?
□ Cobrem riscos genuínos?
□ Tom é profissional (não pessoal)?
□ Cada abordagem foi criticamente examinada?
□ Perguntas socráticas foram usadas?
```

### Round 3 - Rebuttals

```markdown
□ Críticas foram adequadamente endereçadas?
□ Defesas são substantivas?
□ Houve adaptação quando apropriado?
□ Posições mantidas têm justificativa válida?
□ Steel-manning foi aplicado?
□ Concessões foram feitas quando necessário?
```

### Round 4 - Synthesis

```markdown
□ Análise é imparcial?
□ Decisão é claramente justificada?
□ Melhores elementos foram incorporados?
□ Copy final é coeso (não Frankenstein)?
□ Rationale completo está documentado?
□ Trade-offs estão explicados?
```

### Post-Debate Checklist

```markdown
□ Debate gerou insights não-óbvios?
□ Copy final é superior a qualquer proposta individual?
□ Aprendizados foram documentados?
□ Padrões reutilizáveis foram identificados?
□ Próximos passos estão claros?
```

---

## Anti-Patterns a Evitar

### No Processo

| Anti-Pattern | Descrição | Solução |
|--------------|-----------|---------|
| **Echo Chamber** | Todos concordam rápido demais | Designar devil's advocate explícito |
| **Alpha Dominance** | Um copywriter domina discussão | Tempo igual para todos, moderador controla |
| **Analysis Paralysis** | Debate sem conclusão | Time-box cada round |
| **Personal Attacks** | Críticas pessoais | Moderador intervém, regras claras |
| **Vagueness** | Críticas vagas sem substância | Exigir especificidade (SLICE) |
| **Strawmanning** | Distorcer argumento do outro | Exigir steel-manning |

### No Output

| Anti-Pattern | Descrição | Solução |
|--------------|-----------|---------|
| **Frankenstein** | Síntese desconexa de partes | Copy Chief refina para coesão |
| **Weakest Common** | Consenso pelo mínimo comum | Buscar integração, não compromisso |
| **Ignored Insights** | Boas ideias descartadas | Documentar tudo, justificar exclusões |
| **Undocumented** | Decisões sem rationale | Template obrigatório com rationale |
| **Identical Voices** | Copywriters soando igual | Enfatizar características únicas |

---

## Output Format

### Estrutura do Documento de Debate

```yaml
format: markdown
sections:
  1. debate_header:
    - Metadata (data, copywriters, briefing)
    - Pergunta central
    - Critérios de winning

  2. round_1_opening:
    - Opening statement de cada copywriter
    - Análise + abordagem + preview

  3. round_2_critiques:
    - Cross-examination completa
    - Todas as combinações de críticas

  4. round_3_rebuttals:
    - Defesas de cada copywriter
    - Adaptações feitas

  5. round_4_synthesis:
    - Análise comparativa do Copy Chief
    - Decisão e rationale
    - Copy final implementado

  6. debate_insights:
    - Principais aprendizados
    - Padrões para reutilização
    - Erros a evitar
```

---

## Example Output

```markdown
# Copy Debate: Melhor Hook para VSL de Curso de Copywriting

**Data:** 2026-01-23
**Copywriters:** Gary Halbert, Jon Benson, Dan Kennedy
**Briefing:** Curso de copywriting R$997, avatar empreendedor 25-45, frustrado com vendas baixas
**Pergunta Central:** Qual a melhor abordagem de hook para capturar atenção nos primeiros 5 segundos?

---

## 🎤 ROUND 1: OPENING STATEMENTS

### **[GARY HALBERT]:**

**Análise do Briefing:**
O avatar é um empreendedor frustrado. Frustração é emoção. Emoção é minha especialidade. Ele já tentou várias coisas que não funcionaram. Precisa de alguém que ENTENDA sua dor antes de oferecer solução.

**Abordagem Proposta:**
Começar com história pessoal de "rock bottom" que espelha a situação do avatar. Criar identificação imediata. Só depois revelar a solução.

**Justificativa:**
Empreendedores frustrados estão cansados de promessas. Precisam primeiro sentir que você ENTENDE antes de ouvir mais uma solução. História cria essa ponte.

**Técnicas:**
- Abertura em primeira pessoa
- Cenário visual específico (3h da manhã, cursor piscando)
- Curiosity loop no final

**Preview:**
```
"Eram 3h da manhã e eu estava olhando para o cursor piscando na tela...
com R$47 na conta e uma pilha de boletos na mesa.
Minha esposa dormia no quarto ao lado, sem saber que eu estava a 30 dias
de perder tudo.

Foi naquela noite que eu descobri os 7 caracteres que mudaram tudo..."
```

---

### **[JON BENSON]:**

**Análise do Briefing:**
Avatar moderno, provavelmente vendo no celular, atenção de 8 segundos. Não tenho tempo para história longa. Preciso de promessa clara em 3 segundos + prova implícita em 5.

**Abordagem Proposta:**
VSL moderno: promessa específica + timeframe + proof number. Pular história, ir direto ao valor.

**Justificativa:**
Dados mostram que atenção em vídeo cai 40% após 10 segundos sem promessa clara. Avatar ocupado quer saber "vale meu tempo?" antes de investir atenção.

**Técnicas:**
- Promessa com número específico
- Timeframe definido (12 minutos)
- Social proof implícito (2.847 pessoas)

**Preview:**
```
"O que eu vou te mostrar nos próximos 12 minutos vai parecer impossível...
[PAUSA]
...mas já transformou 2.847 pessoas que NÃO sabiam escrever
em copywriters que faturam 5 dígitos por mês.

E não, você não precisa de talento. Você precisa de UM framework."
```

---

### **[DAN KENNEDY]:**

**Análise do Briefing:**
Empreendedor frustrado = já viu muita coisa. Não quer mais enrolação. Quer saber: funciona ou não? Quanto custa? Por que agora?

**Abordagem Proposta:**
Direto ao ponto. Atenção + urgência + promessa de eficiência. Zero storytelling no início.

**Justificativa:**
Storytelling é 2005. Avatar de hoje já viu milhares de histórias de "rock bottom". Diferenciação está em NÃO fazer o esperado.

**Técnicas:**
- Abertura com ATENÇÃO
- Deadline imediato
- Promessa de eficiência (direto ao ponto)

**Preview:**
```
"ATENÇÃO: Se você quer escrever copy que vende, você tem exatamente
72 horas para aplicar o que vou te mostrar.

Depois disso, esta página SAI DO AR e você volta para o Google tentando
aprender com conteúdo grátis que nunca vai te dar resultado real.

Pronto? Ótimo. Vamos direto ao ponto..."
```

---

## 🔍 ROUND 2: CROSS-EXAMINATION

### **[BENSON] critica [HALBERT]:**

**Ponto Fraco:** História de "3h da manhã" é clichê de 2005. Todo VSL usa isso.

**Risco:** Avatar moderno faz scroll antes de chegar na promessa. Drop-off de 40%+ nos primeiros 10 segundos.

**Evidência:** Dados de heatmap mostram que atenção em vídeo cai drasticamente após 8 segundos sem promessa clara. Avatar já viu essa história 100 vezes.

**Pergunta Socrática:** "Se o avatar já viu dezenas de histórias de 'rock bottom', o que faz a SUA diferente o suficiente para manter atenção?"

---

### **[HALBERT] critica [BENSON]:**

**Ponto Fraco:** "12 minutos" pode afugentar quem tem pouco tempo. E "2.847 pessoas" parece número fabricado.

**Risco:** Números muito específicos demais geram desconfiança. Avatar pensa "isso é real?"

**Evidência:** Estudos mostram que números redondos parecem mais críveis que números quebrados demais. 2.847 parece que você inventou ontem.

**Pergunta Socrática:** "Se a promessa parece boa demais, o avatar acredita ou desconfia?"

---

### **[KENNEDY] critica [HALBERT] e [BENSON]:**

**Ponto Fraco de Ambos:** Nenhum cria urgência REAL. Avatar assiste, gosta, e "volta depois" (nunca volta).

**Risco:** Sem deadline concreto = sem ação imediata. Taxa de conclusão de VSL sem urgência é <15%.

**Evidência:** Meus próprios testes mostram que deadline aumenta conversão em 200-400%. Sem deadline, pessoas procrastinam eternamente.

**Pergunta Socrática:** "Quantas vezes você mesmo disse 'vou ver depois' e nunca mais voltou?"

---

[Continua com Round 3 e 4...]
```

---

## Workflow Integration

### Step 1: Prepare Debate

```
1. Coletar inputs completos
   - Briefing detalhado
   - Avatar profile
   - Objetivos e KPIs

2. Selecionar copywriters
   - 2-4 copywriters
   - Preferir alto contraste filosófico
   - Considerar tipo de projeto

3. Definir pergunta central
   - Específica e debatível
   - Múltiplas respostas válidas possíveis

4. Estabelecer critérios
   - Como determinar "vencedor"
   - Constraints e requisitos
```

### Step 2: Execute Rounds

```
Para cada Round (1-4):
1. Introduzir objetivo do round
2. Executar conforme estrutura
3. Verificar critérios de qualidade
4. Documentar output
5. Transicionar para próximo round
```

### Step 3: Post-Debate

```
1. Revisar síntese
   - Coesão do copy final
   - Completude do rationale

2. Documentar learnings
   - Padrões identificados
   - Técnicas efetivas
   - Erros a evitar

3. Preparar deliverables
   - Copy final formatado
   - Documento de debate arquivado
   - Action items
```

---

## Integration with Copy Framework

### Tier Integration

| Tier | Debate Role |
|------|-------------|
| **Tier 0 (Briefing)** | Input para debate |
| **Tier 1 (Research)** | Informa perspectivas |
| **Tier 2 (Structure)** | Debate sobre estrutura |
| **Tier 3 (Execution)** | Copy final do debate |
| **TOOL (Debate)** | Este task |

### Handoff

```yaml
input_from:
  - Tier 0 briefing completo
  - Tier 1 research (se disponível)

output_to:
  - Copy final para Tier 3 refinement
  - Learnings para knowledge base
  - Padrões para projetos futuros
```

---

## Notes

- Debates funcionam melhor com copywriters de filosofias diferentes
- Copy Chief deve ser imparcial (não favorecer um copywriter)
- O valor está tanto no DEBATE quanto no copy final
- Insights são reutilizáveis em projetos futuros
- 2-3 copywriters é ideal; 4 pode ficar muito longo
- Time-box cada round para evitar paralisia
- Documentar TUDO - decisões não documentadas são perdidas

---

*Task Version: 2.0*
*Last Updated: 2026-01-23*
*Copy Framework v2.0 - Multi-Perspective Debate System*
