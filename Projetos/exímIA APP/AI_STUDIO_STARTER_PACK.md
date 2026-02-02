# ExímIA OS - AI Studio Starter Pack

> Cole este conteudo no AI Studio para comecar a desenvolver o visual.

---

## 1. SETUP INICIAL

### Dependencias (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Tailwind Config (tailwind.config.js)
```js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',  // Brand primary
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

### CSS Base (globals.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Theme Variables */
:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;
  --fg-primary: #0F172A;
  --fg-secondary: #475569;
  --border-primary: #E2E8F0;
}

.dark {
  --bg-primary: #09090B;
  --bg-secondary: #18181B;
  --fg-primary: #FAFAFA;
  --fg-secondary: #A1A1AA;
  --border-primary: #27272A;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Focus Ring */
*:focus-visible {
  outline: 2px solid #F59E0B;
  outline-offset: 2px;
}

/* Selection */
::selection {
  background-color: #FBBF24;
  color: #451A03;
}
```

---

## 2. FILOSOFIA VISUAL: "Soft Business"

### Principios
1. **Containment** - Tudo vive em "janelas" (WindowCard)
2. **Data Density** - Interfaces densas mas legíveis
3. **Stark Contrast** - Light usa Slate, Dark usa Zinc

### Paleta de Cores

| Uso | Light Mode | Dark Mode |
|-----|------------|-----------|
| **Background** | white | black |
| **Surface** | slate-50 | zinc-950 |
| **Surface Elevated** | slate-100 | zinc-900 |
| **Border** | slate-200 | zinc-800 |
| **Text Primary** | slate-900 | zinc-100 |
| **Text Secondary** | slate-600 | zinc-400 |
| **Text Muted** | slate-500 | zinc-500 |
| **Primary Action** | amber-500 | amber-400 |
| **Primary Text** | amber-950 | zinc-900 |

### Cores Semanticas
- **Success**: emerald-500 / emerald-400
- **Warning**: orange-500 / orange-400
- **Error**: rose-500 / rose-400
- **Info**: sky-500 / sky-400

---

## 3. COMPONENTES BASE

### WindowCard (Componente Principal)
```tsx
interface WindowCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

const WindowCard = ({ title, children, className = '', footer }: WindowCardProps) => (
  <div className={`
    group flex flex-col rounded-lg border overflow-hidden
    border-slate-200 dark:border-zinc-800
    bg-slate-50 dark:bg-zinc-950
    shadow-sm transition-all duration-300 hover:shadow-md
    ${className}
  `}>
    {/* Chrome Header */}
    <div className="h-10 px-4 flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900">
      {/* Traffic Lights (neutral) */}
      <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
      </div>
      {title && (
        <>
          <div className="h-4 w-px bg-slate-300 dark:bg-zinc-700 mx-2" />
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-500">
            {title}
          </span>
        </>
      )}
    </div>

    {/* Content */}
    <div className="flex-1 p-6">{children}</div>

    {/* Optional Footer */}
    {footer && (
      <div className="px-6 py-3 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
        {footer}
      </div>
    )}
  </div>
);
```

### Button
```tsx
// Variants
const buttonVariants = {
  primary: "bg-amber-500 hover:bg-amber-600 text-amber-950 dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-zinc-900",
  secondary: "bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 border border-slate-200 dark:border-zinc-700",
  ghost: "text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
  destructive: "bg-rose-500 hover:bg-rose-600 text-white",
};

const Button = ({ variant = 'primary', size = 'md', children, ...props }) => (
  <button
    className={`
      inline-flex items-center justify-center gap-2 rounded-md font-medium
      transition-all active:scale-[0.98]
      focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      ${size === 'sm' ? 'h-8 px-3 text-sm' : size === 'lg' ? 'h-12 px-6 text-base' : 'h-10 px-4 text-sm'}
      ${buttonVariants[variant]}
    `}
    {...props}
  >
    {children}
  </button>
);
```

### Input
```tsx
const Input = ({ label, error, ...props }) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">
        {label}
      </label>
    )}
    <input
      className={`
        w-full px-3 py-2 rounded-md text-sm
        bg-white dark:bg-zinc-900
        border ${error ? 'border-rose-500' : 'border-slate-300 dark:border-zinc-700'}
        placeholder-slate-400 dark:placeholder-zinc-500
        focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
        transition-all
      `}
      {...props}
    />
    {error && <p className="text-xs text-rose-500">{error}</p>}
  </div>
);
```

### Badge
```tsx
const badgeVariants = {
  default: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300",
  primary: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  destructive: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
};

const Badge = ({ variant = 'default', children }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeVariants[variant]}`}>
    {children}
  </span>
);
```

### NavItem
```tsx
const NavItem = ({ icon: Icon, label, active, badge, collapsed }) => (
  <button className={`
    w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all
    ${active
      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
      : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900'
    }
  `}>
    <Icon className={`w-4 h-4 ${active ? 'text-amber-500' : 'opacity-70'}`} />
    {!collapsed && (
      <>
        <span className="flex-1 text-left">{label}</span>
        {badge && <Badge variant="primary">{badge}</Badge>}
      </>
    )}
  </button>
);
```

---

## 4. LAYOUTS

### DashboardLayout
```
+------------------+----------------------------------------+
|                  |  Header (h-16)                         |
|     Sidebar      |  - Breadcrumb | Title | Actions        |
|     (w-60)       +----------------------------------------+
|                  |                                        |
|  - Logo          |  Content Area                          |
|  - Quick Action  |  (bg-white dark:bg-black)              |
|  - Nav Items     |                                        |
|  - Separator     |  +------------+ +------------+         |
|  - AI Agents     |  | MetricCard | | MetricCard |         |
|  - Footer        |  +------------+ +------------+         |
|    - Theme       |                                        |
|    - Settings    |  +----------------------------------+  |
|    - User        |  | WindowCard - Main Content        |  |
|                  |  +----------------------------------+  |
+------------------+----------------------------------------+
```

### Mobile Layout
```
+----------------------------------------+
|  Mobile Header (sticky)                |
|  [Logo] ExímIA OS              [Menu]  |
+----------------------------------------+
|                                        |
|  Content Area                          |
|  (padding-bottom for nav)              |
|                                        |
+----------------------------------------+
|  [Home] [Goals] [+] [Learn] [More]     |  <- BottomNav (fixed)
+----------------------------------------+
```

---

## 5. TELAS PARA DESENVOLVER

### 5.1 Dashboard (/dashboard)
```
Elementos:
- Greeting: "Bom dia, Hugo!"
- Subtitle: status do dia
- 4x MetricCards: Metas, Hábitos, Streak, Produtividade
- WindowCard: Hábitos de Hoje (checklist)
- WindowCard: Metas em Foco (2 GoalCards)
- WindowCard: Sugestões da IA
```

### 5.2 Goals (/journey/goals)
```
Elementos:
- Header: "Metas" + [+ Nova Meta]
- Filtros: [Todas] [Ativas] [Q1] [Q2]
- Grid de GoalCards
- GoalCard contém:
  - Badge prioridade (HIGH/MED/LOW)
  - Título + deadline
  - ProgressBar
  - Key Results (lista)
  - EntityLinks (conexões)
  - Meta info (owner, comments, attachments)
```

### 5.3 Inbox (/inbox)
```
Elementos:
- Header: "Inbox" + [+ Captura Rápida]
- Filtros: [Todos] [Texto] [Voz] [Links]
- Lista de InboxItems
- InboxItem contém:
  - Tipo (emoji)
  - Preview do conteúdo
  - Timestamp
  - Sugestão IA (destino + confiança)
  - Actions: [Aceitar] [Editar] [Arquivar]
```

### 5.4 Sidebar
```
Elementos:
- Logo: "E" amber-500 + "ExímIA OS"
- Quick Action: [+ Nova Meta]
- Nav Principal:
  - Dashboard
  - Goals (com badge)
  - Inbox (com badge)
  - Journey
  - Academy
  - Brand
  - PrototypOS
- Separator
- AI Agents:
  - Minds
  - Copilot
- Footer:
  - Theme Toggle (Appearance)
  - Settings
  - User Card (avatar + name + plan)
```

---

## 6. ESPECIFICACOES VISUAIS

### Tipografia
| Elemento | Size | Weight | Line Height |
|----------|------|--------|-------------|
| Display | 48px | Bold | 1.1 |
| H1 | 30px | Semibold | 1.2 |
| H2 | 24px | Semibold | 1.3 |
| Body | 16px | Regular | 1.5 |
| Label | 14px | Medium | 1.4 |
| Caption | 12px | Regular | 1.4 |

### Espacamento (Base 4px)
| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |

### Border Radius
| Token | Value |
|-------|-------|
| sm | 4px |
| md | 8px |
| lg | 12px |
| xl | 16px |
| full | 9999px |

### Shadows
```css
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

---

## 7. DARK/LIGHT MODE

### Toggle Implementation
```tsx
const [theme, setTheme] = useState('light');

useEffect(() => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [theme]);

// Button
<button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
  {theme === 'light' ? <Moon /> : <Sun />}
</button>
```

### Cores por Tema
```
Light:
- bg-white / bg-slate-50 / bg-slate-100
- text-slate-900 / text-slate-600 / text-slate-500
- border-slate-200

Dark:
- bg-black / bg-zinc-950 / bg-zinc-900
- text-zinc-100 / text-zinc-400 / text-zinc-500
- border-zinc-800
```

---

## 8. CHECKLIST DE DESENVOLVIMENTO

- [ ] Setup Tailwind com tema customizado
- [ ] Implementar toggle dark/light mode
- [ ] Criar WindowCard component
- [ ] Criar Button com variants
- [ ] Criar Input component
- [ ] Criar Badge component
- [ ] Criar NavItem component
- [ ] Layout: Sidebar completo
- [ ] Layout: Header com breadcrumb
- [ ] Layout: BottomNav mobile
- [ ] Tela: Dashboard
- [ ] Tela: Goals
- [ ] Tela: Inbox
- [ ] Responsividade mobile
- [ ] Testar dark mode em todas as telas

---

## 9. DICAS

1. **Comece pelo Sidebar** - É o elemento que define a estrutura
2. **Use WindowCard para tudo** - É o padrão visual principal
3. **Teste dark mode sempre** - Cada componente deve funcionar nos dois modos
4. **Mobile first** - Comece pelo mobile e expanda para desktop
5. **Amber é destaque** - Use com moderação para CTAs e estados ativos

---

*ExímIA OS Starter Pack v1.0*
*Pronto para AI Studio*
