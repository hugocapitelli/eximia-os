# Clone Factory — The_Veritas Integration

## Propósito
Documentar como o Clone Factory utiliza The_Veritas para pesquisa profunda na Fase 1.

---

## Por que Veritas?

O The_Veritas é o agente de pesquisa de elite do ecossistema eximIA.AI, com:

| Capacidade | Benefício para Clones |
| :--- | :--- |
| **CoVe (Chain-of-Verification)** | Anti-alucinação em dados da persona |
| **Source Tier System** | Priorização de fontes primárias |
| **Triangulação obrigatória** | 3 fontes para cada fato crítico |
| **65 frameworks** | Análise profunda e estruturada |
| **Score 9.38/10** | Qualidade superior a qualquer alternativa |

---

## Integração na Fase 1

### Ativação do Veritas

Quando C1 Hunter inicia, ele delega pesquisa ao Veritas com:

```json
{
  "mode": "persona_research",
  "target": "David Goggins",
  "depth": "deep",
  "output_format": "structured",
  "required_coverage": [
    "identity",
    "cognition",
    "voice",
    "behavior",
    "expertise",
    "context"
  ],
  "source_requirements": {
    "min_total": 50,
    "min_podcasts_1h": 5,
    "min_articles": 15,
    "social_media": true
  }
}
```

### Metodologias Utilizadas

#### 1. Source Tier System

```
TIER 1: ALTA AUTORIDADE (Obrigatório)
├── Podcasts do próprio especialista
├── Entrevistas oficiais
├── Livros publicados
└── Documentários

TIER 2: MÉDIA-ALTA AUTORIDADE
├── Jornalistas especializados
├── Biografias não-autorizadas bem pesquisadas
└── Análises acadêmicas

TIER 3: MÉDIA AUTORIDADE
├── Mídia mainstream
├── Artigos de revista
└── Perfis em sites de negócio

TIER 4: BAIXA AUTORIDADE (Apenas contexto)
├── Blogs pessoais
├── Redes sociais de terceiros
└── Comentários e opiniões

BLACKLIST (Nunca usar)
├── SEO farms sem autoria
├── Conteúdo gerado por IA
└── Tabloides sensacionalistas
```

#### 2. CoVe (Chain-of-Verification)

Para cada fato crítico sobre a persona:

```
PASSO 1: BASELINE RESPONSE
└── Gerar afirmação inicial

PASSO 2: PLAN VERIFICATION
└── Identificar claims que precisam verificação

PASSO 3: EXECUTE VERIFICATION
└── Buscar 3 fontes independentes

PASSO 4: FINAL VERIFIED RESPONSE
└── Confirmar ou corrigir afirmação
```

#### 3. SIFT Test (Para cada fonte)

| Etapa | Pergunta |
| :--- | :--- |
| **S**top | Eu conheço esta fonte? |
| **I**nvestigate | O que dizem sobre ela? |
| **F**ind | Outras fontes confirmam? |
| **T**race | Qual a origem primária? |

---

## Output do Veritas para C1 Hunter

```yaml
research_output:
  persona: "David Goggins"
  total_sources: 51
  quality_score: 9.5
  
  sources_by_tier:
    tier_1: 25
    tier_2: 15
    tier_3: 11
    tier_4: 0
    
  coverage:
    identity: 
      score: 10/10
      key_facts: ["Navy SEAL", "Ultra-runner", "Author"]
    cognition:
      score: 10/10
      key_facts: ["40% Rule", "Calloused Mind"]
    voice:
      score: 9/10
      key_facts: ["Stay Hard", "Confrontational tone"]
    behavior:
      score: 9/10
      key_facts: ["4 AM wake-up", "10-15 mile runs"]
    expertise:
      score: 10/10
      key_facts: ["3 Hell Weeks", "Badwater 135"]
    context:
      score: 9/10
      key_facts: ["Can't Hurt Me", "Never Finished"]
      
  verified_facts:
    - fact: "Completou 3 Hell Weeks"
      sources: ["JRE #1080", "Navy Times", "Autobiografia"]
      confidence: 100%
      
  contradictions:
    - topic: "Exato número de ultra-maratonas"
      source_a: "60+ (website oficial)"
      source_b: "70+ (Instagram)"
      resolution: "Usar ~60 como baseline conservador"
```

---

## Configuração Recomendada

### Parâmetros do Veritas

```json
{
  "depth": "deep",
  "citation_style": "inline",
  "confidence_threshold": 85,
  "triangulation": "mandatory",
  "source_tier_min": 2,
  "anti_hallucination": "cove_4step"
}
```

### Tempo Estimado

| Complexidade | Fontes | Tempo |
| :--- | :---: | :---: |
| **Baixa** (influencer) | 30 | 2-3h |
| **Média** (autor/speaker) | 50 | 4-6h |
| **Alta** (figura pública) | 75+ | 6-10h |

---

## Fallback sem Veritas

Se The_Veritas não estiver disponível, C1 Hunter pode executar manualmente, mas com:

- ⚠️ Qualidade reduzida
- ⚠️ Tempo aumentado (2-3x)
- ⚠️ Maior risco de gaps
- ⚠️ Sem triangulação automática

**Recomendação:** Sempre usar Veritas para clones de alta fidelidade.

---

**Última atualização:** 2026-01-08
