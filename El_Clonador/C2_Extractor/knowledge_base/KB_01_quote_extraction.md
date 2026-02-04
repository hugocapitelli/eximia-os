---
title: "KB_01 — Extração de Quotes"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-01-quote-extraction"
  - "kb_01 — extração de quotes"
  - "propósito"
  - "1. critérios de quote válida"
  - "2. processo de extração"
  - "passo 1: identificar quotes ca"
  - "passo 2: validar e limpar"
  - "passo 3: categorizar"
  - "passo 4: estruturar em json"
  - "3. targets de extração"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_01 — Extração de Quotes

## Propósito
Guia detalhado para extrair citações verbatim de transcrições e textos coletados.

---

## 1. Critérios de Quote Válida

Uma quote deve:
- [ ] Ser texto **EXATO** do especialista (não paráfrase)
- [ ] Ter **fonte verificável** (vídeo, artigo, livro)
- [ ] Ser **atribuível** claramente ao especialista (não a terceiros)
- [ ] Ter **contexto** identificável

---

## 2. Processo de Extração

### Passo 1: Identificar Quotes Candidatas

```python
import re

def find_quote_candidates(text):
    """
    Encontra potenciais quotes em texto
    """
    patterns = [
        # Frases contundentes (imperativas)
        r'(?:You must|You need to|You have to|You should)[^.!?]+[.!?]',
        
        # Declarações de crença
        r'(?:I believe|I think|The truth is|The reality is)[^.!?]+[.!?]',
        
        # Princípios/Regras
        r'(?:The \w+ rule|My \w+ principle|The key is)[^.!?]+[.!?]',
        
        # Frases com palavras-chave do especialista
        # (customizar por especialista)
    ]
    
    candidates = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        candidates.extend(matches)
    
    return candidates
```

### Passo 2: Validar e Limpar

```python
def clean_quote(quote):
    """
    Limpa quote para formato padrão
    """
    # Remover timestamps
    quote = re.sub(r'\[\d{2}:\d{2}:\d{2}\]', '', quote)
    
    # Remover indicadores de ação [risos], [música], etc
    quote = re.sub(r'\[.*?\]', '', quote)
    
    # Remover espaços extras
    quote = ' '.join(quote.split())
    
    return quote.strip()
```

### Passo 3: Categorizar

| Categoria | Descrição | Exemplo |
|-----------|-----------|---------|
| `philosophy` | Crenças fundamentais | "When you think you're done..." |
| `motivation` | Incentivo à ação | "Get off your ass and..." |
| `advice` | Conselhos práticos | "Every morning, write down..." |
| `personal_story` | Experiências pessoais | "When I was in SEAL training..." |
| `framework` | Metodologias | "The 40% rule means..." |
| `challenge` | Desafios ao ouvinte | "What are you doing right now?" |

### Passo 4: Estruturar em JSON

```json
{
  "id": "Q001",
  "text": "When you think you're done, you're only at 40% of your capacity.",
  "text_original": "When you think you're done, you're only at 40% of your capacity, man.",
  "source": {
    "type": "podcast",
    "title": "Joe Rogan Experience #1080",
    "url": "https://youtube.com/watch?v=5tSTk1083VY",
    "timestamp": "01:23:45"
  },
  "category": "philosophy",
  "tags": ["40% rule", "mental toughness", "limits"],
  "language": "en",
  "verified": true,
  "extracted_at": "2025-12-19"
}
```

---

## 3. Targets de Extração

| Categoria | Mínimo | Ideal |
|-----------|--------|-------|
| philosophy | 10 | 15+ |
| motivation | 8 | 12+ |
| advice | 10 | 15+ |
| personal_story | 5 | 10+ |
| framework | 5 | 8+ |
| challenge | 5 | 8+ |
| **TOTAL** | **50** | **75+** |

---

## 4. Quality Checks

Após extração:

- [ ] Todas as quotes têm fonte
- [ ] Nenhuma quote é paráfrase
- [ ] Categorias balanceadas
- [ ] Duplicatas removidas
- [ ] JSON válido

---

## 5. Output

```
2_structured_data/
└── quotes/
    ├── quotes.json          # Todas as quotes
    ├── quotes_by_category/  # Separadas por categoria
    │   ├── philosophy.json
    │   ├── motivation.json
    │   └── ...
    └── EXTRACTION_LOG.md    # Log do processo
```

---

**Versão:** 1.0
**Clone Factory Module:** C2_Extractor

#galaxy-creation