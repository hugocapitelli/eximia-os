# Story EXIMIA-007: Templates e Layouts

**Story ID:** EXIMIA-007
**Epic:** EXIMIA-EPIC-002 (Design System Foundation)
**Sprint:** 2
**Pontos:** 8
**Prioridade:** P0 (Crítico)
**Depende de:** EXIMIA-006 (Organisms)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter Templates de layout prontos,
**Para que** eu possa criar novas páginas em minutos.

---

## Contexto

Templates são layouts estruturais sem conteúdo específico.
Definem a "casca" das páginas com slots para Organisms.

---

## Acceptance Criteria

### DashboardLayout
- [ ] Sidebar (collapsible)
- [ ] Header slot
- [ ] Metrics row slot (optional)
- [ ] Main content area
- [ ] Mobile: Drawer navigation
- [ ] Responsive breakpoints

### AuthLayout
- [ ] Centered card
- [ ] Logo
- [ ] Background pattern/gradient
- [ ] Footer links (terms, privacy)

### SettingsLayout
- [ ] Settings sidebar navigation
- [ ] Content area
- [ ] Section groups

### ModuleLayout
- [ ] Module-specific header
- [ ] Tab navigation (optional)
- [ ] Content area
- [ ] Sidebar (optional)

### OnboardingLayout
- [ ] Step indicator
- [ ] Content area
- [ ] Navigation (back/next)
- [ ] Skip option

---

## Technical Details

### DashboardLayout

```tsx
// src/components/templates/DashboardLayout/DashboardLayout.tsx
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/organisms/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`
        flex-1 flex flex-col overflow-hidden
        transition-all duration-300
      `}>
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="w-8 h-8 bg-eximia-400 rounded-lg flex items-center justify-center">
            <span className="font-bold text-zinc-900">E</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
```

### AuthLayout

```tsx
// src/components/templates/AuthLayout/AuthLayout.tsx
import { Logo } from "@/components/Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-eximia-400/10 to-transparent" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-eximia-400/5 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-4">
        {/* Logo */}
        <div className="mb-8">
          <Logo size="lg" />
        </div>

        {/* Card */}
        <div className="w-full max-w-md">
          {(title || subtitle) && (
            <div className="text-center mb-6">
              {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
              {subtitle && <p className="text-zinc-400 mt-2">{subtitle}</p>}
            </div>
          )}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-6 text-center">
        <div className="flex items-center justify-center gap-4 text-sm text-zinc-500">
          <a href="/terms" className="hover:text-white transition-colors">
            Termos de Uso
          </a>
          <span>•</span>
          <a href="/privacy" className="hover:text-white transition-colors">
            Privacidade
          </a>
          <span>•</span>
          <a href="/help" className="hover:text-white transition-colors">
            Ajuda
          </a>
        </div>
        <p className="mt-2 text-xs text-zinc-600">
          © 2026 ExímIA Ventures. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
```

### SettingsLayout

```tsx
// src/components/templates/SettingsLayout/SettingsLayout.tsx
import { NavItem, Icon } from "@/components/ui";

interface SettingsSection {
  title: string;
  items: {
    icon: string;
    label: string;
    href: string;
  }[];
}

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeHref?: string;
}

const settingsSections: SettingsSection[] = [
  {
    title: "Conta",
    items: [
      { icon: "User", label: "Perfil", href: "/settings/profile" },
      { icon: "Shield", label: "Segurança", href: "/settings/security" },
      { icon: "Bell", label: "Notificações", href: "/settings/notifications" },
    ],
  },
  {
    title: "Assinatura",
    items: [
      { icon: "CreditCard", label: "Plano & Faturamento", href: "/settings/billing" },
      { icon: "Zap", label: "Uso & Limites", href: "/settings/usage" },
    ],
  },
  {
    title: "Integrações",
    items: [
      { icon: "Plug", label: "Conexões", href: "/settings/connections" },
      { icon: "Key", label: "API Keys", href: "/settings/api" },
    ],
  },
  {
    title: "Preferências",
    items: [
      { icon: "Palette", label: "Aparência", href: "/settings/appearance" },
      { icon: "Globe", label: "Idioma & Região", href: "/settings/locale" },
      { icon: "Keyboard", label: "Atalhos", href: "/settings/shortcuts" },
    ],
  },
];

export function SettingsLayout({ children, activeHref }: SettingsLayoutProps) {
  return (
    <div className="flex h-full">
      {/* Settings Nav */}
      <aside className="w-64 border-r border-zinc-800 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Settings" size={24} className="text-zinc-400" />
          <h2 className="text-lg font-semibold text-white">Configurações</h2>
        </div>

        <nav className="space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItem
                    key={item.href}
                    icon={item.icon as any}
                    label={item.label}
                    href={item.href}
                    isActive={activeHref === item.href}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
```

### ModuleLayout

```tsx
// src/components/templates/ModuleLayout/ModuleLayout.tsx
import { Header } from "@/components/organisms/Header";
import { Tabs, TabList, TabTrigger, TabContent } from "@/components/ui";
import * as LucideIcons from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon?: keyof typeof LucideIcons;
}

interface ModuleLayoutProps {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  icon?: keyof typeof LucideIcons;
  description?: string;
  actions?: React.ReactNode;
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function ModuleLayout({
  breadcrumbs,
  title,
  icon,
  description,
  actions,
  tabs,
  activeTab,
  onTabChange,
  children,
  sidebar,
}: ModuleLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Header
        breadcrumbs={breadcrumbs}
        title={title}
        icon={icon}
        description={description}
        actions={actions}
      />

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="border-b border-zinc-800 px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium
                  border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? "border-eximia-400 text-eximia-400"
                    : "border-transparent text-zinc-400 hover:text-white"
                  }
                `}
              >
                {tab.icon && <LucideIcons[tab.icon] size={16} />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

        {/* Optional Sidebar */}
        {sidebar && (
          <aside className="w-80 border-l border-zinc-800 overflow-y-auto p-4">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
```

### OnboardingLayout

```tsx
// src/components/templates/OnboardingLayout/OnboardingLayout.tsx
import { Button, Icon } from "@/components/ui";
import { Logo } from "@/components/Logo";

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  showSkip?: boolean;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
}

export function OnboardingLayout({
  currentStep,
  totalSteps,
  stepTitle,
  children,
  onBack,
  onNext,
  onSkip,
  nextLabel = "Continuar",
  showSkip = true,
  isNextDisabled,
  isNextLoading,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-zinc-800">
        <Logo />

        {showSkip && onSkip && (
          <Button variant="ghost" onClick={onSkip}>
            Pular configuração
          </Button>
        )}
      </header>

      {/* Progress */}
      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-zinc-500">
              Passo {currentStep} de {totalSteps}
            </span>
            <span className="text-sm text-zinc-600">•</span>
            <span className="text-sm text-zinc-400">{stepTitle}</span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-eximia-400 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {currentStep > 1 ? (
            <Button variant="ghost" onClick={onBack}>
              <Icon name="ArrowLeft" size={16} />
              Voltar
            </Button>
          ) : (
            <div />
          )}

          <Button
            onClick={onNext}
            disabled={isNextDisabled}
            loading={isNextLoading}
          >
            {nextLabel}
            <Icon name="ArrowRight" size={16} />
          </Button>
        </div>
      </footer>
    </div>
  );
}
```

---

## Tasks

- [ ] Criar `DashboardLayout` com Sidebar responsive
- [ ] Criar `AuthLayout` com background pattern
- [ ] Criar `SettingsLayout` com nav sections
- [ ] Criar `ModuleLayout` com tabs support
- [ ] Criar `OnboardingLayout` com step progress
- [ ] Testar responsividade em todos breakpoints
- [ ] Atualizar exports em `components/templates/index.ts`

---

## Definition of Done

- [ ] 5 Templates implementados
- [ ] Mobile-first responsive
- [ ] Slots funcionando corretamente
- [ ] TypeScript sem erros
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/components/templates/
├── DashboardLayout/
│   ├── DashboardLayout.tsx   [CREATE]
│   └── index.ts              [CREATE]
├── AuthLayout/
│   ├── AuthLayout.tsx        [CREATE]
│   └── index.ts              [CREATE]
├── SettingsLayout/
│   ├── SettingsLayout.tsx    [CREATE]
│   └── index.ts              [CREATE]
├── ModuleLayout/
│   ├── ModuleLayout.tsx      [CREATE]
│   └── index.ts              [CREATE]
├── OnboardingLayout/
│   ├── OnboardingLayout.tsx  [CREATE]
│   └── index.ts              [CREATE]
└── index.ts                  [CREATE]
```

---

## Referências

- [PRD Design System - Templates](../../00_Core/PRD-Design-System-v5.0.md#6-templates)

---

**Story criada por River (SM)**
**Data:** 2026-01-29
