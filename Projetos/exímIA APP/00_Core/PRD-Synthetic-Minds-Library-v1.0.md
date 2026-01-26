# PRD — Synthetic Minds Library
**Módulo:** 00_Core (Cross-cutting)
**Versão:** 1.0
**Data:** 26 Janeiro 2026
**Status:** 📋 **PROPOSTA** — Baseada em Alan's Demo

---

## Sumário Executivo

> **Inspiration:** Demo de Alan (YouTube 1:42:00-1:46:00) mostrando biblioteca de "synthetic minds" organizadas e acessíveis para todo o time.

A **Synthetic Minds Library** é uma proposta de organização centralizada dos **clones validados** do eximIA.OS (Elon Musk, David Kolb, Gary Halbert, etc.), permitindo que toda equipe exímIA tenha acesso fácil a esses agentes especializados.

**Filosofia:** *"Expertise on-demand."*

**Diferencial:** Clones não ficam escondidos em pastas — vivem em biblioteca discoverable, com metadata rica, exemplos de uso e ratings da equipe.

**Estratégia:** Democratizar acesso a clones validados, aumentar reuso, e facilitar onboarding de novos membros do time.

**Nota:** ✅ PRD atualizado com screenshots do vídeo de Alan (26/01/2026). UI/UX baseada na implementação real do LendárIA.OS.

---

## Problema Atual

### Clones Escondidos
- 50+ clones em subpastas
- Descoberta difícil: *"Temos um clone de copywriter?"*
- Sem índice visual ou metadata consistente
- Qualidade variável (alguns validados, outros WIP)

### Impacto
- Time não sabe quais clones existem
- Clones validados não são reutilizados
- Onboarding: 2 dias explorando pastas

---

## Visão da Solução

```
┌─────────────────────────────────────────────────────────────────┐
│               SYNTHETIC MINDS LIBRARY                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🧠 COPYWRITING (Tier 1 - Masters)                              │
│     ├── Gary Halbert        ⭐⭐⭐⭐⭐ (95% fidelity)            │
│     ├── David Ogilvy        ⭐⭐⭐⭐⭐ (94% fidelity)            │
│     └── Gary Bencivenga     ⭐⭐⭐⭐⭐ (96% fidelity)            │
│                                                                 │
│  🧠 STRATEGY                                                    │
│     ├── Elon Musk           ⭐⭐⭐⭐⭐ (94% fidelity)            │
│     └── Jeff Bezos          ⚠️ WIP                              │
│                                                                 │
│  🧠 LEARNING DESIGN                                             │
│     ├── David Kolb          ⭐⭐⭐⭐⭐ (95% fidelity)            │
│     └── Malcolm Knowles     ⭐⭐⭐⭐ (88% fidelity)              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Metadata de Cada Clone

```yaml
# gary_halbert/metadata.yaml
name: "Gary Halbert"
domain: "Copywriting"
subdomain: "Direct Response, Sales Letters"
tier: "Tier 1 - Master"
version: "2.0"
fidelity_score: 95
status: "validated"

description: "The Prince of Print. Direct response copywriting legend."

use_cases:
  - "Sales pages longas com storytelling"
  - "Cartas de vendas emocionais"
  - "Produtos problem-aware, sophistication stage 3+"

avoid_cases:
  - "Copy corporativo (usar Ogilvy)"
  - "Copy técnico B2B (usar Bencivenga)"

times_invoked: 142
avg_rating: 4.8
team_feedback:
  - "Melhor para sales pages longas"
  - "Storytelling é incrível"

created_at: "2025-11-12"
last_updated: "2026-01-10"
```

---

## UI/UX Design (baseado em Alan's LendárIA.OS)

### Layout Principal

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  Academia  v                                  [User]    │
│                                                                 │
│  ┌─────────────┐  ┌──────────────────────────────────────────┐ │
│  │ SIDEBAR     │  │ Mentes Sintéticas (52)                   │ │
│  │             │  │                                          │ │
│  │ Academia    │  │ [Buscar por nome, tag ou categoria...]  │ │
│  │ Criador de  │  │                                          │ │
│  │ Cursos      │  │ Categorias: [Todas][Recentes][Progresso]│ │
│  │ Desafios    │  │                                          │ │
│  │ Programas   │  │ + NOVA MENTE                            │ │
│  │             │  │                                          │ │
│  │█Mentes      │  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │ │
│  │ Sintéticas  │  │ │  AH  │ │  AN  │ │  AH  │ │  AK  │    │ │
│  │             │  │ │●     │ │●     │ │●     │ │●     │    │ │
│  │ Identidade  │  │ │Abilio│ │ Alan │ │ Alex │ │Andrej│    │ │
│  │ Design      │  │ │Diniz │ │Nicole│ │Hormo │ │Karpa │    │ │
│  │ System      │  │ │──────│ │──────│ │──────│ │──────│    │ │
│  │ Hall da     │  │ │BUSINE│ │ARQUIT│ │STRATE│ │PROGR │    │ │
│  │ Fama        │  │ │SS    │ │ETO   │ │GY    │ │AMMIN │    │ │
│  │             │  │ │──────│ │──────│ │──────│ │──────│    │ │
│  │ Criação &   │  │ │Brief │ │Brief │ │Brief │ │Brief │    │ │
│  │ Conteúdo    │  │ │desc  │ │desc  │ │desc  │ │desc  │    │ │
│  │             │  │ │──────│ │──────│ │──────│ │──────│    │ │
│  │ ...         │  │ │[tags]│ │[tags]│ │[tags]│ │[tags]│    │ │
│  │             │  │ └──────┘ └──────┘ └──────┘ └──────┘    │ │
│  │             │  │                                          │ │
│  └─────────────┘  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Card Design (Clone)

**Observado nos screenshots:**

```
┌────────────────────────────┐
│       [AVATAR/PHOTO]       │
│            ●               │  ← Status indicator (verde = ativo)
│                            │
│      Nome do Clone         │  ← Typography: Inter Bold
│      ──────────────        │
│    ESPECIALIDADE           │  ← Typography: Inter Regular, 12px
│                            │
│    Descrição curta do      │  ← 2-3 linhas max
│    clone e sua expertise   │
│                            │
│ [Tag1] [Tag2] [Tag3]       │  ← Pills/badges com categorias
│                            │
│ [View] [Edit] [...More]    │  ← Actions (hover state)
└────────────────────────────┘
```

**Elementos Visuais:**
- **Avatar:** Circular, 80x80px, foto ou iniciais
- **Status Dot:** Verde (ativo), Cinza (inativo), Amarelo (em validação)
- **Typography:**
  - Nome: Inter Bold, 18px
  - Especialidade: Inter Regular, 12px, uppercase, letter-spacing +0.5px
  - Descrição: Source Serif 4, 14px
- **Tags:** Pills com background cinza 8% (da escala monocromática), 6px radius
- **Hover:** Elevação sutil (shadow), scale 1.02

### Barra de Busca e Filtros

**Observado:**
```
┌────────────────────────────────────────────────────────────────┐
│  🔍  Buscar por nome, tag ou categoria...                      │
│                                                                │
│  Categorias:  [● Todas]  [○ Recentes]  [○ Em progresso]       │
│                                                                │
│  [Grid Icon] [List Icon]                      + NOVA MENTE    │
└────────────────────────────────────────────────────────────────┘
```

### Navegação Lateral (Sidebar)

**Hierarquia observada:**
```
📚 Academia
   ├── Criador de Cursos
   ├── Desafios
   ├── Programas
   └── Jornada do Aluno

🧠 Mentes Sintéticas ★ (Active)

🎨 Identidade
   ├── Design System
   ├── Identidade Visual
   ├── Hall da Fama
   └── Banco de Mídia

✍️ Criação & Conteúdo

📈 Tráfego & Conversão

💰 Vendas & Clientes
   ├── Sales AI
   ├── Lançamentos
   ├── CRM
   └── Previsão de Churn

👥 Equipe & Cultura

⚙️ Operações
```

---

## Organização dos Clones

### Exemplos Observados no LendárIA.OS

**Screenshot mostra 6 clones:**

1. **Abilio Diniz**
   - Domain: BUSINESS STRATEGY
   - Tags: Business Strategy, Leadership, Financial Management
   - Descrição: "Empresário brasileiro, ex-presidente do Grupo Pão de Açúcar. Conhecer pela grande capacidade e acurácia estratégica na fusões brasileiras."

2. **Alan Nicolas**
   - Domain: ARQUITETO DE SISTEMAS COGNITIVOS
   - Tags: Programming, Machine Learning, Product Strategy
   - Descrição: "Sistema Relleda escalável para manufatura de clones. Sistema único de IA com escalability e capacidade..."

3. **Alex Hormezi**
   - Domain: BUSINESS STRATEGY
   - Tags: Business Strategy, Leadership, Closing
   - Descrição: "Empresário por excelência e criador empresarial único dos EUA. Autor de 3 colstel (100m+). Especialize em branding, orquestramento, posicionamento e escala de negócios."

4. **Andrej Karpathy**
   - Domain: PROGRAMMING
   - Tags: Programming, Machine Learning, Deep Learning
   - Descrição: "Ex-diretor da IA do Tesla, co-fundador da OpenAI, Cientista da campranhação com mais de 10 anos. Arquiteto de multi modelo / arquitetura e rede, especializa em visão/LLMs."

5. **Brad Frost**
   - Domain: WRITING STYLES
   - Tags: Writing Styles, Visual Design, System Architecture
   - Descrição: "Web designer, autor de "Atomic Design". Criador de sistemas defensivo e arquitetos em empresas de Front-end-x"

6. **Daniel Kahneman**
   - Domain: WRITING STYLES
   - Tags: Writing Styles, Critical Thinking, Research Methodology
   - Descrição: "Nobel de Economia. Professor/PhD. Autor de "Thinking, Fast and Slow". Pioneiro da psicologia comportamental e ações cognitivas e tomada de decisão."

### Por Domain (ExímIA OS)

| Domain | Clones Atuais | Status |
|--------|---------------|--------|
| **Copywriting** | Gary Halbert, David Ogilvy, Gary Bencivenga, Claude Hopkins, Dan Kennedy | ✅ Validated |
| **Strategy** | Elon Musk, Abilio Diniz, Alex Hormezi | ✅ Validated |
| **Learning Design** | David Kolb, Malcolm Knowles | ✅ Validated |
| **Finance** | Ray Dalio | ⚠️ Validating |
| **Motivation** | David Goggins | ✅ Validated |
| **Technology** | Andrej Karpathy | ⚠️ Validating |
| **Design** | Brad Frost | ✅ Validated |
| **Psychology** | Daniel Kahneman | ⚠️ Validating |

### Por Tier (Quality)

| Tier | Critério | Exemplo |
|------|----------|---------|
| **Tier 0 - Diagnostic** | Diagnóstico, não execução | Claude Hopkins, Eugene Schwartz |
| **Tier 1 - Master** | Fidelity ≥90%, $500M+ impact | Gary Halbert, David Ogilvy |
| **Tier 2 - Systematizer** | Fidelity ≥85%, frameworks | Dan Kennedy, Todd Brown |
| **Tier 3 - Specialist** | Fidelity ≥80%, domínio específico | Jon Benson (VSL) |

---

## Fluxos de Uso

### 1. Invocar Clone via Library
1. User: "Synthetic Minds Library"
2. Busca: "Copywriting"
3. Vê grid com ratings
4. Clica em Gary Halbert → Detail Page
5. Vê: bio, quando usar, exemplos, team feedback
6. "Invocar Gary Halbert"
7. Chat iniciado

### 2. Adicionar Clone à Library
1. Z Squad valida novo clone
2. Fidelity score: 94%
3. Preenche metadata.yaml
4. Publica na Library
5. Team notificado: "🆕 Novo clone"

### 3. Atualizar Clone
1. Z Squad melhora clone v1.0 → v2.0
2. Atualiza metadata + changelog
3. Library mostra badge: "🆕 Updated"
4. Próxima invocação usa v2.0

---

## Casos de Uso

### Novo Membro do Time (Onboarding)
**Sem Library:** 2 dias explorando 50+ pastas
**Com Library:** <1 hora (vê 12 clones validados, ratings, use cases)
**Ganho:** 95% faster onboarding

### Escolher Clone Certo
**Sem Library:** 1h trial & error (testa vários)
**Com Library:** 2 min (busca + vê "quando usar")
**Ganho:** 97% faster

### Descobrir Clones Relacionados
Library sugere: *"Clones relacionados: LXD_Architect, ELC_Architect, Malcolm Knowles"*

---

## Implementation Plan

**Total: 36 hours**

- Phase 1: Metadata & Index (6h)
- Phase 2: Library UI (12h)
- Phase 3: Invocation System (8h)
- Phase 4: Recommendations (6h)
- Phase 5: Analytics Dashboard (4h)

---

## Success Metrics

| Métrica | Target |
|---------|--------|
| **Time to Find Right Clone** | <2 min |
| **Clone Avg Rating** | ≥4.2/5.0 |
| **Monthly Active Clones** | ≥80% of validated clones |
| **New Team Member Onboarding** | <1 hour |

---

## Próximos Passos

1. ⏳ Assistir vídeo do Alan (1:42:00-1:46:00) para capturar detalhes da UI
2. ⏳ Auditar todos clones existentes (quantos? quais validated?)
3. ⏳ Gerar metadata.yaml para os 12 validated
4. ⏳ Implementar MVP (Q2 2026)

---

## Decisão

**Status:** 📋 PROPOSTA — Aguardando revisão do vídeo do Alan

**Prioridade:** Média-Alta (facilitador de produtividade do time)

**Rationale:** Democratiza acesso a expertise via clones, reduz friction, acelera onboarding.

---

## Referências

- **Inspiration:** Alan's demo (YouTube 1:42:00-1:46:00)
- **Current Clones:** `Clones/` folder
- **Clone Factory:** `Clone_Factory/`
- **Z_Squad:** `Z_Squad/`
- **Copy Squad:** `Ferramentas/copy/`

---

*Synthetic Minds Library v1.0 — Expertise On-Demand*
*ExímIA OS — 2026*
