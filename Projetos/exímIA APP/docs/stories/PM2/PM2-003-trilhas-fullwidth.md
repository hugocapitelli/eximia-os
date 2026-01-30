# Story PM2-003: Trilhas Full-Width Redesign

## Story Info

**Story ID:** PM2-003
**Epic:** PM2 - Visual Refinement Package
**Priority:** P1
**Story Points:** 3
**Status:** Ready for Development

## User Story

**Como** usuário da Academy,
**Eu quero** ver as trilhas de aprendizado em cards full-width empilhados,
**Para que** o visual seja mais minimalista e fácil de escanear.

## Context

Os TrackCardLarge atuais usam grid de 2 colunas com visual colorido. O novo design deve ser:
- 1 trilha por linha (full-width)
- Visual minimalista (menos cores)
- Cards empilhados verticalmente
- Foco em informação clara

## Current vs Target

### Current (TrackCardLarge)
```
┌─────────────────┐  ┌─────────────────┐
│ [Gradient BG]   │  │ [Gradient BG]   │
│ Track 1         │  │ Track 2         │
│ Progress bar    │  │ Progress bar    │
└─────────────────┘  └─────────────────┘
```

### Target (TrackCardFullWidth)
```
┌─────────────────────────────────────────────────────────────────┐
│  [Icon]   FUNDAMENTOS DE PRODUTO                                │
│           Domine os conceitos essenciais de gestão de produto   │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  35%               │
│  5 cursos • 42h                                    [Continuar →]│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  [Icon]   ENGENHARIA DE SOFTWARE                                │
│           Arquitetura, patterns e boas práticas                 │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0%                │
│  8 cursos • 64h                                     [Iniciar →] │
└─────────────────────────────────────────────────────────────────┘
```

## Acceptance Criteria

### AC1: Layout Full-Width
- [ ] Cada card ocupa 100% da largura (max-w-4xl centralizado)
- [ ] Cards empilhados verticalmente com gap-4
- [ ] Apenas 1 trilha por linha
- [ ] Altura consistente (~100-120px)

### AC2: Visual Minimalista
- [ ] Background: `bg-[#0A0A0A]` com border sutil
- [ ] Sem gradientes coloridos de fundo
- [ ] Ícone com tint sutil da cor da trilha (10% opacity)
- [ ] Tipografia limpa: título bold, descrição zinc-500
- [ ] Progress bar fino (h-1)

### AC3: Informações Claras
- [ ] Ícone 48x48 à esquerda
- [ ] Título: text-lg font-bold text-white
- [ ] Descrição: text-sm text-zinc-500 (1 linha, truncate)
- [ ] Meta: "X cursos • Yh estimadas"
- [ ] CTA à direita: ghost button

### AC4: Estados do CTA
- [ ] Não iniciado: "Iniciar →"
- [ ] Em progresso: "Continuar →"
- [ ] Concluído: "Concluída ✓" (disabled style)

### AC5: Interações
- [ ] Hover: border-zinc-700, slight shadow
- [ ] Click no card: navega para trilha
- [ ] Editor mode: drag handle, edit, delete (se admin)

## Component: TrackCardFullWidth.tsx

```typescript
interface TrackCardFullWidthProps {
  track: AcademyTrack;
  onNavigate: (trackId: string) => void;
  isEditorMode?: boolean;
  onEdit?: (trackId: string) => void;
  onDelete?: (trackId: string) => void;
}
```

### Component Structure

```tsx
export const TrackCardFullWidth: React.FC<TrackCardFullWidthProps> = ({
  track,
  onNavigate,
  isEditorMode,
  onEdit,
  onDelete,
}) => {
  const progress = track.progress || 0;
  const isCompleted = progress === 100;
  const isStarted = progress > 0;

  return (
    <div
      onClick={() => onNavigate(track.id)}
      className="
        w-full bg-[#0A0A0A] border border-[#1F1F22] rounded-xl
        p-5 flex items-center gap-5
        hover:border-zinc-700 hover:shadow-lg
        transition-all duration-200 cursor-pointer
        group
      "
    >
      {/* Editor Mode: Drag Handle */}
      {isEditorMode && (
        <div className="cursor-grab">
          <GripVertical className="w-5 h-5 text-zinc-600" />
        </div>
      )}

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${track.color}15` }}
      >
        <span className="text-2xl">{track.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-white mb-0.5">
          {track.name}
        </h3>
        <p className="text-sm text-zinc-500 truncate mb-2">
          {track.description}
        </p>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-400 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-zinc-600 font-mono">
            {progress}%
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="text-right flex-shrink-0">
        <p className="text-xs text-zinc-600 mb-2">
          {track.courseCount} cursos • {track.estimatedHours}h
        </p>

        {/* CTA Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(track.id); }}
          className={`
            text-sm font-medium px-4 py-1.5 rounded-lg transition-colors
            ${isCompleted
              ? 'text-emerald-500/50 cursor-default'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }
          `}
          disabled={isCompleted}
        >
          {isCompleted ? 'Concluída ✓' : isStarted ? 'Continuar →' : 'Iniciar →'}
        </button>
      </div>

      {/* Editor Mode: Actions */}
      {isEditorMode && (
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(track.id); }}
            className="p-2 text-zinc-500 hover:text-amber-500 transition-colors"
          >
            <PenTool className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(track.id); }}
            className="p-2 text-zinc-500 hover:text-rose-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
```

## Changes to AcademyDashboard.tsx

```tsx
// FROM:
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {tracks.map(track => (
    <TrackCardLarge ... />
  ))}
</div>

// TO:
<div className="flex flex-col gap-4 max-w-4xl mx-auto">
  {tracks.map(track => (
    <TrackCardFullWidth
      key={track.id}
      track={track}
      onNavigate={handleNavigateTrack}
      isEditorMode={isEditorMode}
    />
  ))}
</div>
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `components/academy/TrackCardFullWidth.tsx` | Create |
| `components/pages/AcademyDashboard.tsx` | Replace TrackCardLarge usage |

## Testing Checklist

- [ ] Cards ocupam full-width
- [ ] 1 card por linha
- [ ] Visual minimalista (sem gradientes coloridos)
- [ ] Progress bar funciona
- [ ] Estados do CTA corretos
- [ ] Hover effect funciona
- [ ] Click navega para trilha
- [ ] Responsivo em mobile
- [ ] Editor mode funciona (se admin)

## Definition of Done

- [ ] TrackCardFullWidth criado
- [ ] Integrado no AcademyDashboard
- [ ] Visual minimalista alcançado
- [ ] Funcionalidade preservada
- [ ] Responsivo

---

**Criado por:** River (SM Agent)
**Data:** 2026-01-29
**Estimativa:** 2-3 horas
