---
title: "KB_02: Estrutura de Paragrafos"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-02-estrutura-paragrafos"
  - "kb_02: estrutura de paragrafos"
  - "regra de ouro"
  - "estrutura visual"
  - "cenarios de ajuste"
  - "cenario 1: input com 1 paragra"
  - "cenario 2: input com 3+ paragr"
  - "cenario 3: input com pergunta "
  - "cenario 4: input com multiplas"
  - "tamanho dos paragrafos"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_02: Estrutura de Paragrafos

## Regra de Ouro

**Toda resposta editada deve ter EXATAMENTE 2 paragrafos:**
1. **Paragrafo 1:** Feedback sobre a resposta do aluno
2. **Paragrafo 2:** Pergunta aberta que aprofunda

**Separados por:** Uma linha em branco (`\n\n`)

---

## Estrutura Visual

```
[Paragrafo 1: Feedback]
Uma ou mais frases que comentam a resposta do aluno,
reconhecem pontos validos, e/ou adicionam nuances.

[Paragrafo 2: Pergunta]
Uma pergunta aberta que convida o aluno a aprofundar
seu raciocinio, terminando com ponto de interrogacao.
```

---

## Cenarios de Ajuste

### Cenario 1: Input com 1 Paragrafo

**Problema:** Feedback e pergunta estao juntos em um bloco.

**Solucao:** Identificar onde termina o feedback e comeca a pergunta, separar com linha em branco.

**Exemplo:**
```
ANTES:
Voce fez uma observacao interessante sobre gestao de riscos, mostrando compreensao do conceito. Como voce aplicaria essa ideia em um cenario real?

DEPOIS:
Voce fez uma observacao interessante sobre gestao de riscos, mostrando compreensao do conceito.

Como voce aplicaria essa ideia em um cenario real?
```

---

### Cenario 2: Input com 3+ Paragrafos

**Problema:** Conteudo excessivamente fragmentado.

**Solucao:** Consolidar paragrafos de feedback em 1, garantir que pergunta fique isolada no paragrafo 2.

**Exemplo:**
```
ANTES:
Voce mencionou um ponto importante.

A questao da sustentabilidade e complexa.

Existem varios fatores a considerar.

O que voce acha que seria prioritario?

DEPOIS:
Voce mencionou um ponto importante sobre a questao da sustentabilidade, que e de fato complexa e envolve varios fatores a considerar.

O que voce acha que seria prioritario nesse contexto?
```

---

### Cenario 3: Input com Pergunta no Meio

**Problema:** Pergunta aparece antes do final.

**Solucao:** Reorganizar para que pergunta seja o fechamento.

**Exemplo:**
```
ANTES:
Interessante. Voce ja pensou em como isso se aplica? A gestao de riscos realmente envolve muitos fatores como voce mencionou.

DEPOIS:
Interessante observacao. A gestao de riscos realmente envolve muitos fatores como voce mencionou, e sua analise toca em pontos relevantes.

Voce ja pensou em como isso se aplica na pratica?
```

---

### Cenario 4: Input com Multiplas Perguntas

**Problema:** Mais de uma pergunta no texto.

**Solucao:** Manter apenas a pergunta principal (geralmente a ultima ou mais relevante).

**Exemplo:**
```
ANTES:
Boa reflexao. O que voce acha? E como isso se relaciona com o tema? Voce poderia dar um exemplo?

DEPOIS:
Boa reflexao que demonstra engajamento com o tema e suas nuances.

Voce poderia dar um exemplo concreto de como isso funcionaria?
```

---

## Tamanho dos Paragrafos

### Paragrafo 1 (Feedback)
- **Minimo:** 2 frases
- **Maximo:** 5 frases
- **Ideal:** 3-4 frases
- **Palavras:** 40-120

### Paragrafo 2 (Pergunta)
- **Minimo:** 1 frase (a pergunta)
- **Maximo:** 2 frases (contexto + pergunta)
- **Ideal:** 1-2 frases
- **Palavras:** 15-50

### Total
- **Minimo:** 80 palavras
- **Maximo:** 200 palavras
- **Ideal:** 100-150 palavras

---

## Transicao entre Paragrafos

A transicao deve ser natural. O segundo paragrafo pode:

1. **Comecar diretamente com a pergunta:**
   ```
   Como voce aplicaria isso?
   ```

2. **Ter breve contexto antes da pergunta:**
   ```
   Pensando nisso, como voce aplicaria essa ideia na pratica?
   ```

3. **Conectar com o feedback:**
   ```
   Considerando esses pontos que voce levantou, o que aconteceria se...?
   ```

---

## Validacao de Estrutura

Antes de entregar, verificar:

| Criterio | Verificacao |
|----------|-------------|
| Exatamente 2 paragrafos? | Contar quebras duplas |
| Separados por linha em branco? | Verificar `\n\n` |
| Paragrafo 1 e feedback? | Conteudo sobre resposta do aluno |
| Paragrafo 2 termina com "?"? | Ultima char e "?" |
| Tamanho total 80-200 palavras? | Contar palavras |


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation