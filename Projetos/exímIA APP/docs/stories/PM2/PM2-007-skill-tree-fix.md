# Story PM2-007: Skill Tree View Fix

## Story Info

**Story ID:** PM2-007
**Epic:** PM2 - Visual Refinement Package
**Priority:** P0 (Crítico - Bug Fix)
**Story Points:** 2
**Status:** Ready for Development

## User Story

**Como** usuário da Academy,
**Eu quero** ver a Skill Tree no modo visual de árvore RPG,
**Para que** eu tenha a experiência gamificada prometida.

## Context

O código do SkillTreeGrid está implementado e integrado corretamente em AcademySkillTree.tsx. O viewMode default é 'tree'. Porém o usuário reporta que ainda vê a versão antiga (grid de cards). Possíveis causas: cache do browser ou erro de renderização.

## Problem Analysis

```typescript
// AcademySkillTree.tsx - linha 114
const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');

// Linha 216 - conditional render
{viewMode === 'tree' && (
  <div className="mb-8">
    <SkillTreeGrid onNavigateToCourse={onNavigateToCourse} />
  </div>
)}
```

## Acceptance Criteria

### Funcional
- [ ] Skill Tree view renderiza por default ao abrir a página
- [ ] Toggle tree/grid funciona corretamente
- [ ] SkillTreeGrid exibe os 18 skills em layout de árvore (4 tiers)
- [ ] Estados visuais funcionam: locked, available, in_progress, completed, mastered
- [ ] Conexões verticais aparecem entre tiers
- [ ] Tooltip aparece no hover de cada skill
- [ ] Modal de detalhes abre ao clicar em skill não-bloqueado
- [ ] Stats header mostra contagem correta

### Debug Tasks
- [ ] Adicionar console.log para verificar viewMode
- [ ] Verificar se SkillTreeGrid é importado corretamente
- [ ] Limpar localStorage se necessário (key: 'eximia-skill-tree')
- [ ] Verificar se useSkillTree retorna dados

## Technical Tasks

- [ ] Adicionar fallback visual se skills array estiver vazio
- [ ] Adicionar error boundary no SkillTreeGrid
- [ ] Forçar re-render se viewMode === 'tree' mas grid aparece
- [ ] Opcional: Adicionar loading state enquanto carrega skills

## Files to Modify

| File | Action |
|------|--------|
| `components/pages/AcademySkillTree.tsx` | Debug, add fallback |
| `components/academy/SkillTreeGrid.tsx` | Add error boundary, loading state |
| `hooks/useSkillTree.ts` | Verify data loading |

## Debug Code to Add

```typescript
// AcademySkillTree.tsx - temporário
useEffect(() => {
  console.log('[SkillTree] viewMode:', viewMode);
  console.log('[SkillTree] SkillTreeGrid type:', typeof SkillTreeGrid);
}, [viewMode]);

// SkillTreeGrid.tsx - temporário
useEffect(() => {
  console.log('[SkillTreeGrid] skills count:', skills.length);
  console.log('[SkillTreeGrid] tier1:', getSkillsByTier(1).length);
}, [skills]);
```

## Definition of Done

- [ ] Skill Tree view aparece por default
- [ ] Todos os 18 skills renderizam na árvore
- [ ] Toggle tree/grid funciona
- [ ] Console.logs removidos após fix
- [ ] Testado em browser limpo (incognito)

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**Estimativa:** 1-2 horas
