
import React, { useState, useEffect, useRef } from 'react';
import { ViewType, UserRole } from '../types';

interface HeaderProps {
  title: string;
  onNavigate: (view: ViewType) => void;
  currentView: ViewType;
  onBack?: () => void;
  logoUrl: string;
  userRole: UserRole;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onNavigate, currentView, onBack, logoUrl, userRole, onLogout }) => {
  const [imgError, setImgError] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  // Fecha o dropdown se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserData = () => {
    switch (userRole) {
      case 'STUDENT': return { name: 'Lucas Martins', roleLabel: 'Aluno', img: 'https://picsum.photos/seed/student/100/100' };
      case 'INSTRUCTOR': return { name: 'Elena Vance', roleLabel: 'Instrutor', img: 'https://picsum.photos/seed/teacher/100/100' };
      case 'ADMIN': return { name: 'Administrador', roleLabel: 'Admin', img: 'https://picsum.photos/seed/admin/100/100' };
      default: return { name: 'Usuário', roleLabel: 'Visitante', img: 'https://picsum.photos/seed/user/100/100' };
    }
  };

  const userData = getUserData();

  return (
    <header className="h-16 bg-harven-dark border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0 z-20">
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
            title="Voltar"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        )}
        <div className="flex items-center text-sm text-gray-400 font-display">
          {!imgError && (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-8 w-auto mr-3 cursor-pointer hover:opacity-80 object-contain"
              onClick={() => onNavigate('STUDENT_DASHBOARD')}
              onError={() => setImgError(true)}
            />
          )}
          {imgError && (
            <span className="material-symbols-outlined text-[20px] mr-2 text-primary">token</span>
          )}
          <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
          <span className="text-white font-medium">{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">search</span>
          <input
            className="bg-[#152214] text-gray-200 text-sm rounded-lg pl-10 pr-4 py-1.5 border border-white/5 focus:outline-none focus:border-primary w-64 placeholder-gray-600 transition-all"
            placeholder="Pesquisar..."
            type="text"
          />
        </div>

        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-harven-dark"></span>
        </button>

        <button className="p-2 text-gray-400 hover:text-white transition-colors mr-2">
          <span className="material-symbols-outlined">help</span>
        </button>

        <div className="h-8 w-px bg-white/10 mx-1"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 hover:bg-white/5 py-1 px-2 rounded-lg transition-colors group outline-none"
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-white text-xs font-bold leading-none">{userData.name}</span>
              <span className="text-gray-400 text-[10px] font-medium leading-none mt-1">{userData.roleLabel}</span>
            </div>
            <img
              src={userData.img}
              alt="User"
              className={`size-9 rounded-full border-2 object-cover transition-all ${isProfileOpen ? 'border-primary' : 'border-harven-gold group-hover:border-white'}`}
            />
            <span className={`material-symbols-outlined text-gray-400 text-[18px] transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 border border-harven-border dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                <p className="text-sm font-bold text-harven-dark dark:text-white">{userData.name}</p>
                <p className="text-xs text-gray-500">{userRole === 'ADMIN' ? 'admin@harven.edu' : 'usuario@harven.edu'}</p>
              </div>

              <button
                onClick={() => { onNavigate('ACCOUNT_SETTINGS'); setIsProfileOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-harven-dark dark:hover:text-white flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Configurações da Conta
              </button>

              <button
                onClick={() => { onNavigate('USER_PROFILE'); setIsProfileOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-harven-dark dark:hover:text-white flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                Meu Perfil
              </button>

              <div className="my-1 border-t border-gray-100 dark:border-gray-700"></div>

              <button
                onClick={() => { onLogout(); setIsProfileOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sair da Plataforma
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
