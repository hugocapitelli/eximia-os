
import { Clone, NavItem, DesignSystem, Goal, Habit, Book, Author, AcademyCourse, AcademyLesson, Achievement, Skill, BrandIdentityData, InboxItem, CourseBlueprint, TeamMember, Department, UserDirective, AcademyTrack, ContentItem, SourceItem, HiringJob, HiringCandidate, OnboardingProcess, OnboardingTrack, PerformanceGoal, PerformanceFeedback, PerformanceReviewCycle, Ritual, RitualTemplate, RitualActionItem } from './types';
import { 
  BookOpen, 
  Brain, 
  Palette, 
  PenTool, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Settings, 
  GraduationCap,
  Layout,
  Target,
  Compass,
  CheckCircle2, 
  Library,
  Zap,
  Award,
  Flame,
  MessageSquare,
  FileImage,
  Type,
  Mic,
  Code,
  Inbox,
  PenSquare,
  Wallet,
  PieChart,
  CreditCard,
  AlertTriangle,
  Crosshair,
  Map,
  Flag,
  Bot,
  UserCog,
  Briefcase,
  Terminal,
  Cpu,
  Rocket,
  ShieldCheck,
  Search,
  Smartphone,
  Mail,
  Video,
  FileText,
  Clock,
  LayoutDashboard,
  Network,
  Bell,
  Sparkles,
  LogOut,
  Calendar,
  Coffee,
  Repeat
} from 'lucide-react';

// ... (Existing Clones Data remains unchanged)
export const CLONES: Clone[] = [
  {
    id: '1',
    name: 'Gary Halbert',
    avatarUrl: 'GH',
    domain: 'COPYWRITING',
    description: 'The Prince of Print. Lenda do direct response copywriting. Especialista em cartas de vendas emocionais e alta conversão.',
    tags: ['Sales Letters', 'Direct Response', 'Storytelling'],
    status: 'active',
    tier: 'Tier 1',
    rating: 5,
  },
  {
    id: '2',
    name: 'Elon Musk',
    avatarUrl: 'EM',
    domain: 'STRATEGY',
    description: 'CEO da Tesla e SpaceX. Especialista em primeiros princípios, engenharia extrema e estratégia de longo prazo.',
    tags: ['First Principles', 'Innovation', 'Scale'],
    status: 'active',
    tier: 'Tier 1',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Abilio Diniz',
    avatarUrl: 'AD',
    domain: 'BUSINESS STRATEGY',
    description: 'Empresário brasileiro, ex-presidente do Grupo Pão de Açúcar. Conhecido pela grande capacidade e acurácia estratégica.',
    tags: ['Management', 'Leadership', 'Retail'],
    status: 'active',
    tier: 'Tier 1',
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Alan Nicolas',
    avatarUrl: 'AN',
    domain: 'ARQUITETO COGNITIVO',
    role: 'Arquiteto de Sistemas Cognitivos',
    description: 'Sistema Relleda escalável para manufatura de clones. Sistema único de IA com escalabilidade e capacidade de design.',
    tags: ['AI Architecture', 'Product', 'Systems'],
    status: 'active',
    tier: 'Tier 1',
    rating: 5.0,
  },
  {
    id: '5',
    name: 'Alex Hormozi',
    avatarUrl: 'AH',
    domain: 'BUSINESS STRATEGY',
    role: 'Empresário & Investidor',
    description: 'Empresário por excelência e criador de ofertas irresistíveis. Especialista em branding, aquisição e escala.',
    tags: ['Offers', 'Acquisition', 'Scale'],
    status: 'active',
    tier: 'Tier 1',
    rating: 4.7,
    stats: {
        apexScore: 8.5,
        neuralData: 9,
        topSkill: { name: 'Business Strategy', level: 5 }
    },
    dna: {
        sliders: [
            { label: 'Nível de Provocação', value: 85, leftLabel: 'Conforto', rightLabel: 'Crise' },
            { label: 'Temperatura da Verdade', value: 95, leftLabel: 'Aconselhamento', rightLabel: 'Humilhação' },
            { label: 'Validar vs Desafiar', value: 70, leftLabel: 'Validar', rightLabel: 'Desafiar' },
            { label: 'Densidade', value: 80, leftLabel: 'Conciso', rightLabel: 'Detalhado' },
        ],
        powerWords: ['Extraordinário', 'Al First', 'Escalar', 'Legado', 'F*da-se o medíocre', 'Engrenagem'],
        archetype: {
            name: 'ENTJ - The Commander',
            description: 'Comandante Natural com profundidade emocional de O Realizador',
            quote: '"O Comandante Natural com profundidade emocional de O Realizador"'
        },
        operationalMode: {
            title: 'Instalação de SO Mental',
            description: '"O Governante Rebelde"'
        },
        traits: [
            { title: 'Energy Cycles', type: 'Non-Linear', description: 'Picos de Hiperfoco (8h+) vs Vales de Recuperação. Não espere consistência 9-5.' },
            { title: 'Redundancy Allergy', type: 'Critical', description: 'Rejeição imediata de inputs repetitivos. Interações devem avançar em Profundidade ou Precisão.' },
            { title: 'Clarity First', type: 'Absolute', description: 'Alinhamento Interno > Dados Externos. "Se há dúvida, é não".' },
            { title: 'Selective Procrastination', type: 'Filter', description: 'Adia tarefas desalinhadas como sinal de defesa da "Zona de Genialidade".' }
        ]
    }
  },
  {
    id: '6',
    name: 'Andrej Karpathy',
    avatarUrl: 'AK',
    domain: 'PROGRAMMING',
    description: 'Ex-diretor de IA da Tesla, co-fundador da OpenAI. Arquiteto de multimodelo e redes neurais profundas.',
    tags: ['Deep Learning', 'Vision', 'LLMs'],
    status: 'wip',
    tier: 'Tier 1',
    rating: 4.5,
  },
  {
    id: '7',
    name: 'David Kolb',
    avatarUrl: 'LEARNING DESIGN',
    domain: 'EDUCATION',
    description: 'Teórico educacional americano. Desenvolveu o ciclo de aprendizagem experiencial e estilos de aprendizagem.',
    tags: ['Education', 'Andragogy', 'Frameworks'],
    status: 'active',
    tier: 'Tier 1',
    rating: 4.8,
  },
  {
    id: '8',
    name: 'David Ogilvy',
    avatarUrl: 'DO',
    domain: 'COPYWRITING',
    description: 'O pai da publicidade. Focado em pesquisa meticulosa, criatividade disciplinada e resultados de vendas.',
    tags: ['Advertising', 'Research', 'Headlines'],
    status: 'active',
    tier: 'Tier 1',
    rating: 4.9,
  }
];

// ... (Navigation Data remains unchanged)
export const NAV_ITEMS_PERSONAL: NavItem[] = [
  {
    id: 'inbox',
    label: 'Inbox',
    icon: Inbox,
    isActive: true,
  },
  {
    id: 'journey',
    label: 'Journey',
    icon: Compass,
    subItems: [
      { id: 'journey-dashboard', label: 'Dashboard' },
      { id: 'journey-goals', label: 'Metas (Goals)' },
      { id: 'journey-habits', label: 'Hábitos' },
      { id: 'journey-calendar', label: 'Calendário' },
    ]
  },
  {
    id: 'biblioteca',
    label: 'Biblioteca',
    icon: Library,
  },
  {
    id: 'academy-dashboard',
    label: 'Academy',
    icon: GraduationCap,
  }
];

export const NAV_ITEMS_BUSINESS: NavItem[] = [
  {
    id: 'strategy',
    label: 'Strategy',
    icon: Crosshair,
    subItems: [
      { id: 'strategy-dashboard', label: 'Dashboard' },
      { id: 'strategy-cycles', label: 'Ciclos & OKRs' },
      { id: 'strategy-initiatives', label: 'Iniciativas' },
      { id: 'strategy-kpis', label: 'KPIs' },
      { id: 'strategy-roadmap', label: 'Roadmap' },
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: Wallet,
    subItems: [
      { id: 'finance-dashboard', label: 'Dashboard' },
      { id: 'finance-revenues', label: 'Receitas' },
      { id: 'finance-expenses', label: 'Despesas' },
      { id: 'finance-projections', label: 'Projeções' },
      { id: 'finance-saas', label: 'SaaS Metrics' },
      { id: 'finance-reports', label: 'Relatórios' },
    ]
  },
  {
    id: 'sales',
    label: 'Vendas & Clientes',
    icon: DollarSign,
    subItems: [
      { id: 'sales-ai', label: 'Sales AI' },
      { id: 'crm', label: 'CRM' },
    ]
  },
  {
    id: 'team',
    label: 'Equipe & Cultura',
    icon: Users,
    subItems: [
      { id: 'team-dashboard', label: 'Dashboard' },
      { id: 'team-org', label: 'Organograma' },
      { id: 'team-members', label: 'Membros' },
      { id: 'team-hiring', label: 'Hiring' },
      { id: 'team-onboarding', label: 'Onboarding' },
      { id: 'team-performance', label: 'Performance' },
      { id: 'team-rituals', label: 'Rituais' },
      { id: 'team-culture', label: 'Cultura' },
      { id: 'team-comms', label: 'Comunicação' },
      { id: 'team-management', label: 'Gestão de Usuários' }, 
    ]
  }
];

export const NAV_ITEMS_CREATIVE: NavItem[] = [
  {
    id: 'prototypos',
    label: 'PrototypOS',
    icon: Code,
    subItems: [
      { id: 'ds-library', label: 'DS Library' },
      { id: 'ds-viewer', label: 'Viewer' },
    ]
  },
  {
    id: 'identity',
    label: 'Identidade & Marca',
    icon: Palette,
    subItems: [
      { id: 'brand-dashboard', label: 'Dashboard' },
      { id: 'brand-visual', label: 'Identidade Visual' },
      { id: 'brand-voice', label: 'Voz & Mensagem' },
      { id: 'brand-assets', label: 'Biblioteca de Assets' },
    ]
  },
  {
    id: 'content',
    label: 'Criação & Conteúdo',
    icon: PenTool,
    subItems: [
      { id: 'content-dashboard', label: 'Dashboard' },
      { id: 'content-courses', label: 'Course Creator' },
      { id: 'content-curator', label: 'Curador[IA]' },
      { id: 'content-ebooks', label: 'Ebook Generator' },
      { id: 'content-social', label: 'Social Media' },
      { id: 'content-newsletter', label: 'Newsletter Builder' },
      { id: 'content-videos', label: 'Vídeo Scripts' },
      { id: 'content-copies', label: 'Copy Bank' },
    ]
  }
];

export const NAV_ITEMS_AI: NavItem[] = [
  {
    id: 'synthetic-minds',
    label: 'Minds',
    icon: Brain,
  }
];

// Admin Navigation (PM1-006)
export const NAV_ITEMS_ADMIN: NavItem[] = [
  {
    id: 'admin-academy-studio',
    label: 'Academy Studio',
    icon: GraduationCap,
    subItems: [
      { id: 'admin-courses', label: 'Gerenciar Cursos' },
      { id: 'admin-tracks', label: 'Gerenciar Trilhas' },
      { id: 'admin-carousel', label: 'Hero Carousel' },
    ]
  },
  {
    id: 'admin-library-editor',
    label: 'Library Editor',
    icon: Library,
    subItems: [
      { id: 'admin-books', label: 'Gerenciar Livros' },
      { id: 'admin-authors', label: 'Gerenciar Autores' },
    ]
  },
  {
    id: 'admin-ds-manager',
    label: 'DS Manager',
    icon: Layout,
    subItems: [
      { id: 'admin-components', label: 'Componentes' },
      { id: 'admin-tokens', label: 'Tokens' },
    ]
  },
  {
    id: 'admin-settings',
    label: 'Configurações',
    icon: Settings,
  }
];

export const NAV_ITEMS_CORE = [...NAV_ITEMS_PERSONAL, ...NAV_ITEMS_BUSINESS, ...NAV_ITEMS_CREATIVE];
export const NAV_ITEMS = [...NAV_ITEMS_CORE, ...NAV_ITEMS_AI];

export const APP_MODULES = [
    { id: 'strategy', label: 'Strategy', description: 'Acesso total ao Strategy Hub e ciclos.' },
    { id: 'finance', label: 'Finance', description: 'Visualização de contas e transações.' },
    { id: 'sales', label: 'Vendas & CRM', description: 'Gestão de clientes e pipeline.' },
    { id: 'team', label: 'Equipe & Cultura', description: 'Visualização e gestão de membros.' },
    { id: 'prototypos', label: 'PrototypOS', description: 'Acesso à biblioteca de Design System.' },
    { id: 'identity', label: 'Identidade & Marca', description: 'Gestão de assets da marca.' },
    { id: 'content', label: 'Criação', description: 'Editor de cursos e conteúdo.' },
    { id: 'ai', label: 'AI Playground', description: 'Acesso às Mentes Sintéticas.' },
];

// ... (Other data remains unchanged)
export const STRATEGY_CYCLES = [
  {
    id: 'c1',
    title: 'Q1 2026: The Foundation',
    type: 'Trimestral',
    status: 'active',
    progress: 35,
    health: 'on_track',
    startDate: '01 Jan 2026',
    endDate: '31 Mar 2026',
    vision: 'Estabelecer a infraestrutura core do ExímIA OS e validar PMF com 100 usuários beta.',
  }
];

export const STRATEGY_INITIATIVES = [
  {
    id: 'i1',
    cycleId: 'c1',
    title: 'Lançar MVP ExímIA OS',
    owner: 'Hugo Capitelli',
    priority: 'must_have',
    status: 'in_progress',
    progress: 45,
    kpi: 'WAU > 100',
    deadline: '28 Fev',
  },
  {
    id: 'i2',
    cycleId: 'c1',
    title: 'Validar Academy Socrática',
    owner: 'Alan Nicolas',
    priority: 'should_have',
    status: 'planned',
    progress: 10,
    kpi: 'Completion Rate > 40%',
    deadline: '15 Mar',
  },
  {
    id: 'i3',
    cycleId: 'c1',
    title: 'Estruturar Connection Layer',
    owner: 'Tech Team',
    priority: 'must_have',
    status: 'attention',
    progress: 20,
    kpi: 'Event Bus Latency < 100ms',
    deadline: '30 Jan',
  }
];

export const FINANCE_ACCOUNTS = [
  { id: '1', workspace: 'personal', name: 'Nubank Principal', balance: 12450.00, type: 'bank', bankColor: 'bg-purple-600' },
  { id: '2', workspace: 'personal', name: 'Reserva XP', balance: 45000.00, type: 'investment', bankColor: 'bg-zinc-800' },
  { id: '3', workspace: 'business', name: 'Inter PJ', balance: 85200.50, type: 'bank', bankColor: 'bg-orange-500' },
  { id: '4', workspace: 'business', name: 'Cora', balance: 1200.00, type: 'bank', bankColor: 'bg-pink-500' },
];

export const FINANCE_CARDS = [
  { id: '1', workspace: 'personal', name: 'Ultravioleta', limit: 25000, current: 4500, closingDay: 5, color: 'bg-purple-900' },
  { id: '2', workspace: 'business', name: 'Amex Business', limit: 50000, current: 12800, closingDay: 15, color: 'bg-zinc-600' },
];

export const FINANCE_TRANSACTIONS = [
  { id: 't1', title: 'Pagamento AWS', amount: -450.00, date: 'Hoje', category: 'Infraestrutura', workspace: 'business' },
  { id: 't2', title: 'Supermercado', amount: -850.20, date: 'Hoje', category: 'Alimentação', workspace: 'personal' },
  { id: 't3', title: 'Entrada Cliente X', amount: 15000.00, date: 'Ontem', category: 'Vendas', workspace: 'business' },
  { id: 't4', title: 'Spotify', amount: -21.90, date: 'Ontem', category: 'Assinaturas', workspace: 'personal' },
  { id: 't5', title: 'Uber', amount: -45.00, date: '12 Jan', category: 'Transporte', workspace: 'personal' },
];

export const FINANCE_INSIGHTS = [
  { 
    id: 'i1', 
    type: 'warning', 
    title: 'Gasto acima da média', 
    message: 'Você gastou 2x mais em "Alimentação" este mês comparado à média dos últimos 3 meses.', 
    action: 'Ver Detalhes',
    workspace: 'personal'
  },
  { 
    id: 'i2', 
    type: 'alert', 
    title: 'Limite MEI Próximo', 
    message: 'Atenção: Sua receita anual atingiu 78% do limite MEI. Considere migrar para ME.', 
    action: 'Simular Impostos',
    workspace: 'business'
  },
  { 
    id: 'i3', 
    type: 'info', 
    title: 'Projeção de Fluxo', 
    message: 'Baseado nos seus recebíveis, você terá um superávit de R$ 12k no fim do mês.', 
    action: 'Investir',
    workspace: 'business'
  }
];

// ... (Course Data remains unchanged)
export const MOCK_BLUEPRINT: CourseBlueprint = {
  metadata: {
    title: "Vibecoding - Criação de Apps Sem Código com IA",
    targetAudience: "Empreendedores e Criadores (No-Code)",
    totalDuration: "12 horas (3 módulos)",
    frameworkMix: ["Action_Mapping", "Kolb_6_Stage", "Backward_Design", "Gagnes_9_Events"]
  },
  qualityScore: {
    overall: 92.5,
    rating: 'EXCELLENT',
    dimensions: {
      alignment: 100,
      bloomProgression: 100,
      elcCompleteness: 100,
      durationOptimization: 90,
      cognitiveLoad: 85
    }
  },
  modules: [
    {
      moduleNumber: 1,
      title: "DO ZERO AO PRIMEIRO APP",
      durationHours: 4,
      objectives: ["Criar app funcional", "Entender lógica no-code"],
      problemMotor: {
        title: "Ideia na Cabeça, App na Mão",
        scenario: "Você precisa validar uma ideia de startup em 24h sem gastar com desenvolvedores.",
        tension: "Velocidade vs Funcionalidade",
        deliverable: "MVP Publicado"
      },
      elcStructure: []
    },
    {
      moduleNumber: 2,
      title: "ARSENAL NO-CODE",
      durationHours: 4,
      objectives: ["Integrar APIs", "Automação de workflows"],
      problemMotor: {
        title: "Escalando Operações",
        scenario: "Seu app ganhou tração e o processo manual quebrou. Automatize ou morra.",
        tension: "Scale vs Chaos",
        deliverable: "Workflow Automatizado"
      },
      elcStructure: [] 
    },
    {
      moduleNumber: 3,
      title: "MONETIZAÇÃO E LANÇAMENTO",
      durationHours: 4,
      objectives: ["Configurar pagamentos", "Estratégia de Go-to-market"],
      problemMotor: {
        title: "Do Hobby ao Business",
        scenario: "Você tem usuários, mas não tem receita. Implemente um paywall que converta.",
        tension: "Freemium vs Premium",
        deliverable: "Checkout Funcional"
      },
      elcStructure: [] 
    }
  ]
};

export const MOCK_COURSES_LIST = [
  {
    id: 'c1',
    title: 'Vibecoding - Criação de Apps Sem Código com IA',
    modules: 3,
    lessons: 7,
    status: 'PRODUZINDO',
    progress: 0,
    lastUpdated: '12/12/2025',
    author: 'Alan Nicolas',
    tags: ['technical'],
    icon: Code
  },
  {
    id: 'c2',
    title: 'Supabase do Zero: Backend Completo sem Escrever Backend',
    modules: 13,
    lessons: 59,
    status: 'PRODUZINDO',
    progress: 0,
    lastUpdated: '12/12/2025',
    author: 'Alan Nicolas',
    tags: ['technical'],
    icon: BookOpen
  },
  {
    id: 'c3',
    title: 'Prompt Engineering - Arquitetura de Agentes Executivos',
    modules: 5,
    lessons: 24,
    status: 'VALIDAÇÃO',
    progress: 75,
    lastUpdated: '10/12/2025',
    author: 'Alan Nicolas',
    tags: ['AI', 'strategic'],
    icon: Brain
  },
  {
    id: 'c4',
    title: 'Design Systems for Scale',
    modules: 8,
    lessons: 32,
    status: 'PUBLICADO',
    progress: 100,
    lastUpdated: '05/11/2025',
    author: 'Alan Nicolas',
    tags: ['design'],
    icon: Palette
  }
];

export const INBOX_ITEMS: InboxItem[] = [
  {
    id: '1',
    type: 'text',
    content: "Ler livro 'Inspired' do Marty Cagan e aplicar conceitos de discovery",
    timestamp: "Há 2 horas",
    status: 'pending',
    aiSuggestion: {
      targetModule: "Journey",
      targetType: "Book",
      confidence: 95,
      reason: "Identificado intenção de leitura e título de obra."
    }
  },
  {
    id: '2',
    type: 'voice',
    content: "Ideia para novo módulo de networking no ExímIA OS. Precisamos conectar os alunos baseados em skill match.",
    audioDuration: "00:45",
    timestamp: "Há 4 horas",
    status: 'pending',
    aiSuggestion: {
      targetModule: "Strategy",
      targetType: "Initiative",
      confidence: 82,
      reason: "Palavras-chave: 'Ideia', 'módulo', 'novo'."
    }
  },
  {
    id: '3',
    type: 'link',
    content: "https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice",
    previewUrl: "YC Library",
    timestamp: "Ontem",
    status: 'pending',
    aiSuggestion: {
      targetModule: "Academy",
      targetType: "Resource",
      confidence: 78,
      reason: "Link educacional detectado."
    }
  },
  {
    id: '4',
    type: 'text',
    content: "Agendar reunião com time de design para revisar o Design System ExímIA",
    timestamp: "Ontem",
    status: 'pending',
    aiSuggestion: {
      targetModule: "Journey",
      targetType: "Task",
      confidence: 88,
      reason: "Verbo de ação 'Agendar' indica tarefa."
    }
  }
];

export const JOURNEY_GOALS: Goal[] = [
  { id: '1', title: 'Lançar MVP ExímIA Finance', scope: 'Quarterly', status: 'in_progress', progress: 35, deadline: '30 Mar 2026', category: 'Business' },
  { id: '2', title: 'Ler 24 livros em 2026', scope: 'Yearly', status: 'in_progress', progress: 12, deadline: '31 Dez 2026', category: 'Personal' },
  { id: '3', title: 'Atingir 15% de gordura corporal', scope: 'Quarterly', status: 'in_progress', progress: 60, deadline: '15 Abr 2026', category: 'Health' },
  { id: '4', title: 'Criar Fundo de Emergência', scope: 'Yearly', status: 'completed', progress: 100, deadline: 'Jan 2026', category: 'Finance' },
];

export const JOURNEY_HABITS: Habit[] = [
  { id: '1', name: 'Meditação (15min)', streak: 45, completedToday: false, frequency: 'daily', time: '07:00' },
  { id: '2', name: 'Leitura Profunda (30min)', streak: 12, completedToday: false, frequency: 'daily', time: '20:00' },
  { id: '3', name: 'Treino de Força', streak: 4, completedToday: true, frequency: 'weekly', time: '18:00' },
  { id: '4', name: 'Revisão Semanal', streak: 15, completedToday: false, frequency: 'weekly' },
];

export const JOURNEY_BOOKS: Book[] = [
  { id: '1', title: 'Admirável Mundo Novo', author: 'Aldous Huxley', status: 'to_read', progress: 0, category: 'Ficção', isDraft: false, description: 'Um clássico distópico sobre o futuro da sociedade.' },
  { id: '2', title: 'Os Anjos Bons Da Nossa Natureza', author: 'Steven Pinker', status: 'reading', progress: 15, currentPage: 120, totalPage: 800, category: 'Psicologia', isDraft: false, description: 'Por que a violência diminuiu.' },
  { id: '3', title: 'Deep Work', author: 'Cal Newport', status: 'reading', progress: 45, totalPage: 304, currentPage: 136, category: 'Produtividade' },
  { id: '4', title: 'Inspired', author: 'Marty Cagan', status: 'reading', progress: 12, totalPage: 368, currentPage: 44, category: 'Produto' },
  { id: '5', title: 'Antifragile', author: 'Nassim Taleb', status: 'to_read', progress: 0, category: 'Filosofia' },
  { id: '6', title: 'Atomic Habits', author: 'James Clear', status: 'completed', progress: 100, category: 'Produtividade' },
];

// ... (Academy Data unchanged)
export const ACADEMY_COURSES: AcademyCourse[] = [
  {
    id: 'prospectando-clientes',
    title: 'Prospectando Clientes',
    description: 'Estratégias avançadas de outbound e inbound para gerar pipeline qualificado.',
    level: 'Intermediário',
    duration: '9 aulas',
    lessonsCount: 9,
    category: 'Vendas',
    progress: 35,
    isEnrolled: true,
    isFavorite: true,
    coverColor: 'bg-[#0f172a]', // Dark Slate
    skills: ['Outbound', 'Inbound', 'CRM'],
  },
  {
    id: 'fechando-contratos',
    title: 'Fechando contratos de Alto Ticket',
    description: 'A arte de negociar e fechar deals de 6 dígitos com confiança.',
    level: 'Avançado',
    duration: '8 aulas',
    lessonsCount: 8,
    category: 'Vendas',
    progress: 0,
    isEnrolled: false,
    coverColor: 'bg-[#1e1b4b]', // Dark Indigo
    skills: ['Negotiation', 'High Ticket', 'Closing'],
  },
  {
    id: 'vibecoding',
    title: 'Vibecoding - Criação de Apps Sem Código com IA',
    description: 'Desenvolva aplicações completas usando apenas linguagem natural e ferramentas no-code.',
    level: 'Iniciante',
    duration: '7 aulas',
    lessonsCount: 7,
    category: 'Programação',
    progress: 0,
    isEnrolled: false,
    isFavorite: true,
    coverColor: 'bg-[#020617]', // Deep Blue/Black
    skills: ['No-Code', 'AI Development', 'Prototyping'],
  },
  {
    id: 'growth-101',
    title: 'Growth Hacking',
    description: 'Estratégias de crescimento rápido, loops virais e otimização de funil.',
    level: 'Intermediário',
    duration: '10 aulas',
    lessonsCount: 10,
    category: 'Marketing',
    progress: 0,
    isEnrolled: false,
    coverColor: 'bg-[#2e1065]', // Deep Purple
    skills: ['A/B Testing', 'Funnel Optimization', 'Viral Loops'],
  },
  {
    id: 'ai-prompting',
    title: 'Engenharia de Prompt Avançada',
    description: 'Como extrair o máximo dos LLMs modernos. Chain-of-thought, Few-shot e automação.',
    level: 'Avançado',
    duration: '5 aulas',
    lessonsCount: 5,
    category: 'AI',
    progress: 0,
    isEnrolled: false,
    coverColor: 'bg-[#4a044e]', // Deep Fucshia
    skills: ['Prompt Engineering', 'LLMs', 'Automation'],
  },
  {
    id: 'sys-design',
    title: 'System Design for Scale',
    description: 'Arquitetura de sistemas distribuídos, escalabilidade e trade-offs.',
    level: 'Avançado',
    duration: '15 aulas',
    lessonsCount: 15,
    category: 'Programação',
    progress: 0,
    isEnrolled: false,
    coverColor: 'bg-[#0f172a]',
    skills: ['Architecture', 'Microservices', 'Database Design'],
  },
];

export const ACADEMY_LESSONS: AcademyLesson[] = [
  {
    id: 'l1',
    courseId: 'pm-101',
    title: 'O Mindset do Product Manager',
    order: 1,
    content: `
      # Introdução ao Product Management

      Product Management não é sobre gerenciar tarefas, é sobre **gerenciar riscos e valor**.
      
      Muitos acreditam que o papel do PM é definir *como* algo deve ser construído. Na verdade, o papel do PM é definir *o que* deve ser construído e, mais importante, *por que*.

      ## Os 4 Grandes Riscos
      Segundo Marty Cagan, existem quatro riscos principais que devemos mitigar:
      1. **Risco de Valor**: As pessoas vão comprar/escolher usar?
      2. **Risco de Usabilidade**: As pessoas vão conseguir usar?
      3. **Risco de Viabilidade**: Podemos construir isso com a tecnologia/tempo/dinheiro que temos?
      4. **Risco de Negócio**: Isso funciona para o nosso negócio? (Legal, vendas, finanças, etc.)

      Nesta lição, vamos explorar como você identifica esses riscos antes de escrever uma única linha de código.
    `,
    durationMinutes: 45,
    status: 'completed',
  },
  {
    id: 'l2',
    courseId: 'pm-101',
    title: 'Discovery & Validação',
    order: 2,
    content: `
      # Discovery Contínuo

      A fase de Discovery serve para separar as ideias boas das ruins. A verdade dura é que a maioria das nossas ideias não vai funcionar. E as que funcionarem, vão precisar de várias iterações.

      ## Jobs to be Done (JTBD)
      As pessoas não compram produtos; elas "contratam" produtos para fazer um "trabalho" em suas vidas. 
      
      > "As pessoas não querem uma broca de 1/4 de polegada. Elas querem um furo de 1/4 de polegada." - Theodore Levitt

      Entender o "Job" é crucial para não criar soluções para problemas que não existem.
    `,
    durationMinutes: 60,
    status: 'unlocked',
  },
  {
    id: 'l3',
    courseId: 'pm-101',
    title: 'Definindo o MVP',
    order: 3,
    content: 'Conteúdo bloqueado.',
    durationMinutes: 50,
    status: 'locked',
  }
];

export const ACADEMY_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'First Step', description: 'Complete sua primeira lição.', icon: Zap, status: 'unlocked', unlockedAt: '12 Jan 2026' },
  { id: '2', title: 'Deep Thinker', description: 'Tenha 5 insights validados pela IA.', icon: Brain, status: 'unlocked', progress: 5, unlockedAt: '15 Jan 2026' },
  { id: '3', title: 'Scholar', description: 'Mantenha um streak de 7 dias.', icon: Flame, status: 'unlocked', progress: 12, unlockedAt: '20 Jan 2026' },
  { id: '4', title: 'Socratic Master', description: 'Complete 3 diálogos socráticos sem dicas.', icon: MessageSquare, status: 'locked', progress: 1 },
  { id: '5', title: 'Course Finisher', description: 'Complete um curso inteiro.', icon: Award, status: 'locked', progress: 35 },
];

export const ACADEMY_SKILLS: Skill[] = [
  { name: 'Product Discovery', level: 45, category: 'Product' },
  { name: 'Strategic Thinking', level: 30, category: 'Business' },
  { name: 'System Architecture', level: 10, category: 'Engineering' },
  { name: 'Leadership', level: 15, category: 'Management' },
];

// Featured Courses for Hero Carousel (PM1-001)
export const FEATURED_COURSES_IDS = ['vibecoding', 'ai-prompting', 'prospectando-clientes'];

export const ACADEMY_TRACKS: AcademyTrack[] = [
    { 
        id: 't1', 
        title: 'Full Stack Engineer 2026', 
        description: 'Domine o desenvolvimento moderno com React, Next.js, AI Integration e System Design.',
        courseCount: 12,
        completedCount: 2,
        icon: Code,
        color: 'from-blue-500 to-cyan-500'
    },
    { 
        id: 't2', 
        title: 'AI Product Architect', 
        description: 'Aprenda a arquitetar produtos que têm IA no core, desde o discovery até o deploy.',
        courseCount: 8,
        completedCount: 0,
        icon: Brain,
        color: 'from-purple-500 to-pink-500'
    },
    { 
        id: 't3', 
        title: 'Growth & Sales Mastery', 
        description: 'Estratégias avançadas de aquisição, retenção e vendas de alto ticket.',
        courseCount: 6,
        completedCount: 1,
        icon: Rocket,
        color: 'from-amber-500 to-orange-500'
    }
];

// ... (Brand, DS, Team data remains unchanged)
export const BRAND_IDENTITY: BrandIdentityData = {
  name: "ExímIA OS",
  tagline: "Unleash Your Legacy.",
  mission: "Unir e potencializar pessoas lendárias com IA para construírem soluções e negócios que imortalizem seu legado.",
  vision: "Ser referência global em educação de IA generativa aplicada a negócios.",
  values: ["Consistent Containment", "Data Density", "Stark Contrast", "Minimal Chrome"],
  archetypes: [
    { name: "Rebelde", percentage: 50, description: "Desafiar o status quo e recusar a mediocridade." },
    { name: "Mago", percentage: 30, description: "Transformar realidade e conhecimento em revolução." },
    { name: "Sábio", percentage: 20, description: "Buscar a verdade através da transparência radical." }
  ],
  tones: [
    { attribute: "Formalidade", value: 30, leftLabel: "Casual", rightLabel: "Formal" },
    { attribute: "Humor", value: 20, leftLabel: "Sério", rightLabel: "Divertido" },
    { attribute: "Emoção", value: 80, leftLabel: "Racional", rightLabel: "Emocional" },
    { attribute: "Direção", value: 90, leftLabel: "Indireto", rightLabel: "Direto" },
  ],
  palettes: [
    {
      name: "Primary",
      colors: [
        { name: "ExímIA Gold", hex: "#FDBF68", usage: "Primary Action" },
        { name: "Surface Dark", hex: "#09090B", usage: "Background" },
        { name: "Text Light", hex: "#FAFAFA", usage: "Typography" }
      ]
    },
    {
      name: "Semantic",
      colors: [
        { name: "Success", hex: "#22C55E", usage: "Confirmation" },
        { name: "Error", hex: "#EF4444", usage: "Destructive" },
        { name: "Warning", hex: "#F59E0B", usage: "Alerts" }
      ]
    }
  ],
  assets: [
    { id: 'a1', name: 'Logo Full Vector', type: 'logo', category: 'Identity', url: '#', status: 'approved', size: '1.2 MB', updatedAt: '2 days ago' },
    { id: 'a2', name: 'Social Media Kit', type: 'image', category: 'Social', url: '#', status: 'approved', size: '15 MB', updatedAt: '1 week ago' },
    { id: 'a3', name: 'Presentation Template', type: 'document', category: 'Office', url: '#', status: 'review', size: '4.5 MB', updatedAt: 'Yesterday' },
    { id: 'a4', name: 'Brand Manifesto Video', type: 'video', category: 'Marketing', url: '#', status: 'draft', size: '120 MB', updatedAt: '3 hours ago' },
    { id: 'a5', name: 'Inter Font Family', type: 'font', category: 'Typography', url: '#', status: 'approved', size: '2 MB', updatedAt: '1 month ago' },
  ]
};

export const DESIGN_SYSTEMS: DesignSystem[] = [
  {
    id: 'eximia-os-v6',
    name: 'ExímIA OS v6 (Official)',
    description: 'The definitive Single Source of Truth for ExímIA OS. Based on Atomic Design methodology and the Academy visual language.',
    version: '6.0.0',
    author: 'ExímIA Design Team',
    category: 'Core System',
    tags: ['Atomic Design', 'Dark Mode', 'Official', 'Academy Style'],
    use_cases: ['All Modules', 'Dashboard', 'Landing Pages', 'Apps'],
    tech_stack: ['React', 'Tailwind CSS', 'Framer Motion', 'Lucide Icons'],
    philosophy: 'Absolute Consistency. Deep Dark Aesthetics. Precision.',
    identity: {
        mission: 'Provide a unified, scalable, and high-performance design language for all ExímIA products.',
        vision: 'A seamless, immersive experience that feels like a premium desktop OS on the web.',
        archetypes: [
            { name: 'Ruler', description: 'Control, structure, and stability.' },
            { name: 'Magician', description: 'Transformation and visionary interfaces.' },
            { name: 'Sage', description: 'Clarity and data density.' }
        ]
    },
    tokens: {
        colors: {
            primary: { name: 'ExímIA Gold', hex: '#FDBF68', usage: 'Primary Actions, Highlights' },
            scale: [
                { name: 'Surface 0 (Deepest)', hex: '#000000', usage: 'Page Background' },
                { name: 'Surface 1', hex: '#050505', usage: 'Main Background' },
                { name: 'Surface 2', hex: '#0A0A0A', usage: 'Cards, Modals' },
                { name: 'Surface 3', hex: '#121214', usage: 'Inputs, Hovers' },
                { name: 'Border', hex: '#1F1F22', usage: 'Separators, Outlines' },
                { name: 'Text Primary', hex: '#FAFAFA', usage: 'Headings' },
                { name: 'Text Secondary', hex: '#A1A1AA', usage: 'Body Text' },
                { name: 'Text Tertiary', hex: '#52525B', usage: 'Disabled, Placeholders' },
            ],
            semantic: [
                { name: 'Success', hex: '#10B981', usage: 'Validation' },
                { name: 'Warning', hex: '#F59E0B', usage: 'Alerts' },
                { name: 'Error', hex: '#EF4444', usage: 'Destructive' },
                { name: 'Info', hex: '#3B82F6', usage: 'Information' },
            ]
        },
        typography: [
            { role: 'Display', font: 'Inter', weight: '700', size: '3rem', lineHeight: '1.1', sample: 'Hero Title' },
            { role: 'H1', font: 'Inter', weight: '600', size: '1.875rem', lineHeight: '1.2', sample: 'Page Title' },
            { role: 'H2', font: 'Inter', weight: '600', size: '1.5rem', lineHeight: '1.3', sample: 'Section Title' },
            { role: 'H3', font: 'Inter', weight: '500', size: '1.25rem', lineHeight: '1.4', sample: 'Card Title' },
            { role: 'Body', font: 'Inter', weight: '400', size: '1rem', lineHeight: '1.5', sample: 'Standard UI text.' },
            { role: 'Body Serif', font: 'Source Serif 4', weight: '400', size: '1.125rem', lineHeight: '1.6', sample: 'Reading content.' },
            { role: 'Caption', font: 'JetBrains Mono', weight: '500', size: '0.75rem', lineHeight: '1.5', sample: 'METADATA' },
        ],
        spacing: [
            { name: '2px', value: '0.125rem', variable: 'gap-0.5' },
            { name: '4px', value: '0.25rem', variable: 'gap-1' },
            { name: '8px', value: '0.5rem', variable: 'gap-2' },
            { name: '16px', value: '1rem', variable: 'gap-4' },
            { name: '24px', value: '1.5rem', variable: 'gap-6' },
            { name: '32px', value: '2rem', variable: 'gap-8' },
            { name: '48px', value: '3rem', variable: 'gap-12' },
            { name: '64px', value: '4rem', variable: 'gap-16' },
        ],
        radius: [
            { name: 'sm', value: '4px', variable: 'rounded-sm' },
            { name: 'md', value: '8px', variable: 'rounded-md' },
            { name: 'lg', value: '12px', variable: 'rounded-xl' },
            { name: 'xl', value: '16px', variable: 'rounded-2xl' },
            { name: 'full', value: '9999px', variable: 'rounded-full' },
        ]
    },
    components: [
        { id: 'button', name: 'Button', type: 'Atom', status: 'Stable', description: 'Primary, Secondary, Ghost variants. Strict padding and radius.' },
        { id: 'badge', name: 'Badge', type: 'Atom', status: 'Stable', description: 'Status indicators with subtle borders.' },
        { id: 'input', name: 'Input', type: 'Atom', status: 'Stable', description: 'Dark background form fields.' },
        { id: 'card', name: 'Card', type: 'Molecule', status: 'Stable', description: 'Container with #0A0A0A bg and #1F1F22 border.' },
        { id: 'sidebar', name: 'Sidebar', type: 'Organism', status: 'Stable', description: 'Collapsible navigation structure.' },
        { id: 'page-header', name: 'Page Header', type: 'Organism', status: 'Stable', description: 'Standardized title area with actions.' },
    ]
  },
];

export const DEPARTMENTS: Department[] = [
  { id: 'dep1', name: 'Product', headcount: 8, budgetUtilization: 75, lead: 'Alan Nicolas' },
  { id: 'dep2', name: 'Engineering', headcount: 12, budgetUtilization: 90, lead: 'Andrej K.' },
  { id: 'dep3', name: 'Marketing', headcount: 5, budgetUtilization: 45, lead: 'Gary H.' },
  { id: 'dep4', name: 'Operations', headcount: 4, budgetUtilization: 60, lead: 'Hugo C.' },
];

export const TEAM_MEMBERS: TeamMember[] = [
  { 
    id: 't1', 
    name: 'Alan Nicolas', 
    role: 'CEO & Founder', 
    department: 'Executive', 
    status: 'Focus', 
    avatarInitials: 'AN', 
    performance: 98, 
    cultureFit: 100, 
    projects: 5,
    accountType: 'Admin', 
    permissions: ['strategy', 'finance', 'sales', 'team', 'prototypos', 'identity', 'content', 'ai'],
    email: 'alan@eximia.os',
    location: 'São Paulo, BR',
    timezone: 'GMT-3',
    startDate: '15/01/2020',
    skills: [
        { name: 'Leadership', level: 3, category: 'Soft' },
        { name: 'Strategy', level: 3, category: 'Hard' },
        { name: 'Product Vision', level: 3, category: 'Hard' }
    ]
  },
  { 
    id: 't2', 
    name: 'Hugo Capitelli', 
    role: 'COO', 
    department: 'Operations', 
    status: 'Online', 
    avatarInitials: 'HC', 
    performance: 95, 
    cultureFit: 98, 
    projects: 8,
    accountType: 'Admin', 
    permissions: ['strategy', 'finance', 'sales', 'team', 'content'],
    email: 'hugo@eximia.os',
    location: 'São Paulo, BR',
    timezone: 'GMT-3',
    startDate: '10/02/2020',
    skills: [
        { name: 'Operations', level: 3, category: 'Hard' },
        { name: 'Process Design', level: 3, category: 'Hard' },
        { name: 'Team Management', level: 3, category: 'Soft' }
    ]
  },
  { 
    id: 't3', 
    name: 'Andrej Karpathy', 
    role: 'CTO', 
    department: 'Engineering', 
    status: 'Online', 
    avatarInitials: 'AK', 
    performance: 99, 
    cultureFit: 90, 
    projects: 3,
    accountType: 'Admin', 
    permissions: ['strategy', 'prototypos', 'ai'],
    email: 'andrej@eximia.os',
    location: 'San Francisco, US',
    timezone: 'GMT-8',
    startDate: '01/06/2023',
    skills: [
        { name: 'Deep Learning', level: 3, category: 'Hard' },
        { name: 'System Architecture', level: 3, category: 'Hard' },
        { name: 'Python', level: 3, category: 'Hard' }
    ]
  },
  { 
    id: 't4', 
    name: 'Gary Halbert', 
    role: 'Head of Copy', 
    department: 'Marketing', 
    status: 'In Meeting', 
    avatarInitials: 'GH', 
    performance: 92, 
    cultureFit: 85, 
    projects: 4,
    accountType: 'Member', 
    permissions: ['content', 'identity', 'sales'],
    email: 'gary@eximia.os',
    location: 'Miami, US',
    timezone: 'GMT-5',
    startDate: '15/03/2024',
    skills: [
        { name: 'Copywriting', level: 3, category: 'Hard' },
        { name: 'Direct Response', level: 3, category: 'Hard' }
    ]
  },
  { 
    id: 't5', 
    name: 'Sarah Designer', 
    role: 'Product Designer', 
    department: 'Product', 
    status: 'Offline', 
    avatarInitials: 'SD', 
    performance: 88, 
    cultureFit: 95, 
    projects: 6,
    accountType: 'Member', 
    permissions: ['prototypos', 'identity', 'content'],
    email: 'sarah@eximia.os',
    location: 'Remote',
    timezone: 'GMT-3',
    startDate: '20/08/2024',
    skills: [
        { name: 'UI Design', level: 2, category: 'Hard' },
        { name: 'Figma', level: 3, category: 'Hard' },
        { name: 'Prototyping', level: 2, category: 'Hard' }
    ],
    // Example rich data matching "Maria Silva" from spec
    goals: [
        { 
            id: 'g1', title: 'Lançar v2.0 do Design System', status: 'completed', progress: 100, period: 'Q4 2025',
            keyResults: [{ text: 'Definir tokens', status: 'completed' }, { text: 'Documentar componentes', status: 'completed' }]
        },
        { 
            id: 'g2', title: 'Reduzir inconsistências visuais', status: 'in_progress', progress: 65, period: 'Q1 2026',
            keyResults: [{ text: 'Audit de telas', status: 'completed' }, { text: 'Implementar linting', status: 'pending' }]
        }
    ],
    feedbacks: [
        { id: 'f1', date: '15/01/2026', type: 'Review', author: 'Alan Nicolas', content: 'Excelente trabalho na migração para o novo DS. A velocidade de entrega aumentou consideravelmente.', rating: 5 },
        { id: 'f2', date: '10/12/2025', type: 'Praise', author: 'Mike Dev', content: 'Os novos componentes estão muito fáceis de implementar. Obrigado pela documentação clara!' }
    ],
    timeline: [
        { id: 'tl1', date: '15/01/2026', type: 'achievement', title: 'Goal Concluído: DS v2.0' },
        { id: 'tl2', date: '10/01/2026', type: 'review', title: 'Performance Review Q4 (5/5)' },
        { id: 'tl3', date: '20/08/2024', type: 'hiring', title: 'Início na ExímIA' }
    ]
  },
  { 
    id: 't6', 
    name: 'Mike Dev', 
    role: 'Frontend Lead', 
    department: 'Engineering', 
    status: 'Focus', 
    avatarInitials: 'MD', 
    performance: 94, 
    cultureFit: 92, 
    projects: 5,
    accountType: 'Member', 
    permissions: ['prototypos', 'ai'],
    email: 'mike@eximia.os',
    location: 'London, UK',
    timezone: 'GMT+0',
    startDate: '11/11/2023',
    skills: [
        { name: 'React', level: 3, category: 'Hard' },
        { name: 'Performance', level: 2, category: 'Hard' }
    ]
  },
  { 
    id: 't7', 
    name: 'Julia Ops', 
    role: 'Ops Manager', 
    department: 'Operations', 
    status: 'Online', 
    avatarInitials: 'JO', 
    performance: 90, 
    cultureFit: 96, 
    projects: 7,
    accountType: 'Member', 
    permissions: ['finance', 'team'],
    email: 'julia@eximia.os',
    location: 'Remote',
    startDate: '05/05/2022',
    skills: [
        { name: 'Project Management', level: 3, category: 'Hard' },
        { name: 'Communication', level: 3, category: 'Soft' }
    ]
  },
  { 
    id: 't8', 
    name: 'David Growth', 
    role: 'Growth Hacker', 
    department: 'Marketing', 
    status: 'In Meeting', 
    avatarInitials: 'DG', 
    performance: 85, 
    cultureFit: 88, 
    projects: 2,
    accountType: 'Member', 
    permissions: ['sales', 'strategy'],
    email: 'david@eximia.os',
    location: 'Remote',
    startDate: '01/09/2025',
    skills: [
        { name: 'SEO', level: 2, category: 'Hard' },
        { name: 'Analytics', level: 2, category: 'Hard' }
    ]
  },
];

export const MOCK_DIRECTIVES: UserDirective[] = [
  { id: 'd1', userId: 't4', type: 'feedback', content: 'Focar mais em hooks emocionais nas próximas campanhas de e-mail.', priority: 'high', createdAt: '2026-01-24', createdBy: 'Alan Nicolas', status: 'active' },
  { id: 'd2', userId: 't4', type: 'task', content: 'Revisar a copy da Landing Page do produto X até sexta-feira.', priority: 'medium', createdAt: '2026-01-25', createdBy: 'Hugo Capitelli', status: 'active' },
  { id: 'd3', userId: 't5', type: 'alignment', content: 'Alinhamento sobre o uso do novo Design System nas telas de Checkout.', priority: 'high', createdAt: '2026-01-20', createdBy: 'Alan Nicolas', status: 'active' },
  { id: 'd4', userId: 't6', type: 'note', content: 'Demonstrou grande proatividade na resolução do bug da API.', priority: 'low', createdAt: '2026-01-22', createdBy: 'Andrej Karpathy', status: 'completed' },
];

export const CONTENT_METRICS = [
  { id: 'm1', label: 'Em Produção', value: 12, icon: PenTool, color: 'text-amber-500' },
  { id: 'm2', label: 'Publicados', value: 45, icon: CheckCircle2, color: 'text-emerald-500' },
  { id: 'm3', label: 'Views (7d)', value: '2.3K', icon: TrendingUp, color: 'text-blue-500' },
  { id: 'm4', label: 'Agendados', value: 8, icon: Clock, color: 'text-purple-500' },
];

export const CONTENT_PIPELINE = [
  { id: 'p1', stage: 'Briefing', count: 3 },
  { id: 'p2', stage: 'Pesquisa', count: 2 },
  { id: 'p3', stage: 'Geração IA', count: 5 },
  { id: 'p4', stage: 'Revisão', count: 4 },
  { id: 'p5', stage: 'Agendado', count: 8 },
];

export const RECENT_CONTENT: ContentItem[] = [
  { id: 'c1', type: 'course', title: 'Fundamentos de Copywriting', status: 'in_review', updatedAt: '2h atrás', progress: 85 },
  { id: 'c2', type: 'post', title: '5 erros de empreendedores', status: 'scheduled', platform: 'LinkedIn', updatedAt: '5h atrás' },
  { id: 'c3', type: 'ebook', title: 'Guia do Empreendedor', status: 'draft', updatedAt: '1d atrás', progress: 20 },
  { id: 'c4', type: 'newsletter', title: 'O Futuro do No-Code', status: 'published', updatedAt: '2d atrás' },
  { id: 'c5', type: 'video', title: 'Tutorial Supabase', status: 'draft', updatedAt: '3d atrás' },
];

export const SOURCE_ITEMS: SourceItem[] = [
  { id: 's1', type: 'youtube', title: 'Como Construir uma Marca Pessoal - Gary Vee', metadata: '45 min', tags: ['marca', 'marketing'], insightsCount: 5, dateImported: '2 dias atrás' },
  { id: 's2', type: 'pdf', title: 'The Mom Test - Rob Fitzpatrick', metadata: '180 pgs', tags: ['validação', 'startup'], insightsCount: 12, dateImported: '1 semana atrás' },
  { id: 's3', type: 'url', title: 'Paul Graham: Do Things that Don\'t Scale', metadata: 'Artigo', tags: ['startups', 'growth'], insightsCount: 8, dateImported: 'Ontem' },
];

// --- Hiring Mock Data ---

export const HIRING_JOBS: HiringJob[] = [
  {
    id: 'j1',
    title: 'Product Manager',
    department: 'Produto',
    location: 'Remoto',
    type: 'Full-time',
    openDays: 15,
    manager: 'Maria Silva',
    status: 'active',
    stages: [
        { id: 'applied', name: 'Aplicou', count: 5 },
        { id: 'screening', name: 'Triagem', count: 3 },
        { id: 'hr_interview', name: 'Entrevista RH', count: 2 },
        { id: 'tech_interview', name: 'Técnica', count: 1 },
        { id: 'case', name: 'Case', count: 0 },
        { id: 'offer', name: 'Proposta', count: 0 },
    ]
  },
  {
    id: 'j2',
    title: 'Senior Frontend Dev',
    department: 'Engenharia',
    location: 'São Paulo',
    type: 'Híbrido',
    openDays: 7,
    manager: 'João Pedro',
    status: 'active',
    stages: [
        { id: 'applied', name: 'Aplicou', count: 8 },
        { id: 'screening', name: 'Triagem', count: 2 },
        { id: 'hr_interview', name: 'Entrevista RH', count: 0 },
        { id: 'tech_interview', name: 'Técnica', count: 0 },
        { id: 'case', name: 'Case', count: 0 },
        { id: 'offer', name: 'Proposta', count: 0 },
    ]
  }
];

export const HIRING_CANDIDATES: HiringCandidate[] = [
    {
        id: 'c1', jobId: 'j1', name: 'João Silva', email: 'joao@email.com', phone: '+55 11 99999-9999', avatarInitials: 'JS',
        stage: 'applied', matchScore: 85, experience: '5 anos', appliedDate: '10/01/2026', lastActivity: 'Hoje', tags: ['SaaS', 'Discovery']
    },
    {
        id: 'c2', jobId: 'j1', name: 'Maria Costa', email: 'maria@email.com', phone: '+55 11 88888-8888', avatarInitials: 'MC',
        stage: 'screening', matchScore: 78, experience: '3 anos', appliedDate: '12/01/2026', lastActivity: 'Ontem', tags: ['Agile']
    },
    {
        id: 'c3', jobId: 'j1', name: 'Ana Pereira', email: 'ana@email.com', phone: '+55 21 97777-7777', avatarInitials: 'AP',
        stage: 'hr_interview', matchScore: 92, experience: '6 anos', appliedDate: '05/01/2026', lastActivity: '2h atrás', tags: ['Liderança', 'Tech']
    }
];

// --- Onboarding Mock Data ---

export const ONBOARDING_RESOURCES = [
    { id: 'r1', title: 'Culture Handbook', type: 'doc', url: '#', description: 'Documento completo sobre cultura e valores.' },
    { id: 'r2', title: 'Nossa História', type: 'video', url: '#', description: 'Vídeo institucional.' },
    { id: 'r3', title: 'Guia de Setup', type: 'doc', url: '#', description: 'Configuração de ambiente e acessos.' },
    { id: 'r4', title: 'Mapa de Ferramentas', type: 'doc', url: '#', description: 'Lista de ferramentas e links úteis.' },
    { id: 'r5', title: 'Onboarding 101', type: 'course', url: '#', description: 'Curso introdutório na Academy.' },
];

export const ONBOARDING_TRACKS: OnboardingTrack[] = [
    {
        id: 'pm-track',
        title: 'Produto - Product Manager',
        role: 'Product Manager',
        duration: '30 dias',
        phases: [
            {
                id: 'week1',
                title: 'Semana 1: Welcome Week',
                description: 'Imersão na cultura e setup.',
                isLocked: false,
                tasks: [
                    { id: 't1', title: 'Receber equipamentos', type: 'task', isCompleted: true, deadline_day: 1, required: true },
                    { id: 't2', title: 'Configurar email corporativo', type: 'system', isCompleted: true, deadline_day: 1, required: true },
                    { id: 't3', title: 'Ler Culture Handbook', type: 'doc', link: '#', isCompleted: true, deadline_day: 2, required: true },
                    { id: 't4', title: 'Café com Buddy', type: 'meeting', isCompleted: true, deadline_day: 3, required: true },
                    { id: 't5', title: 'Apresentação ao time', type: 'meeting', isCompleted: false, deadline_day: 5, required: true },
                ]
            },
            {
                id: 'month1',
                title: 'Semana 2-4: Ramp Up',
                description: 'Entendimento do produto e primeiros projetos.',
                isLocked: false,
                tasks: [
                    { id: 't6', title: 'Curso PM 101 na Academy', type: 'course', link: '#', isCompleted: false, deadline_day: 15, required: true },
                    { id: 't7', title: 'Entender métricas chave', type: 'doc', isCompleted: false, deadline_day: 10, required: true },
                    { id: 't8', title: 'Shadow em 3 reuniões de discovery', type: 'task', isCompleted: false, deadline_day: 20, required: true },
                ]
            },
            {
                id: 'month2',
                title: 'Mês 2: Building',
                description: 'Execução com autonomia.',
                isLocked: true,
                tasks: []
            }
        ]
    },
    {
        id: 'dev-track',
        title: 'Tech - Desenvolvedor',
        role: 'Developer',
        duration: '45 dias',
        phases: []
    }
];

export const ONBOARDING_PROCESSES: OnboardingProcess[] = [
    {
        id: 'proc1',
        memberId: 't5',
        memberName: 'Sarah Designer',
        memberRole: 'Product Designer',
        memberAvatar: 'SD',
        startDate: '20/01/2026',
        buddy: 'Maria Silva',
        manager: 'Hugo D.',
        trackId: 'pm-track', // Using PM track as mock for designer too
        progress: 40,
        currentPhaseIndex: 0,
        status: 'on_track',
        phases: ONBOARDING_TRACKS[0].phases // Hydrated phases
    },
    {
        id: 'proc2',
        memberId: 't6',
        memberName: 'Mike Dev',
        memberRole: 'Frontend Lead',
        memberAvatar: 'MD',
        startDate: '15/01/2026',
        buddy: 'Andrej K.',
        manager: 'João Pedro',
        trackId: 'dev-track',
        progress: 65,
        currentPhaseIndex: 1,
        status: 'on_track',
        phases: []
    }
];

// --- Performance Mock Data ---

export const PERFORMANCE_GOALS: PerformanceGoal[] = [
    {
        id: 'g1',
        memberId: 't5', // Sarah
        memberName: 'Sarah Designer',
        memberAvatar: 'SD',
        title: 'Lançar v2.0 do Design System',
        description: 'Finalizar a migração de tokens e componentes.',
        cycle: 'Q1 2026',
        status: 'active',
        progress: 75,
        deadline: '31/03/2026',
        keyResults: [
            { id: 'kr1', title: 'Definir 100% dos tokens', type: 'percentage', target: 100, current: 100, progress: 100 },
            { id: 'kr2', title: 'Documentar 30 componentes', type: 'number', target: 30, current: 15, progress: 50 },
        ]
    },
    {
        id: 'g2',
        memberId: 't3', // Andrej
        memberName: 'Andrej Karpathy',
        memberAvatar: 'AK',
        title: 'Deploy Automático',
        description: 'Reduzir tempo de deploy para < 5min.',
        cycle: 'Q1 2026',
        status: 'completed',
        progress: 100,
        deadline: '28/02/2026',
        keyResults: [
            { id: 'kr3', title: 'Implementar CI/CD', type: 'boolean', target: 1, current: 1, progress: 100 },
        ]
    },
    {
        id: 'g3',
        memberId: 't3',
        memberName: 'Andrej Karpathy',
        memberAvatar: 'AK',
        title: 'Reduzir Bugs Críticos',
        description: 'Melhorar estabilidade do core.',
        cycle: 'Q1 2026',
        status: 'active',
        progress: 80,
        deadline: '31/03/2026',
        keyResults: [
            { id: 'kr4', title: 'Taxa de crash < 0.1%', type: 'percentage', target: 0.1, current: 0.2, progress: 80 },
        ]
    }
];

export const PERFORMANCE_FEEDBACKS: PerformanceFeedback[] = [
    {
        id: 'f1',
        fromId: 't1',
        fromName: 'Alan Nicolas',
        fromAvatar: 'AN',
        toId: 't5', // Sarah
        toName: 'Sarah Designer',
        toAvatar: 'SD',
        type: 'praise',
        content: 'Excelente trabalho na apresentação do roadmap para o board! Comunicação clara e confiança nas respostas.',
        competency: 'Comunicação',
        date: '20/01/2026',
        visibility: 'public'
    },
    {
        id: 'f2',
        fromId: 't1',
        fromName: 'Alan Nicolas',
        fromAvatar: 'AN',
        toId: 't5', // Sarah
        toName: 'Sarah Designer',
        toAvatar: 'SD',
        type: 'constructive',
        content: 'Uma oportunidade de melhoria: delegar mais decisões operacionais para os PMs juniores.',
        competency: 'Liderança',
        date: '15/01/2026',
        visibility: 'private'
    },
    {
        id: 'f3',
        fromId: 't6', // Mike
        fromName: 'Mike Dev',
        fromAvatar: 'MD',
        toId: 't5', // Sarah
        toName: 'Sarah Designer',
        toAvatar: 'SD',
        type: 'praise',
        content: 'Obrigado pela mentoria em UX writing. Ajudou muito no meu último PR.',
        competency: 'Colaboração',
        date: '10/01/2026',
        visibility: 'public'
    }
];

export const PERFORMANCE_CYCLES_MOCK: PerformanceReviewCycle[] = [
    { id: 'c1', name: 'Q1 2026 Review', status: 'active', deadline: '31/03/2026', completionRate: 15 },
    { id: 'c2', name: 'Q4 2025 Review', status: 'calibration', deadline: '15/01/2026', completionRate: 98 },
    { id: 'c3', name: 'Annual 2025', status: 'completed', deadline: '31/12/2025', completionRate: 100 },
];

// --- Rituals Mock Data ---

export const RITUAL_TEMPLATES_MOCK: RitualTemplate[] = [
    {
        id: 'daily',
        name: 'Daily Standup',
        type: 'daily',
        description: 'Alinhamento rápido diário para identificar bloqueios.',
        defaultDuration: 15,
        suggestedFrequency: 'Diário',
        participants: 'Time inteiro',
        agenda: [
            { id: '1', title: 'Check-in Rápido', duration: 2, description: 'Como você está chegando?' },
            { id: '2', title: 'Updates & Bloqueios', duration: 10, description: 'Ontem, Hoje, Bloqueios' },
            { id: '3', title: 'Avisos', duration: 3, description: 'Lembretes do dia' }
        ],
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        icon: Zap
    },
    {
        id: '1on1',
        name: 'One-on-One',
        type: '1on1',
        description: 'Reunião individual de desenvolvimento e feedback.',
        defaultDuration: 30,
        suggestedFrequency: 'Semanal',
        participants: 'Líder + Liderado',
        agenda: [
            { id: '1', title: 'Check-in Pessoal', duration: 5, description: 'Bem-estar e vida fora do trabalho' },
            { id: '2', title: 'Pauta do Liderado', duration: 15, description: 'Prioridades e desafios dele' },
            { id: '3', title: 'Feedback & Desenvolvimento', duration: 10, description: 'Pontos do líder' }
        ],
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        icon: Users
    },
    {
        id: 'retro',
        name: 'Sprint Retrospective',
        type: 'sprint',
        description: 'Melhoria contínua do processo e time.',
        defaultDuration: 60,
        suggestedFrequency: 'Quinzenal',
        participants: 'Time Scrum',
        agenda: [
            { id: '1', title: 'Quebra-gelo', duration: 5, description: 'Atividade rápida' },
            { id: '2', title: 'Data Gathering', duration: 20, description: 'O que funcionou? O que não?' },
            { id: '3', title: 'Insights & Ações', duration: 25, description: 'Plano de melhoria' },
            { id: '4', title: 'Fechamento', duration: 10, description: 'ROTI (Return on Time Invested)' }
        ],
        color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
        icon: Repeat
    }
];

export const MOCK_RITUALS: Ritual[] = [
    {
        id: 'r1',
        title: 'Daily Standup',
        type: 'daily',
        date: 'Hoje',
        time: '09:00',
        duration: 15,
        participants: ['AN', 'HC', 'AK', 'GH', 'SD'],
        status: 'scheduled',
        templateId: 'daily'
    },
    {
        id: 'r2',
        title: '1:1 com João Pedro',
        type: '1on1',
        date: 'Hoje',
        time: '14:00',
        duration: 45,
        participants: ['AN', 'JP'],
        status: 'scheduled',
        templateId: '1on1'
    },
    {
        id: 'r3',
        title: 'Weekly Sync',
        type: 'weekly',
        date: 'Hoje',
        time: '16:00',
        duration: 60,
        participants: ['AN', 'HC', 'AK', 'GH', 'SD', 'MD', 'JO', 'DG'],
        status: 'scheduled',
        templateId: 'weekly'
    },
    {
        id: 'r4',
        title: 'Sprint Review',
        type: 'sprint',
        date: 'Amanhã',
        time: '10:00',
        duration: 90,
        participants: ['Product Team'],
        status: 'scheduled',
        templateId: 'review'
    }
];

// --- Library Mock Data (Admin) ---

export const AUTHORS_DATA: Author[] = [
    {
        id: 'author-1',
        name: 'Cal Newport',
        bio: 'Professor de ciência da computação em Georgetown University e autor de best-sellers sobre produtividade e trabalho profundo.',
        avatarUrl: '',
        bookCount: 3,
        mindId: undefined
    },
    {
        id: 'author-2',
        name: 'Gary Halbert',
        bio: 'Lendário copywriter conhecido como "The Prince of Print", autor de The Boron Letters.',
        avatarUrl: '',
        bookCount: 2,
        mindId: 'gary-halbert'
    },
    {
        id: 'author-3',
        name: 'David Goggins',
        bio: 'Ex-SEAL da Marinha, ultramaratonista e autor de "Can\'t Hurt Me".',
        avatarUrl: '',
        bookCount: 2,
        mindId: 'david-goggins'
    },
    {
        id: 'author-4',
        name: 'James Clear',
        bio: 'Autor de Atomic Habits e especialista em formação de hábitos e melhoria contínua.',
        avatarUrl: '',
        bookCount: 1,
        mindId: undefined
    }
];

export const BOOKS_DATA: Book[] = [
    {
        id: 'book-1',
        title: 'Deep Work',
        author: 'Cal Newport',
        authorId: 'author-1',
        coverUrl: '',
        status: 'published',
        progress: 0,
        category: 'Produtividade',
        description: 'Regras para o sucesso focado em um mundo distraído.',
        chapters: [
            { id: 'ch1', title: 'Introdução' },
            { id: 'ch2', title: 'A Ideia' },
            { id: 'ch3', title: 'Regra #1: Work Deeply' },
            { id: 'ch4', title: 'Regra #2: Embrace Boredom' }
        ],
        readingTime: '4h',
        rating: 4.8,
        totalReaders: 1250
    },
    {
        id: 'book-2',
        title: 'The Boron Letters',
        author: 'Gary Halbert',
        authorId: 'author-2',
        coverUrl: '',
        status: 'published',
        progress: 0,
        category: 'Copywriting',
        description: 'Cartas de um pai para seu filho sobre copywriting e vida.',
        chapters: [
            { id: 'ch1', title: 'Carta 1' },
            { id: 'ch2', title: 'Carta 2' },
            { id: 'ch3', title: 'Carta 3' }
        ],
        readingTime: '2h30',
        rating: 4.9,
        totalReaders: 890
    },
    {
        id: 'book-3',
        title: 'Can\'t Hurt Me',
        author: 'David Goggins',
        authorId: 'author-3',
        coverUrl: '',
        status: 'published',
        progress: 0,
        category: 'Mentalidade',
        description: 'Master Your Mind and Defy the Odds.',
        chapters: [
            { id: 'ch1', title: 'Introduction' },
            { id: 'ch2', title: 'I Should Have Been a Statistic' }
        ],
        readingTime: '5h',
        rating: 4.7,
        totalReaders: 2100
    },
    {
        id: 'book-4',
        title: 'Atomic Habits',
        author: 'James Clear',
        authorId: 'author-4',
        coverUrl: '',
        status: 'draft',
        progress: 0,
        category: 'Hábitos',
        description: 'Pequenas mudanças, resultados notáveis.',
        chapters: [],
        readingTime: '3h',
        rating: 0,
        totalReaders: 0
    }
];
