# Proposta de Melhoria do Agente Criador e Avaliador de A3

## 1. Diagnóstico do Estado Atual

### Pontos Fortes
- Estrutura clara de tipos de A3 (Estratégico, Tático, Operacional)
- Integração com Hoshin Kanri bem definida
- Processo passo a passo para construção
- Referência ao Modelo Shingo (sistema -> comportamento -> resultado)
- Modo de avaliação para A3 existentes

### Gaps Identificados
1. **Base teórica limitada** - Falta profundidade nos conceitos de A3 Thinking da Toyota
2. **Rubrica de avaliação vaga** - "X/10 e recomendação" não é criterioso
3. **5 Porquês superficial** - Falta orientação para evitar armadilhas comuns
4. **Ishikawa genérico** - Precisa de exemplos e critérios de qualidade por M
5. **Nemawashi ausente** - Conceito crítico de consenso não está presente
6. **PDCA implícito** - Deveria ser explícito na estrutura do A3
7. **Contramedida vs Ação** - Confusão conceitual não esclarecida
8. **Coaching approach** - Falta orientação para desenvolver pensamento crítico

---

## 2. Melhorias Propostas para o Prompt Base

### 2.1 Adicionar Seção: Fundamentos do A3 Thinking

```
📚 FUNDAMENTOS DO A3 THINKING (OBRIGATÓRIO CONHECER)

O A3 Thinking nasceu na Toyota nos anos 1960 e carrega três significados:
1. O PAPEL - Restrição física que força clareza (A3 = 297×420mm)
2. O PROCESSO - Fluxo estruturado baseado em PDCA
3. O COACHING - Storyboard vivo que convida perguntas e desenvolve pessoas

Princípio Toyota: "Se o trabalhador não aprendeu, o professor não ensinou."

O A3 NÃO é:
- Um formulário para preencher
- Um relatório de status
- Uma apresentação de PowerPoint comprimida

O A3 É:
- Um processo de pensamento disciplinado
- Uma ferramenta de diálogo e consenso
- Um mecanismo de desenvolvimento de pessoas
```

### 2.2 Adicionar Seção: PDCA Explícito

```
🔄 ESTRUTURA PDCA DO A3

PLAN (Lado Esquerdo do A3)
├── Contexto → Entender o cenário
├── Condições Atuais → Basear em fatos do Gemba
├── Objetivos e Metas → Definir estado futuro mensurável
└── Análise de Causa Raiz → Ishikawa + 5 Porquês

DO (Lado Direito do A3)
├── Contramedidas → Ações sistêmicas contra causas raiz
└── Cronograma → Quem, O quê, Quando

CHECK
└── Monitoramento → Indicadores de resultado e eficácia

ACT
└── Padronização ou Novo Ciclo → Se funciona, padronizar; se não, rodar novo PDCA
```

### 2.3 Melhorar Seção: Análise 5 Porquês

```
🔍 TÉCNICA DOS 5 PORQUÊS (APRIMORADA)

REGRAS DE OURO:
1. Sempre comece com o EFEITO claramente definido (frase única)
2. Cada "Porquê" deve ser verificável com dados
3. NUNCA termine com uma pessoa como causa ("operador errou")
4. Termine quando chegar a um FATOR SISTÊMICO modificável
5. O número 5 é guia, não lei - pode ser 3 ou 7

VALIDAÇÃO REVERSA:
Após completar, leia de baixo para cima usando "PORTANTO":
- Causa 5 existe → PORTANTO → Causa 4 acontece
- Causa 4 existe → PORTANTO → Causa 3 acontece
- ...até o EFEITO

Se a lógica quebrar, refaça a análise.

ARMADILHAS A EVITAR:
❌ Parar no sintoma, não na causa
❌ Aceitar "falta de treinamento" como causa final
❌ Pular para soluções antes de completar a análise
❌ Ignorar múltiplas cadeias causais
❌ Não validar com quem está no Gemba

EXEMPLO BOM vs RUIM:

RUIM:
P1: Por que houve atraso na entrega? R: O operador demorou.
P2: Por que o operador demorou? R: Ele é lento.
→ CAUSA: Operador (ERRADO - culpa pessoa)

BOM:
P1: Por que houve atraso na entrega? R: Material chegou fora do prazo.
P2: Por que material chegou fora do prazo? R: Pedido foi feito com atraso.
P3: Por que pedido foi feito com atraso? R: Não há gatilho automático de reposição.
P4: Por que não há gatilho automático? R: Sistema não foi configurado.
P5: Por que sistema não foi configurado? R: Não existe padrão de parametrização.
→ CAUSA: Falta de padrão de parametrização (CERTO - sistêmico)
```

### 2.4 Melhorar Seção: Ishikawa 6M

```
🐟 DIAGRAMA DE ISHIKAWA - 6M APRIMORADO

ESTRUTURA EXPANDIDA POR M:

1. MÉTODO (Processos, Procedimentos)
   Perguntas-guia:
   - O processo está padronizado?
   - O padrão é seguido?
   - O padrão é adequado?
   - Há etapas que não agregam valor?

2. MEDIDA (Indicadores, Calibração)
   Perguntas-guia:
   - Como medimos o problema?
   - Os instrumentos estão calibrados?
   - A frequência de medição é adequada?
   - Os dados são confiáveis?

3. MÃO DE OBRA (Pessoas, Competências)
   Perguntas-guia:
   - As pessoas foram treinadas?
   - Há matriz de competências?
   - A carga de trabalho é adequada?
   - Há rotatividade afetando?
   ⚠️ Nunca culpe a pessoa - busque a falha no sistema

4. MÁQUINA (Equipamentos, Sistemas, TI)
   Perguntas-guia:
   - O equipamento é adequado?
   - A manutenção está em dia?
   - Há capabilidade para o processo?
   - Os sistemas suportam a operação?

5. MATERIAL (Insumos, Informações)
   Perguntas-guia:
   - A especificação está correta?
   - O fornecedor é qualificado?
   - O armazenamento é adequado?
   - A informação chega no tempo certo?

6. MEIO AMBIENTE (Condições, Cultura)
   Perguntas-guia:
   - As condições físicas são adequadas?
   - Há pressão de prazo excessiva?
   - A cultura permite reportar problemas?
   - Há comunicação entre áreas?

CRITÉRIOS DE QUALIDADE DO ISHIKAWA:
✅ Mínimo 2, máximo 4 causas por M (evita dispersão)
✅ Causas devem ser verificáveis
✅ Causas são sistêmicas, não pessoais
✅ Cada causa deve ter evidência ou ser marcada [VALIDAR]
```

### 2.5 Adicionar Seção: Contramedida vs Ação

```
⚔️ CONTRAMEDIDA vs AÇÃO - DIFERENÇA CRÍTICA

CONTRAMEDIDA (Toyota Way):
- Ataca diretamente uma CAUSA RAIZ identificada
- É baseada no conhecimento ATUAL (pode evoluir)
- Reconhece que não é solução "final" - melhoria contínua
- Foco em SISTEMA, não em pessoa

AÇÃO:
- É a EXECUÇÃO de uma contramedida
- Verbo + Objeto + Responsável + Prazo
- Granular e mensurável

HIERARQUIA:
1 Causa Raiz → 1 Contramedida → N Ações de Execução

EXEMPLO:
Causa Raiz: Falta de padrão de parametrização do sistema
Contramedida: Criar e implementar padrão de parametrização
Ações:
  - Mapear parâmetros críticos | João | 15/Jan
  - Elaborar documento padrão | Maria | 22/Jan
  - Validar com stakeholders | João | 29/Jan
  - Treinar usuários | Ana | 05/Fev
  - Implementar em produção | TI | 12/Fev

NUNCA CONFUNDA:
❌ "Treinar operadores" como contramedida (é ação, não ataca causa sistêmica)
✅ "Implementar sistema de gestão visual de parâmetros críticos" (contramedida sistêmica)
```

### 2.6 Adicionar Seção: Nemawashi e Consenso

```
🌱 NEMAWASHI - CONSTRUÇÃO DE CONSENSO

CONCEITO:
Nemawashi (根回し) = "trabalhar em torno das raízes"
É o processo de buscar alinhamento ANTES da aprovação formal.

POR QUE É CRÍTICO NO A3:
- Decisão lenta, implementação rápida (Toyota Way #13)
- Remove objeções antes da reunião formal
- Garante buy-in dos stakeholders
- A3 é a "bola" do processo de Catchball

COMO APLICAR:
1. Envie rascunho do A3 para stakeholders-chave
2. Conduza conversas 1-a-1 para coletar feedback
3. Incorpore insights ao A3
4. Repita até ter consenso suficiente
5. Apresente versão final para aprovação

CHECKLIST DE NEMAWASHI:
[ ] Sponsor validou o contexto estratégico?
[ ] Áreas impactadas foram consultadas?
[ ] Donos das ações concordam com prazos?
[ ] Recursos necessários foram negociados?
[ ] Objeções foram endereçadas?
```

### 2.7 Criar Rubrica de Avaliação Estruturada

```
📊 RUBRICA DE AVALIAÇÃO DE A3 (10 CRITÉRIOS)

Para cada critério: 1 (Crítico) | 2 (Insuficiente) | 3 (Básico) | 4 (Bom) | 5 (Excelente)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ALINHAMENTO ESTRATÉGICO (Peso 2x)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5: Conexão clara com objetivo Hoshin, driver e indicador
4: Conexão identificável mas poderia ser mais explícita
3: Menção ao contexto estratégico sem conexão clara
2: Conexão vaga ou forçada
1: Sem conexão estratégica identificável

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. QUALIDADE DO CONTEXTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5: Conciso (≤5 linhas), explica o porquê, não antecipa solução
4: Adequado mas levemente prolixo ou antecipa solução
3: Contexto presente mas incompleto
2: Muito vago ou muito extenso
1: Ausente ou irrelevante

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. EVIDÊNCIA DAS CONDIÇÕES ATUAIS (Peso 2x)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5: ≥3 evidências quantitativas, estratificadas, com tendência
4: 2-3 evidências com dados mas sem estratificação
3: Dados presentes mas não estratificados
2: Apenas menção qualitativa ao problema
1: Sem evidências objetivas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. OBJETIVOS E METAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5: SMART (específicos, mensuráveis, alcançáveis, relevantes, temporais)
4: Mensuráveis e com prazo, mas poderiam ser mais específicos
3: Presentes mas não totalmente mensuráveis
2: Vagos ou sem prazo
1: Ausentes ou não relacionados ao problema

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. QUALIDADE DO ISHIKAWA (Peso 2x)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5: 6M completo, causas sistêmicas, 2-4 por M, verificáveis
4: 6M com boas causas mas cobertura desigual
3: Ishikawa presente mas causas superficiais
2: Ishikawa incompleto ou com causas pessoais
1: Ausente ou apenas listagem sem estrutura

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. PROFUNDIDADE DOS 5 PORQUÊS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5: Chega a fator sistêmico, validável de baixo para cima
4: Boa profundidade mas não totalmente verificável
3: Para antes de causa sistêmica
2: Apenas 2-3 níveis ou termina em pessoa
1: Ausente ou superficial (1 nível)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. CONTRAMEDIDAS (Peso 2x)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5: 1:1 com causas raiz, sistêmicas, com Definition of Done
4: Atacam causas mas DoD poderia ser mais claro
3: Presentes mas algumas são ações, não contramedidas
2: Confundem ação com contramedida
1: Ausentes ou não relacionadas às causas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. CRONOGRAMA E COBERTURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5: 100% das contramedidas cobertas, sequência lógica, gates
4: Boa cobertura mas sem gates ou sequência pode melhorar
3: Cobertura parcial (70-99%)
2: Cobertura baixa (<70%) ou sem responsáveis
1: Ausente ou desconectado das contramedidas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. MONITORAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5: Indicadores de resultado + eficácia, régua clara, ritual definido
4: Indicadores adequados mas sem ritual ou régua incompleta
3: Indicadores presentes mas não medem o problema diretamente
2: Indicadores vagos ou sem metas
1: Ausente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10. COERÊNCIA LÓGICA GERAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5: Fluxo impecável: Contexto→Problema→Causa→Contramedida→Ação→Monitoramento
4: Fluxo coerente com pequenas lacunas
3: Algumas desconexões identificáveis
2: Lacunas significativas na lógica
1: Sem coerência identificável

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÁLCULO DA NOTA FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Critérios com peso 2x: 1, 3, 5, 7 (multiplicar por 2)
Critérios com peso 1x: 2, 4, 6, 8, 9, 10

Pontuação máxima: (4 × 5 × 2) + (6 × 5 × 1) = 40 + 30 = 70 pontos
Nota final: (Pontuação obtida / 70) × 10

CLASSIFICAÇÃO:
9.0 - 10.0: Excelente - Pronto para execução
8.0 - 8.9: Bom - Pequenos ajustes recomendados
7.0 - 7.9: Adequado - Revisão de alguns blocos necessária
6.0 - 6.9: Insuficiente - Revisão significativa necessária
< 6.0: Crítico - Refazer o A3
```

---

## 3. Base de Conhecimento Expandida

### KB_01: Fundamentos do A3 Thinking Toyota

```markdown
# KB_01: Fundamentos do A3 Thinking Toyota

## Origem e Evolução
- Desenvolvido na Toyota nos anos 1960
- Formato A3 escolhido por ser grande o suficiente para gráficos mas pequeno para transportar
- Evoliu de formato de papel para disciplina de resolução de problemas e prática de liderança

## Os Três Significados do A3
1. **O Papel**: Restrição física que força clareza e síntese
2. **O Processo de Pensamento**: Fluxo estruturado baseado em PDCA
3. **O Coaching Storyboard**: Ferramenta de diálogo que desenvolve pessoas

## Oito Facetas do A3 (Lean Enterprise Institute)
1. Padrão físico (papel A3)
2. Template (documento pré-formatado)
3. Storyboard (comunicação visual)
4. Formato de relatório (documentação final)
5. Metodologia de resolução de problemas
6. Disciplina de gestão (coaching)
7. A3 Thinking (modo de pensar sistemático)
8. Ferramenta de alinhamento estratégico

## Princípios Fundamentais
- "Se o trabalhador não aprendeu, o professor não ensinou"
- A3 muda cultura de "debate sobre autoridade" para "diálogo sobre responsabilidade"
- Baseado em fatos indisputáveis do Gemba
- O dono do A3 tem responsabilidade pela implementação

## Fontes
- Lean Enterprise Institute: https://www.lean.org/lexicon-terms/a3-report/
- MIT Sloan Management Review: https://sloanreview.mit.edu/article/toyotas-secret-the-a3-report/
```

### KB_02: Integração PDCA e A3

```markdown
# KB_02: Integração PDCA e A3

## O Ciclo PDCA (Deming)
- Plan: Determinar objetivos e mudanças necessárias
- Do: Implementar mudanças
- Check: Avaliar resultados
- Act: Padronizar ou iniciar novo ciclo

## Mapeamento A3 → PDCA

| PDCA | Seção do A3 |
|------|-------------|
| PLAN | Contexto, Condições Atuais, Objetivos/Metas, Análise Causa Raiz |
| DO | Contramedidas, Cronograma |
| CHECK | Monitoramento |
| ACT | Padronização (se eficaz) ou Novo PDCA (se ineficaz) |

## Estrutura Visual
- Lado Esquerdo do A3 = PLAN (entendimento)
- Lado Direito do A3 = DO + CHECK (ação e verificação)
- Rodapé = ACT (decisão de eficácia)

## Ciclo Contínuo
- A3 não é documento estático
- Deve ser atualizado conforme aprendizado
- Fecha um PDCA, pode abrir outro

## Fonte
- OPEX Learning: https://opexlearning.com/resources/lean-six-sigma-plan-do-check-act-pdca-and-a3/
```

### KB_03: Técnica dos 5 Porquês Avançada

```markdown
# KB_03: Técnica dos 5 Porquês Avançada

## Origem
- Desenvolvida por Sakichi Toyoda (fundador Toyota Industries)
- Prática central no Lean e Kaizen

## Regras de Ouro
1. Comece com EFEITO claramente definido
2. Cada "Porquê" deve ser verificável com dados
3. NUNCA termine com pessoa como causa
4. Termine em FATOR SISTÊMICO modificável
5. O "5" é guia, não regra (pode ser 3 ou 7)

## Validação Reversa
Ler de baixo para cima usando "PORTANTO":
Causa N → PORTANTO → Causa N-1 → ... → EFEITO

## Armadilhas Comuns
1. Parar no sintoma
2. Aceitar "falta de treinamento" como final
3. Pular para soluções prematuramente
4. Ignorar múltiplas cadeias causais
5. Não validar no Gemba

## Limitações Reconhecidas
- Teruyuki Minoura (Toyota) criticou como "muito básico"
- Para problemas complexos, combinar com Ishikawa
- Depende da qualidade do facilitador

## Quando Usar
- Problemas com causação linear clara
- Necessidade de solução rápida
- Equipe pequena e focada

## Fontes
- Tulip: https://tulip.co/glossary/five-whys/
- Wikipedia: https://en.wikipedia.org/wiki/Five_whys
```

### KB_04: Diagrama de Ishikawa 6M

```markdown
# KB_04: Diagrama de Ishikawa 6M

## Origem
- Popularizado por Kaoru Ishikawa nos anos 1960
- Estaleiros Kawasaki, Japão
- Uma das 7 ferramentas básicas da qualidade

## Os 6M da Manufatura

### 1. MÉTODO (Method)
- Processos padronizados?
- Padrão é seguido?
- Padrão é adequado?
- Etapas que não agregam valor?

### 2. MEDIDA (Measurement)
- Como medimos o problema?
- Instrumentos calibrados?
- Frequência adequada?
- Dados confiáveis?

### 3. MÃO DE OBRA (Manpower)
- Pessoas treinadas?
- Matriz de competências existe?
- Carga de trabalho adequada?
- Rotatividade afetando?
⚠️ Nunca culpar pessoa - buscar falha no sistema

### 4. MÁQUINA (Machine)
- Equipamento adequado?
- Manutenção em dia?
- Capabilidade para o processo?
- Sistemas suportam operação?

### 5. MATERIAL (Material)
- Especificação correta?
- Fornecedor qualificado?
- Armazenamento adequado?
- Informação chega no tempo?

### 6. MEIO AMBIENTE (Mother Nature/Environment)
- Condições físicas adequadas?
- Pressão de prazo excessiva?
- Cultura permite reportar problemas?
- Comunicação entre áreas?

## Modelos Expandidos
- 7M: Inclui Money (recursos financeiros)
- 8M: Inclui Management e Maintenance

## Critérios de Qualidade
- Mínimo 2, máximo 4 causas por M
- Causas verificáveis
- Causas sistêmicas, não pessoais
- Cada causa com evidência ou [VALIDAR]

## Integração com 5 Porquês
Ishikawa gera possibilidades → 5 Porquês aprofunda as prioritárias

## Fonte
- ASQ: https://asq.org/quality-resources/fishbone
- Thinkleansixsigma: https://www.thinkleansixsigma.com/article/ishikawa-diagram
```

### KB_05: Contramedida vs Ação vs Solução

```markdown
# KB_05: Contramedida vs Ação vs Solução

## Definições

### CONTRAMEDIDA (Countermeasure) - Toyota Way
- Ataca diretamente uma CAUSA RAIZ
- Baseada no conhecimento ATUAL
- Reconhece que pode evoluir (melhoria contínua)
- Foco em SISTEMA, não em pessoa
- Termo preferido pela Toyota

### AÇÃO
- EXECUÇÃO de uma contramedida
- Verbo + Objeto + Responsável + Prazo
- Granular e mensurável

### SOLUÇÃO (Solution) - Termo a evitar
- Implica "final" e "definitivo"
- Cria falsa sensação de segurança
- Pode fazer equipe ignorar recorrência

## Por que Toyota prefere "Contramedida"
- Evita mentalidade de "resolvido para sempre"
- Reconhece que conhecimento evolui
- Mantém humildade e abertura para melhoria
- Problema "resolvido" pode retornar

## Hierarquia de Ações (A.D.P.)
1. **A**dministrativas - Treinar, instruir (mais fraco)
2. **D**etecção - Inspeção, poka-yoke de detecção
3. **P**revenção - Elimina causa raiz (mais forte)

## Exemplo Prático
```
Causa Raiz: Falta de padrão de parametrização do sistema
Contramedida: Implementar sistema de gestão visual de parâmetros
Ações:
  - Mapear parâmetros críticos | João | 15/Jan
  - Elaborar documento padrão | Maria | 22/Jan
  - Validar com stakeholders | João | 29/Jan
  - Treinar usuários | Ana | 05/Fev
  - Implementar em produção | TI | 12/Fev
```

## Fonte
- AllAboutLean: https://www.allaboutlean.com/practical-problem-solving-countermeasures-and-implement/
- Velaction: https://www.velaction.com/countermeasures/
```

### KB_06: Nemawashi e Catchball

```markdown
# KB_06: Nemawashi e Catchball

## Nemawashi (根回し)
### Significado
"Trabalhar em torno das raízes" - processo de buscar alinhamento ANTES da aprovação formal

### Princípio Toyota #13
"Tome decisões lentamente por consenso, considerando todas as opções; implemente rapidamente"

### Benefícios
- Decisão lenta, implementação rápida
- Remove objeções antes da reunião formal
- Garante buy-in dos stakeholders
- Reduz conflito e preserva harmonia

### Processo
1. Enviar rascunho do A3 para stakeholders
2. Conduzir conversas 1-a-1
3. Incorporar feedback
4. Repetir até consenso
5. Apresentar versão final

## Catchball
### Conceito
Processo de "jogar a bola" entre níveis hierárquicos no Hoshin Kanri

### Fluxo
1. Executivos "jogam" direção estratégica
2. Gerentes "pegam" e devolvem com feedback
3. Ida e volta até alinhamento
4. A3 é a "bola" do Catchball

### Benefícios
- Estratégia feita COM funcionários, não PARA
- Alinhamento trabalho diário ↔ estratégia
- Ownership distribuído
- Issues emergem cedo

## Checklist de Nemawashi para A3
[ ] Sponsor validou contexto estratégico?
[ ] Áreas impactadas consultadas?
[ ] Donos das ações concordam com prazos?
[ ] Recursos negociados?
[ ] Objeções endereçadas?

## Fonte
- Businessmap: https://businessmap.io/lean-management/hoshin-kanri/what-is-catchball
- LinkedIn: https://www.linkedin.com/advice/0/how-do-you-use-nemawashi-build-consensus-lean-initiatives
```

### KB_07: Erros Comuns no A3

```markdown
# KB_07: Erros Comuns no A3 e Como Evitar

## Erros de Processo

### 1. Não Atualizar Frequentemente
- A3 fica obsoleto
- Não reflete conhecimento atual
- **Solução**: Revisar semanalmente durante execução

### 2. Falta de Envolvimento da Liderança
- Sinaliza que problema não é prioridade
- Menos buy-in e input
- **Solução**: Sponsor ativo nas revisões

### 3. Parar Análise de Causa Cedo Demais
- Red flag: "operador errou" como causa
- Trata sintoma, não causa
- **Solução**: Sempre chegar a fator sistêmico

### 4. Pular Etapas
- Especialmente causa raiz ou follow-up
- Quebra o ciclo PDCA
- **Solução**: Checklist obrigatório

### 5. Correr para Mostrar "A Resposta"
- Mostra necessidade de parecer competente
- Pula análise adequada
- **Solução**: Cultura de aprendizado, não julgamento

## Erros de Conteúdo

### 6. Priorizar Forma sobre Conteúdo
- A3 bonito com análise fraca
- **Solução**: Conteúdo > Estética

### 7. Expandir Além de Uma Página
- Sinaliza história não focada
- **Solução**: Refinar visuais, usar apêndice se necessário

### 8. Metas Vagas
- "Melhorar qualidade" não é meta
- **Solução**: Sempre numérico e temporal

### 9. Contramedidas que são Ações
- "Treinar equipe" não ataca sistema
- **Solução**: Pensar em mudança de processo/sistema

### 10. Monitoramento sem Ritual
- Indicadores sem reunião de acompanhamento
- **Solução**: Definir frequência, participantes, foco

## Citação de Michel Baudin
"Mesmo que o A3 às vezes seja desfilado como relíquia sagrada, é apenas uma ferramenta menor. O trabalho principal ainda é identificar e resolver o problema. Se tenho escolha entre análise de causa raiz desleixada num A3 e uma boa num envelope usado, fico com o envelope."

## Fonte
- Michel Baudin's Blog: https://michelbaudin.com/2016/04/07/the-a3-report-part-3-limitations-and-common-mistakes-christof-roser/
- LearnLeanSigma: https://www.learnleansigma.com/guides/a3-problem-solving/
```

### KB_08: Modelo Shingo e A3

```markdown
# KB_08: Integração Modelo Shingo e A3

## O Diamante da Transformação Shingo

### Componentes (Centro para Fora)
- **CULTURA** (centro) → Base de tudo
- **PRINCÍPIOS** → Regras fundamentais que governam consequências
- **SISTEMAS** → Estruturas que direcionam comportamentos
- **FERRAMENTAS** → Métodos de implementação (A3 é uma delas)
- **RESULTADOS** → Consequências dos comportamentos

### Fluxo Causal
Princípios informam → Sistemas direcionam → Comportamentos produzem → Resultados

## Os 3 Níveis de Princípios Shingo

### 1. Cultural Enablers (Habilitadores Culturais)
- Respeito por cada indivíduo
- Liderar com humildade

### 2. Continuous Improvement (Melhoria Contínua)
- Buscar perfeição
- Abraçar pensamento científico
- Foco no processo
- Assegurar qualidade na fonte
- Melhorar fluxo e puxar valor

### 3. Enterprise Alignment (Alinhamento Empresarial)
- Pensar sistemicamente
- Criar constância de propósito
- Criar valor para o cliente

## Aplicação no A3

### Sistema → Comportamento → Resultado
Este princípio Shingo é OBRIGATÓRIO no A3:
- Nunca culpar pessoa (comportamento)
- Sempre mudar sistema
- Sistema corrigido → Comportamento muda → Resultado melhora

### Liderança no A3
- Líderes colocam princípios na cultura
- Gestores constroem sistemas em torno deles
- A3 é ferramenta para ambos

## Fonte
- Shingo Institute: https://shingo.org/shingo-model/
- 6Sigma.us: https://www.6sigma.us/six-sigma-in-focus/shingo-model/
```

---

## 4. Prompt Melhorado Consolidado

O prompt completo melhorado está disponível no arquivo separado: `PROMPT_A3_MELHORADO_v2.md`

---

## 5. Fontes Principais da Pesquisa

### A3 Thinking e Toyota
- [Lean Enterprise Institute - A3 Report](https://www.lean.org/lexicon-terms/a3-report/)
- [MIT Sloan - Toyota's Secret: The A3 Report](https://sloanreview.mit.edu/article/toyotas-secret-the-a3-report/)
- [LearnLeanSigma - A3 Problem-Solving Guide 2025](https://www.learnleansigma.com/guides/a3-problem-solving/)

### PDCA e Melhoria Contínua
- [Lean Enterprise Institute - PDCA](https://www.lean.org/lexicon-terms/pdca/)
- [OPEX Learning - PDCA and A3](https://opexlearning.com/resources/lean-six-sigma-plan-do-check-act-pdca-and-a3/)

### 5 Porquês
- [Tulip - Five Whys](https://tulip.co/glossary/five-whys/)
- [Wikipedia - Five Whys](https://en.wikipedia.org/wiki/Five_whys)

### Ishikawa/6M
- [ASQ - Fishbone Diagram](https://asq.org/quality-resources/fishbone)
- [ThinkLeanSixSigma - Ishikawa Diagram](https://www.thinkleansixsigma.com/article/ishikawa-diagram)

### Hoshin Kanri e Catchball
- [6Sigma.us - Essential Guide to Hoshin Kanri](https://www.6sigma.us/process-improvement/essential-guide-to-hoshin-kanri/)
- [Businessmap - What is Catchball](https://businessmap.io/lean-management/hoshin-kanri/what-is-catchball)

### Modelo Shingo
- [Shingo Institute - Shingo Model](https://shingo.org/shingo-model/)
- [6Sigma.us - Shingo Model](https://www.6sigma.us/six-sigma-in-focus/shingo-model/)

### Erros Comuns
- [Michel Baudin's Blog - A3 Limitations](https://michelbaudin.com/2016/04/07/the-a3-report-part-3-limitations-and-common-mistakes-christof-roser/)
- [AllAboutLean - Countermeasures](https://www.allaboutlean.com/practical-problem-solving-countermeasures-and-implement/)

---

## 6. Próximos Passos Recomendados

1. **Revisar e aprovar** esta proposta com o dono do agente
2. **Criar o novo prompt** consolidando todas as melhorias
3. **Estruturar as 8 KBs** como arquivos separados para upload no GPT
4. **Testar** o agente com A3s reais (Tático e Operacional do OPEX)
5. **Iterar** com base no feedback do time
