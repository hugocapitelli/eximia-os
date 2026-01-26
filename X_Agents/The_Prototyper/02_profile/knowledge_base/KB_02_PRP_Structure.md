# KB-02: Product Requirement Prompts (PRP) Structure

## 1. O que é um PRP?

### Definição
**Product Requirement Prompt (PRP)** é um documento estruturado que fornece a um sistema de AI (como um coding assistant ou agente) todo o contexto necessário para implementar um feature de produto de forma autônoma e correta.

### PRP vs PRD

| Aspecto | PRD | PRP |
|---------|-----|-----|
| **Audiência** | Humanos (PMs, devs, designers) | AI/LLM |
| **Objetivo** | Alinhar stakeholders, documentar decisões | Instruir AI para implementação |
| **Formato** | Flexível, narrativo | Altamente estruturado, explícito |
| **Ambiguidade** | Tolerada (humanos inferem) | Zero (AI não infere bem) |
| **Contexto** | Assume conhecimento prévio | Fornece todo contexto necessário |
| **Validação** | Review humano | Critérios automatizáveis |

### Por que PRPs são necessários?

1. **AI não tem contexto implícito**: Precisa saber TUDO explicitamente
2. **AI otimiza literalmente**: Se critério não está escrito, não será considerado
3. **AI pode alucinar**: Constraints e validações previnem outputs incorretos
4. **AI precisa de estrutura**: Formato consistente melhora qualidade do output

---

## 2. Anatomia de um PRP

### 2.1 Estrutura Completa

```markdown
# PRP: [Nome do Feature]

## Metadata
- **Version**: 1.0
- **Created**: [Date]
- **Author**: [Name]
- **Target System**: [Claude/GPT/Copilot/Custom Agent]
- **Complexity**: Simple | Medium | Complex
- **Estimated Implementation**: [Timeframe]

---

## 1. Context

### 1.1 System Context
[Descrição do sistema/produto onde o feature será implementado]

### 1.2 Tech Stack
- **Frontend**: [Framework, versão]
- **Backend**: [Language, framework]
- **Database**: [Type, schema relevante]
- **Key Dependencies**: [Libraries críticas]

### 1.3 Existing Patterns
[Padrões de código já estabelecidos que devem ser seguidos]

### 1.4 File Structure Reference
```
src/
├── components/     # React components
├── services/       # Business logic
├── utils/          # Helpers
└── types/          # TypeScript types
```

---

## 2. Task Definition

### 2.1 Objective
[Uma frase clara do que deve ser construído]

### 2.2 User Story
As a [persona],
I want [capability],
So that [benefit].

### 2.3 Scope

#### In Scope
- ✅ [O que DEVE ser feito]
- ✅ [Outro item obrigatório]

#### Out of Scope
- ❌ [O que NÃO deve ser feito]
- ❌ [Outro item excluído]

#### Assumptions
- [Suposição 1 que a AI pode fazer]
- [Suposição 2]

---

## 3. Requirements

### 3.1 Functional Requirements
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | [Requisito funcional] | Must | [Detalhes] |
| FR-002 | [Requisito funcional] | Should | [Detalhes] |

### 3.2 Non-Functional Requirements
| ID | Requirement | Target | Measurement |
|----|-------------|--------|-------------|
| NFR-001 | Response time | <200ms | Lighthouse |
| NFR-002 | Accessibility | WCAG 2.1 AA | axe-core |

### 3.3 Acceptance Criteria
- [ ] AC-001: Given [context], when [action], then [outcome]
- [ ] AC-002: Given [context], when [action], then [outcome]

---

## 4. Constraints

### 4.1 Technical Constraints
- [Limitação técnica 1]
- [Limitação técnica 2]

### 4.2 Business Constraints
- [Restrição de negócio]

### 4.3 DO NOT (Hard Constraints)
- ❌ DO NOT use deprecated APIs
- ❌ DO NOT modify [file/module]
- ❌ DO NOT introduce new dependencies without approval

---

## 5. Implementation Guidance

### 5.1 Suggested Approach
[High-level approach recomendado]

### 5.2 Key Files to Modify/Create
| File | Action | Purpose |
|------|--------|---------|
| `src/components/Feature.tsx` | Create | Main component |
| `src/services/feature.ts` | Create | Business logic |
| `src/types/feature.ts` | Create | Type definitions |

### 5.3 Code Patterns to Follow
```typescript
// Example of expected pattern
export const useFeature = () => {
  // Follow existing hook patterns
};
```

### 5.4 Integration Points
- [Como se integra com sistema X]
- [API endpoint a chamar]

---

## 6. Edge Cases & Error Handling

### 6.1 Edge Cases
| Case | Expected Behavior | Priority |
|------|-------------------|----------|
| Empty state | Show placeholder message | P0 |
| Network error | Show retry option | P0 |
| Invalid input | Show validation error | P1 |

### 6.2 Error Messages
| Error Type | User Message | Log Level |
|------------|--------------|-----------|
| Network | "Unable to load. Please try again." | ERROR |
| Validation | "[Field] is required" | WARN |

---

## 7. Validation Criteria

### 7.1 Self-Validation Checklist
Before considering implementation complete:
- [ ] All acceptance criteria met
- [ ] TypeScript compiles without errors
- [ ] No console errors in browser
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible via keyboard navigation

### 7.2 Test Cases
| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| TC-001 | [Cenário de teste] | [Resultado esperado] |
| TC-002 | [Cenário de teste] | [Resultado esperado] |

### 7.3 Definition of Done
- [ ] Code implemented
- [ ] Tests passing
- [ ] No linting errors
- [ ] Documentation updated
- [ ] PR ready for review

---

## 8. Examples & References

### 8.1 Input/Output Examples
**Input:**
```json
{
  "userId": "123",
  "action": "create"
}
```

**Expected Output:**
```json
{
  "success": true,
  "id": "456"
}
```

### 8.2 UI Reference
[Link to Figma/wireframe]

### 8.3 Similar Implementations
- `src/components/ExistingFeature.tsx` - Similar pattern
- [Link to documentation]

---

## 9. Questions for Clarification
[Questões que a AI deve perguntar se encontrar durante implementação]

- If [situation], should I [option A] or [option B]?
- What should happen when [edge case]?
```

---

## 3. Componentes Detalhados

### 3.1 Context Section

O contexto é CRÍTICO para AI. Sem contexto adequado, AI vai:
- Usar padrões genéricos em vez de padrões do projeto
- Criar estruturas inconsistentes
- Perder integrações importantes

**Template de Context**:
```markdown
## System Context

### Product Overview
[Nome do produto] é [tipo de produto] que [proposta de valor principal].
O feature sendo implementado faz parte do [módulo/área] e afeta [usuários/fluxos].

### Current Architecture
```
[Diagrama ou descrição da arquitetura]
```

### Relevant Existing Code
- `path/to/relevant/file.ts` - [O que faz e por que é relevante]
- `path/to/another/file.ts` - [O que faz e por que é relevante]

### Design System
- Components: [Material UI / Chakra / Custom]
- Styling: [Tailwind / CSS Modules / Styled Components]
- Icons: [Lucide / Heroicons / FontAwesome]

### API Conventions
- REST endpoints follow: `/{resource}/{id}/{action}`
- Auth: Bearer token in header
- Response format: `{ data: T, error?: Error }`
```

### 3.2 Constraints Section

Constraints previnem que AI faça coisas indesejadas.

**Tipos de Constraints**:

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **Hard** | Nunca pode ser violado | "DO NOT modify database schema" |
| **Soft** | Preferência, pode ser discutida | "Prefer functional over class components" |
| **Performance** | Limites de desempenho | "Queries must return in <100ms" |
| **Security** | Restrições de segurança | "Never log PII" |
| **Compatibility** | Suporte a plataformas | "Must work in IE11" |

**Template de Constraints**:
```markdown
## Constraints

### MUST (Critical)
- ❌ MUST NOT modify files in `/core/` without explicit approval
- ❌ MUST NOT use `any` type in TypeScript
- ❌ MUST NOT expose sensitive data in client-side code

### SHOULD (Important)
- ⚠️ SHOULD follow existing naming conventions
- ⚠️ SHOULD use existing utility functions over creating new ones
- ⚠️ SHOULD keep components under 200 lines

### MAY (Optional)
- ✅ MAY create new utility functions if needed
- ✅ MAY suggest refactoring if it improves implementation
```

### 3.3 Validation Criteria

Validation criteria permitem que AI auto-verifique seu trabalho.

**Níveis de Validação**:

```markdown
## Validation Levels

### Level 1: Syntax & Compilation
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Prettier formatting applied

### Level 2: Functional Correctness
- [ ] All acceptance criteria met
- [ ] Happy path works end-to-end
- [ ] Error states handled

### Level 3: Quality Standards
- [ ] No console.log statements
- [ ] Proper error boundaries
- [ ] Loading states implemented

### Level 4: Production Readiness
- [ ] Performance within targets
- [ ] Accessibility compliance
- [ ] Analytics events implemented
```

---

## 4. PRP Templates por Complexidade

### 4.1 Simple PRP (Bug Fix / Small Change)

```markdown
# PRP: [Bug/Change Name]

## Context
**File**: `src/components/Button.tsx`
**Issue**: [Descrição do bug/mudança]

## Task
Fix/Change [specific thing] so that [expected behavior].

## Current Behavior
[O que acontece atualmente]

## Expected Behavior
[O que deve acontecer]

## Acceptance Criteria
- [ ] [Critério específico]

## Constraints
- DO NOT change component API
- DO NOT modify other files

## Validation
- [ ] Bug no longer reproduces
- [ ] Existing tests pass
```

### 4.2 Medium PRP (New Component / Feature)

```markdown
# PRP: [Feature Name]

## Context
[2-3 parágrafos sobre sistema e onde feature se encaixa]

### Tech Stack
- React 18 + TypeScript
- Zustand for state
- Tanstack Query for data fetching

### Files Reference
- Similar component: `src/components/ExistingFeature/`
- API service: `src/services/api.ts`

## Task
Create [component/feature] that allows users to [capability].

### User Story
As a [persona], I want [action] so that [benefit].

## Requirements

### Functional
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | [Req] | Must |
| FR-002 | [Req] | Should |

### Non-Functional
- Response time: <200ms
- Mobile responsive

## Implementation

### Files to Create
1. `src/components/Feature/Feature.tsx` - Main component
2. `src/components/Feature/Feature.types.ts` - Types
3. `src/components/Feature/Feature.test.tsx` - Tests

### Suggested Structure
```typescript
// Feature.tsx
export const Feature: React.FC<FeatureProps> = ({ ... }) => {
  // State
  // Effects
  // Handlers
  // Render
};
```

## Edge Cases
| Case | Behavior |
|------|----------|
| Empty data | Show empty state |
| Error | Show error message with retry |

## Acceptance Criteria
- [ ] AC-001: [Specific testable criteria]
- [ ] AC-002: [Specific testable criteria]

## Validation
- [ ] TypeScript compiles
- [ ] Tests pass
- [ ] No console errors
- [ ] Works on mobile
```

### 4.3 Complex PRP (System/Architecture Change)

Use a estrutura completa da Seção 2.1.

---

## 5. Best Practices para PRPs

### 5.1 Princípios de Escrita

| Princípio | Descrição | Exemplo |
|-----------|-----------|---------|
| **Explicit > Implicit** | Escreva tudo, não assuma | ❌ "Handle errors" ✅ "Show error toast on API failure" |
| **Specific > General** | Detalhes concretos | ❌ "Fast" ✅ "<100ms response time" |
| **Example > Description** | Mostre, não apenas diga | Inclua código exemplo |
| **Constraint > Freedom** | Limites claros | "Use existing Button, DO NOT create new" |
| **Testable > Aspirational** | Verificável | ❌ "Good UX" ✅ "Tab navigation works" |

### 5.2 Checklist de Qualidade

```
PRP QUALITY CHECKLIST

□ Context
  □ Sistema/produto claramente descrito
  □ Tech stack especificado
  □ Arquivos relevantes referenciados
  □ Padrões existentes documentados

□ Task
  □ Objetivo em uma frase clara
  □ User story completa
  □ Scope (in/out) definido
  □ Assumptions listadas

□ Requirements
  □ Requisitos funcionais priorizados
  □ Requisitos não-funcionais quantificados
  □ Acceptance criteria testáveis

□ Constraints
  □ Hard constraints com DO NOT
  □ Preferências vs obrigações claras
  □ Arquivos protegidos listados

□ Validation
  □ Checklist de auto-validação
  □ Test cases específicos
  □ Definition of Done clara

□ Examples
  □ Input/output examples
  □ Code snippets de padrões
  □ UI references linkadas
```

### 5.3 Anti-Patterns

| Anti-Pattern | Problema | Solução |
|--------------|----------|---------|
| **Vague Requirements** | "Make it user-friendly" | Especificar métricas: "WCAG 2.1 AA" |
| **Missing Context** | AI não sabe do sistema | Incluir tech stack, padrões, arquivos |
| **No Constraints** | AI pode fazer qualquer coisa | Definir DO NOTs explícitos |
| **No Examples** | Output inconsistente | Incluir input/output samples |
| **Scope Creep** | PRP vira PRD | Manter focado em uma tarefa |
| **Implementation Details** | Prescreve o "como" | Focar no "o quê" e "por quê" |

---

## 6. Workflow de Criação de PRP

```
┌─────────────────────────────────────────────────────────────┐
│                    PRP CREATION WORKFLOW                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. GATHER CONTEXT                                          │
│     └─> Ler PRD existente                                   │
│     └─> Identificar arquivos relevantes                     │
│     └─> Documentar padrões do projeto                       │
│                                                             │
│  2. DEFINE TASK                                             │
│     └─> Escrever objetivo em uma frase                      │
│     └─> Criar user story                                    │
│     └─> Definir scope (in/out)                              │
│                                                             │
│  3. SPECIFY REQUIREMENTS                                    │
│     └─> Listar requisitos funcionais                        │
│     └─> Quantificar requisitos não-funcionais               │
│     └─> Escrever acceptance criteria                        │
│                                                             │
│  4. SET CONSTRAINTS                                         │
│     └─> Identificar DO NOTs                                 │
│     └─> Documentar preferências                             │
│     └─> Listar arquivos protegidos                          │
│                                                             │
│  5. PREPARE VALIDATION                                      │
│     └─> Criar checklist de validação                        │
│     └─> Escrever test cases                                 │
│     └─> Definir Definition of Done                          │
│                                                             │
│  6. ADD EXAMPLES                                            │
│     └─> Input/output samples                                │
│     └─> Code snippets                                       │
│     └─> UI references                                       │
│                                                             │
│  7. REVIEW & ITERATE                                        │
│     └─> Validar com stakeholder técnico                     │
│     └─> Testar com AI (dry run)                             │
│     └─> Refinar baseado em output                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. PRP para Diferentes AI Systems

### 7.1 Para Claude/Claude Code

- Aproveita estrutura em Markdown/XML
- Funciona bem com seções hierárquicas
- Responde bem a "DO NOT" constraints
- Pode pedir clarificações se instruído

### 7.2 Para GitHub Copilot

- Focar em context através de comentários
- Incluir exemplos de código inline
- Usar convenções de naming claras
- Manter arquivos relevantes abertos

### 7.3 Para GPT-4 / ChatGPT

- Estrutura clara com headers
- Exemplos concretos são críticos
- Explicitar formato de output esperado
- Quebrar em tarefas menores se complexo

### 7.4 Para Agentes Customizados

- Adaptar ao schema de input do agente
- Incluir tool_calls disponíveis
- Definir checkpoints de validação
- Especificar formato de output esperado

---

## Referências

- Anthropic Claude Documentation (2024)
- OpenAI Best Practices for Prompting
- GitHub Copilot Documentation
- "The Art of Clear Prompting" - Internal Best Practices


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->