import React, { useContext, useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { Search, Moon, Sun, Bell, ChevronDown, Library, ArrowLeft, Settings, LogOut, User as UserIcon, Printer } from 'lucide-react';
import { ThemeContext, SearchContext } from '../App';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const { user } = useUser();

  // User Dropdown State
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  // Different header styles based on route
  const isDashboard = location.pathname === '/';
  const isBookDetail = location.pathname.startsWith('/books/');
  const isProfile = location.pathname === '/profile';
  const isCategory = location.pathname.startsWith('/category/');
  const isExport = location.pathname === '/export';

  // Default user data if not loaded yet
  const currentUser = user || { name: 'Usuário', email: 'usuario@biblioteca.com', avatar_url: null };

  // Common User Avatar Component
  const UserProfileDropdown = () => (
    <div className="relative" ref={userMenuRef}>
      <div
        className={`flex items-center gap-3 cursor-pointer pl-2 ${isDashboard ? 'border-l border-slate-200 dark:border-[#232f48]' : ''}`}
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
      >
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">{currentUser.name}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Pro Member</span>
        </div>
        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-slate-200 dark:border-[#232f48] hover:border-primary transition-colors">
          {currentUser.avatar_url ? (
            <div className="bg-center bg-no-repeat h-full w-full bg-cover" style={{ backgroundImage: `url("${currentUser.avatar_url}")` }}></div>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <ChevronDown className="text-slate-400 text-sm hidden sm:block" size={16} />
      </div>

      {/* Dropdown Menu */}
      {isUserMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700">
            <p className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
            <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
          </div>
          <div className="p-2">
            <button
              onClick={() => { navigate('/profile'); setIsUserMenuOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <UserIcon size={16} />
              Perfil
            </button>
            <button
              onClick={() => { navigate('/export'); setIsUserMenuOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <Printer size={16} />
              Imprimir Etiquetas
            </button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
              <Settings size={16} />
              Configurações
            </button>
          </div>
          <div className="p-2 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isExport) {
    return (
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-[#232f48] bg-white dark:bg-[#111722] px-6 py-4 md:px-10 print:hidden">
        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#232f48] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-bold leading-tight">Central de Etiquetas</h2>
        </div>
        <div className="flex flex-1 justify-end gap-4 items-center">
          <button onClick={toggleTheme} className="flex items-center justify-center rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#232f48] transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-[#232f48] mx-1"></div>
          <UserProfileDropdown />
        </div>
      </header>
    )
  }

  if (isBookDetail) {
    return (
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-[#232f48] bg-white dark:bg-background-dark/95 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          <div className="text-primary size-8 flex items-center justify-center bg-primary/10 rounded-lg">
            <Library size={20} />
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Biblioteca</h2>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <div className="hidden md:flex w-full max-w-xs">
            <div className="flex w-full items-center rounded-lg bg-slate-100 dark:bg-[#232f48] border border-transparent focus-within:border-primary/50 transition-colors">
              <div className="pl-3 text-slate-400"><Search size={18} /></div>
              <input
                className="w-full bg-transparent border-none text-sm px-3 py-2 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <UserProfileDropdown />
        </div>
      </header>
    );
  }

  if (isProfile) {
    return (
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-[#232f48] bg-white dark:bg-[#111722] px-6 py-4 md:px-10">
        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#232f48] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-bold leading-tight">Perfil</h2>
        </div>
        <div className="flex flex-1 justify-end gap-4 items-center">
          <button onClick={toggleTheme} className="flex items-center justify-center rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#232f48] transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-[#232f48] mx-1"></div>
          <UserProfileDropdown />
        </div>
      </header>
    )
  }

  if (isCategory) {
    return (
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-[#232f48] bg-white dark:bg-[#111722] px-6 py-4 md:px-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#232f48] transition-colors">
            <ArrowLeft size={20} className="text-slate-900 dark:text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">DESENVOLVIMENTO PESSOAL</h1>
            <p className="text-sm font-normal text-slate-500 dark:text-[#92a4c9]">18 books</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center rounded-lg bg-[#f0f2f4] dark:bg-[#232f48] px-3 py-2">
            <Search size={18} className="text-slate-500" />
            <input
              className="bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none w-48 lg:w-64 ml-2"
              placeholder="Search books..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-[#232f48] mx-1"></div>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center size-10 rounded-full bg-[#f0f2f4] dark:bg-[#232f48] hover:bg-slate-200 dark:hover:bg-[#2d3b55] transition text-slate-900 dark:text-white">
              <Bell size={20} />
            </button>
            <UserProfileDropdown />
          </div>
        </div>
      </header>
    );
  }

  // Dashboard Header
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-[#232f48] bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm px-6 py-3 lg:px-10 print:hidden">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex items-center justify-center text-primary">
            <Library size={28} />
          </div>
          <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">Biblioteca</h2>
        </div>
        <div className="hidden md:flex items-center w-full max-w-md min-w-[320px]">
          <div className="relative w-full text-slate-400 focus-within:text-primary transition-colors">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} />
            </div>
            <input
              className="block w-full rounded-lg border-none bg-slate-100 dark:bg-[#232f48] py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search your library..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 lg:gap-6">
        <button className="flex md:hidden items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
          <Search size={24} />
        </button>
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#232f48] transition-colors"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default Header;