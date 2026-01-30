# exímIA OS App - Visual Feedback Specification

**Documento para Design no AI Studio**
**Baseado na Connection Layer (BLOCO 1.1, 1.3, 2.1, 2.2)**

---

## 1. TOASTS & NOTIFICATIONS

### 1.1 Error Toasts (Vermelho/Destructive)

| ID | Mensagem | Contexto |
|----|----------|----------|
| ERR_LINK_FETCH | "Failed to fetch links" | Ao carregar conexões |
| ERR_LINK_CREATE | "Failed to create link" | Ao criar conexão |
| ERR_LINK_DELETE | "Failed to delete link" | Ao deletar conexão |
| ERR_LINK_UPDATE | "Failed to update link access" | Ao atualizar acesso |
| ERR_SEARCH | "Error searching entities" | Busca de entidades |
| ERR_INBOX_FETCH | "Failed to fetch items" | Ao carregar inbox |
| ERR_INBOX_CREATE | "Failed to create item" | Ao criar item |
| ERR_INBOX_UPDATE | "Failed to update item" | Ao atualizar item |
| ERR_INBOX_DELETE | "Failed to delete item" | Ao deletar item |
| ERR_CAPTURE | "Failed to capture" | Quick capture falhou |
| ERR_ANALYSIS | "Analysis failed" | AI não conseguiu analisar |
| ERR_CONVERT | "Conversion failed" | Conversão para entidade falhou |
| ERR_DISMISS | "Dismiss failed" | Arquivamento falhou |
| ERR_AUTH | "User not authenticated" | Sem autenticação |

### 1.2 Success Toasts (Verde/Success)

| ID | Mensagem | Contexto |
|----|----------|----------|
| SUC_LINK_CREATE | "Link created" | Conexão criada |
| SUC_CAPTURE | "Captured!" | Item capturado no inbox |
| SUC_CONVERT | "Converted successfully" | Item virou entidade |
| SUC_DISMISS | "Item dismissed" | Item arquivado |

### 1.3 Info/Warning Toasts (Amarelo/Warning)

| ID | Mensagem | Contexto |
|----|----------|----------|
| WARN_EXPIRING | "Connection expiring soon" | Link próximo de expirar |
| INFO_PROCESSING | "AI is analyzing..." | Processamento em andamento |

---

## 2. LOADING STATES

### 2.1 Spinners com Texto

| ID | Texto | Componente |
|----|-------|------------|
| LOAD_CONNECT | "Connecting..." | Link Modal |
| LOAD_SEARCH | "Searching..." | Search Input |
| LOAD_CAPTURE | "Capturing..." | Quick Capture |
| LOAD_ANALYZE | "Analyzing..." | Triage Modal |
| LOAD_CONVERT | "Converting..." | Triage Modal |
| LOAD_TRIAGE | "Triaging..." | Inbox List |
| LOAD_DELETE | "Deleting..." | Link/Item Row |
| LOAD_FETCH | "Loading..." | Listas em geral |

### 2.2 Skeleton States

- Inbox List: 3-5 skeleton cards
- Connection List: 2-3 skeleton rows
- Entity Search Results: skeleton dropdown items

---

## 3. EMPTY STATES

### 3.1 No Connections

```
┌─────────────────────────────────────┐
│                                     │
│         🔗 (ícone grande)           │
│                                     │
│     "No connections yet"            │
│                                     │
│  [ Create first connection ]        │
│                                     │
└─────────────────────────────────────┘
```

### 3.2 No Inbox Items

```
┌─────────────────────────────────────┐
│                                     │
│         📥 (ícone grande)           │
│                                     │
│      "Your inbox is empty"          │
│   "Capture thoughts, ideas, links"  │
│                                     │
│     [ Start capturing ]             │
│                                     │
└─────────────────────────────────────┘
```

### 3.3 No Search Results

```
┌─────────────────────────────────────┐
│                                     │
│         🔍 (ícone pequeno)          │
│                                     │
│     "No entities found"             │
│                                     │
└─────────────────────────────────────┘
```

---

## 4. CONFIRMATION DIALOGS

### 4.1 Delete Link Confirmation

```
┌─────────────────────────────────────┐
│  ⚠️ Delete Connection?              │
├─────────────────────────────────────┤
│                                     │
│  This will remove the link between  │
│  "[Entity A]" and "[Entity B]"      │
│                                     │
│  This action cannot be undone.      │
│                                     │
├─────────────────────────────────────┤
│         [ Cancel ]  [ Delete ]      │
└─────────────────────────────────────┘
```

### 4.2 Dismiss Inbox Item

```
┌─────────────────────────────────────┐
│  📥 Dismiss Item?                   │
├─────────────────────────────────────┤
│                                     │
│  "[Item title preview...]"          │
│                                     │
│  This will archive the item without │
│  converting it to an entity.        │
│                                     │
├─────────────────────────────────────┤
│        [ Cancel ]  [ Dismiss ]      │
└─────────────────────────────────────┘
```

---

## 5. STATUS BADGES

### 5.1 Inbox Item Status

| Status | Cor | Label |
|--------|-----|-------|
| `inbox` | Gray | "New" |
| `processing` | Yellow | "Processing" |
| `triaged` | Blue | "Triaged" |
| `converted` | Green | "Converted" |
| `archived` | Gray outline | "Archived" |

### 5.2 AI Suggestion Status

| Status | Cor | Label |
|--------|-----|-------|
| `pending` | Gray | "Pending" |
| `shown` | Blue | "Shown" |
| `accepted` | Green | "Accepted" |
| `dismissed` | Red outline | "Dismissed" |
| `snoozed` | Yellow | "Snoozed" |
| `expired` | Gray strikethrough | "Expired" |

### 5.3 Connection Count Badge

```
Connections [3]  ← número em pill/badge pequeno
```

---

## 6. FORM VALIDATION MESSAGES

### 6.1 Required Fields

| Campo | Mensagem |
|-------|----------|
| Title | "Title is required" |
| Content | "Content cannot be empty" |
| Entity | "Please select an entity" |
| Relationship | "Please select a relationship type" |

### 6.2 Format Validation

| Campo | Mensagem |
|-------|----------|
| Title | "Title must be less than 100 characters" |
| URL | "Please enter a valid URL" |

---

## 7. PLACEHOLDER & HELPER TEXT

### 7.1 Input Placeholders

| Input | Placeholder |
|-------|-------------|
| Quick Capture | "Capture anything... thought, idea, task, link" |
| Floating Capture | "Quick capture..." |
| Entity Search | "Search entities to link..." |
| Title Edit | "Enter title..." |

### 7.2 Helper Text (abaixo dos inputs)

| Input | Helper |
|-------|--------|
| Quick Capture | `Enter` to capture quickly |
| Floating Capture | `Enter` to capture • `Esc` to close |

---

## 8. AI FEEDBACK ELEMENTS

### 8.1 Confidence Indicator

```
┌─────────────────────────────────────┐
│  ✨ AI Suggestion          85%      │
│─────────────────────────────────────│
│                                     │
│  Suggested: Goal                    │
│  Category: Health                   │
│  Title: "Start daily meditation"    │
│                                     │
│  "Detected goal-related keywords    │
│   and actionable intent"            │
│                                     │
└─────────────────────────────────────┘
```

### 8.2 Confidence Levels

| Range | Visual | Label |
|-------|--------|-------|
| 90-100% | 🟢 Green | "High confidence" |
| 70-89% | 🟡 Yellow | "Medium confidence" |
| 50-69% | 🟠 Orange | "Low confidence" |
| <50% | 🔴 Red | "Very low - review needed" |

### 8.3 Extracted Data Display

```
Category: [Health]
Tags: #meditation #wellness #daily
```

---

## 9. INTERACTIVE STATES

### 9.1 Button States

| State | Visual |
|-------|--------|
| Default | Normal styling |
| Hover | Background/border color change |
| Active/Pressed | Darker background |
| Disabled | Opacity 50%, cursor not-allowed |
| Loading | Spinner + texto opaco |

### 9.2 Link Row States

| State | Visual |
|-------|--------|
| Default | Transparent background |
| Hover | `bg-surface-700` + delete button aparece |
| Deleting | Spinner no lugar do trash icon |

### 9.3 Expand/Collapse

```
Connections [5]
├── Link 1
├── Link 2
├── Link 3
└── Show 2 more ▼   ← collapsed

Connections [5]
├── Link 1
├── Link 2
├── Link 3
├── Link 4
├── Link 5
└── Show less ▲     ← expanded
```

---

## 10. MODULE COLOR CODING

### 10.1 Module Icons & Colors

| Module | Icon | Color Class |
|--------|------|-------------|
| Journey | 🎯 | `text-eximia-400` (accent) |
| Academy | 📚 | `text-blue-400` |
| Strategy | 🧭 | `text-purple-400` |
| Brand | 🎨 | `text-pink-400` |
| PrototypOS | ⚡ | `text-orange-400` |
| Inbox | 📥 | `text-yellow-400` |
| System | ⚙️ | `text-gray-400` |

### 10.2 Entity Type Pills

```
[🎯 Goal]  [📚 Book]  [⚡ Habit]  [💡 Idea]
```

---

## 11. RELATIONSHIP TYPES

### 11.1 Connection Relationship Labels

| Value | Display Label |
|-------|---------------|
| `supports` | "supports" |
| `related_to` | "related to" |
| `derived_from` | "derived from" |
| `parent_of` | "parent of" |
| `child_of` | "child of" |
| `blocks` | "blocks" |
| `blocked_by` | "blocked by" |
| `influences` | "influences" |

### 11.2 Direction Indicators

```
← from [Entity]     (incoming)
→ to [Entity]       (outgoing)
```

---

## 12. KEYBOARD SHORTCUTS DISPLAY

### 12.1 Kbd Styling

```css
/* Estilo padrão para teclas */
.kbd {
  padding: 2px 6px;
  font-size: 12px;
  background: surface-700;
  border: 1px solid surface-600;
  border-radius: 4px;
  font-family: monospace;
}
```

### 12.2 Shortcuts Exibidos

| Contexto | Shortcut | Ação |
|----------|----------|------|
| Quick Capture | `Enter` | Capturar |
| Floating Capture | `Enter` | Capturar |
| Floating Capture | `Esc` | Fechar |
| Modal | `Esc` | Fechar |

---

## 13. ANIMATIONS & TRANSITIONS

### 13.1 Spinners

- **Loader2 Icon**: `animate-spin` (rotação contínua)
- **Duração**: Enquanto loading state ativo

### 13.2 Success Feedback

- **Check Icon**: Aparece por 2 segundos
- **Transição**: Fade in → hold → fade out
- **Cor**: `text-green-400`

### 13.3 Dropdown/Expand

- **Chevron**: `rotate-180` quando expandido
- **Transition**: `transition-transform duration-200`

### 13.4 Hover Effects

- **Opacity**: `opacity-0` → `opacity-100` (delete button)
- **Background**: Suave transição de cor
- **Transition**: `transition-colors duration-150`

---

## 14. DESIGN TOKENS REFERENCE

### 14.1 Surface Colors (Dark Theme)

```
surface-900: Background principal
surface-800: Cards/Containers
surface-700: Hover states, inputs
surface-600: Borders, dividers
surface-500: Hover borders
```

### 14.2 Semantic Colors

```
eximia-400: Primary accent (brand)
eximia-500/50: Primary border (50% opacity)

green-400: Success
red-400: Error/Destructive
yellow-400: Warning
blue-400: Info
gray-400: Neutral/Disabled
```

### 14.3 Text Colors

```
white: Primary text
gray-400: Secondary text
gray-500: Tertiary/muted text
```

---

## 15. COMPONENT CHECKLIST

### Toasts/Notifications
- [ ] Error Toast (red)
- [ ] Success Toast (green)
- [ ] Warning Toast (yellow)
- [ ] Info Toast (blue)

### Loading
- [ ] Spinner component
- [ ] Skeleton loader
- [ ] Loading button state
- [ ] Full-screen loader

### Empty States
- [ ] No connections
- [ ] No inbox items
- [ ] No search results
- [ ] Generic empty state

### Dialogs
- [ ] Confirmation dialog (destructive)
- [ ] Confirmation dialog (neutral)
- [ ] Modal close behaviors (X, Esc, backdrop)

### Badges/Pills
- [ ] Status badges (5 statuses)
- [ ] Count badges
- [ ] Entity type pills
- [ ] Module color pills

### Form Elements
- [ ] Validation error state
- [ ] Helper text
- [ ] Disabled state
- [ ] Required indicator

### Interactive
- [ ] Hover states
- [ ] Active states
- [ ] Focus states
- [ ] Loading states

### AI Elements
- [ ] Confidence indicator
- [ ] Reasoning display
- [ ] Extracted data display
- [ ] Suggestion card

---

**Última atualização**: 2026-01-27
**Versão**: 1.0.0
**Módulo**: Connection Layer (BLOCO 1.1, 1.3, 2.1, 2.2)
