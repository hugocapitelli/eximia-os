import React, { useState } from 'react';
import { Layout, Code, Eye, Copy, Check, Search, Filter } from 'lucide-react';
import { AdminPanel, AdminHeader } from '../admin';

interface DSComponent {
  id: string;
  name: string;
  category: 'atom' | 'molecule' | 'organism' | 'template';
  description: string;
  variants: number;
  usageCount: number;
}

// Mock DS components from the actual codebase
const DS_COMPONENTS: DSComponent[] = [
  { id: 'button', name: 'Button', category: 'atom', description: 'Botão interativo com variantes', variants: 4, usageCount: 156 },
  { id: 'badge', name: 'Badge', category: 'atom', description: 'Indicador visual compacto', variants: 3, usageCount: 89 },
  { id: 'input', name: 'Input', category: 'atom', description: 'Campo de entrada de texto', variants: 2, usageCount: 67 },
  { id: 'icon', name: 'Icon', category: 'atom', description: 'Wrapper para ícones Lucide', variants: 1, usageCount: 234 },
  { id: 'avatar', name: 'Avatar', category: 'atom', description: 'Imagem de perfil circular', variants: 3, usageCount: 45 },
  { id: 'card', name: 'Card', category: 'molecule', description: 'Container com borda e sombra', variants: 2, usageCount: 78 },
  { id: 'form-field', name: 'FormField', category: 'molecule', description: 'Label + Input + Error', variants: 1, usageCount: 34 },
  { id: 'nav-item', name: 'NavItem', category: 'molecule', description: 'Item de navegação com ícone', variants: 2, usageCount: 23 },
  { id: 'search-input', name: 'SearchInput', category: 'molecule', description: 'Input com ícone de busca', variants: 1, usageCount: 12 },
  { id: 'sidebar', name: 'Sidebar', category: 'organism', description: 'Navegação lateral completa', variants: 1, usageCount: 1 },
  { id: 'header', name: 'Header', category: 'organism', description: 'Cabeçalho de página', variants: 2, usageCount: 5 },
  { id: 'admin-panel', name: 'AdminPanel', category: 'organism', description: 'Painel administrativo', variants: 1, usageCount: 8 },
  { id: 'dashboard-layout', name: 'DashboardLayout', category: 'template', description: 'Layout base do dashboard', variants: 1, usageCount: 1 },
];

const CATEGORIES = [
  { id: 'all', label: 'Todos', count: DS_COMPONENTS.length },
  { id: 'atom', label: 'Atoms', count: DS_COMPONENTS.filter(c => c.category === 'atom').length },
  { id: 'molecule', label: 'Molecules', count: DS_COMPONENTS.filter(c => c.category === 'molecule').length },
  { id: 'organism', label: 'Organisms', count: DS_COMPONENTS.filter(c => c.category === 'organism').length },
  { id: 'template', label: 'Templates', count: DS_COMPONENTS.filter(c => c.category === 'template').length },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'atom': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'molecule': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'organism': return 'bg-violet-500/10 text-violet-500 border-violet-500/20';
    case 'template': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
  }
};

interface AdminDSComponentsProps {
  onBack: () => void;
  onNavigate?: (pageId: string) => void;
}

export const AdminDSComponents: React.FC<AdminDSComponentsProps> = ({
  onBack,
  onNavigate,
}) => {
  const [components] = useState<DSComponent[]>(DS_COMPONENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredComponents = components.filter((comp) => {
    const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyImport = (componentName: string) => {
    const importStatement = `import { ${componentName} } from '@/components/${componentName.toLowerCase()}';`;
    navigator.clipboard.writeText(importStatement);
    setCopiedId(componentName);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <AdminHeader
        breadcrumbs={[
          { label: 'Admin', onClick: onBack },
          { label: 'DS Manager', onClick: onBack },
          { label: 'Componentes' },
        ]}
        onBack={onBack}
      />

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <AdminPanel
          icon={Layout}
          title="Design System Components"
          description="Biblioteca de componentes do exímIA OS. Atoms, Molecules, Organisms e Templates."
          showDefaultActions={false}
        />

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar componentes..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {cat.label}
                <span className="ml-2 text-[10px] opacity-60">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComponents.length === 0 ? (
            <div className="col-span-3 text-center py-16">
              <Layout className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 text-lg">Nenhum componente encontrado</p>
            </div>
          ) : (
            filteredComponents.map((component) => (
              <div
                key={component.id}
                className="bg-[#0A0A0A] border border-[#1F1F22] hover:border-zinc-700 rounded-xl p-5 transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${getCategoryColor(component.category)}`}>
                      {component.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopyImport(component.name)}
                      className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded transition-colors"
                      title="Copiar import"
                    >
                      {copiedId === component.name ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded transition-colors"
                      title="Ver código"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Name & Description */}
                <h3 className="font-semibold text-white mb-1">{component.name}</h3>
                <p className="text-sm text-zinc-500 mb-4">{component.description}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-zinc-600">
                  <span>{component.variants} variantes</span>
                  <span className="text-zinc-700">•</span>
                  <span>{component.usageCount} usos</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDSComponents;
