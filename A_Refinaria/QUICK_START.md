# Quick Start Guide — Enhanced Intellex Book Processing

## 🎯 Overview

Você tem 3 opções para processar livros com qualidade máxima:

1. **Single-Pass Enhanced** — Use prompt melhorado (mais rápido, ~70-80% qualidade)
2. **Multi-Pass Pipeline** — 6 passes especializados (mais lento, ~90-95% qualidade)
3. **Hybrid with Self-Critique** — Gera + valida + corrige (balanceado, ~85-90% qualidade)

---

## Option 1: Single-Pass Enhanced ⚡

### Quando usar
- Livros menos críticos
- Quer resultado rápido
- Primeira iteração/exploração

### Como usar

1. Cole o livro + cole este prompt exato:

```
Você é o Book_Processor do Intellex.

LEIA O ARQUIVO: modules/Book_Processor/agente_core.md

Processe este livro seguindo EXATAMENTE as especificações do agente_core.md (versão ENHANCED v2.0).

CRÍTICO:
- Deep Synthesis: MÍNIMO 4.000 palavras
- Frameworks: MÍNIMO 8, cada um 300+ palavras
- Heurísticas: MÍNIMO 25 em KB_03_HEURISTICS.yaml

ANTES de gerar, execute o CHAIN OF THOUGHT obrigatório:
1. Inventário Completo
2. Expansão de Frameworks
3. Geração de Heurísticas
4. Síntese com Verificação

Gere o LX Package completo.
```

2. Aguarde geração completa

3. Valide manualmente se atingiu benchmarks

---

## Option 2: Multi-Pass Pipeline 🏗️ (RECOMENDADO)

### Quando usar
- Livros de alta importância
- Quer máxima qualidade
- Tem tempo para múltiplos calls

### Como usar

#### Pass 1: Raw Extraction

**Prompt:**
```
LEIA O ARQUIVO: pipelines/multi_pass_pipeline.md

Execute o PASS 1: Raw Extraction conforme especificado.

Extraia TUDO do livro sem filtrar:
- Conceitos (mín. 30)
- Frameworks (mín. 10)
- Heurísticas potenciais (mín. 30)
- Citações (mín. 20)
- Argumentos principais (mín. 15)

NÃO sintetize. Apenas LISTE.
```

**Output esperado:** Lista bruta de 80-150 itens

---

#### Pass 2: Framework Expansion

**Prompt:**
```
RECEBIDO DA PASS 1:
[Cole o output da Pass 1 aqui]

---

LEIA O ARQUIVO: pipelines/multi_pass_pipeline.md

Execute o PASS 2: Framework Expansion.

Para CADA framework listado acima, crie análise completa:
- Definição (300+ palavras)
- Componentes
- Aplicação prática
- Exemplo concreto
- Conexões
- Diagrama

FAÇA ISSO PARA TODOS. Não pule nenhum.
```

**Output esperado:** 8-10 frameworks com 400-600 palavras cada

---

#### Pass 3: Heuristics Generation

**Prompt:**
```
LEIA O ARQUIVO: pipelines/multi_pass_pipeline.md
LEIA O ARQUIVO: modules/Book_Processor/knowledge_base/heuristics_template.yaml

Execute o PASS 3: Heuristics Generation.

Gere 25-30 heurísticas em YAML válido seguindo o template EXATO.

Organize por domínios e inclua veto_rules no final.
```

**Output esperado:** KB_03_HEURISTICS.yaml com 25-30 heurísticas

---

#### Pass 4: Deep Synthesis

**Prompt:**
```
RECEBIDO DAS PASSES ANTERIORES:
[Cole frameworks da Pass 2]
[Cole heurísticas da Pass 3]

---

LEIA O ARQUIVO: pipelines/multi_pass_pipeline.md
LEIA O ARQUIVO: modules/Book_Processor/agente_core.md

Execute o PASS 4: Deep Synthesis.

Compile tudo em documento final de 4000+ palavras seguindo estrutura:
1. Visão Geral
2. Problema que Resolve
3. Tese Central
4. Frameworks (cole todos da Pass 2)
5. Análise Crítica
6. Comparação com Obras
7. Plano Prático
8. Citações
9. Diagrama mermaid
10. Veredicto

VERIFICAÇÃO FINAL obrigatória no final.
```

**Output esperado:** deep_synthesis.md com 4000-5000 palavras

---

#### Pass 5: QA Validation

**Prompt:**
```
RECEBIDO DA PASS 4:
[Cole deep_synthesis.md aqui]

---

LEIA O ARQUIVO: modules/QA_Validator/agente_core.md

Execute validação completa:
1. Conte palavras, frameworks, heurísticas
2. Execute checklist
3. Identifique gaps ESPECÍFICOS
4. Dê recomendação (APROVADO/REVISÃO)
```

**Output esperado:** Validation report

---

#### Pass 6: Gap Filling (Se necessário)

**Prompt:**
```
VALIDATION REPORT:
[Cole validation_report aqui]

DOCUMENTO ATUAL:
[Cole deep_synthesis.md aqui]

---

Execute correções para TODOS os gaps identificados.

Para cada gap, expanda a seção específica mantendo estilo consistente.
```

**Output esperado:** Versão final corrigida

---

## Option 3: Hybrid (Single + Self-Critique) 🔄

### Quando usar
- Quer qualidade alta sem 6 passes
- Quer automação de refinamento
- Balanceado entre velocidade e qualidade

### Como usar

#### Step 1: Generate

```
LEIA: modules/Book_Processor/agente_core.md (ENHANCED v2.0)

Gere LX Package completo seguindo especificações.
```

#### Step 2: Critique

```
LEIA: modules/QA_Validator/agente_core.md

DOCUMENTO GERADO:
[Cole o que foi gerado]

REFERÊNCIA DE QUALIDADE:
[Cole um exemplo do Claude, ex: naval_ravikant_almanaque/deep_synthesis.md]

---

Compare os dois e identifique O QUE ESTÁ FALTANDO no documento gerado.

Liste ações corretivas ESPECÍFICAS.
```

#### Step 3: Regenerate

```
DOCUMENTO ORIGINAL:
[Cole documento]

CRÍTICAS IDENTIFICADAS:
[Cole validation report]

---

Corrija TODOS os problemas identificados.
```

---

## 📊 Comparação de Opções

| Opção | Tempo | Qualidade | Complexidade | Quando Usar |
|-------|-------|-----------|--------------|-------------|
| Single-Pass Enhanced | 1 call (5-10min) | 70-80% | Baixa | Exploração rápida |
| Multi-Pass Pipeline | 6 calls (30-60min) | 90-95% | Alta | Livros críticos |
| Hybrid Self-Critique | 3 calls (15-25min) | 85-90% | Média | **Recomendado geral** |

---

## ✅ Checklist de Qualidade Final

Antes de considerar concluído, verifique:

- [ ] Deep Synthesis tem 4000+ palavras
- [ ] Contém 8+ frameworks detalhados (300+ palavras cada)
- [ ] KB_03 tem 25+ heurísticas completas
- [ ] KB_04 tem 30+ citações
- [ ] Tem análise crítica (pontos fortes E limitações)
- [ ] Tem comparação com 4+ livros relacionados
- [ ] Tem plano de aplicação prática
- [ ] Tem diagrama mermaid
- [ ] Todas as 6 KBs estão presentes

---

## 🎯 Dica Pro

**Para primeira vez:** Use Multi-Pass Pipeline no Naval Ravikant para estabelecer baseline de qualidade.

**Depois que funcionar:** Use Hybrid para livros futuros (80% do resultado com 50% do esforço).

**Se tiver pressa:** Single-Pass Enhanced + validação manual.

---

## 🔧 Troubleshooting

### Problema: Output ainda muito curto

**Solução:** 
1. Enfatize "MÍNIMO X palavras" no início do prompt
2. Peça "Chain of Thought" antes de gerar
3. Use Multi-Pass (força decomposição)

### Problema: Heurísticas vagas

**Solução:**
1. Cole o heuristics_template.yaml como exemplo
2. Enfatize "trigger ESPECÍFICO, action EXECUTÁVEL"
3. Peça 30 em vez de 25 (descarte piores depois)

### Problema: Falta análise crítica

**Solução:**
1. No prompt, liste explicitamente: "Viés de sobrevivência? Contexto de privilégio?"
2. Peça mínimo 4 pontos fortes E 4 limitações
3. Dê exemplo de análise crítica boa

---

## 📥 Files Created

Esta implementação criou:

1. `modules/Book_Processor/agente_core.md` — ENHANCED v2.0
2. `modules/Book_Processor/knowledge_base/heuristics_template.yaml` — Exemplos Claude
3. `modules/QA_Validator/agente_core.md` — Self-critique module
4. `pipelines/multi_pass_pipeline.md` — 6-pass specification
5. `QUICK_START.md` — Este guia

---

## 🚀 Next Steps

1. **Teste com Naval Ravikant:** Rode Multi-Pass Pipeline
2. **Compare resultados:** Claude vs Gemini Enhanced
3. **Itere:** Ajuste prompts baseado em gaps
4. **Automatize:** Quando funcionar, crie script Python
