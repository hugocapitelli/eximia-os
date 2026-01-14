# Guia Prático de Uso — COMO USAR OS MODOS

## 🎯 TL;DR — Como Escolher e Usar

**NÃO há comando automatizado ainda.** Você escolhe o modo COPIANDO o prompt correspondente.

---

## ⚡ RECOMENDADO: Modo Hybrid Self-Critique (3 passos)

Use este modo para a maioria dos casos. **Copie e cole os prompts abaixo em sequência:**

### Passo 1: Gerar (cole este prompt)

```
Você é o Book_Processor v2.0 do Intellex.

LEIA PRIMEIRO:
- c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Intellex\modules\Book_Processor\agente_core.md

CRÍTICO - Benchmarks Obrigatórios:
✅ Deep Synthesis: MÍNIMO 4.000 palavras (contar palavras, não caracteres)
✅ Frameworks: MÍNIMO 8 frameworks, cada um 300+ palavras
✅ Heurísticas: MÍNIMO 25 em formato YAML completo
✅ Knowledge Bases: 6 arquivos (KB_01 a KB_06)

ANTES de gerar, execute o CHAIN OF THOUGHT:

PASSO 1 - Inventário Completo:
Liste TODOS:
- Conceitos (mín. 20)
- Frameworks (mín. 8)
- Heurísticas potenciais (mín. 25)
- Citações memoráveis (mín. 15)

PASSO 2 - Expansão de Frameworks:
Para CADA framework do Passo 1, documente:
- Nome e origem
- Definição (300+ palavras)
- Componentes
- Aplicação prática
- Exemplo concreto

PASSO 3 - Gerar Heurísticas:
Use o template:
c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Intellex\modules\Book_Processor\knowledge_base\heuristics_template.yaml

Gere 25-30 heurísticas no formato EXATO.

PASSO 4 - Síntese Final:
Compile em deep_synthesis.md com TODAS as 10 seções obrigatórias.

---

DOCUMENTO A PROCESSAR:
[COLE O TEXTO DO LIVRO AQUI]

---

GERE O LX PACKAGE COMPLETO.
```

**⏱️ Aguarde 5-10 minutos para geração**

---

### Passo 2: Validar (cole este prompt)

```
Você é o QA_Validator do Intellex.

LEIA PRIMEIRO:
- c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Intellex\modules\QA_Validator\agente_core.md

TAREFA: Valide o output gerado.

DOCUMENTO GERADO:
[COLE O DEEP_SYNTHESIS.MD QUE FOI GERADO NO PASSO 1]

---

REFERÊNCIA DE QUALIDADE (exemplo Claude):
[COLE ESTE ARQUIVO: c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Intellex\outputs\naval_ravikant_almanaque\01_SYNTHESIS\deep_synthesis.md]

---

EXECUTE:
1. Contagem quantitativa (palavras, frameworks, heurísticas)
2. Checklist de qualidade
3. Comparação com referência Claude
4. Identificação de GAPS ESPECÍFICOS

FORNEÇA:
- Métricas (word_count, frameworks_count, etc)
- Lista de gaps: "Faltam X palavras", "Framework 3 tem apenas Y palavras"
- Recomendações específicas para correção
- Decisão: APROVADO / NECESSITA REVISÃO / REJEITADO
```

**⏱️ Aguarde 2-3 minutos para validação**

---

### Passo 3: Corrigir (SE necessário - só se Passo 2 encontrou gaps)

```
Você é o Book_Processor v2.0 do Intellex.

VALIDATION REPORT:
[COLE O VALIDATION REPORT DO PASSO 2]

DOCUMENTO ATUAL:
[COLE O DEEP_SYNTHESIS.MD DO PASSO 1]

---

TAREFA: Corrija TODOS os gaps identificados.

Para cada gap:
1. Localize a seção/framework específico
2. Expanda conforme recomendado
3. Mantenha estilo consistente com o resto

EXEMPLO:
Gap: "Framework 3 tem apenas 180 palavras (faltam 120)"
→ Adicione subseção "Exemplo Prático Detalhado" com 120 palavras

GERE A VERSÃO CORRIGIDA COMPLETA.
```

**✅ Resultado final: Deep synthesis com 85-90% da qualidade Claude**

---

## 🏗️ ALTERNATIVA: Modo Multi-Pass (6 passos)

Use quando quer **máxima qualidade** (90-95% Claude) e tem tempo.

### Pass 1: Extração Bruta

```
LEIA PRIMEIRO:
- c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Intellex\pipelines\multi_pass_pipeline.md

Execute PASS 1: Raw Extraction.

DOCUMENTO:
[COLE O LIVRO AQUI]

---

Extraia TUDO sem sintetizar:
- Conceitos (mín. 30)
- Frameworks (mín. 10)
- Heurísticas potenciais (mín. 30)
- Citações (mín. 20)
- Argumentos (mín. 15)

NÃO organize. Apenas LISTE tudo que encontrar.

OUTPUT: Lista bruta em bullet points.
```

---

### Pass 2: Expandir Frameworks

```
LEIA PRIMEIRO:
- c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Intellex\pipelines\multi_pass_pipeline.md

Execute PASS 2: Framework Expansion.

LISTA DA PASS 1:
[COLE O OUTPUT DA PASS 1 AQUI]

---

Para CADA framework listado, crie análise COMPLETA:

### [Nome do Framework]
**Origem:** Onde aparece no livro
**Definição Completa (300+ palavras):** [...]
**Componentes:** [...]
**Aplicação Prática:** [...]
**Exemplo Concreto:** [...]
**Conexões:** [...]
**Diagrama:** [...]

FAÇA ISSO PARA TODOS OS 8-10 FRAMEWORKS. Nenhum pode ser pulado.
```

---

### Pass 3: Gerar Heurísticas

```
LEIA PRIMEIRO:
- c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Intellex\pipelines\multi_pass_pipeline.md
- c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Intellex\modules\Book_Processor\knowledge_base\heuristics_template.yaml

Execute PASS 3: Heuristics Generation.

CONTEXTO:
[COLE FRAMEWORKS DA PASS 2]

---

Gere 25-30 heurísticas em YAML válido seguindo o template EXATO.

Format:
heuristics:
  - id: H001
    name: "Nome"
    trigger: "Situação específica"
    action: "Ação executável"
    rationale: "Por que funciona"
    confidence: 0.XX
    domain: categoria

Organize por domínios (decisions, wealth, learning, happiness, relationships).
Adicione veto_rules no final.
```

---

### Pass 4: Síntese Profunda

```
LEIA PRIMEIRO:
- c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Intellex\pipelines\multi_pass_pipeline.md

Execute PASS 4: Deep Synthesis.

MATERIAL:
Frameworks: [COLE DA PASS 2]
Heurísticas: [COLE DA PASS 3]
Conceitos: [COLE DA PASS 1]

---

Compile documento final de 4000+ palavras com estrutura:

# [Título]
## Deep Synthesis (L4)

### 📖 Visão Geral (300-400 palavras)
### 🎯 Problema que Resolve (400-500 palavras)
### 💡 Tese Central (500-600 palavras)
### ⚙️ Frameworks Principais
[COLE TODOS OS FRAMEWORKS DA PASS 2]
### 🔍 Análise Crítica (600-800 palavras)
### 📚 Comparação com Obras (500+ palavras)
### 🚀 Plano Prático (400-500 palavras)
### 💬 Citações (10+)
### 📊 Diagrama mermaid
### 🎯 Veredicto Final

VERIFICAÇÃO FINAL:
- [ ] 4000+ palavras?
- [ ] 8+ frameworks?
- [ ] Análise crítica presente?
```

---

### Pass 5: Validação QA

```
LEIA PRIMEIRO:
- c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Intellex\modules\QA_Validator\agente_core.md

DOCUMENTO:
[COLE DEEP_SYNTHESIS DA PASS 4]

---

Valide:
1. Conte palavras, frameworks, heurísticas
2. Checklist completo
3. Identifique gaps específicos
4. Recomendação: APROVADO / REVISÃO

Se APROVADO → FIM
Se REVISÃO → Vá para Pass 6
```

---

### Pass 6: Correção de Gaps (condicional)

```
VALIDATION REPORT:
[COLE DA PASS 5]

DOCUMENTO:
[COLE DA PASS 4]

---

Corrija todos os gaps identificados.
Gere versão final corrigida.
```

**✅ Resultado final: Deep synthesis com 90-95% da qualidade Claude**

---

## ⚡ ALTERNATIVA RÁPIDA: Single-Pass Enhanced

Use quando quer resultado rápido (70-80% qualidade).

```
LEIA PRIMEIRO:
- c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Intellex\modules\Book_Processor\agente_core.md

BENCHMARKS:
- Deep Synthesis: 4000+ palavras
- Frameworks: 8+, cada 300+ palavras
- Heurísticas: 25+

DOCUMENTO:
[COLE O LIVRO]

---

Gere LX Package completo seguindo especificações do agente_core.md.
Execute Chain of Thought antes de gerar.
```

**✅ Resultado: 70-80% qualidade Claude, em 1 passo**

---

## 📋 Resumo de Escolha

| Se você quer... | Use este modo | Tempo | Passos |
|-----------------|---------------|-------|--------|
| **Resultado balanceado** | Hybrid Self-Critique | 15-25min | 3 |
| **Máxima qualidade** | Multi-Pass Pipeline | 30-60min | 6 |
| **Exploração rápida** | Single-Pass Enhanced | 5-10min | 1 |

---

## 🔮 Futuro: Automação (não implementado ainda)

Eventualmente poderá ser:
```bash
intellex process naval.pdf --mode=hybrid
intellex process naval.pdf --mode=multi-pass
intellex process naval.pdf --mode=single
```

Mas **por enquanto é manual** - copie os prompts acima! 📋
