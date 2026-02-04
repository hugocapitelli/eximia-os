---
title: "KB_02 — Análise de Voice Signature"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-02-voice-analysis"
  - "kb_02 — análise de voice signa"
  - "propósito"
  - "1. dimensões de análise"
  - "1.1 tom e atitude"
  - "1.2 vocabulário"
  - "1.3 estrutura de sentença"
  - "2. output: voice signature jso"
  - "3. quality checks"
  - "4. uso pelo c3 creator"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_02 — Análise de Voice Signature

## Propósito
Processo detalhado para extrair e analisar o padrão de comunicação (voice signature) do especialista.

---

## 1. Dimensões de Análise

### 1.1 Tom e Atitude

```python
def analyze_tone(transcripts):
    """
    Analisa tom predominante nas transcrições
    """
    tone_indicators = {
        'confrontational': [
            'what are you doing', 'stop making excuses',
            'you need to', 'get off your', 'weak'
        ],
        'empathetic': [
            'I understand', 'I hear you', 'it\'s okay',
            'we all struggle', 'you\'re not alone'
        ],
        'technical': [
            'the data shows', 'research indicates',
            'the methodology', 'statistically'
        ],
        'inspirational': [
            'you can do this', 'believe in',
            'possible', 'dream', 'achieve'
        ],
        'direct': [
            'here\'s the truth', 'bottom line',
            'the reality is', 'simply put'
        ]
    }
    
    scores = {tone: 0 for tone in tone_indicators}
    
    for transcript in transcripts:
        text_lower = transcript.lower()
        for tone, indicators in tone_indicators.items():
            for indicator in indicators:
                scores[tone] += text_lower.count(indicator)
    
    # Normalizar e rankear
    total = sum(scores.values()) or 1
    return {k: round(v/total * 100, 1) for k, v in scores.items()}
```

---

### 1.2 Vocabulário

```python
from collections import Counter
import nltk
from nltk.corpus import stopwords

def extract_vocabulary(transcripts, top_n=50):
    """
    Extrai vocabulário característico
    """
    stop_words = set(stopwords.words('english'))
    
    all_words = []
    for transcript in transcripts:
        words = nltk.word_tokenize(transcript.lower())
        words = [w for w in words if w.isalpha() and w not in stop_words]
        all_words.extend(words)
    
    # Frequência
    freq = Counter(all_words)
    
    return {
        'most_common': freq.most_common(top_n),
        'signature_phrases': extract_phrases(transcripts),
        'profanity_level': detect_profanity(all_words)
    }

def extract_phrases(transcripts, min_count=3):
    """
    Extrai frases recorrentes (2-4 palavras)
    """
    from nltk import ngrams
    
    all_phrases = []
    for transcript in transcripts:
        words = transcript.lower().split()
        for n in [2, 3, 4]:
            phrases = [' '.join(gram) for gram in ngrams(words, n)]
            all_phrases.extend(phrases)
    
    freq = Counter(all_phrases)
    return [p for p, c in freq.most_common(20) if c >= min_count]
```

---

### 1.3 Estrutura de Sentença

```python
import spacy
nlp = spacy.load('en_core_web_sm')

def analyze_sentence_structure(transcripts):
    """
    Analisa estrutura das sentenças
    """
    sentence_lengths = []
    sentence_types = {'declarative': 0, 'interrogative': 0, 'imperative': 0, 'exclamatory': 0}
    
    for transcript in transcripts:
        doc = nlp(transcript)
        for sent in doc.sents:
            # Comprimento
            sentence_lengths.append(len(sent))
            
            # Tipo
            text = sent.text.strip()
            if text.endswith('?'):
                sentence_types['interrogative'] += 1
            elif text.endswith('!'):
                sentence_types['exclamatory'] += 1
            elif any(text.lower().startswith(v) for v in ['do', 'don\'t', 'stop', 'start', 'get']):
                sentence_types['imperative'] += 1
            else:
                sentence_types['declarative'] += 1
    
    return {
        'avg_length': sum(sentence_lengths) / len(sentence_lengths),
        'types': sentence_types,
        'complexity': 'high' if sum(sentence_lengths)/len(sentence_lengths) > 20 else 'medium'
    }
```

---

## 2. Output: Voice Signature JSON

```json
{
  "persona": "David Goggins",
  "analysis_date": "2025-12-19",
  "sources_analyzed": 51,
  
  "tone": {
    "primary": "confrontational",
    "secondary": "direct",
    "tertiary": "inspirational",
    "distribution": {
      "confrontational": 45.2,
      "direct": 28.1,
      "inspirational": 15.3,
      "empathetic": 8.4,
      "technical": 3.0
    }
  },
  
  "vocabulary": {
    "word_cloud_top_50": ["hard", "soft", "mind", "pain", "work", "..."],
    "signature_phrases": [
      "stay hard",
      "who's gonna carry the boats",
      "calloused mind",
      "accountability mirror",
      "cookie jar"
    ],
    "domain_terms": ["SEAL", "Hell Week", "ultra", "40%"],
    "profanity": {
      "level": "moderate_to_high",
      "common": ["damn", "hell", "ass"],
      "frequency_per_1000_words": 8.5
    }
  },
  
  "sentence_structure": {
    "avg_length_words": 18,
    "types": {
      "declarative": 45,
      "imperative": 35,
      "interrogative": 15,
      "exclamatory": 5
    },
    "preferred_opening": ["The truth is", "Here's the thing", "Listen"],
    "preferred_closing": ["Stay hard", "Get after it", "No excuses"]
  },
  
  "rhetoric": {
    "uses_questions": true,
    "question_style": "rhetorical_challenging",
    "uses_stories": true,
    "story_type": "personal_struggle",
    "uses_analogies": true,
    "analogy_sources": ["military", "athletics", "nature"]
  },
  
  "intensity": {
    "baseline": 8,
    "range": [6, 10],
    "peaks_on": ["excuses", "quitting", "comfort zone"],
    "calms_on": ["reflection", "gratitude", "achievement"]
  }
}
```

---

## 3. Quality Checks

- [ ] ≥30 transcrições analisadas
- [ ] Todas as 5 dimensões preenchidas
- [ ] Frases de assinatura identificadas
- [ ] Tom predominante claro
- [ ] Exemplos concretos para cada dimensão

---

## 4. Uso pelo C3 Creator

O C3 usa o voice_signature.json para:

1. **System Prompt** — Definir tom e vocabulário
2. **Response Patterns** — Estrutura de respostas
3. **Q&A Base** — Estilo das respostas
4. **Knowledge Bases** — Linguagem consistente

---

**Versão:** 1.0
**Clone Factory Module:** C2_Extractor

#galaxy-creation