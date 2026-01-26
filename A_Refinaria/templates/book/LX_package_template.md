# LX — Author Intelligence Package
## Template de Output

---

> **LX** é o nível máximo de output do Intellex. Combina Deep Synthesis (L4), Knowledge Base estruturada, Author Clone conversacional e Red Team em um único pacote de **inteligência completa sobre um autor/livro**.

---

## 📦 Estrutura do LX Package

```
Intellex/outputs/{book_slug}/
├── LX_PACKAGE.md                    # Este arquivo — índice do pacote
│
├── 01_SYNTHESIS/
│   └── deep_synthesis.md            # L4 — Resumo completo (3000+ palavras)
│
├── 02_KNOWLEDGE_BASE/
│   ├── KB_01_CORE_PHILOSOPHY.md     # Tese central e crenças fundamentais
│   ├── KB_02_FRAMEWORKS.md          # Frameworks e modelos extraídos
│   ├── KB_03_HEURISTICS.yaml        # Regras de decisão codificadas
│   ├── KB_04_QUOTES.md              # Citações organizadas por tema
│   ├── KB_05_VOCABULARY.md          # Terminologia e conceitos-chave
│   └── KB_06_MENTAL_MODELS.md       # Modelos mentais do autor
│
├── 03_AUTHOR_CLONE/
│   ├── SYSTEM_PROMPT.md             # Prompt para simular o autor
│   ├── PERSONALITY_PROFILE.yaml     # Perfil psicológico extraído
│   └── GUARDRAILS.md                # Limites do que o clone sabe
│
└── 04_RED_TEAM/
    ├── CHALLENGER_PROMPT.md         # Prompt para modo adversarial
    └── ATTACK_VECTORS.yaml          # Como o autor desafia premissas
```

---

## 🎯 O que cada componente entrega

| Componente | Propósito | Uso Principal |
|------------|-----------|---------------|
| **01_SYNTHESIS** | Compreensão profunda do livro | Leitura, referência, estudo |
| **02_KNOWLEDGE_BASE** | Conhecimento estruturado reutilizável | Alimentar agentes, RAG, pesquisas |
| **03_AUTHOR_CLONE** | Conversar com o autor | Tirar dúvidas, explorar ideias |
| **04_RED_TEAM** | Desafiar ideias usando lógica do autor | Validar planos, stress-test de ideias |

---

## ⚡ Benefícios do LX

1. **Máximo valor em um único output** — Não precisa pedir L4, depois L5, depois L6...
2. **Imediatamente acionável** — Clone e Red Team prontos para usar
3. **Reutilizável** — KB pode alimentar Clone Factory e outros agentes
4. **Consistente** — Todos os componentes derivam do mesmo processamento

---

## 📋 Checklist de Geração

Para produzir um LX Package completo, o Book_Processor deve:

- [ ] Gerar Deep Synthesis (L4)
- [ ] Extrair 6 Knowledge Bases estruturadas
- [ ] Criar System Prompt do Author Clone
- [ ] Extrair perfil de personalidade (Big5/MBTI aproximado)
- [ ] Definir guardrails (o que o clone não sabe)
- [ ] Criar Challenger Prompt (Red Team)
- [ ] Mapear attack vectors do autor
- [ ] Compilar LX_PACKAGE.md como índice

---

## 🕐 Tempo Estimado

| Nível | Tempo | Valor |
|-------|-------|-------|
| L1 OnePager | 2 min | ⭐ |
| L4 Deep | 10 min | ⭐⭐⭐ |
| **LX Package** | 30 min | ⭐⭐⭐⭐⭐ |
| Clone Factory Full | 2-4 horas | ⭐⭐⭐⭐⭐+ |

---

*Template Intellex LX — Author Intelligence Package*
