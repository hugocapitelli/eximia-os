# Minds - Main Page

## Visão Geral

**Módulo:** AI Playground / Minds
**Tela:** Minds Main (Lista de Minds)
**Prioridade:** P1
**Status:** Especificação Completa

**Propósito:** Lista de todos os AI Minds disponíveis — clones de personalidades, especialistas e mentores virtuais com os quais os usuários podem conversar e opcionalmente baixar arquivos associados.

---

## Wireframe Principal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🧠 MINDS                                            [🔍] [Filtros ▾]   │
│  Converse com mentores e especialistas virtuais                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 [Buscar por nome, especialidade ou tema...]                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📁 CATEGORIAS                                                    │   │
│  │                                                                  │   │
│  │  [Todos ✓] [Empreendedorismo] [Produtividade] [Liderança]       │   │
│  │  [Marketing] [Finanças] [Tecnologia] [Desenvolvimento Pessoal]  │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ⭐ MINDS EM DESTAQUE                                             │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │ ┌────────┐                                                │  │   │
│  │  │ │        │  🏆 DAVID GOGGINS                              │  │   │
│  │  │ │ [FOTO] │  "Can't Hurt Me" Author & Ultra-Athlete       │  │   │
│  │  │ │        │                                                │  │   │
│  │  │ └────────┘  🏷️ Disciplina • Mindset • Superação           │  │   │
│  │  │             📁 3 arquivos disponíveis                      │  │   │
│  │  │                                                           │  │   │
│  │  │  "Stay hard! A accountability mirror never lies."         │  │   │
│  │  │                                                           │  │   │
│  │  │  ⭐ 4.9 (234 conversas)          [💬 Conversar]           │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🧠 TODOS OS MINDS                                                │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  ┌────────────────────┐  ┌────────────────────┐                 │   │
│  │  │ ┌──────┐           │  │ ┌──────┐           │                 │   │
│  │  │ │ FOTO │           │  │ │ FOTO │           │                 │   │
│  │  │ └──────┘           │  │ └──────┘           │                 │   │
│  │  │ ELON MUSK          │  │ GARY HALBERT       │                 │   │
│  │  │ Visionary & Founder│  │ The Prince of Print│                 │   │
│  │  │                    │  │                    │                 │   │
│  │  │ 🏷️ Inovação        │  │ 🏷️ Copywriting    │                 │   │
│  │  │ 🏷️ Tecnologia      │  │ 🏷️ Vendas         │                 │   │
│  │  │                    │  │                    │                 │   │
│  │  │ 📁 5 arquivos      │  │ 📁 12 arquivos     │                 │   │
│  │  │                    │  │                    │                 │   │
│  │  │ ⭐ 4.8 (156 conv.) │  │ ⭐ 4.9 (89 conv.)  │                 │   │
│  │  │                    │  │                    │                 │   │
│  │  │ [💬 Conversar]     │  │ [💬 Conversar]     │                 │   │
│  │  └────────────────────┘  └────────────────────┘                 │   │
│  │                                                                  │   │
│  │  ┌────────────────────┐  ┌────────────────────┐                 │   │
│  │  │ ┌──────┐           │  │ ┌──────┐           │                 │   │
│  │  │ │ FOTO │           │  │ │ FOTO │           │                 │   │
│  │  │ └──────┘           │  │ └──────┘           │                 │   │
│  │  │ STEVE JOBS         │  │ ALEX HORMOZI       │                 │   │
│  │  │ Design & Innovation│  │ $100M Offers       │                 │   │
│  │  │                    │  │                    │                 │   │
│  │  │ 🏷️ Produto         │  │ 🏷️ Negócios       │                 │   │
│  │  │ 🏷️ Design          │  │ 🏷️ Vendas         │                 │   │
│  │  │                    │  │                    │                 │   │
│  │  │ 📁 8 arquivos      │  │ 📁 6 arquivos      │                 │   │
│  │  │                    │  │                    │                 │   │
│  │  │ ⭐ 4.7 (198 conv.) │  │ ⭐ 4.9 (267 conv.) │                 │   │
│  │  │                    │  │                    │                 │   │
│  │  │ [💬 Conversar]     │  │ [💬 Conversar]     │                 │   │
│  │  └────────────────────┘  └────────────────────┘                 │   │
│  │                                                                  │   │
│  │  ┌────────────────────┐  ┌────────────────────┐                 │   │
│  │  │ ┌──────┐           │  │ ┌──────┐           │                 │   │
│  │  │ │ FOTO │           │  │ │ FOTO │           │                 │   │
│  │  │ └──────┘           │  │ └──────┘           │                 │   │
│  │  │ DAVID OGILVY       │  │ RAY DALIO          │                 │   │
│  │  │ Father of Advertising│ │ Principles        │                 │   │
│  │  │                    │  │                    │                 │   │
│  │  │ 🏷️ Marketing       │  │ 🏷️ Investimentos  │                 │   │
│  │  │ 🏷️ Publicidade     │  │ 🏷️ Princípios     │                 │   │
│  │  │                    │  │                    │                 │   │
│  │  │ 📁 4 arquivos      │  │ 📁 2 arquivos      │                 │   │
│  │  │                    │  │                    │                 │   │
│  │  │ ⭐ 4.8 (72 conv.)  │  │ ⭐ 4.6 (45 conv.)  │                 │   │
│  │  │                    │  │                    │                 │   │
│  │  │ [💬 Conversar]     │  │ [💬 Conversar]     │                 │   │
│  │  └────────────────────┘  └────────────────────┘                 │   │
│  │                                                                  │   │
│  │  [Carregar mais Minds...]                                       │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📚 SEUS MINDS RECENTES                                           │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                         │   │
│  │  │ [GOGGINS]│ │ [HORMOZI]│ │ [JOBS]   │                         │   │
│  │  │ Ontem    │ │ 3 dias   │ │ 1 semana │                         │   │
│  │  │[Continuar│ │[Continuar│ │[Continuar│                         │   │
│  │  └──────────┘ └──────────┘ └──────────┘                         │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## TypeScript Interfaces

```typescript
type MindCategory =
  | 'entrepreneurship'
  | 'productivity'
  | 'leadership'
  | 'marketing'
  | 'finance'
  | 'technology'
  | 'personal_development'
  | 'sales'
  | 'copywriting'
  | 'investing';

interface Mind {
  id: string;
  name: string;
  title: string;                   // "Can't Hurt Me Author & Ultra-Athlete"
  bio: string;
  shortBio: string;

  // Visual
  avatarUrl: string;
  coverImageUrl?: string;

  // Categorization
  categories: MindCategory[];
  tags: string[];

  // Personality
  quote?: string;                  // Signature quote
  personality: MindPersonality;

  // Files & Resources
  hasFiles: boolean;
  filesCount: number;
  filesDownloadable: boolean;      // Admin setting

  // Stats
  conversationCount: number;
  rating: number;
  ratingCount: number;

  // Status
  status: 'active' | 'coming_soon' | 'maintenance';
  isFeatured: boolean;

  // Admin settings
  isPublic: boolean;

  // Meta
  createdAt: Date;
  updatedAt: Date;
}

interface MindPersonality {
  traits: string[];                // ["disciplined", "intense", "motivational"]
  communicationStyle: string;      // "Direct, challenging, uses military metaphors"
  expertise: string[];             // ["mental toughness", "endurance", "accountability"]
  signature: {
    greeting?: string;
    closingPhrase?: string;
    typicalPhrases?: string[];
  };
}

interface MindFile {
  id: string;
  mindId: string;
  name: string;
  description?: string;
  type: 'pdf' | 'audio' | 'video' | 'document' | 'other';
  mimeType: string;
  size: number;
  url: string;
  downloadable: boolean;           // Admin can control per file
  downloadCount: number;
  createdAt: Date;
}

interface MindConversation {
  id: string;
  mindId: string;
  userId: string;
  title?: string;
  lastMessageAt: Date;
  messageCount: number;
  createdAt: Date;
}

interface RecentMind {
  mind: Mind;
  lastConversation: MindConversation;
}

interface MindsPageData {
  featuredMind?: Mind;
  minds: Mind[];
  recentMinds: RecentMind[];
  categories: MindCategoryInfo[];
  filters: MindFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}

interface MindCategoryInfo {
  id: MindCategory;
  name: string;
  icon: string;
  count: number;
}

interface MindFilters {
  search?: string;
  categories?: MindCategory[];
  hasFiles?: boolean;
  sortBy?: 'popular' | 'recent' | 'rating' | 'name';
}
```

---

## Mind Card Component

```
┌────────────────────────────────┐
│ ┌──────────────┐               │
│ │              │               │
│ │    [FOTO]    │               │
│ │              │               │
│ └──────────────┘               │
│                                │
│ DAVID GOGGINS                  │  ← Nome (text-lg font-bold)
│ "Can't Hurt Me" Author         │  ← Título (text-sm text-muted)
│                                │
│ 🏷️ Disciplina • Mindset        │  ← Tags (badges)
│                                │
│ 📁 3 arquivos disponíveis      │  ← Info de arquivos (se houver)
│                                │
│ ⭐ 4.9 (234 conversas)         │  ← Rating e stats
│                                │
│ [💬 Conversar]                 │  ← CTA principal
│                                │
└────────────────────────────────┘
```

---

## Integração Connection Layer

```
Events Emitidos:
- minds.page.viewed
- minds.mind.clicked { mind_id }
- minds.conversation.started { mind_id }
- minds.filter.applied { filters }
- minds.search.performed { query }

Events Consumidos:
- journey.book.completed → Sugere Mind do autor (se disponível)
```

---

## Link com Journey Autores

Quando um Mind corresponde a um autor na biblioteca de livros:

```
┌─────────────────────────────────────────────────────────────────────┐
│  📚 Você está lendo "Can't Hurt Me" de David Goggins               │
│                                                                     │
│  [💬 Conversar com o Mind do David Goggins]                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Estados da UI

### Empty State (Sem Minds)
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                           🧠                                        │
│                                                                     │
│              Nenhum Mind disponível ainda                          │
│                                                                     │
│     Em breve você poderá conversar com mentores e                  │
│     especialistas virtuais.                                        │
│                                                                     │
│                      [Voltar ao Dashboard]                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Empty Search Results
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                           🔍                                        │
│                                                                     │
│              Nenhum Mind encontrado                                │
│                                                                     │
│     Tente buscar por outro nome ou categoria.                      │
│                                                                     │
│                      [Limpar Busca]                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Dados Mock (Referência)

**Localização:** `app/src/data/minds-mock.ts`

```typescript
export const MOCK_MINDS: Mind[] = [
  {
    id: 'mind_goggins',
    name: 'David Goggins',
    title: '"Can\'t Hurt Me" Author & Ultra-Athlete',
    bio: 'David Goggins is a retired Navy SEAL and the only member of the U.S. Armed Forces to complete SEAL training, Army Ranger School, and Air Force Tactical Air Controller training.',
    shortBio: 'Navy SEAL, Ultra-Marathon Runner, Motivational Speaker',
    avatarUrl: '/minds/goggins-avatar.jpg',
    categories: ['personal_development', 'productivity'],
    tags: ['Disciplina', 'Mindset', 'Superação', 'Accountability'],
    quote: 'Stay hard! The accountability mirror never lies.',
    personality: {
      traits: ['disciplined', 'intense', 'challenging', 'motivational'],
      communicationStyle: 'Direct, challenging, uses military metaphors',
      expertise: ['mental toughness', 'endurance', 'accountability', 'discipline'],
      signature: {
        greeting: 'What\'s up? Ready to get after it?',
        closingPhrase: 'Stay hard!',
        typicalPhrases: ['Who\'s gonna carry the boats?', 'The 40% rule', 'Accountability mirror'],
      },
    },
    hasFiles: true,
    filesCount: 3,
    filesDownloadable: true,
    conversationCount: 234,
    rating: 4.9,
    ratingCount: 234,
    status: 'active',
    isFeatured: true,
    isPublic: true,
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2026-01-20'),
  },
  // ... mais minds
];
```
