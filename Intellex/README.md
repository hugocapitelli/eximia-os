# Intellex — Intellectual Production Engine

<div align="center">

**Sistema de Produção Intelectual de Alto Impacto**

[![Class](https://img.shields.io/badge/Class-ENGINE-purple)]()
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)]()
[![Status](https://img.shields.io/badge/Status-Development-yellow)]()
[![Veritas](https://img.shields.io/badge/Powered%20by-The__Veritas-gold)]()

</div>

---

## 🎯 Missão

O **Intellex** é o motor de produção intelectual da ExímIA.AI, projetado para:

1. **📚 Consumir** conhecimento existente (livros, papers, pesquisas)
2. **⚙️ Criar** frameworks e metodologias originais de impacto
3. **📝 Produzir** artigos científicos e whitepapers

> *"Não processamos informação, criamos legado intelectual."*

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                       INTELLEX                               │
│                                                              │
│   📥 CORE ENGINE                                            │
│   ┌─────────────┬─────────────┬─────────────┐              │
│   │ K1_Ingester │ K2_Analyzer │ K3_Extractor│              │
│   └──────┬──────┴──────┬──────┴──────┬──────┘              │
│          │             │             │                      │
│   ┌──────▼─────┐ ┌─────▼─────┐ ┌─────▼──────┐             │
│   │ 📚 Book    │ │ 📝 Paper  │ │ ⚙️ Framework│             │
│   │ Processor  │ │ Generator │ │ Creator    │             │
│   └────────────┘ └───────────┘ └────────────┘             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Módulos

| Módulo | Função | Prioridade |
| :--- | :--- | :---: |
| **Book_Processor** | Resumos, sínteses, extração de frameworks | ⭐ Alta |
| **Framework_Creator** | Criar/empacotar metodologias originais | ⭐ Alta |
| **Paper_Generator** | Artigos científicos estruturados | Média |

---

## 📊 Níveis de Output — Book_Processor

| Nível | Nome | Descrição | Tamanho |
| :--- | :--- | :--- | :--- |
| **L1** | OnePager | Resumo ultracompacto | ~300 palavras |
| **L2** | Executive | Síntese executiva | ~1000 palavras |
| **L3** | Chapters | Resumo por capítulo | ~500/cap |
| **L4** | Deep Synthesis | Análise completa | 3000+ palavras |
| **LX** | Author Intelligence Package | **MÁXIMO** — inclui KB + Clone + Red Team | 12+ arquivos |

### 🏆 LX — Author Intelligence Package

O nível **LX** é o output máximo do Intellex. Combina:

```
📦 LX_PACKAGE/
├── 01_SYNTHESIS/       → Deep Synthesis (L4)
├── 02_KNOWLEDGE_BASE/  → 6 KBs estruturadas
├── 03_AUTHOR_CLONE/    → Prompt para simular autor
└── 04_RED_TEAM/        → Desafiar ideias com lógica do autor
```

**Quando usar LX:**
- Livros de alta importância estratégica
- Autores que você quer "conversar"
- Precisa de conhecimento reutilizável

---

## ⚙️ Framework Creator

O módulo diferencial para criar trabalhos "que fiquem famosos".

### Pipeline

```
1. DISCOVERY       → Identificar gap/problema
2. SYNTHESIS       → Combinar conceitos de fontes
3. ABSTRACTION     → Generalizar para aplicação universal
4. NAMING          → Nome memorável
5. VISUALIZATION   → Representação icônica
6. VALIDATION      → Testar em múltiplos contextos
7. PACKAGING       → Preparar para publicação
```

### Modos de Operação

- **Create**: Desenvolver framework totalmente novo
- **Package**: Empacotar e sistematizar ideias existentes

---

## 🔗 Integrações

| Sistema | Uso |
| :--- | :--- |
| **The_Veritas** | Pesquisa profunda antes de criar frameworks |
| **Clone_Factory** | Alimentar clones com KBs extraídas |
| **Z_Squad** | Pipeline de criação de agentes |

---

## 🚀 Enhanced Processing (v2.0)

### Quality Improvements Implemented

**v2.0 introduces 3 processing modes to achieve Claude-level quality:**

| Mode | Quality | Speed | Use Case |
|------|---------|-------|----------|
| **Single-Pass Enhanced** | 70-80% | ⚡ Fast | Quick exploration |
| **Multi-Pass Pipeline** | 90-95% | 🐢 Slow | Critical books |
| **Hybrid Self-Critique** | 85-90% | ⚖️ Balanced | **Recommended** |

### Key Enhancements

1. **Quantitative Specifications**
   - Deep Synthesis: 4000+ words (vs 2000-3000 before)
   - Frameworks: 8-10 detailed (vs 3-5 brief)
   - Heuristics: 25-30 complete (vs 10-15)

2. **Chain-of-Thought Processing**
   - Forced decomposition before synthesis
   - Inventory → Expansion → Generation → Verification

3. **Few-Shot Learning**
   - Reference templates from high-quality Claude outputs
   - Specific examples of good vs bad heuristics

4. **Self-Critique Loop**
   - QA_Validator module validates outputs
   - Identifies specific gaps
   - Iterative refinement

### 📖 Quick Start

See [QUICK_START.md](./QUICK_START.md) for detailed usage instructions.

**TL;DR — Recommended Flow:**
```
1. Use Hybrid Self-Critique mode
2. Generate LX Package with enhanced prompts
3. Validate with QA_Validator
4. Refine based on gaps identified
```

---

## 🚀 Quick Start (Basic)


```bash
# Via Eximia Runtime (em breve)
eximia run intellex --module book_processor --input "livro.pdf"
eximia run intellex --module framework_creator --mode package --input "minhas_ideias.md"
```

---

<div align="center">

**Built with ExímIA.AI** | Intellex v1.0.0

</div>
