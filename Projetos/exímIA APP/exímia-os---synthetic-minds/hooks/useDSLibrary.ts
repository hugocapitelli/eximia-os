import { useState, useEffect, useCallback } from 'react';

export type DSCategory = 'atoms' | 'molecules' | 'organisms' | 'templates';

export interface ComponentProp {
  name: string;
  type: string;
  defaultValue?: string;
  required: boolean;
  description?: string;
}

export interface ComponentVariant {
  name: string;
  description?: string;
  preview?: string;
}

export interface CodeExample {
  title: string;
  code: string;
  language: 'tsx' | 'css' | 'ts';
}

export interface DSComponent {
  id: string;
  name: string;
  category: DSCategory;
  path: string;
  description: string;
  variants: ComponentVariant[];
  props: ComponentProp[];
  examples: CodeExample[];
  createdAt: string;
  updatedAt: string;
  version: string;
  author?: string;
  usedBy?: string[];
  uses?: string[];
}

const DS_STORAGE_KEY = 'eximia-ds-library';

// Initial exímIA OS components
const INITIAL_COMPONENTS: DSComponent[] = [
  // ATOMS
  {
    id: 'button',
    name: 'Button',
    category: 'atoms',
    path: 'components/atoms/Button.tsx',
    description: 'Botão primário do sistema com variantes primary, secondary, ghost e danger.',
    variants: [
      { name: 'primary', description: 'Ação principal' },
      { name: 'secondary', description: 'Ação secundária' },
      { name: 'ghost', description: 'Ação sutil' },
      { name: 'danger', description: 'Ação destrutiva' },
    ],
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", defaultValue: 'primary', required: false },
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: 'md', required: false },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', required: false },
      { name: 'icon', type: 'ReactNode', required: false },
      { name: 'onClick', type: '() => void', required: false },
    ],
    examples: [
      { title: 'Basic', code: '<Button variant="primary">Click me</Button>', language: 'tsx' },
      { title: 'With Icon', code: '<Button icon={<Plus />}>Add Item</Button>', language: 'tsx' },
    ],
    createdAt: '2025-12-01',
    updatedAt: '2026-01-29',
    version: '1.2.0',
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'atoms',
    path: 'components/atoms/Badge.tsx',
    description: 'Indicadores de status com cores semânticas.',
    variants: [
      { name: 'default', description: 'Badge neutro' },
      { name: 'success', description: 'Status positivo' },
      { name: 'warning', description: 'Atenção necessária' },
      { name: 'error', description: 'Erro ou problema' },
      { name: 'info', description: 'Informação' },
    ],
    props: [
      { name: 'variant', type: "'default' | 'success' | 'warning' | 'error' | 'info'", defaultValue: 'default', required: false },
      { name: 'size', type: "'sm' | 'md'", defaultValue: 'md', required: false },
    ],
    examples: [
      { title: 'Status', code: '<Badge variant="success">Active</Badge>', language: 'tsx' },
    ],
    createdAt: '2025-12-01',
    updatedAt: '2026-01-15',
    version: '1.0.0',
  },
  {
    id: 'input',
    name: 'Input',
    category: 'atoms',
    path: 'components/atoms/Input.tsx',
    description: 'Campo de entrada de texto com suporte a label e erro.',
    variants: [
      { name: 'default', description: 'Input padrão' },
      { name: 'error', description: 'Estado de erro' },
      { name: 'disabled', description: 'Desabilitado' },
    ],
    props: [
      { name: 'label', type: 'string', required: false },
      { name: 'error', type: 'string', required: false },
      { name: 'placeholder', type: 'string', required: false },
      { name: 'type', type: 'string', defaultValue: 'text', required: false },
    ],
    examples: [
      { title: 'With Label', code: '<Input label="Email" placeholder="seu@email.com" />', language: 'tsx' },
    ],
    createdAt: '2025-12-01',
    updatedAt: '2026-01-10',
    version: '1.1.0',
  },
  {
    id: 'spinner',
    name: 'Spinner',
    category: 'atoms',
    path: 'components/atoms/Spinner.tsx',
    description: 'Indicador de carregamento animado.',
    variants: [
      { name: 'sm', description: 'Pequeno (16px)' },
      { name: 'md', description: 'Médio (24px)' },
      { name: 'lg', description: 'Grande (32px)' },
    ],
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: 'md', required: false },
      { name: 'color', type: 'string', defaultValue: 'currentColor', required: false },
    ],
    examples: [
      { title: 'Loading', code: '<Spinner size="md" />', language: 'tsx' },
    ],
    createdAt: '2026-01-20',
    updatedAt: '2026-01-20',
    version: '1.0.0',
  },
  // MOLECULES
  {
    id: 'search-bar',
    name: 'SearchBar',
    category: 'molecules',
    path: 'components/molecules/SearchBar.tsx',
    description: 'Campo de busca com ícone e estilização consistente.',
    variants: [
      { name: 'default', description: 'Busca padrão' },
      { name: 'compact', description: 'Versão compacta' },
    ],
    props: [
      { name: 'placeholder', type: 'string', defaultValue: 'Buscar...', required: false },
      { name: 'onSearch', type: '(query: string) => void', required: false },
      { name: 'value', type: 'string', required: false },
    ],
    examples: [
      { title: 'Basic', code: '<SearchBar placeholder="Buscar cursos..." />', language: 'tsx' },
    ],
    createdAt: '2025-12-10',
    updatedAt: '2026-01-15',
    version: '1.0.0',
    uses: ['input'],
  },
  {
    id: 'stat-card',
    name: 'StatCard',
    category: 'molecules',
    path: 'components/molecules/StatCard.tsx',
    description: 'Card de métrica com ícone, valor e label.',
    variants: [],
    props: [
      { name: 'icon', type: 'ReactNode', required: true },
      { name: 'value', type: 'string | number', required: true },
      { name: 'label', type: 'string', required: true },
      { name: 'trend', type: "'up' | 'down' | 'neutral'", required: false },
    ],
    examples: [
      { title: 'Revenue', code: '<StatCard icon={<DollarSign />} value="$12,450" label="Receita" trend="up" />', language: 'tsx' },
    ],
    createdAt: '2025-12-15',
    updatedAt: '2026-01-10',
    version: '1.0.0',
  },
  {
    id: 'nav-item',
    name: 'NavItem',
    category: 'molecules',
    path: 'components/molecules/NavItem.tsx',
    description: 'Item de navegação para sidebar com suporte a subitens.',
    variants: [
      { name: 'default', description: 'Item normal' },
      { name: 'active', description: 'Item ativo' },
      { name: 'collapsed', description: 'Modo recolhido' },
    ],
    props: [
      { name: 'icon', type: 'LucideIcon', required: true },
      { name: 'label', type: 'string', required: true },
      { name: 'isActive', type: 'boolean', defaultValue: 'false', required: false },
      { name: 'subItems', type: 'NavItem[]', required: false },
    ],
    examples: [
      { title: 'Basic', code: '<NavItem icon={Home} label="Dashboard" isActive />', language: 'tsx' },
    ],
    createdAt: '2025-12-01',
    updatedAt: '2026-01-20',
    version: '1.1.0',
  },
  // ORGANISMS
  {
    id: 'sidebar',
    name: 'Sidebar',
    category: 'organisms',
    path: 'components/organisms/Sidebar.tsx',
    description: 'Navegação lateral colapsável com seções e perfil.',
    variants: [
      { name: 'expanded', description: 'Sidebar expandida' },
      { name: 'collapsed', description: 'Sidebar recolhida' },
    ],
    props: [
      { name: 'onNavigate', type: '(pageId: string) => void', required: true },
      { name: 'activePageId', type: 'string', required: true },
    ],
    examples: [
      { title: 'Basic', code: '<Sidebar onNavigate={handleNavigate} activePageId="dashboard" />', language: 'tsx' },
    ],
    createdAt: '2025-12-01',
    updatedAt: '2026-01-29',
    version: '2.0.0',
    uses: ['nav-item'],
  },
  {
    id: 'course-card',
    name: 'CourseCard',
    category: 'organisms',
    path: 'components/academy/AcademyCourseCard.tsx',
    description: 'Card de curso da Academy com cover, progresso e meta info.',
    variants: [
      { name: 'default', description: 'Card padrão' },
      { name: 'featured', description: 'Curso destacado' },
    ],
    props: [
      { name: 'course', type: 'AcademyCourse', required: true },
      { name: 'onClick', type: '() => void', required: false },
    ],
    examples: [
      { title: 'Basic', code: '<AcademyCourseCard course={course} onClick={handleClick} />', language: 'tsx' },
    ],
    createdAt: '2025-12-20',
    updatedAt: '2026-01-25',
    version: '1.2.0',
    uses: ['badge', 'button'],
  },
  {
    id: 'hero-carousel',
    name: 'HeroCarousel',
    category: 'organisms',
    path: 'components/academy/HeroCarousel.tsx',
    description: 'Carrossel de cursos destacados com autoplay e navegação.',
    variants: [],
    props: [
      { name: 'courses', type: 'FeaturedCourse[]', required: true },
      { name: 'autoPlayInterval', type: 'number', defaultValue: '5000', required: false },
      { name: 'onCourseClick', type: '(courseId: string) => void', required: true },
      { name: 'isEditorMode', type: 'boolean', defaultValue: 'false', required: false },
    ],
    examples: [
      { title: 'Basic', code: '<HeroCarousel courses={featured} onCourseClick={handleClick} />', language: 'tsx' },
    ],
    createdAt: '2026-01-29',
    updatedAt: '2026-01-29',
    version: '1.0.0',
    uses: ['button'],
  },
  {
    id: 'track-card',
    name: 'TrackCardLarge',
    category: 'organisms',
    path: 'components/academy/TrackCardLarge.tsx',
    description: 'Card vertical grande de trilha de aprendizado.',
    variants: [],
    props: [
      { name: 'track', type: 'AcademyTrack', required: true },
      { name: 'onNavigate', type: '(trackId: string) => void', required: true },
      { name: 'isEditorMode', type: 'boolean', defaultValue: 'false', required: false },
    ],
    examples: [
      { title: 'Basic', code: '<TrackCardLarge track={track} onNavigate={handleNav} />', language: 'tsx' },
    ],
    createdAt: '2026-01-29',
    updatedAt: '2026-01-29',
    version: '1.0.0',
    uses: ['button', 'badge'],
  },
  // TEMPLATES
  {
    id: 'dashboard-layout',
    name: 'DashboardLayout',
    category: 'templates',
    path: 'components/templates/DashboardLayout.tsx',
    description: 'Layout base para páginas de dashboard com sidebar e content area.',
    variants: [],
    props: [
      { name: 'children', type: 'ReactNode', required: true },
      { name: 'sidebar', type: 'ReactNode', required: false },
    ],
    examples: [
      { title: 'Basic', code: '<DashboardLayout>...</DashboardLayout>', language: 'tsx' },
    ],
    createdAt: '2025-12-01',
    updatedAt: '2026-01-15',
    version: '1.0.0',
    uses: ['sidebar'],
  },
  {
    id: 'reading-page',
    name: 'ReadingPage',
    category: 'templates',
    path: 'components/reading/ReadingPage.tsx',
    description: 'Template fullscreen para leitura de livros com TOC e progresso.',
    variants: [],
    props: [
      { name: 'bookId', type: 'string', required: true },
      { name: 'bookTitle', type: 'string', required: true },
      { name: 'chapters', type: 'Chapter[]', required: true },
      { name: 'onBack', type: '() => void', required: true },
    ],
    examples: [
      { title: 'Basic', code: '<ReadingPage bookId="1" bookTitle="Deep Work" chapters={chapters} onBack={handleBack} />', language: 'tsx' },
    ],
    createdAt: '2026-01-29',
    updatedAt: '2026-01-29',
    version: '1.0.0',
    uses: ['toc-card', 'reading-progress', 'reading-header'],
  },
];

export interface UseDSLibraryReturn {
  components: DSComponent[];
  filteredComponents: DSComponent[];
  selectedCategory: DSCategory | 'all';
  searchQuery: string;
  setSelectedCategory: (category: DSCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
  getComponent: (id: string) => DSComponent | undefined;
  saveComponent: (component: DSComponent) => void;
  deleteComponent: (id: string) => void;
  getCategoryCount: (category: DSCategory) => number;
}

export const useDSLibrary = (): UseDSLibraryReturn => {
  const [components, setComponents] = useState<DSComponent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DSCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(DS_STORAGE_KEY);
    if (stored) {
      try {
        setComponents(JSON.parse(stored));
      } catch {
        setComponents(INITIAL_COMPONENTS);
        localStorage.setItem(DS_STORAGE_KEY, JSON.stringify(INITIAL_COMPONENTS));
      }
    } else {
      setComponents(INITIAL_COMPONENTS);
      localStorage.setItem(DS_STORAGE_KEY, JSON.stringify(INITIAL_COMPONENTS));
    }
  }, []);

  // Filter components
  const filteredComponents = components.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getComponent = useCallback((id: string) => {
    return components.find((c) => c.id === id);
  }, [components]);

  const saveComponent = useCallback((component: DSComponent) => {
    setComponents((prev) => {
      const existing = prev.findIndex((c) => c.id === component.id);
      let updated: DSComponent[];
      if (existing >= 0) {
        updated = [...prev];
        updated[existing] = { ...component, updatedAt: new Date().toISOString().split('T')[0] };
      } else {
        updated = [...prev, { ...component, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] }];
      }
      localStorage.setItem(DS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem(DS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getCategoryCount = useCallback((category: DSCategory) => {
    return components.filter((c) => c.category === category).length;
  }, [components]);

  return {
    components,
    filteredComponents,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    getComponent,
    saveComponent,
    deleteComponent,
    getCategoryCount,
  };
};

export default useDSLibrary;
