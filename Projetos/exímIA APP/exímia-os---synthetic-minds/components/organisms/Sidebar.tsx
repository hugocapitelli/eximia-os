
import React, { useState } from 'react';
import { NavItem } from '../../types';
import {
    NAV_ITEMS_PERSONAL,
    NAV_ITEMS_BUSINESS,
    NAV_ITEMS_CREATIVE,
    NAV_ITEMS_AI,
    NAV_ITEMS_ADMIN
} from '../../constants';
import { ChevronDown, User, Settings, PanelLeftClose, PanelLeftOpen, LogOut, Command, Sparkles, Shield } from 'lucide-react';
import { useAdminMode } from '../../hooks/useAdminMode';

interface SidebarProps {
  onNavigate: (pageId: string) => void;
  activePageId: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activePageId }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAdmin, toggleAdmin } = useAdminMode();

  const renderSection = (title: string | null, items: NavItem[]) => {
      const isAISection = title === 'AI PLAYGROUND';
      const isAdminSection = title === 'ADMIN';

      return (
        <div className="mb-6">
            {title && !isCollapsed && (
                <div className="px-4 mb-3 flex items-center gap-2">
                    {isAISection ? (
                        <>
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span className="text-[9px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase tracking-widest">{title}</span>
                        </>
                    ) : isAdminSection ? (
                        <>
                            <Shield className="w-3 h-3 text-amber-500" />
                            <span className="text-[9px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 uppercase tracking-widest">{title}</span>
                        </>
                    ) : (
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{title}</span>
                    )}
                </div>
            )}
            {title && isCollapsed && (
                <div className={`my-3 border-t mx-4 ${isAISection ? 'border-cyan-500/30' : isAdminSection ? 'border-amber-500/30' : 'border-[#1F1F22]'}`} />
            )}

            <div className="space-y-1 px-2">
                {items.map((item) => (
                    <SidebarItem
                        key={item.id}
                        item={item}
                        isCollapsed={isCollapsed}
                        onNavigate={onNavigate}
                        isActive={activePageId === item.id || item.subItems?.some(sub => sub.id === activePageId)}
                        activePageId={activePageId}
                        isAiItem={isAISection}
                        isAdminItem={isAdminSection}
                    />
                ))}
            </div>
        </div>
      );
  };

  return (
    <aside 
      className={`
        bg-[#050505] border-r border-[#1F1F22] flex flex-col h-screen fixed left-0 top-0 z-30 font-sans transition-all duration-300 ease-in-out text-zinc-400
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* 1. Header Area - Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#1F1F22]">
          <div 
            onClick={() => onNavigate('strategy-dashboard')}
            className={`cursor-pointer flex items-center gap-3 group w-full ${isCollapsed ? 'justify-center' : ''}`}
          >
             {/* Logo Container */}
             <div className="flex items-center gap-2">
                 
                 {/* Collapsed: Symbol Only */}
                 {isCollapsed ? (
                     <div className="w-8 h-8 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <svg viewBox="0 0 120.4 136.01" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <path d="M58.88,132.06c0,2.84,2.96,4.72,5.53,3.5l51-24.09c3.04-1.44,4.99-4.51,4.98-7.89l-.02-23.87v-1.81s-.06-60.95-.06-60.95c0-3.57-2.31-6.73-5.72-7.81L87.3.46c-5.29-1.68-10.7,2.27-10.69,7.83l.04,38.51c.01,11.07,7.12,20.88,17.63,24.32l23.61,7.78-53.28,21.38c-3.48,1.39-5.75,4.77-5.75,8.51l.02,23.27Z" fill="#f59e0b"/>
                            <path d="M61.33,3.85c-.02-2.84-2.99-4.7-5.56-3.47L4.93,24.8C1.9,26.27-.02,29.35,0,32.73l.18,23.87v1.81s.47,60.94.47,60.94c.03,3.57,2.36,6.71,5.77,7.77l27.35,8.51c5.3,1.65,10.68-2.34,10.64-7.89l-.29-38.51c-.08-11.07-7.26-20.83-17.79-24.21l-23.66-7.62,53.14-21.73c3.47-1.42,5.72-4.8,5.69-8.55l-.17-23.27Z" fill="#FFFFFF"/>
                        </svg>
                     </div>
                 ) : (
                     /* Expanded: Horizontal Logo + OS Icon */
                     <div className="flex items-center gap-1">
                        {/* Horizontal Logo SVG */}
                        <div className="h-6 w-auto">
                            <svg viewBox="0 0 631.53 136.01" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Symbol Right (Amber) */}
                                <path d="M58.88,132.06c0,2.84,2.96,4.72,5.53,3.5l51-24.09c3.04-1.44,4.99-4.51,4.98-7.89l-.02-23.87v-1.81s-.06-60.95-.06-60.95c0-3.57-2.31-6.73-5.72-7.81L87.3.46c-5.29-1.68-10.7,2.27-10.69,7.83l.04,38.51c.01,11.07,7.12,20.88,17.63,24.32l23.61,7.78-53.28,21.38c-3.48,1.39-5.75,4.77-5.75,8.51l.02,23.27Z" fill="#f59e0b"/>
                                {/* Symbol Left (White) */}
                                <path d="M61.33,3.85c-.02-2.84-2.99-4.7-5.56-3.47L4.93,24.8C1.9,26.27-.02,29.35,0,32.73l.18,23.87v1.81s.47,60.94.47,60.94c.03,3.57,2.36,6.71,5.77,7.77l27.35,8.51c5.3,1.65,10.68-2.34,10.64-7.89l-.29-38.51c-.08-11.07-7.26-20.83-17.79-24.21l-23.66-7.62,53.14-21.73c3.47-1.42,5.72-4.8,5.69-8.55l-.17-23.27Z" fill="#FFFFFF"/>
                                {/* Text EXIMIA (White) */}
                                <g fill="#FFFFFF">
                                    <path d="M245.86,76.39c0-7.48-1.59-14.11-4.78-19.89-3.19-5.77-7.67-10.23-13.44-13.38-5.78-3.14-12.32-4.71-19.62-4.71s-14.28,1.61-20.1,4.85c-5.82,3.23-10.35,7.86-13.59,13.86-3.23,6.01-4.85,12.98-4.85,20.93s1.64,14.79,4.92,20.79c3.28,6.01,7.86,10.65,13.72,13.93,5.87,3.28,12.5,4.92,19.89,4.92,9.15,0,16.86-2.38,23.15-7.14,6.29-4.76,10.54-10.83,12.76-18.22h-20.93c-3.05,6.19-8.18,9.29-15.38,9.29-4.99,0-9.2-1.58-12.62-4.72-3.42-3.14-5.36-7.49-5.82-13.03h56.14c.37-2.22.55-4.71.55-7.49ZM189.31,70.85c.74-5.18,2.75-9.22,6.03-12.13,3.28-2.91,7.32-4.37,12.13-4.37,5.08,0,9.38,1.51,12.89,4.51,3.51,3,5.31,7,5.4,11.99h-36.46Z"/>
                                    <path d="M298.82,77.92l25.23-38.26h-20.8l-14.14,23.71-15.66-23.71h-21.9l25.37,38.26-25.09,38.54h20.8l14-23.84,15.8,23.84h21.9l-25.5-38.54Z"/>
                                    <path d="M347.28,43.48l-11.59-3.83v76.8h19.41v-62.16c0-4.91-3.15-9.27-7.82-10.81ZM337.91,24.75c-1.36.64-2.22,2-2.22,3.5v11.41l27.33-10.94v-15.8l-25.11,11.83Z"/>
                                    <path d="M493.22,47.21c-5.77-5.77-13.37-8.66-22.8-8.66-5.55,0-10.7,1.34-15.45,4.02-4.77,2.68-8.39,6.24-10.89,10.67-2.59-4.72-6.24-8.34-10.94-10.88-4.72-2.54-10.08-3.81-16.08-3.81-4.72,0-9.03.92-12.96,2.78-3.93,1.85-7.14,4.39-9.64,7.62v-9.29h-19.4v76.8h19.4v-42.42c0-6.01,1.55-10.6,4.64-13.79,3.1-3.19,7.32-4.79,12.68-4.79s9.42,1.6,12.47,4.79c3.05,3.19,4.58,7.78,4.58,13.79v42.42h19.4v-42.42c0-6.01,1.55-10.6,4.64-13.79,3.1-3.19,7.27-4.79,12.54-4.79s9.42,1.6,12.48,4.79c3.05,3.19,4.57,7.78,4.57,13.79v42.42h19.4v-45.05c0-10.35-2.89-18.42-8.66-24.19Z"/>
                                    <path d="M520.33,19.56v96.9h19.4V19.56h-19.4Z"/>
                                    <path d="M596.73,19.56h-22.59l-34.41,95.83-.38,1.07h20.38l6.38-18.44h38.54l6.38,18.44h20.51l-34.79-96.9ZM571.37,82.49l14-40.48,14,40.48h-28Z"/>
                                </g>
                            </svg>
                        </div>
                        
                        {/* OS Icon - Adjusted Alignment */}
                        <div className="flex items-center justify-center -translate-y-[2px]" title="Operating System">
                            <svg width="32" height="18" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* O: Thick Ring with a Nucleus Dot */}
                                <path 
                                    fillRule="evenodd" 
                                    clipRule="evenodd" 
                                    d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM10 14C12.2091 14 14 12.2091 14 10C14 7.79086 12.2091 6 10 6C7.79086 6 6 7.79086 6 10C6 12.2091 7.79086 14 10 14Z" 
                                    fill="#f59e0b"
                                />
                                <rect x="8.5" y="8.5" width="3" height="3" rx="0.5" fill="#f59e0b" />

                                {/* S: Geometric Blocky Style */}
                                <path 
                                    d="M23 6C21.8954 6 21 6.89543 21 8V10C21 11.1046 21.8954 12 23 12H27C27.5523 12 28 12.4477 28 13V14C28 14.5523 27.5523 15 27 15H21V18H27C29.2091 18 31 16.2091 31 14V12C31 10.8954 30.1046 10 29 10H25C24.4477 10 24 9.55228 24 9V8C24 7.44772 24.4477 7 25 7H31V4H25C22.7909 4 21 5.79086 21 8" 
                                    transform="translate(2 0)" 
                                    fill="#f59e0b"
                                />
                            </svg>
                        </div>
                     </div>
                 )}
             </div>
          </div>
      </div>

      {/* 2. Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        {renderSection(null, NAV_ITEMS_PERSONAL)}
        {renderSection('BUSINESS', NAV_ITEMS_BUSINESS)}
        {renderSection('CREATIVE', NAV_ITEMS_CREATIVE)}
        {renderSection('AI PLAYGROUND', NAV_ITEMS_AI)}
        {isAdmin && renderSection('ADMIN', NAV_ITEMS_ADMIN)}
      </div>

      {/* 3. Footer / User Area (Inverted Order) */}
      <div className="p-4 border-t border-[#1F1F22] bg-[#050505]">
        
        {/* Buttons (Top) */}
        <div className={`mb-4 flex ${isCollapsed ? 'flex-col items-center gap-4' : 'justify-between px-2'}`}>
             <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-zinc-600 hover:text-white transition-colors"
                aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
             >
                 {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
             </button>
             <div className={`flex ${isCollapsed ? 'flex-col' : ''} gap-2`}>
                 <button
                    onClick={toggleAdmin}
                    className={`transition-colors ${isAdmin ? 'text-amber-500 hover:text-amber-400' : 'text-zinc-600 hover:text-white'}`}
                    aria-label={isAdmin ? 'Desativar modo admin' : 'Ativar modo admin'}
                    title={isAdmin ? 'Admin Mode ON' : 'Admin Mode OFF'}
                 >
                     <Shield className="w-4 h-4" />
                 </button>
                 {!isCollapsed && (
                     <button className="text-zinc-600 hover:text-white transition-colors" aria-label="Configurações">
                         <Settings className="w-4 h-4" />
                     </button>
                 )}
             </div>
        </div>

        {/* User Profile (Bottom) */}
        <div className="relative">
            <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-3 w-full rounded-lg p-2 hover:bg-[#121214] border border-transparent hover:border-[#1F1F22] transition-all ${isCollapsed ? 'justify-center' : ''}`}
            >
                <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                    <User className="w-4 h-4 text-zinc-400" />
                </div>
                {!isCollapsed && (
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-bold text-white truncate">Hugo D.</p>
                        <p className="text-[10px] text-zinc-500 truncate">Admin Workspace</p>
                    </div>
                )}
            </button>
        </div>
      </div>
    </aside>
  );
};

// Helper Item Component
const SidebarItem: React.FC<{
  item: NavItem;
  depth?: number;
  isCollapsed: boolean;
  onNavigate: (id: string) => void;
  isActive: boolean;
  activePageId: string;
  isAiItem?: boolean;
  isAdminItem?: boolean;
}> = ({ item, depth = 0, isCollapsed, onNavigate, isActive, activePageId, isAiItem, isAdminItem }) => {
  const [isOpen, setIsOpen] = useState(isActive);
  const hasSubs = item.subItems && item.subItems.length > 0;
  
  const handleClick = () => {
    if (hasSubs && !isCollapsed) {
      setIsOpen(!isOpen);
    } else {
      onNavigate(item.id);
    }
  };

  const isItemActive = activePageId === item.id;

  // Determine icon color
  const getIconColorClass = () => {
      if (isActive || isItemActive) return 'text-white';
      // Items inside AI section keep purple/minds color
      if (isAiItem) return 'text-minds-500 group-hover:text-minds-400';
      // Items inside Admin section keep amber color
      if (isAdminItem) return 'text-amber-500 group-hover:text-amber-400';
      return 'text-zinc-600 group-hover:text-zinc-400';
  };

  // Determine background/border for active state
  const getActiveClass = () => {
      if ((isActive && depth === 0) || isItemActive) {
          if (isAiItem) return 'text-white bg-minds-500/10 border border-minds-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]';
          if (isAdminItem) return 'text-white bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
          return 'text-white bg-[#121214] border border-[#1F1F22]';
      }
      return 'text-zinc-500 hover:text-zinc-300 hover:bg-[#0A0A0A] border border-transparent';
  };

  return (
    <div className="relative">
      <div 
        onClick={handleClick}
        title={isCollapsed ? item.label : undefined}
        className={`
          group flex items-center w-full py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 mb-1
          ${depth > 0 ? 'pl-9 text-xs' : 'text-xs font-medium'}
          ${isCollapsed ? 'justify-center px-2' : 'justify-between'}
          ${getActiveClass()}
        `}
      >
        <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
          {item.icon && (
            <item.icon className={`
                ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} 
                ${getIconColorClass()}
                transition-all duration-200
            `} />
          )}
          {!isCollapsed && (
              <span className={`uppercase tracking-wide ${(isAiItem || isAdminItem) && !isItemActive ? 'text-zinc-400 group-hover:text-white' : ''}`}>
                  {item.label}
              </span>
          )}
        </div>
        
        {!isCollapsed && hasSubs && (
            <span className={`text-zinc-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-3 h-3" />
            </span>
        )}
      </div>

      {/* Submenu */}
      {hasSubs && isOpen && !isCollapsed && (
        <div className="mt-1 space-y-0.5 relative">
          <div className={`absolute left-[1.15rem] top-0 bottom-2 w-[1px] ${isAiItem ? 'bg-minds-500/30' : isAdminItem ? 'bg-amber-500/30' : 'bg-[#1F1F22]'}`} />

          {item.subItems!.map((sub) => (
            <SidebarItem
              key={sub.id}
              item={sub}
              depth={depth + 1}
              isCollapsed={isCollapsed}
              onNavigate={onNavigate}
              isActive={false}
              activePageId={activePageId}
              isAiItem={isAiItem}
              isAdminItem={isAdminItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};
