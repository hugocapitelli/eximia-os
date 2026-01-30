# Story PM1-003: Skill Tree RPG Visual

## Story Info

**Story ID:** PM1-003
**Epic:** PM1 - UX Enhancement Package
**Priority:** P3 (Menor - Alta Complexidade)
**Story Points:** 8
**Status:** Ready for Development

## User Story

**Como** usuário da Academy,
**Eu quero** visualizar minhas habilidades em uma árvore visual estilo RPG,
**Para que** eu tenha uma experiência gamificada e motivadora de progressão.

## Context

Atualmente as skills são exibidas em uma lista simples. O objetivo é transformar isso em uma árvore de habilidades visual, similar a jogos RPG, com nós conectados, estados de desbloqueio e progressão visual.

## UX Specifications (Uma)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      SKILL TREE                              │
│                      ══════════                              │
│                                                              │
│                         [🎯]                                 │
│                        MASTER                                │
│                          │                                   │
│              ┌──────────┼──────────┐                        │
│              │          │          │                         │
│            [📊]       [🎨]       [💡]                        │
│           ANÁLISE    DESIGN    INOVAÇÃO                      │
│              │          │          │                         │
│        ┌─────┴─────┐   │    ┌─────┴─────┐                   │
│        │           │   │    │           │                    │
│      [📈]       [🔍]  [✏️] [💭]       [🚀]                   │
│     Métricas  Research Sketch Ideação  Execução              │
│        │           │         │           │                    │
│     ┌──┴──┐     ┌──┴──┐   ┌──┴──┐     ┌──┴──┐               │
│     │     │     │     │   │     │     │     │                │
│   [📉] [📊]   [🔬] [📚] [🖌] [📐]   [⚡] [🎯]               │
│   KPIs Dash  Labs Docs  UI  Wire  Speed Goals                │
│                                                              │
│  ════════════════════════════════════════════════════════   │
│  [🟢 Desbloqueado: 12]  [🟡 Em Progresso: 4]  [⚫ Locked: 8] │
└─────────────────────────────────────────────────────────────┘
```

### Node States

```typescript
type SkillNodeState =
  | 'locked'      // ⚫ Cinza, bloqueado
  | 'available'   // 🟡 Pode desbloquear
  | 'in_progress' // 🔵 Em progresso (parcial)
  | 'completed'   // 🟢 Completo
  | 'mastered';   // ⭐ Mestria (100% + certificado)
```

### Visual Design

```css
/* Node base */
.skill-node {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* States */
.skill-node--locked {
  background: #1F1F22;
  border: 2px solid #2a2a2a;
  opacity: 0.5;
  filter: grayscale(100%);
}

.skill-node--available {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border: 2px solid #3a3a3a;
  animation: pulse 2s infinite;
}

.skill-node--in_progress {
  background: linear-gradient(135deg, #0A0A0A, #1a3a5a);
  border: 2px solid #3b82f6;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

.skill-node--completed {
  background: linear-gradient(135deg, #0A0A0A, #1a4a2a);
  border: 2px solid #22c55e;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

.skill-node--mastered {
  background: linear-gradient(135deg, #1a1a0a, #3a3a1a);
  border: 2px solid #f59e0b;
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.5);
}

/* Connection lines */
.skill-connection {
  stroke: #2a2a2a;
  stroke-width: 2;
  fill: none;
}

.skill-connection--active {
  stroke: #22c55e;
  stroke-width: 3;
  filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.5));
}

/* Pulse animation */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
}
```

### Component Structure

```typescript
interface SkillTreeProps {
  skills: SkillNode[];
  connections: SkillConnection[];
  onNodeClick: (skillId: string) => void;
  onNodeHover?: (skillId: string | null) => void;
  isEditorMode?: boolean;
}

interface SkillNode {
  id: string;
  name: string;
  icon: string; // emoji or icon name
  state: SkillNodeState;
  progress: number; // 0-100
  position: { x: number; y: number }; // relative position
  tier: number; // 1=basic, 2=intermediate, 3=advanced, 4=master
  prerequisites: string[]; // skill ids that must be completed first
  coursesRequired: string[]; // course ids to complete this skill
}

interface SkillConnection {
  from: string; // skill id
  to: string;   // skill id
  isActive: boolean;
}
```

### Interaction Behavior

| Action | Result |
|--------|--------|
| Hover node | Show tooltip with skill details |
| Click unlocked | Open skill detail modal |
| Click locked | Show requirements toast |
| Drag (editor) | Reposition node |
| Zoom (scroll) | Zoom in/out tree |
| Pan (drag bg) | Move view |

### Node Tooltip

```
┌─────────────────────────────────┐
│ 📊 ANÁLISE DE DADOS             │
│ ────────────────────            │
│ Tier: Intermediário             │
│ Progresso: 65%                  │
│ ████████░░░░ 65%                │
│                                 │
│ Cursos: 3/5 concluídos          │
│ • Data Basics ✓                 │
│ • SQL Fundamentals ✓            │
│ • Analytics Dashboard ✓         │
│ • Advanced Analytics ○          │
│ • Data Science Intro ○          │
│                                 │
│ [Ver Detalhes]                  │
└─────────────────────────────────┘
```

### Admin Editor Mode

```typescript
interface SkillTreeEditorControls {
  addNode: () => void;
  editNode: (id: string) => void;
  deleteNode: (id: string) => void;
  moveNode: (id: string, position: {x: number, y: number}) => void;
  addConnection: (from: string, to: string) => void;
  removeConnection: (from: string, to: string) => void;
  setPrerequisites: (id: string, prereqs: string[]) => void;
}
```

## Implementation Approach

### MVP (Recomendado para P3)

Implementar versão simplificada primeiro:
1. Grid layout em vez de posicionamento livre
2. Conexões verticais simples (sem curvas)
3. 3 estados: locked, available, completed
4. Sem zoom/pan inicialmente

### Full Version (Futuro)

1. SVG canvas com posicionamento livre
2. Bezier curves para conexões
3. Zoom/pan com touch support
4. Animações de desbloqueio
5. Particles effects para mastery

## Acceptance Criteria

### MVP - Funcional
- [ ] Visualização em grid de skills
- [ ] 3 estados visuais: locked, available, completed
- [ ] Conexões verticais entre nodes
- [ ] Tooltip com detalhes no hover
- [ ] Click para abrir modal de detalhes
- [ ] Indicadores de progresso por node

### MVP - Acessibilidade (WCAG AA)
- [ ] Contraste mínimo 4.5:1 para estados
- [ ] Focus visible em todos os nodes
- [ ] aria-label descritivo para cada node
- [ ] Keyboard navigation (Arrow keys entre nodes)
- [ ] role="tree" e role="treeitem" semânticos
- [ ] Screen reader anuncia estado do node

### MVP - Responsividade
- [ ] Layout adapta para mobile (scroll horizontal ou vertical stack)
- [ ] Touch targets mínimo 44x44px
- [ ] Tooltip funciona com touch (long press)

### MVP - Performance
- [ ] Renderiza 50+ nodes a 60fps
- [ ] Animações CSS-only onde possível

### Full (Future)
- [ ] Posicionamento livre com drag
- [ ] Conexões curvas (bezier)
- [ ] Zoom/pan controls
- [ ] Animações de desbloqueio
- [ ] Editor mode para admin

## Technical Tasks

### MVP
- [ ] Criar componente `SkillTreeGrid.tsx`
- [ ] Criar componente `SkillNode.tsx`
- [ ] Criar componente `SkillConnection.tsx`
- [ ] Implementar tooltip
- [ ] Implementar modal de detalhes
- [ ] Integrar com dados de cursos/progresso

### Full (Future)
- [ ] Migrar para SVG canvas
- [ ] Implementar zoom/pan
- [ ] Adicionar animações
- [ ] Implementar editor mode

## Files to Modify/Create

| File | Action |
|------|--------|
| `components/academy/SkillTreeGrid.tsx` | Create (MVP) |
| `components/academy/SkillNode.tsx` | Create |
| `components/academy/SkillConnection.tsx` | Create |
| `components/academy/SkillTooltip.tsx` | Create |
| `components/academy/SkillDetailModal.tsx` | Create |
| `hooks/useSkillTree.ts` | Create |
| `constants.ts` | Add SKILLS_TREE mock |

## Definition of Done

- [ ] MVP implementado e funcionando
- [ ] Visual consistente com DS
- [ ] Estados de node claros e distintos
- [ ] Responsividade testada (mobile/tablet/desktop)
- [ ] Performance aceitável (60fps com 50+ nodes)
- [ ] Acessibilidade verificada (keyboard nav, screen reader)
- [ ] Touch interactions testadas em mobile

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**UX Review:** Uma (UX Design Expert)
**Nota:** Complexidade alta - recomenda-se MVP primeiro
