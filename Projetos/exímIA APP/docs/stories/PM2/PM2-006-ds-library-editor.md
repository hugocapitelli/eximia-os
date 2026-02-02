# Story PM2-006: DS Library Editor Mode Visual

## Story Info

**Story ID:** PM2-006
**Epic:** PM2 - Visual Refinement Package
**Priority:** P2
**Story Points:** 3
**Status:** Ready for Development
**Dependencies:** PM2-001 (Admin Mode patterns)

## User Story

**Como** administrador do Design System,
**Eu quero** que o modo editor da DS Library tenha visual glassmorphism consistente com Academy,
**Para que** a experiência de administração seja coesa em todo o app.

## Context

O DS Library já tem modo editor (`isAdminMode`) mas o visual é diferente do padrão estabelecido na Academy. Precisamos aplicar o mesmo glassmorphism pattern.

**Localização do DS:** Os componentes do exímIA estão salvos em:
- Hook: `hooks/useDSLibrary.ts`
- Storage: localStorage key `eximia-ds-library`
- UI: `components/pages/DesignSystemLibrary.tsx`

## Current vs Target

### Current Admin Panel
```tsx
{isAdminMode && (
  <div className="mb-8 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
    {/* Content */}
  </div>
)}
```

### Target Admin Panel (Glassmorphism)
```tsx
{isAdminMode && (
  <div
    className="mb-8 p-6 rounded-2xl animate-in fade-in duration-300"
    style={{
      background: 'rgba(245, 158, 11, 0.05)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(245, 158, 11, 0.2)',
    }}
  >
    {/* Content */}
  </div>
)}
```

## Acceptance Criteria

### AC1: Glassmorphism Admin Panel
- [ ] Background: `rgba(245, 158, 11, 0.05)`
- [ ] Backdrop blur: `blur(12px)`
- [ ] Border: `1px solid rgba(245, 158, 11, 0.2)`
- [ ] Border radius: 16px (rounded-2xl)
- [ ] Animation: fade-in on appear

### AC2: Admin Header Styling
- [ ] Icon com background amber/10
- [ ] Title: "Component Manager" em font-bold text-white
- [ ] Description em text-zinc-400
- [ ] Gradient sutil no topo (opcional)

### AC3: Action Buttons
- [ ] "Gerar com AI" - variant secondary
- [ ] "Novo Componente" - bg-amber-500 text-black com glow
- [ ] Box-shadow: `0 0 20px rgba(245, 158, 11, 0.4)`

### AC4: Consistent with Academy
- [ ] Mesmo visual que AcademyDashboard editor mode
- [ ] Mesmo padrão de cores e espaçamentos
- [ ] Mesma animação de entrada

### AC5: Card Admin Controls
- [ ] Drag handle com mesmo estilo
- [ ] Edit button com amber glow
- [ ] Delete button com hover rose
- [ ] "Gerenciar" tooltip no hover

## Implementation

### DesignSystemLibrary.tsx Updates

```tsx
{/* Admin Panel with Glassmorphism */}
{isAdminMode && (
  <div
    className="mb-8 p-6 rounded-2xl animate-in fade-in duration-300"
    style={{
      background: 'rgba(245, 158, 11, 0.05)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(245, 158, 11, 0.2)',
    }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Layers className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Component Manager</h2>
          <p className="text-sm text-zinc-400">
            Adicione, edite e organize componentes do Design System.
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" icon={<Zap className="w-4 h-4" />}>
          Gerar com AI
        </Button>
        <Button
          className="bg-amber-500 hover:bg-amber-400 text-black border-transparent"
          style={{ boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}
          icon={<Plus className="w-4 h-4" />}
        >
          Novo Componente
        </Button>
      </div>
    </div>
  </div>
)}
```

### Admin Mode Toggle Button (Consistent Style)

```tsx
<button
  onClick={() => setIsAdminMode(!isAdminMode)}
  className={`
    flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300
    ${isAdminMode
      ? 'bg-amber-500 text-zinc-900 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}
  `}
>
  {isAdminMode ? <Settings className="w-3 h-3 animate-spin-slow" /> : <PenTool className="w-3 h-3" />}
  <span className="text-[10px] font-bold uppercase tracking-wider">
    {isAdminMode ? 'Editor Ativo' : 'Editar'}
  </span>
</button>
```

## Files to Modify

| File | Changes |
|------|---------|
| `components/pages/DesignSystemLibrary.tsx` | Apply glassmorphism to admin panel |

## Visual Reference (Academy Pattern)

```css
/* From AcademyDashboard.tsx - to match */
.admin-panel-glass {
  background: rgba(245, 158, 11, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 16px;
}

.admin-button-primary {
  background-color: #f59e0b;
  color: #000000;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
}

.admin-icon-container {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 8px;
  padding: 12px;
}
```

## Testing Checklist

- [ ] Admin panel aparece com glassmorphism
- [ ] Blur effect visível
- [ ] Cores amber consistentes
- [ ] Botões com estilo correto
- [ ] Glow no botão primário
- [ ] Animação fade-in funciona
- [ ] Toggle mantém estado
- [ ] Visual igual ao Academy

## Definition of Done

- [ ] Glassmorphism aplicado no admin panel
- [ ] Visual consistente com Academy
- [ ] Botões com glow effect
- [ ] Sem regressões de funcionalidade

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**Estimativa:** 1-2 horas
