# KB_09 — Redação Técnica e Acadêmica

## Categoria: ESTRATÉGIA
## Palavras: ~2,000
## Atualizado: 2026-01-07
## Fonte: Web Research 2024

---

## 1. Princípios de Redação Técnica

> *"Clareza, precisão e simplicidade são as virtudes cardinais da escrita técnica."*
> — Fonte: Scilife.io (2024)

### Best Practices 2024

| Princípio | Aplicação |
| :--- | :--- |
| **Audience-Centric** | Adaptar linguagem ao público-alvo |
| **Clarity First** | Frases curtas, uma ideia por sentença |
| **Active Voice** | Preferir voz ativa sobre passiva |
| **Modular Content** | Tópicos independentes e autocontidos |
| **Visual Aids** | Tabelas, diagramas para complementar texto |

---

## 2. Estrutura de Relatório Técnico

### Formato Padrão (Purdue/Sussex 2024)

```
TÍTULO
│
├── Resumo/Abstract (max 200 palavras)
├── Sumário
├── 1. Introdução
│   ├── Contexto
│   └── Objetivo
├── 2. Metodologia
│   ├── Fontes utilizadas
│   └── Critérios de seleção
├── 3. Resultados
│   ├── Dados principais
│   └── Tabelas/Gráficos
├── 4. Discussão
│   ├── Interpretação
│   └── Limitações
├── 5. Conclusão
│   └── Recomendações
├── Referências
└── Anexos
```

---

## 3. Estilos de Citação

### APA 7th Edition (Academia/Psicologia)

**In-text:**
> (Autor, Ano, p. XX) ou Autor (Ano) afirma que...

**Referência:**
```
Heuer, R. J., Jr. (1999). Psychology of intelligence analysis. 
    Central Intelligence Agency.
```

### ABNT NBR 6023 (Brasil)

**In-text:**
> (AUTOR, Ano) ou Autor (Ano)

**Referência:**
```
HEUER, Richards J., Jr. Psychology of intelligence analysis. 
    Langley: Central Intelligence Agency, 1999.
```

### IEEE (Engenharia/Tech)

**In-text:**
> [1] ou conforme apresentado em [1, p. XX]

**Referência:**
```
[1] R. J. Heuer Jr., Psychology of Intelligence Analysis. 
    Langley, VA, USA: CIA, 1999.
```

---

## 4. Formatação Padrão

### Fonte e Espaçamento

| Elemento | Especificação |
| :--- | :--- |
| **Fonte impressa** | Times New Roman, 12pt |
| **Fonte digital** | Calibri ou Arial, 12pt |
| **Espaçamento** | Simples, duplo entre parágrafos |
| **Margens** | 2.54 cm (1 inch) em todos os lados |
| **Páginas** | Numeradas, centralizado |

### Figuras e Tabelas

- Numeração sequencial (Figura 1, Tabela 1)
- Título em negrito acima (tabelas) ou abaixo (figuras)
- Fonte dos dados abaixo

**Exemplo:**
```
Tabela 1. Produção de soja por região (Mt)
| Região    | 2023 | 2024 |
|-----------|------|------|
| Centro-Oeste | 85.2 | 88.1 |
| Sul       | 42.1 | 43.5 |
Fonte: Conab (2024)
```

---

## 5. Output Formats por Contexto

### Executivo (Bullet-first)

```markdown
## Key Findings

- **Bottom line:** [Uma frase]
- **Evidência 1:** [Dado + Fonte]
- **Evidência 2:** [Dado + Fonte]

## Implicações
1. [Ação recomendada]

## Próximos Passos
- [Ação 1]
- [Ação 2]
```

### Acadêmico (IMRAD)

```markdown
## 1. Introdução
[Contexto e objetivo]

## 2. Metodologia
[Fontes, critérios, limitações]

## 3. Resultados
[Dados, tabelas]

## 4. Discussão
[Interpretação, incertezas]

## 5. Conclusão
[Síntese, recomendações]

## Referências
[Lista formatada]
```

### JSON (API/Integração)

```json
{
  "summary": "string",
  "confidence": 85,
  "sources": [
    {"title": "...", "url": "...", "tier": 1}
  ],
  "data": {...}
}
```

---

## 6. Referências

- Scilife.io. (2024). *Technical Writing Best Practices*.
- Purdue University. (2024). *Technical Report Format*.
- APA. (2020). *Publication Manual of the APA, 7th ed*.
- ABNT. (2018). *NBR 6023: Referências*.
