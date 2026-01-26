# Wireframes & PRPs - Automator Sales Engine
## Guia Completo para Geração de Telas no Google AI Studio

**Data:** 24/01/2026
**Versão:** 1.0
**Status:** ✅ Completo - Pronto para uso

---

## 📦 CONTEÚDO ENTREGUE

### Documentos Criados (9 arquivos)

| Arquivo | Descrição | Telas |
|:--------|:----------|:------|
| **MAPA_COMPLETO_TELAS.md** | Arquitetura completa do app | 20 telas |
| **PRP-01_Autenticacao.md** | Login, Signup, Password Reset | 4 telas |
| **PRP-02_Onboarding.md** | Tutorial interativo (4 steps) | 1 tela |
| **PRP-03_Dashboard.md** | Home com métricas e navegação | 1 tela |
| **PRP-04_Wizard_Diagnostico.md** | Wizard multi-step (4 etapas) | 4 telas |
| **PRP-05_Resultados.md** | ROI + Precificação + Gráficos | 1 tela |
| **PRP-06_Proposta.md** | Geração de PDF profissional | 1 tela |
| **PRP-07_Historico.md** | Lista de diagnósticos | 1 tela |
| **PRP-08_Configuracoes.md** | Perfil + Marca + Preferências | 4 telas |

**Total:** 9 PRPs cobrindo 20+ telas principais

---

## 🎯 COMO USAR NO GOOGLE AI STUDIO

### Método Recomendado: PRP por PRP

Para cada PRP, siga este fluxo no Google AI Studio (Gemini):

#### **Passo 1: Preparar o Prompt**

Cole o conteúdo completo do PRP no Google AI Studio com o seguinte prompt:

```
Você é um expert UI/UX designer especializado em criar interfaces modernas
para aplicações SaaS B2B.

Baseado no PRP (Product Requirement Prompt) abaixo, crie uma interface
moderna e profissional para a tela descrita.

Requisitos:
- Design system: ShadCN/UI + TailwindCSS
- Estilo: Limpo, minimalista, profissional
- Cores: Azul (#0066CC) como primária, Verde (#00CC66) como secundária
- Typography: Inter ou similar
- Responsive: Desktop-first, mas mobile-friendly
- Acessibilidade: WCAG AA

Gere o código completo em Next.js 15 + TypeScript + ShadCN/UI.

[COLE O CONTEÚDO DO PRP AQUI]
```

#### **Passo 2: Revisar Wireframes ASCII**

Antes de gerar, revise os wireframes ASCII no PRP para entender:
- Layout da tela
- Posicionamento de elementos
- Hierarquia visual
- Fluxos de interação

#### **Passo 3: Gerar Código**

Gemini irá gerar:
- Componente React completo
- Tipos TypeScript
- Validações Zod (se aplicável)
- Estilos TailwindCSS
- Integração Supabase (se aplicável)

#### **Passo 4: Trazer para Desenvolvimento**

Copie o código gerado e:
1. Crie arquivo na pasta correspondente
2. Ajuste imports/paths
3. Teste funcionamento
4. Itere se necessário

---

## 📐 ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

### **Phase 1: Core (MVP)**

Implemente nesta ordem para ter MVP funcional o mais rápido:

1. ✅ **PRP-01** → Autenticação (Login/Signup)
   - Permite criar usuários e acessar sistema
   - Tempo estimado: 2-3 dias

2. ✅ **PRP-03** → Dashboard
   - Home funcional com navegação
   - Tempo estimado: 1-2 dias

3. ✅ **PRP-04** → Wizard de Diagnóstico
   - Coração da aplicação (4 steps)
   - Tempo estimado: 4-5 dias

4. ✅ **PRP-05** → Resultados & Precificação
   - Mostra ROI calculado
   - Tempo estimado: 2-3 dias

5. ✅ **PRP-06** → Geração de Proposta
   - PDF profissional
   - Tempo estimado: 3-4 dias

**Total Phase 1:** 12-17 dias

### **Phase 2: Management**

6. ⚠️ **PRP-07** → Histórico
   - Listar todos diagnósticos
   - Tempo estimado: 2 dias

7. ⚠️ **PRP-08** → Configurações (básico)
   - Perfil + Marca/Logo
   - Tempo estimado: 2-3 dias

**Total Phase 2:** 4-5 dias

### **Phase 3: Polish**

8. 🔵 **PRP-02** → Onboarding Tutorial
   - Nice-to-have, melhora UX
   - Tempo estimado: 1-2 dias

9. 🔵 **PRP-08** (completo) → Preferências + Segurança
   - Features avançadas
   - Tempo estimado: 1-2 dias

**Total Phase 3:** 2-4 dias

---

## 🏗️ ESTRUTURA DO PROJETO (Sugestão)

```
automator-sales-engine/
├── app/
│   ├── (auth)/
│   │   ├── login/               ← PRP-01
│   │   ├── signup/              ← PRP-01
│   │   └── forgot-password/     ← PRP-01
│   ├── (onboarding)/
│   │   └── tutorial/            ← PRP-02
│   ├── (dashboard)/
│   │   ├── page.tsx             ← PRP-03 (Dashboard)
│   │   ├── novo/                ← PRP-04 (Wizard)
│   │   ├── diagnostico/[id]/
│   │   │   ├── resultados/      ← PRP-05
│   │   │   └── proposta/        ← PRP-06
│   │   ├── historico/           ← PRP-07
│   │   └── configuracoes/       ← PRP-08
│   └── layout.tsx
├── components/
│   ├── ui/                      ← ShadCN components
│   ├── forms/                   ← Form components
│   ├── charts/                  ← Recharts wrappers
│   └── layout/
│       ├── Sidebar.tsx
│       ├── TopBar.tsx
│       └── UserMenu.tsx
├── lib/
│   ├── supabase.ts              ← Supabase client
│   ├── auth.ts                  ← Auth helpers
│   └── validators.ts            ← Zod schemas
└── types/
    └── database.types.ts        ← Supabase types
```

---

## 🎨 DESIGN TOKENS (Usar em Todas as Telas)

### Cores

```css
--primary: #0066CC;       /* Azul principal */
--primary-dark: #0052A3;
--primary-light: #3399FF;

--secondary: #00CC66;     /* Verde secundário */
--secondary-dark: #00A352;
--secondary-light: #33FF99;

--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;

--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### Typography

```css
--font-primary: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
```

### Spacing

```css
--space-1: 0.25rem;      /* 4px */
--space-2: 0.5rem;       /* 8px */
--space-3: 0.75rem;      /* 12px */
--space-4: 1rem;         /* 16px */
--space-5: 1.25rem;      /* 20px */
--space-6: 1.5rem;       /* 24px */
--space-8: 2rem;         /* 32px */
--space-10: 2.5rem;      /* 40px */
--space-12: 3rem;        /* 48px */
--space-16: 4rem;        /* 64px */
```

### Border Radius

```css
--radius-sm: 0.25rem;    /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;
```

---

## 🔧 DEPENDÊNCIAS NECESSÁRIAS

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/auth-helpers-nextjs": "^0.10.0",

    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.344.0",

    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",

    "recharts": "^2.10.0",
    "@react-pdf/renderer": "^3.4.0",

    "date-fns": "^3.3.0",
    "react-hot-toast": "^2.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0"
  }
}
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após implementar cada tela, valide:

### Funcionalidade
- [ ] Todos os campos validam corretamente
- [ ] Botões executam ações esperadas
- [ ] Navegação entre telas funciona
- [ ] Estados de loading aparecem
- [ ] Mensagens de erro são claras
- [ ] Toast notifications funcionam

### Design
- [ ] Cores seguem design tokens
- [ ] Typography consistente
- [ ] Spacing consistente (8px grid)
- [ ] Hover/focus states visíveis
- [ ] Ícones corretos (Lucide)

### Responsividade
- [ ] Desktop (>1024px) funciona
- [ ] Tablet (768-1024px) funciona
- [ ] Mobile (<768px) funciona
- [ ] Sidebar adapta corretamente
- [ ] Forms são usáveis em mobile

### Acessibilidade
- [ ] Tab navigation funciona
- [ ] Labels associados a inputs
- [ ] Contraste WCAG AA (4.5:1)
- [ ] Erros anunciados por screen readers
- [ ] Botões têm aria-labels quando necessário

### Performance
- [ ] Imagens otimizadas (Next/Image)
- [ ] Componentes não re-renderizam desnecessariamente
- [ ] Debounce em buscas/autocomplete
- [ ] Loading states evitam layout shift

---

## 📚 RECURSOS ÚTEIS

### Documentação
- [Next.js 15 Docs](https://nextjs.org/docs)
- [ShadCN/UI](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Recharts](https://recharts.org/)
- [React-PDF](https://react-pdf.org/)

### Ferramentas
- [Figma](https://figma.com) → Para ajustar designs
- [Lucide Icons](https://lucide.dev/) → Todos os ícones
- [Coolors](https://coolors.co/) → Paleta de cores
- [Realtime Colors](https://realtimecolors.com/) → Preview cores

---

## 🎯 PRÓXIMOS PASSOS

1. **Leia o PRD v2.0** completo para entender o contexto
2. **Comece por PRP-01** (Autenticação)
3. **Use Google AI Studio** (Gemini) para gerar cada tela
4. **Implemente fase por fase** (não tente fazer tudo de uma vez)
5. **Teste cada tela** antes de seguir para próxima
6. **Itere baseado em feedback** real de usuários

---

## 🤝 SUPORTE

Se tiver dúvidas ou precisar de ajustes nos PRPs:

1. Releia o PRP específico (contém TODOS os detalhes)
2. Verifique os wireframes ASCII (mostram layout exato)
3. Consulte os critérios de aceite (validação)
4. Revise o schema database (estrutura de dados)

**Todos os PRPs foram criados para serem auto-suficientes e prontos para uso no Google AI Studio.**

---

**Status:** ✅ Completo e Pronto para Uso
**Última Atualização:** 24/01/2026
**Criado por:** Claude Code (eximIA.OS)
**Versão:** 1.0
