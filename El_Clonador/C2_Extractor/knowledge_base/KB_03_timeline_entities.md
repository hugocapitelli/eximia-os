---
title: "KB_03 — Timeline e Entity Extraction"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-03-timeline-entities"
  - "kb_03 — timeline e entity extr"
  - "propósito"
  - "1. extração de timeline"
  - "1.1 tipos de eventos"
  - "1.2 código de extração"
  - "1.3 schema de timeline"
  - "2. extração de entidades"
  - "2.1 tipos de entidades"
  - "2.2 código de extração"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_03 — Timeline e Entity Extraction

## Propósito
Processo para extrair eventos de timeline e mapear entidades relacionadas ao especialista.

---

## 1. Extração de Timeline

### 1.1 Tipos de Eventos

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `birth` | Nascimento | "Born in Buffalo, NY" |
| `childhood` | Infância/formação | "Abused by father until age 8" |
| `education` | Educação formal | "Graduated high school" |
| `military` | Carreira militar | "Completed SEAL training" |
| `career` | Carreira profissional | "Became motivational speaker" |
| `achievement` | Conquistas | "Broke pull-up world record" |
| `publication` | Publicações | "Released 'Can't Hurt Me'" |
| `personal` | Vida pessoal | "Married Jennifer Kish" |
| `current` | Atual | "Active speaker circuit" |

### 1.2 Código de Extração

```python
import re
from datetime import datetime

def extract_timeline_events(text, persona_name):
    """
    Extrai eventos com datas do texto
    """
    events = []
    
    # Padrões de data
    date_patterns = [
        (r'in (\d{4})', 'year'),
        (r'on (\w+ \d{1,2}, \d{4})', 'exact'),
        (r'(\w+ \d{4})', 'month_year'),
        (r'at age (\d+)', 'age'),
        (r'when (?:he|she|they) (?:was|were) (\d+)', 'age'),
    ]
    
    sentences = text.split('.')
    
    for sentence in sentences:
        # Verificar se menciona a pessoa
        if persona_name.lower() not in sentence.lower():
            continue
            
        for pattern, precision in date_patterns:
            match = re.search(pattern, sentence, re.IGNORECASE)
            if match:
                events.append({
                    'raw_text': sentence.strip(),
                    'date_found': match.group(1),
                    'precision': precision,
                    'needs_review': True
                })
                break
    
    return events

def categorize_event(event_text):
    """
    Categoriza evento automaticamente
    """
    keywords = {
        'birth': ['born', 'birth'],
        'childhood': ['child', 'young', 'grew up', 'father', 'mother'],
        'education': ['school', 'college', 'university', 'graduated'],
        'military': ['military', 'army', 'navy', 'seal', 'deployed'],
        'career': ['started', 'became', 'joined', 'founded'],
        'achievement': ['record', 'completed', 'won', 'achieved', 'first'],
        'publication': ['book', 'published', 'wrote', 'released'],
        'personal': ['married', 'divorced', 'moved', 'family'],
    }
    
    text_lower = event_text.lower()
    for category, words in keywords.items():
        if any(word in text_lower for word in words):
            return category
    
    return 'other'
```

### 1.3 Schema de Timeline

```json
{
  "persona": "David Goggins",
  "total_events": 35,
  "events": [
    {
      "id": "E001",
      "date": "1975-02-17",
      "date_precision": "exact",
      "event": "Born in Buffalo, New York",
      "category": "birth",
      "significance": "high",
      "sources": ["wikipedia", "autobiography"],
      "verified": true
    },
    {
      "id": "E015",
      "date": "2005",
      "date_precision": "year",
      "event": "Completed third Hell Week, became Navy SEAL",
      "category": "military",
      "significance": "very_high",
      "sources": ["JRE #1080", "Can't Hurt Me"],
      "verified": true,
      "context": "Only person to complete SEAL, Ranger, and TACP training"
    }
  ]
}
```

---

## 2. Extração de Entidades

### 2.1 Tipos de Entidades

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `PERSON` | Pessoas relacionadas | "Jesse Itzler" |
| `CONCEPT` | Conceitos-chave | "40% Rule" |
| `FRAMEWORK` | Metodologias | "Accountability Mirror" |
| `ACHIEVEMENT` | Conquistas | "Badwater 135" |
| `WORK` | Livros, produções | "Can't Hurt Me" |
| `ORGANIZATION` | Instituições | "Navy SEALs" |
| `LOCATION` | Lugares importantes | "Death Valley" |

### 2.2 Código de Extração

```python
import spacy
nlp = spacy.load('en_core_web_sm')

def extract_entities(text, custom_entities=None):
    """
    Extrai entidades usando NLP + custom patterns
    """
    doc = nlp(text)
    
    entities = []
    
    # Entidades SpaCy
    for ent in doc.ents:
        entities.append({
            'text': ent.text,
            'type': ent.label_,
            'source': 'spacy'
        })
    
    # Entidades customizadas (específicas do especialista)
    if custom_entities:
        for pattern, entity_type in custom_entities.items():
            if pattern.lower() in text.lower():
                entities.append({
                    'text': pattern,
                    'type': entity_type,
                    'source': 'custom'
                })
    
    return entities

# Exemplo de entidades customizadas para David Goggins
goggins_entities = {
    "40% Rule": "CONCEPT",
    "Accountability Mirror": "FRAMEWORK",
    "Cookie Jar": "FRAMEWORK",
    "Calloused Mind": "CONCEPT",
    "Stay Hard": "CATCHPHRASE",
    "Hell Week": "EVENT",
    "Badwater 135": "ACHIEVEMENT",
    "Jesse Itzler": "PERSON",
    "Jennifer Kish": "PERSON",
}
```

### 2.3 Schema de Entidades

```json
{
  "persona": "David Goggins",
  "total_entities": 78,
  "entities": [
    {
      "id": "ENT001",
      "name": "40% Rule",
      "type": "CONCEPT",
      "description": "Quando a mente diz que você está exausto, você está apenas a 40% da sua capacidade real. O trabalho verdadeiro começa nos 60% restantes.",
      "frequency": "very_high",
      "first_mentioned": "Can't Hurt Me",
      "related_to": ["mental toughness", "limits", "suffering"],
      "sources": ["Can't Hurt Me", "JRE #1080", "Huberman Lab"]
    },
    {
      "id": "ENT010",
      "name": "Jesse Itzler",
      "type": "PERSON",
      "description": "Empresário e autor que convidou Goggins para morar 31 dias com ele, resultando no livro 'Living with a SEAL'.",
      "relationship": "collaborator",
      "frequency": "medium",
      "sources": ["Living with a SEAL", "JRE"]
    }
  ],
  "by_type": {
    "CONCEPT": 15,
    "FRAMEWORK": 8,
    "PERSON": 12,
    "ACHIEVEMENT": 10,
    "WORK": 5,
    "ORGANIZATION": 8,
    "LOCATION": 10,
    "CATCHPHRASE": 10
  }
}
```

---

## 3. Quality Checks

### Timeline
- [ ] ≥20 eventos extraídos
- [ ] Nascimento incluído
- [ ] Eventos-chave da carreira incluídos
- [ ] Datas verificadas com múltiplas fontes
- [ ] Ordenação cronológica correta

### Entidades
- [ ] ≥50 entidades mapeadas
- [ ] Todos os frameworks do especialista
- [ ] Pessoas importantes relacionadas
- [ ] Conceitos-chave documentados
- [ ] Descrições claras e úteis

---

## 4. Output

```
2_structured_data/
├── timeline/
│   ├── events.json
│   └── events_by_category/
├── entities/
│   ├── entities.json
│   └── entities_by_type/
└── EXTRACTION_LOG.md
```

---

**Versão:** 1.0
**Clone Factory Module:** C2_Extractor

#galaxy-creation