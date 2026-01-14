
import React, { useState, useEffect } from 'react';
import { ViewType, UserRole } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  isOpen: boolean;
  onToggle: () => void;
  userRole: UserRole;
  logoUrl: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, userRole, logoUrl }) => {
  const { settings } = useSettings();
  const [imgError, setImgError] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  // Reseta o erro quando a URL do logo muda (ex: novo upload)
  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('harven-theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('harven-theme', 'dark');
      setIsDark(true);
    }
  };

  const NavItem = ({ icon, label, view, activeView }: { icon: string, label: string, view: ViewType, activeView: ViewType }) => {
    const isActive = activeView === view ||
      (view === 'COURSE_LIST' && (activeView === 'COURSE_DETAILS' || activeView === 'CHAPTER_DETAIL' || activeView === 'CHAPTER_READER')) ||
      (view === 'INSTRUCTOR_LIST' && (activeView === 'INSTRUCTOR_DETAIL' || activeView === 'CONTENT_REVISION' || activeView === 'DISCIPLINE_EDIT' || activeView === 'COURSE_EDIT'));

    return (
      <button
        onClick={() => onNavigate(view)}
        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group w-full text-left
          ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isActive ? 'fill-1' : ''}`}>{icon}</span>
        {isOpen && <span className="text-sm font-medium animate-in fade-in duration-200">{label}</span>}
      </button>
    );
  };

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} h-full bg-harven-sidebar flex flex-col flex-shrink-0 transition-all duration-300 z-30 border-r border-white/5`}>
      <div className="h-16 flex items-center justify-between px-3 border-b border-white/10 gap-2 overflow-hidden relative">
        <div
          onClick={() => onNavigate(userRole === 'STUDENT' ? 'STUDENT_DASHBOARD' : userRole === 'INSTRUCTOR' ? 'INSTRUCTOR_LIST' : 'ADMIN_CONSOLE')}
          className="flex items-center gap-3 cursor-pointer transition-transform hover:scale-105 origin-left px-3"
        >
          {isOpen ? (
            !imgError ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="h-10 w-auto object-contain animate-in fade-in duration-200"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-white text-xl font-bold tracking-tight font-display whitespace-nowrap animate-in fade-in">PLATAFORMA</span>
            )
          ) : (
            !imgError ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="size-8 object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="size-8 rounded bg-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-harven-dark font-bold text-xl">token</span>
              </div>
            )
          )}
        </div>

        {/* Dark Mode Toggle */}
        {settings.module_dark_mode && isOpen && (
          <button
            onClick={toggleTheme}
            className="text-gray-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-white/5 absolute right-4"
            title={isDark ? "Mudar para Claro" : "Mudar para Escuro"}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">

        {userRole === 'STUDENT' && (
          <>
            {isOpen && <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 animate-in slide-in-from-left-2">Área do Aluno</p>}
            <NavItem icon="dashboard" label="Dashboard" view="STUDENT_DASHBOARD" activeView={currentView} />
            <NavItem icon="school" label="Meus Cursos" view="COURSE_LIST" activeView={currentView} />
            <NavItem icon="history" label="Histórico" view="STUDENT_HISTORY" activeView={currentView} />
            {settings.module_gamification && (
              <NavItem icon="emoji_events" label="Conquistas" view="STUDENT_ACHIEVEMENTS" activeView={currentView} />
            )}

            <div className="my-2 h-px bg-white/5"></div>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all group w-full text-left text-gray-400 hover:bg-white/5 hover:text-white"
            >
              <span className="material-symbols-outlined text-[22px]">contact_page</span>
              {isOpen && (
                <div className="flex-1 flex items-center justify-between animate-in fade-in duration-200">
                  <span className="text-sm font-medium">Portal do Aluno</span>
                  <span className="material-symbols-outlined text-[16px] opacity-50 group-hover:opacity-100 transition-opacity">open_in_new</span>
                </div>
              )}
            </a>
          </>
        )}

        {userRole === 'INSTRUCTOR' && (
          <>
            {isOpen && <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 animate-in slide-in-from-left-2">Acadêmico</p>}
            <NavItem icon="groups" label="Minhas Turmas" view="INSTRUCTOR_LIST" activeView={currentView} />
          </>
        )}

        {userRole === 'ADMIN' && (
          <>
            {isOpen && <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 animate-in slide-in-from-left-2">Administração</p>}
            <NavItem icon="admin_panel_settings" label="Console Geral" view="ADMIN_CONSOLE" activeView={currentView} />
            <NavItem icon="class" label="Gestão de Turmas" view="ADMIN_CLASSES" activeView={currentView} />
            <NavItem icon="group" label="Usuários" view="USER_MANAGEMENT" activeView={currentView} />
            <NavItem icon="settings" label="Configurações" view="SYSTEM_SETTINGS" activeView={currentView} />
          </>
        )}

      </div>
    </aside>
  );
};

export default Sidebar;
