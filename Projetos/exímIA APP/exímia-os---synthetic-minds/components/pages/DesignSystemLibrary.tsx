
import React, { useState, useRef, useEffect } from 'react';
import { DESIGN_SYSTEMS } from '../../constants';
import { DesignSystem } from '../../types';
import { Search, Check, Layers, ArrowRight, Download, Trash2, X, Settings, PenTool, GripVertical, Zap, Plus, Filter, LayoutGrid, Box, Code, Layout } from 'lucide-react';
import { Button } from '../atoms/Button';
import { useDSLibrary, DSCategory } from '../../hooks/useDSLibrary';
import { DSComponentCard } from '../ds/DSComponentCard';
import { DSComponentModal } from '../ds/DSComponentModal';

interface DesignSystemLibraryProps {
    onSelectDS: (id: string) => void;
}

// --- Internal Luxe Components (Refined for Academy Style) ---

const LuxeCard: React.FC<{ 
    ds: DesignSystem; 
    selected: boolean; 
    onToggle: (id: string) => void;
    onOpen: (id: string) => void;
    disabled?: boolean;
}> = ({ ds, selected, onToggle, onOpen, disabled }) => {
    
    // Determine gradient based on DS ID or properties
    const getGradient = () => {
        if (ds.id === 'lendaria') return 'from-amber-900/40 via-yellow-900/20 to-transparent'; // Gold
        if (ds.id === 'saas-platform') return 'from-blue-900/40 via-indigo-900/20 to-transparent'; // Blue
        if (ds.id === 'eximia') return 'from-orange-900/40 via-red-900/20 to-transparent'; // Orange
        return 'from-zinc-800/40 via-zinc-900/20 to-transparent'; // Default
    };

    return (
        <div 
            className={`group relative flex flex-col transition-all duration-500 ${selected ? 'scale-95' : disabled ? '' : 'hover:-translate-y-2 cursor-pointer'}`}
            onClick={() => !disabled && onOpen(ds.id)}
        >
            {/* Selection Checkbox (Top Left) - NOW HANDLES TOGGLE */}
            {!disabled && (
                <div 
                    onClick={(e) => { e.stopPropagation(); onToggle(ds.id); }}
                    className={`absolute top-4 left-4 z-30 transition-all duration-300 cursor-pointer ${selected ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100'}`}
                >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${selected ? 'bg-white border-white text-black' : 'border-white/30 bg-black/40 backdrop-blur-md text-transparent hover:border-white hover:bg-black/60'}`}>
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                </div>
            )}

            {/* Quick Open Action (Top Right) - Visual Hint */}
            {!disabled && (
                <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                     <div className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 group-hover:text-white group-hover:bg-black/60 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                     </div>
                </div>
            )}

            {/* Card Body / Cover */}
            <div className={`
                relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#1F1F22] bg-[#0A0A0A] shadow-lg
                transition-all duration-500 ease-out transform-gpu
                ${selected ? 'ring-2 ring-amber-500/50 opacity-80' : disabled ? '' : 'group-hover:border-zinc-700 group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]'}
            `}>
                {/* Aura Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-b ${getGradient()} opacity-50 group-hover:opacity-70 transition-opacity duration-700`} />
                
                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                {/* Content Centered */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                    <div className={`w-16 h-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center mb-6 text-white/80 shadow-inner transition-transform duration-500 ${!disabled && 'group-hover:scale-110'}`}>
                        <Layers className="w-8 h-8" />
                    </div>
                    
                    <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase mb-3">
                        {ds.category || 'SYSTEM'}
                    </span>

                    <h3 className="text-xl font-bold text-white leading-tight mb-2 font-sans tracking-tight">
                        {ds.name}
                    </h3>
                    
                    <div className="inline-flex items-center gap-2 mt-2 px-2 py-1 rounded-md bg-black/20 border border-white/5 backdrop-blur-sm">
                        <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono">v{ds.version}</span>
                    </div>
                </div>
                
                {/* Bottom Stats */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-black/20 backdrop-blur-md flex justify-between items-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Components</span>
                    <span className="text-xs font-mono text-zinc-300">{ds.components.length}</span>
                </div>
            </div>
        </div>
    );
};

export const DesignSystemLibrary: React.FC<DesignSystemLibraryProps> = ({ onSelectDS }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('TODOS');
    const [localSystems, setLocalSystems] = useState<DesignSystem[]>(DESIGN_SYSTEMS);

    // Tab navigation: 'biblioteca' (DS libraries) or 'components' (Atomic Design)
    const [activeTab, setActiveTab] = useState<'biblioteca' | 'components'>('biblioteca');

    // DS Library Hook for Atomic Design components
    const {
        filteredComponents,
        selectedCategory,
        searchQuery: componentSearchQuery,
        setSelectedCategory,
        setSearchQuery: setComponentSearchQuery,
        getComponent,
        getCategoryCount,
    } = useDSLibrary();

    // Modal state for component details
    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    const selectedComponent = selectedComponentId ? getComponent(selectedComponentId) : null;

    // Drag & Drop Refs
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const filters = ['TODOS', 'WEB', 'MOBILE', 'DASHBOARD', 'MARKETING', 'ECOMMERCE'];

    // Category config for Atomic Design
    const CATEGORY_TABS: { id: DSCategory | 'all'; label: string; icon: typeof Box }[] = [
        { id: 'all', label: 'Todos', icon: LayoutGrid },
        { id: 'atoms', label: 'Atoms', icon: Box },
        { id: 'molecules', label: 'Molecules', icon: Layers },
        { id: 'organisms', label: 'Organisms', icon: Code },
        { id: 'templates', label: 'Templates', icon: Layout },
    ];

    // Filter Logic
    useEffect(() => {
        let filtered = DESIGN_SYSTEMS.filter(ds => 
            ds.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            ds.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        if (selectedFilter !== 'TODOS') {
            // Mock filtering logic for demo as categories aren't fully populated in constants
            // In a real app, this would filter by ds.category or ds.tags
            if (selectedFilter === 'WEB') filtered = filtered.filter(ds => ds.tags?.includes('SaaS') || ds.category?.includes('Web'));
        }

        setLocalSystems(filtered);
    }, [searchQuery, selectedFilter]);

    const toggleSelection = (id: string) => {
        if (isAdminMode) return;
        const newSelection = new Set(selectedIds);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedIds(newSelection);
    };

    const clearSelection = () => setSelectedIds(new Set());

    // --- Drag & Drop Handlers ---
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        if (!isAdminMode) {
            e.preventDefault();
            return;
        }
        dragItem.current = position;
        e.currentTarget.style.opacity = '0.4';
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        if (!isAdminMode) return;
        e.preventDefault();
        
        dragOverItem.current = position;
        
        const dragIndex = dragItem.current;
        const dragOverIndex = dragOverItem.current;

        if (dragIndex === null || dragOverIndex === null || dragIndex === dragOverIndex) return;

        const newSystems = [...localSystems];
        const draggedItemContent = newSystems[dragIndex];
        
        newSystems.splice(dragIndex, 1);
        newSystems.splice(dragOverIndex, 0, draggedItemContent);
        
        dragItem.current = dragOverIndex;
        setLocalSystems(newSystems);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        dragItem.current = null;
        dragOverItem.current = null;
        e.currentTarget.style.opacity = '1';
    };

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans relative selection:bg-amber-500/30 selection:text-white transition-colors duration-500">
            
            {/* --- Top Navigation Bar --- */}
            <div className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-500 ${isAdminMode ? 'bg-[#1a1500]/80 border-amber-500/20' : 'bg-[#050505]/80 border-[#1F1F22]'}`}>
                <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Breadcrumbs / Title */}
                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex items-center gap-6">
                            <button
                                onClick={() => setActiveTab('biblioteca')}
                                className={`text-xs font-bold tracking-widest transition-colors ${activeTab === 'biblioteca' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                BIBLIOTECA
                            </button>
                            <button
                                onClick={() => setActiveTab('components')}
                                className={`text-xs font-bold tracking-widest transition-colors ${activeTab === 'components' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                COMPONENTS
                            </button>
                            <button className="text-xs font-bold tracking-widest transition-colors text-zinc-500 hover:text-zinc-300">TOKENS</button>
                            <div className="h-4 w-[1px] bg-zinc-800" />
                            <button className="text-xs font-bold tracking-widest text-zinc-500 hover:text-zinc-300">DOCUMENTAÇÃO</button>
                        </nav>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-0 top-1.5 w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                            <input
                                type="text"
                                placeholder="BUSCAR..."
                                value={activeTab === 'biblioteca' ? searchQuery : componentSearchQuery}
                                onChange={(e) => activeTab === 'biblioteca' ? setSearchQuery(e.target.value) : setComponentSearchQuery(e.target.value)}
                                className="bg-transparent border-b border-zinc-800 text-[10px] font-bold tracking-widest py-1 pl-5 w-32 focus:w-48 focus:border-zinc-500 focus:outline-none transition-all text-zinc-300 placeholder-zinc-700 uppercase"
                            />
                        </div>
                        
                        {/* Admin Mode Toggle */}
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
                            <span className="text-[10px] font-bold uppercase tracking-wider">{isAdminMode ? 'Editor Ativo' : 'Editar'}</span>
                        </button>

                        <button className="relative p-2 text-zinc-500 hover:text-white transition-colors">
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1800px] mx-auto px-6 py-8 pb-32">
                
                {/* --- Admin Panel (Visible only in Admin Mode) --- */}
                {isAdminMode && (
                    <div
                        className="mb-8 p-6 rounded-2xl flex items-center justify-between animate-in fade-in duration-300"
                        style={{
                            background: 'rgba(245, 158, 11, 0.05)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                        }}
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="p-3 rounded-xl text-amber-500"
                                style={{
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                }}
                            >
                                <Layers className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Gerenciador de Sistemas</h2>
                                <p className="text-sm text-zinc-400">Arraste para reordenar. O card encolhe para revelar as ferramentas.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="secondary" icon={<Zap className="w-4 h-4" />}>Gerar com AI</Button>
                            <Button variant="primary" icon={<Plus className="w-4 h-4" />} className="bg-amber-500 hover:bg-amber-400 text-zinc-900 border-transparent">Novo Sistema</Button>
                        </div>
                    </div>
                )}

                {/* ============================================= */}
                {/* TAB: BIBLIOTECA (Design System Libraries) */}
                {/* ============================================= */}
                {activeTab === 'biblioteca' && (
                    <>
                        {/* --- Hero Header (Only in View Mode) --- */}
                        {!isAdminMode && (
                            <div className="relative w-full h-[380px] rounded-3xl overflow-hidden mb-12 border border-zinc-800 group animate-in fade-in slide-in-from-top-4 duration-500">
                                {/* Background Ambience */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917] via-[#09090b] to-[#1e1b4b] opacity-80" />
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Design System Library</span>
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
                                        Escala com Elegância.
                                    </h1>
                                    <p className="text-lg text-zinc-400 max-w-2xl font-serif leading-relaxed">
                                        Componentes, tokens e padrões unificados para construir produtos lendários.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* --- Filter Bar --- */}
                        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 hide-scrollbar">
                           {filters.map(filter => (
                               <button
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`
                                        px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest transition-all whitespace-nowrap border
                                        ${selectedFilter === filter
                                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                                            : 'bg-[#0A0A0A] text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'}
                                    `}
                                >
                                    {filter}
                                </button>
                           ))}
                       </div>

                        {/* --- Section Header --- */}
                        <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
                           <div className="flex items-center gap-4">
                               <h2 className="text-xs font-bold text-zinc-500 tracking-[0.2em]">TODOS OS SISTEMAS</h2>
                               <div className="h-[1px] w-12 bg-zinc-800" />
                           </div>
                           <span className="text-[10px] font-bold text-zinc-600 tracking-wider">{localSystems.length} libraries</span>
                       </div>

                        {/* --- Grid of Luxe Cards --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {localSystems.map((ds, index) => (
                                <div
                                    key={ds.id}
                                    className={`relative group perspective-1000 ${isAdminMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
                                    draggable={isAdminMode}
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnter={(e) => handleDragEnter(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => e.preventDefault()}
                                >

                                    {/* Layer 0: Admin Backplate */}
                                    {isAdminMode && (
                                        <div className="absolute inset-0 z-0 animate-in fade-in duration-500 pointer-events-none">
                                            <div className="absolute inset-0 rounded-[32px] border-2 border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]" />
                                        </div>
                                    )}

                                    {/* Layer 10: Card Content */}
                                    <div className={`
                                        relative h-full w-full transition-all duration-300 ease-out z-10 origin-center
                                        ${isAdminMode ? 'scale-[0.85] cursor-default' : ''}
                                    `}>
                                        <LuxeCard
                                            ds={ds}
                                            selected={selectedIds.has(ds.id)}
                                            onToggle={toggleSelection}
                                            onOpen={onSelectDS}
                                            disabled={isAdminMode}
                                        />
                                    </div>

                                    {/* Layer 20: Admin Controls (Buttons stay ON TOP) */}
                                    {isAdminMode && (
                                        <div className="absolute inset-0 z-20 pointer-events-none animate-in fade-in duration-500">

                                            {/* Left: Drag Handle */}
                                            <div className="absolute top-2 left-2 pointer-events-auto">
                                                <button className="w-8 h-8 bg-[#121214] border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white shadow-xl hover:scale-110 transition-all cursor-grab active:cursor-grabbing">
                                                    <GripVertical className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Right Top: Edit */}
                                            <div className="absolute top-2 right-2 pointer-events-auto">
                                                <button
                                                    className="w-10 h-10 bg-amber-500 border-2 border-amber-300 rounded-full flex items-center justify-center text-zinc-900 shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:scale-110 hover:rotate-12 transition-all"
                                                    title="Editar Sistema"
                                                >
                                                    <PenTool className="w-4 h-4 fill-current" />
                                                </button>
                                            </div>

                                            {/* Right Bottom: Delete */}
                                            <div className="absolute bottom-10 right-2 pointer-events-auto">
                                                <button className="w-8 h-8 bg-[#121214] border border-zinc-700 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-950 hover:border-rose-500 transition-all shadow-xl">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Center Area: Quick Manage */}
                                            <div className="absolute inset-0 flex items-center justify-center cursor-pointer group/edit pointer-events-auto">
                                                <div className="w-1/2 h-1/2 flex items-center justify-center">
                                                    <div className="px-5 py-2.5 bg-black/90 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest shadow-2xl opacity-0 group-hover/edit:opacity-100 transition-all duration-300 flex items-center gap-2 transform translate-y-4 group-hover/edit:translate-y-0 hover:bg-black hover:border-amber-500/50 hover:text-amber-500">
                                                        <Settings className="w-3 h-3" /> Gerenciar
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* ============================================= */}
                {/* TAB: COMPONENTS (Atomic Design Components) */}
                {/* ============================================= */}
                {activeTab === 'components' && (
                    <>
                        {/* --- Components Hero Header --- */}
                        <div className="relative w-full h-[280px] rounded-3xl overflow-hidden mb-12 border border-zinc-800 group animate-in fade-in slide-in-from-top-4 duration-500">
                            {/* Background Ambience */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-[#09090b] to-amber-900/20 opacity-80" />
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
                                    <Box className="w-3 h-3 text-amber-500" />
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Atomic Design</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-2xl">
                                    exímIA OS Components
                                </h1>
                                <p className="text-base text-zinc-400 max-w-xl">
                                    Componentes do Design System organizados por Atomic Design.
                                    Atoms → Molecules → Organisms → Templates
                                </p>
                            </div>
                        </div>

                        {/* --- Category Tabs (Atomic Design) --- */}
                        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 hide-scrollbar">
                            {CATEGORY_TABS.map((cat) => {
                                const Icon = cat.icon;
                                const count = cat.id === 'all'
                                    ? filteredComponents.length
                                    : getCategoryCount(cat.id as DSCategory);
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`
                                            flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest transition-all whitespace-nowrap border
                                            ${selectedCategory === cat.id
                                                ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                                : 'bg-[#0A0A0A] text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'}
                                        `}
                                    >
                                        <Icon className="w-3 h-3" />
                                        {cat.label}
                                        <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] ${
                                            selectedCategory === cat.id
                                                ? 'bg-black/20 text-black'
                                                : 'bg-zinc-800 text-zinc-500'
                                        }`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* --- Section Header --- */}
                        <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xs font-bold text-zinc-500 tracking-[0.2em]">
                                    {selectedCategory === 'all' ? 'TODOS OS COMPONENTES' : selectedCategory.toUpperCase()}
                                </h2>
                                <div className="h-[1px] w-12 bg-zinc-800" />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-600 tracking-wider">
                                {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* --- Components Grid --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredComponents.map((component) => (
                                <DSComponentCard
                                    key={component.id}
                                    component={component}
                                    onClick={() => setSelectedComponentId(component.id)}
                                />
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredComponents.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <Box className="w-12 h-12 text-zinc-700 mb-4" />
                                <h3 className="text-lg font-bold text-zinc-400 mb-2">Nenhum componente encontrado</h3>
                                <p className="text-sm text-zinc-600">
                                    Tente ajustar os filtros ou a busca.
                                </p>
                            </div>
                        )}
                    </>
                )}

            </div>

            {/* Component Detail Modal */}
            {selectedComponent && (
                <DSComponentModal
                    component={selectedComponent}
                    onClose={() => setSelectedComponentId(null)}
                />
            )}

            {/* --- Floating Action Bar (Bottom - Only in View Mode, Biblioteca Tab) --- */}
            {activeTab === 'biblioteca' && !isAdminMode && selectedIds.size > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 duration-300">
                    <div className="bg-[#E4E4E7] text-black px-2 py-2 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center gap-2 border border-white/50 backdrop-blur-xl">
                        <div className="pl-4 pr-6 flex items-center gap-3 border-r border-zinc-300/50">
                            <span className="flex items-center justify-center w-6 h-6 bg-black text-white rounded-full text-xs font-bold font-mono">
                                {selectedIds.size}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Selecionados</span>
                        </div>
                        
                        <div className="flex items-center gap-1 pr-1">
                            <button className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-xl transition-colors text-[10px] font-bold uppercase tracking-wide group">
                                <Layers className="w-3.5 h-3.5 text-zinc-500 group-hover:text-black" />
                                Comparar
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-xl transition-colors text-[10px] font-bold uppercase tracking-wide group">
                                <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-600" />
                                Exportar
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-xl transition-colors text-[10px] font-bold uppercase tracking-wide group text-rose-700/70 hover:text-rose-600">
                                <Trash2 className="w-3.5 h-3.5" />
                                Excluir
                            </button>
                            <button onClick={clearSelection} className="ml-2 p-2 hover:bg-zinc-300/50 rounded-full text-zinc-500 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
