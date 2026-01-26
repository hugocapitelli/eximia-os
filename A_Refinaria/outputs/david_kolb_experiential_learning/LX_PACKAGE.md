# LX Package: David A. Kolb
## Experiential Learning: Experience as the Source of Learning and Development

---

## Metadados

| Campo | Valor |
|-------|-------|
| **Autor** | David A. Kolb |
| **Obra** | Experiential Learning: Experience as the Source of Learning and Development |
| **Edicao** | Second Edition (2015) |
| **Processamento** | LX (Author Intelligence Package) |
| **Data** | 2026-01-23 |
| **Pipeline** | A Refinaria LX Processing |
| **Versao Package** | 2.0.0 (inclui ELC+ 2026) |
| **Evolucao** | Clone Kolb Project — The_Maestro |

---

## Indice do Package

### 01_SYNTHESIS

| Arquivo | Descricao | Palavras |
|---------|-----------|----------|
| [deep_synthesis.md](./01_SYNTHESIS/deep_synthesis.md) | Analise profunda da teoria, frameworks, criticas e aplicacoes | ~4,500 |

---

### 02_KNOWLEDGE_BASE

| Arquivo | Descricao | Itens |
|---------|-----------|-------|
| [KB_01_CORE_PHILOSOPHY.md](./02_KNOWLEDGE_BASE/KB_01_CORE_PHILOSOPHY.md) | Crencas fundamentais e axiomas | 8 crencas |
| [KB_02_FRAMEWORKS.md](./02_KNOWLEDGE_BASE/KB_02_FRAMEWORKS.md) | Modelos e estruturas conceituais | 10 frameworks |
| [KB_03_HEURISTICS.yaml](./02_KNOWLEDGE_BASE/KB_03_HEURISTICS.yaml) | Regras de decisao aplicaveis | 30 heuristicas |
| [KB_04_QUOTES.md](./02_KNOWLEDGE_BASE/KB_04_QUOTES.md) | Citacoes organizadas por tema | 35+ citacoes |
| [KB_05_VOCABULARY.md](./02_KNOWLEDGE_BASE/KB_05_VOCABULARY.md) | Vocabulario tecnico e definicoes | 40+ termos |
| [KB_06_MENTAL_MODELS.md](./02_KNOWLEDGE_BASE/KB_06_MENTAL_MODELS.md) | Modelos mentais extraidos | 12 modelos |

---

### 03_AUTHOR_CLONE

| Arquivo | Descricao | Uso |
|---------|-----------|-----|
| [SYSTEM_PROMPT.md](./03_AUTHOR_CLONE/SYSTEM_PROMPT.md) | Prompt para simular Kolb em qualquer LLM | Conversacao |
| [PERSONALITY_PROFILE.yaml](./03_AUTHOR_CLONE/PERSONALITY_PROFILE.yaml) | Perfil psicologico (MBTI, Big5, DISC, valores) | Referencia |
| [GUARDRAILS.md](./03_AUTHOR_CLONE/GUARDRAILS.md) | Limites do que o clone sabe/nao sabe | Seguranca |

---

### 04_RED_TEAM

| Arquivo | Descricao | Itens |
|---------|-----------|-------|
| [CHALLENGER_PROMPT.md](./04_RED_TEAM/CHALLENGER_PROMPT.md) | Prompt para modo adversarial | 7 vetores principais |
| [ATTACK_VECTORS.yaml](./04_RED_TEAM/ATTACK_VECTORS.yaml) | Formas de desafiar a teoria | 20 vetores |

---

### 05_EVOLUTION (NOVO)

| Arquivo | Descricao | Evolucao |
|---------|-----------|----------|
| [ELC_PLUS_2026.md](./05_EVOLUTION/ELC_PLUS_2026.md) | Clone conceitual evoluido: ELC+ 2026 | 4 → 6 etapas |

**ELC+ 2026** e uma evolucao do modelo original de Kolb, expandido de 4 para 6 etapas:

```
KOLB ORIGINAL (4)          ELC+ 2026 (6)
═══════════════            ═══════════════
1. EC (Experiencia)   →    1. IMMERSE
2. OR (Reflexao)      →    2. REFLECT
3. CA (Conceituacao)  →    3. CONCEPTUALIZE
4. EA (Experimentacao)→    4. EXPERIMENT
        —             →    5. CALIBRATE ★ NOVO
        —             →    6. INTEGRATE ★ NOVO
```

**Novas Etapas:**
- **CALIBRATE** — Validacao e ajuste com feedback estruturado
- **INTEGRATE** — Transferencia e consolidacao via ensino (90% retencao)

---

## Resumo Executivo

### Sobre David Kolb

David A. Kolb (nascido 1939) e psicologo organizacional americano, Professor Emerito de Comportamento Organizacional na Case Western Reserve University. Ele e conhecido mundialmente pela **Experiential Learning Theory (ELT)** e pelo **Kolb Learning Style Inventory (LSI)**, instrumentos que influenciaram profundamente a educacao de adultos, desenvolvimento organizacional e design instrucional.

### Contribuicao Central

Kolb sintetizou as obras de **John Dewey**, **Kurt Lewin**, **Jean Piaget** e **William James** em um framework coerente que:

1. Define aprendizagem como criacao de conhecimento atraves da transformacao de experiencia
2. Propoe um ciclo de quatro estagios (EC → OR → CA → EA)
3. Identifica quatro estilos de aprendizagem baseados em preferencias dialecticas
4. Mapeia desenvolvimento humano como especializacao seguida de integracao

### Frameworks-Chave

```
┌─────────────────────────────────────────────────────────┐
│                EXPERIENTIAL LEARNING CYCLE               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│              Concrete Experience (EC)                    │
│                        │                                 │
│        ┌───────────────┼───────────────┐                │
│        │               │               │                │
│        ▼               │               ▼                │
│  Active              LEARNING     Reflective            │
│  Experimentation        │         Observation           │
│  (EA)                   │         (OR)                  │
│        │               │               │                │
│        └───────────────┼───────────────┘                │
│                        │                                 │
│                        ▼                                 │
│           Abstract Conceptualization (CA)                │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    LEARNING STYLES                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│    DIVERGENTE          │         ASSIMILADOR            │
│    (EC + OR)           │         (OR + CA)              │
│    Gera ideias         │         Cria modelos           │
│                        │                                 │
│  ──────────────────────┼──────────────────────          │
│                        │                                 │
│    ACOMODADOR          │         CONVERGENTE            │
│    (EA + EC)           │         (CA + EA)              │
│    Age e adapta        │         Resolve problemas      │
│                        │                                 │
└─────────────────────────────────────────────────────────┘
```

### Aplicacoes Praticas

| Dominio | Aplicacao |
|---------|-----------|
| Educacao Superior | Design de curriculos experienciais |
| T&D Corporativo | Programas de desenvolvimento de lideranca |
| Coaching | Diagnostico de preferencias de aprendizagem |
| Design Instrucional | Sequenciamento de atividades pelo ciclo |
| Autodesenvolvimento | Identificacao de modos negligenciados |

---

## Estatisticas do Package

| Metrica | Valor |
|---------|-------|
| **Total de Arquivos** | 13 |
| **Palavras (Synthesis)** | ~4,500 |
| **Frameworks Documentados** | 10 + ELC+ 2026 |
| **Heuristicas Extraidas** | 30 |
| **Citacoes Catalogadas** | 35+ |
| **Termos no Vocabulario** | 40+ |
| **Modelos Mentais** | 12 |
| **Vetores de Ataque** | 20 |
| **Evolucao Conceitual** | ELC+ 2026 (6 etapas) |

---

## Como Usar Este Package

### Para Aprender Sobre Kolb
1. Comece com `01_SYNTHESIS/deep_synthesis.md`
2. Explore frameworks em `KB_02_FRAMEWORKS.md`
3. Consulte citacoes originais em `KB_04_QUOTES.md`

### Para Aplicar a Teoria
1. Use heuristicas em `KB_03_HEURISTICS.yaml`
2. Consulte modelos mentais em `KB_06_MENTAL_MODELS.md`
3. Aplique o vocabulario de `KB_05_VOCABULARY.md`

### Para Simular Kolb
1. Use `SYSTEM_PROMPT.md` em qualquer LLM
2. Consulte `PERSONALITY_PROFILE.yaml` para calibracao
3. Respeite limites em `GUARDRAILS.md`

### Para Pensamento Critico
1. Use `CHALLENGER_PROMPT.md` para modo adversarial
2. Explore vetores em `ATTACK_VECTORS.yaml`
3. Prepare-se para defesas academicas

---

## Avisos Importantes

### Este package e para:
- Estudo e aplicacao da teoria de aprendizagem experiencial
- Design instrucional baseado em evidencias
- Desenvolvimento de programas educacionais
- Pesquisa academica e pensamento critico

### Este package NAO e para:
- Diagnostico psicologico formal
- Substituir leitura da obra original
- Representacao oficial de David Kolb
- Aplicacao sem adaptacao contextual

---

## Proximos Passos Sugeridos

1. **Leitura Profunda**: Leia a obra original para nuances nao capturadas
2. **Aplicacao Piloto**: Teste frameworks em contexto real
3. **Validacao Local**: Adapte para seu contexto cultural/organizacional
4. **Pensamento Critico**: Considere as criticas antes de adotar

---

## Referencias

### Obra Principal
- Kolb, D. A. (2015). *Experiential Learning: Experience as the Source of Learning and Development* (2nd ed.). Pearson Education.

### Obras Complementares
- Kolb, A. Y., & Kolb, D. A. (2005). Learning styles and learning spaces: Enhancing experiential learning in higher education. *Academy of Management Learning & Education*, 4(2), 193-212.
- Kolb, D. A. (1984). *Experiential Learning* (1st ed.). Prentice-Hall.

### Criticas Importantes
- Coffield, F., et al. (2004). *Learning styles and pedagogy in post-16 learning*. Learning and Skills Research Centre.
- Pashler, H., et al. (2008). Learning styles: Concepts and evidence. *Psychological Science in the Public Interest*, 9(3), 105-119.

### Fundadores Citados
- Dewey, J. (1938). *Experience and Education*. Macmillan.
- Lewin, K. (1946). Action research and minority problems. *Journal of Social Issues*, 2(4), 34-46.
- Piaget, J. (1970). *Science of Education and the Psychology of the Child*. Orion Press.

---

## Metadados Tecnicos

```yaml
package_type: "LX (Author Intelligence Package)"
source_file: "David-Kolb_Experiential Learning.json"
processing_date: "2026-01-23"
pipeline: "A Refinaria LX Processing"
version: "2.0.0"  # Atualizado com ELC+ 2026

components:
  synthesis: 1
  knowledge_bases: 6
  author_clone: 3
  red_team: 2
  evolution: 1  # NOVO: ELC+ 2026

total_files: 13

evolution:
  model: "ELC+ 2026"
  stages: 6
  new_stages:
    - "CALIBRATE (Validacao e Ajuste)"
    - "INTEGRATE (Transferencia e Consolidacao)"
  created_by: "Clone Kolb Project | The_Maestro"

quality_indicators:
  depth: "High"
  coverage: "Comprehensive"
  citations: "Verified from source"
  critical_analysis: "Included"
  conceptual_evolution: "ELC+ 2026"
```

---

*LX Package — David A. Kolb — Experiential Learning*
*Gerado por A Refinaria LX Processing*
*eximIA.OS*

