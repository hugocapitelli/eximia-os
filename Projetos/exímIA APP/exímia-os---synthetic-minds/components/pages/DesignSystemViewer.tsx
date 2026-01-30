
import React, { useState, useEffect } from 'react';
import { DESIGN_SYSTEMS } from '../../constants';
import { Palette, Type, Grid, Box, Layers, Move, Component, Monitor, LayoutTemplate, ArrowLeft, Settings, Share2, Code, PenTool, Zap, Plus, Download } from 'lucide-react';

// Import extracted components
import { DesignSystemSelector } from '../design-system/DesignSystemSelector';
import { NavDropdown } from '../design-system/NavDropdown';
import { OverviewSection } from '../design-system/OverviewSection';
import { IdentitySection } from '../design-system/IdentitySection';
import { TokensSection } from '../design-system/TokensSection';
import { LibrarySection } from '../design-system/LibrarySection';
import { Button } from '../atoms/Button';

interface DesignSystemViewerProps {
    dsId: string;
    onBack: () => void;
    onSwitch: (id: string) => void;
}

export const DesignSystemViewer: React.FC<DesignSystemViewerProps> = ({ dsId, onBack, onSwitch }) => {
  const activeDS = DESIGN_SYSTEMS.find(ds => ds.id === dsId) || DESIGN_SYSTEMS[0];

  // Navigation State
  const [activeCategory, setActiveCategory] = useState<'overview' | 'identity' | 'tokens' | 'library'>('overview'); 
  const [activeSubCategory, setActiveSubCategory] = useState<string>('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Editor State
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Reset tab when DS changes
  useEffect(() => {
      setActiveCategory('overview');
      setActiveSubCategory('');
  }, [dsId]);

  const handleNavClick = (category: 'overview' | 'identity' | 'tokens' | 'library', subCategory?: string) => {
    setActiveCategory(category);
    if (subCategory) {
        setActiveSubCategory(subCategory);
    } else {
        // Reset subcategory if main category is clicked without sub-selection
        if(category === 'tokens') setActiveSubCategory('colors');
        if(category === 'library') setActiveSubCategory('all');
    }
    setOpenDropdown(null);
  };

  const NavOptionsTokens = [
    { id: 'colors', label: 'Cores & Temas', icon: Palette },
    { id: 'typography', label: 'Tipografia', icon: Type },
    { id: 'spacing', label: 'Espaçamento', icon: Grid },
    { id: 'radius', label: 'Bordas & Radius', icon: Box },
  ];

  const NavOptionsLibrary = [
    { id: 'all', label: 'Todos', icon: Layers },
    { id: 'Atom', label: 'Atoms', icon: Component },
    { id: 'Molecule', label: 'Molecules', icon: Box },
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'overview': return <OverviewSection ds={activeDS} isEditing={isAdminMode} />;
      case 'identity': return <IdentitySection ds={activeDS} isEditing={isAdminMode} />;
      case 'tokens': return <TokensSection ds={activeDS} subCategory={activeSubCategory || 'colors'} isEditing={isAdminMode} />;
      case 'library': return <LibrarySection ds={activeDS} filter={activeSubCategory || 'all'} isEditing={isAdminMode} />;
      default: return <OverviewSection ds={activeDS} isEditing={isAdminMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans selection:bg-amber-500/30 selection:text-white">
      
      {/* Top Bar - Sticky & Refined */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl border-b transition-colors duration-500 ${isAdminMode ? 'bg-[#1a1500]/90 border-amber-500/20' : 'bg-[#050505]/90 border-[#1F1F22]'}`}>
          <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
              
              {/* Left: Back & Context */}
              <div className="flex items-center gap-6">
                  <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                  >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                  
                  <div className="h-4 w-[1px] bg-zinc-800" />
                  
                  <div>
                      <h2 className="text-sm font-bold text-white leading-none tracking-tight">{activeDS.name}</h2>
                      <div className="flex items-center gap-2 mt-1 opacity-60">
                          <span className="text-[9px] font-mono tracking-wider">v{activeDS.version}</span>
                          <span className="w-0.5 h-0.5 bg-zinc-500 rounded-full" />
                          <span className="text-[9px] uppercase tracking-wider">{activeDS.category}</span>
                      </div>
                  </div>
              </div>

              {/* Center: Navigation */}
              <nav className="hidden xl:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                  <button 
                     onClick={() => handleNavClick('overview')}
                     className={`text-xs font-bold tracking-widest transition-colors ${activeCategory === 'overview' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    VISÃO GERAL
                  </button>
                  <button 
                     onClick={() => handleNavClick('identity')}
                     className={`text-xs font-bold tracking-widest transition-colors ${activeCategory === 'identity' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    IDENTIDADE
                  </button>
                  
                  <NavDropdown 
                     label="TOKENS" 
                     isActive={activeCategory === 'tokens'}
                     isOpen={openDropdown === 'tokens'}
                     onToggle={() => setOpenDropdown(openDropdown === 'tokens' ? null : 'tokens')}
                     onSelect={(id) => handleNavClick('tokens', id)}
                     options={NavOptionsTokens}
                  />
                  
                  <NavDropdown 
                     label="BIBLIOTECA UI" 
                     isActive={activeCategory === 'library'}
                     isOpen={openDropdown === 'library'}
                     onToggle={() => setOpenDropdown(openDropdown === 'library' ? null : 'library')}
                     onSelect={(id) => handleNavClick('library', id)}
                     options={NavOptionsLibrary}
                  />
              </nav>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
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
                        <span className="text-[10px] font-bold uppercase tracking-wider">{isAdminMode ? 'Editor' : 'Editar'}</span>
                    </button>

                  <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

                  <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors">
                      <Download className="w-3 h-3" /> Exportar
                  </button>
              </div>
          </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* --- Admin Panel (Visible only in Admin Mode) --- */}
          {isAdminMode && (
                <div className="mb-12 p-6 bg-amber-500/5 border border-amber-500/20 rounded-[24px] flex items-center justify-between animate-in fade-in duration-300">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20"><Settings className="w-6 h-6" /></div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Configurações do Sistema</h2>
                            <p className="text-sm text-zinc-400">Você está editando a versão <span className="text-amber-500 font-mono">v{activeDS.version}</span></p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" icon={<Zap className="w-4 h-4" />}>Audit com AI</Button>
                        <Button variant="primary" icon={<Plus className="w-4 h-4" />} className="bg-amber-500 hover:bg-amber-400 text-zinc-900 border-transparent">Novo Recurso</Button>
                    </div>
                </div>
          )}

          {/* Main Content Render with Key for Animation trigger */}
          <div className="min-h-[600px] pb-20 key-wrapper" key={`${activeDS.id}-${activeCategory}-${activeSubCategory}`}>
            {renderContent()}
          </div>
      </div>
    </div>
  );
};
