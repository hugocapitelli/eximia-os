import React, { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './views/Login';
import AppRoutes from './routes';
import { useSettings } from './contexts/SettingsContext';

// Componente interno que usa os hooks do Router
const AppContent: React.FC = () => {
  const { settings, loading: settingsLoading } = useSettings();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('STUDENT');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);

    // Redireciona para a view inicial correta baseada no papel
    if (role === 'ADMIN') {
      navigate('/admin');
    } else if (role === 'INSTRUCTOR') {
      navigate('/instructor');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sb-access-token');
    localStorage.removeItem('user-data');
    navigate('/');
  };

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('sb-access-token');
    const userData = localStorage.getItem('user-data');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setIsAuthenticated(true);
        setUserRole(user.role as UserRole);

        // Se estiver na raiz, redireciona para a página inicial do role
        if (location.pathname === '/') {
          if (user.role === 'STUDENT') navigate('/dashboard');
          else if (user.role === 'INSTRUCTOR') navigate('/instructor');
          else if (user.role === 'ADMIN') navigate('/admin');
        }
      } catch (e) {
        console.error("Erro ao restaurar sessão:", e);
        localStorage.removeItem('sb-access-token');
        localStorage.removeItem('user-data');
      }
    }
  }, []);

  // Mapeamento de rotas para títulos
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === '/dashboard') return 'Dashboard do Aluno';
    if (path === '/achievements') return 'Minhas Conquistas';
    if (path === '/history') return 'Histórico de Atividades';
    if (path === '/courses') return 'Meus Cursos';
    if (path.match(/^\/course\/[^/]+$/)) return 'Detalhes do Curso';
    if (path.match(/^\/course\/[^/]+\/edit$/)) return 'Editor de Curso';
    if (path.match(/^\/course\/[^/]+\/chapter\/[^/]+$/)) return 'Visão Geral do Capítulo';
    if (path.match(/^\/course\/[^/]+\/chapter\/[^/]+\/content\/[^/]+$/)) return 'Leitura e Prática Socrática';
    if (path.match(/^\/course\/[^/]+\/chapter\/[^/]+\/new-content$/)) return 'Adicionar Conteúdo';
    if (path.match(/^\/course\/[^/]+\/chapter\/[^/]+\/content\/[^/]+\/revision$/)) return 'Revisão de Conteúdo AI';
    if (path === '/instructor') return 'Portal do Instrutor';
    if (path.match(/^\/instructor\/class\/[^/]+$/)) return 'Gestão de Turma';
    if (path.match(/^\/instructor\/discipline\/[^/]+/)) return 'Editor de Disciplina';
    if (path === '/admin') return 'Console de Administração';
    if (path === '/admin/classes') return 'Gestão de Turmas';
    if (path === '/admin/users') return 'Gestão de Usuários';
    if (path === '/admin/settings') return 'Configurações do Sistema';
    if (path === '/profile') return 'Meu Perfil';
    if (path === '/account') return 'Minha Conta';

    return settings.platform_name || 'Harven.ai';
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (settingsLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-harven-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-harven-bg dark:bg-gray-950 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        userRole={userRole}
        logoUrl={settings.logo_url}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={getPageTitle()}
          userRole={userRole}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto no-scrollbar">
          <AppRoutes
            userRole={userRole}
            gamificationEnabled={settings.module_gamification}
          />
        </main>
      </div>
    </div>
  );
};

// Componente principal que envolve tudo com BrowserRouter
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
