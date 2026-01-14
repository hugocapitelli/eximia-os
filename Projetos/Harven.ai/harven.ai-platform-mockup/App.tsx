



import React, { useState, useEffect } from 'react';
import { ViewType, UserRole } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './views/Login';
import StudentDashboard from './views/StudentDashboard';
import StudentAchievements from './views/StudentAchievements';
import StudentHistory from './views/StudentHistory';
import CourseList from './views/CourseList';
import CourseDetails from './views/CourseDetails';
import CourseEdit from './views/CourseEdit';
import ChapterDetail from './views/ChapterDetail';
import ChapterReader from './views/ChapterReader';
import InstructorList from './views/InstructorList';
import InstructorDetail from './views/InstructorDetail';
import DisciplineEdit from './views/DisciplineEdit';
import ContentCreation from './views/ContentCreation';
import ContentRevision from './views/ContentRevision';
import AdminConsole from './views/AdminConsole';
import AdminClassManagement from './views/AdminClassManagement';
import UserManagement from './views/UserManagement';
import SystemSettings from './views/SystemSettings';
import UserProfile from './views/UserProfile';
import AccountSettings from './views/AccountSettings';
import { useSettings } from './contexts/SettingsContext';

const App: React.FC = () => {
  const { settings, loading: settingsLoading } = useSettings();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('STUDENT_DASHBOARD');
  const [userRole, setUserRole] = useState<UserRole>('STUDENT');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Pilha de histórico para navegação "Voltar" correta
  const [historyStack, setHistoryStack] = useState<ViewType[]>([]);
  const [activeResourceId, setActiveResourceId] = useState<any>(null);

  const handleNavigate = (view: ViewType, data?: any) => {
    // Se a view for a mesma, mas os dados mudaram, forçamos um re-render/update
    // Mas aqui como é React simples, setar o state deve bastar
    if (data !== undefined) setActiveResourceId(data);
    setCurrentView(view);

    // Adiciona ao histórico apenas se for mudança de view
    if (currentView !== view) {
      setHistoryStack((prev) => [...prev, currentView]);
    }
  };

  const handleBack = () => {
    setHistoryStack((prev) => {
      const newStack = [...prev];
      const previousView = newStack.pop();
      if (previousView) {
        setCurrentView(previousView);
      }
      return newStack;
    });
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);

    // Redireciona para a view inicial correta baseada no papel
    if (role === 'ADMIN') {
      setCurrentView('ADMIN_CONSOLE');
    } else if (role === 'INSTRUCTOR') {
      setCurrentView('INSTRUCTOR_LIST');
    } else {
      setCurrentView('STUDENT_DASHBOARD');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sb-access-token');
    localStorage.removeItem('user-data');
    setHistoryStack([]);
    setCurrentView('STUDENT_DASHBOARD'); // Reset para default
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
        // Não reseta a view se já estiver em uma URL específica (mas como é SPA simples, mantemos o default ou dashboard)
        if (user.role === 'STUDENT') setCurrentView('STUDENT_DASHBOARD');
        else if (user.role === 'INSTRUCTOR') setCurrentView('INSTRUCTOR_LIST');
        else if (user.role === 'ADMIN') setCurrentView('ADMIN_CONSOLE');
      } catch (e) {
        console.error("Erro ao restaurar sessão:", e);
        // Se falhar, limpa tudo
        localStorage.removeItem('sb-access-token');
        localStorage.removeItem('user-data');
      }
    }
  }, []);

  const renderView = () => {
    // Helper to get ID whether it's string or object
    const getId = (data: any) => typeof data === 'object' && data !== null ? data.id : data;

    switch (currentView) {
      case 'STUDENT_DASHBOARD': return <StudentDashboard />;
      case 'STUDENT_ACHIEVEMENTS':
        if (!settings.module_gamification && userRole === 'STUDENT') return <StudentDashboard />;
        return <StudentAchievements />;
      case 'STUDENT_HISTORY': return <StudentHistory />;
      case 'COURSE_LIST': return <CourseList onNavigate={handleNavigate} userRole={userRole} />;
      case 'COURSE_DETAILS': return <CourseDetails onNavigate={handleNavigate} userRole={userRole} courseId={getId(activeResourceId)} />;
      case 'COURSE_EDIT': return <CourseEdit onNavigate={handleNavigate} />;
      case 'CHAPTER_DETAIL': return <ChapterDetail onNavigate={handleNavigate} chapterId={getId(activeResourceId)} />;
      case 'CHAPTER_READER': return <ChapterReader userRole={userRole} />;
      case 'INSTRUCTOR_LIST': return <InstructorList onNavigate={handleNavigate} />;
      case 'INSTRUCTOR_DETAIL': return <InstructorDetail onNavigate={handleNavigate} disciplineId={getId(activeResourceId)} />;
      case 'DISCIPLINE_EDIT':
        const dEditId = getId(activeResourceId);
        const dEditTab = typeof activeResourceId === 'object' ? activeResourceId.tab : 'info';
        return <DisciplineEdit onNavigate={handleNavigate} disciplineId={dEditId} initialTab={dEditTab} />;
      case 'CONTENT_CREATION': return <ContentCreation onNavigate={handleNavigate} chapterId={getId(activeResourceId)} />;
      case 'CONTENT_REVISION': return <ContentRevision onNavigate={handleNavigate} />;
      case 'ADMIN_CONSOLE': return <AdminConsole onNavigate={handleNavigate} />;
      case 'ADMIN_CLASSES': return <AdminClassManagement onNavigate={handleNavigate} />;
      case 'USER_MANAGEMENT': return <UserManagement />;
      case 'SYSTEM_SETTINGS': return <SystemSettings />;
      case 'USER_PROFILE': return <UserProfile onNavigate={handleNavigate} />;
      case 'ACCOUNT_SETTINGS': return <AccountSettings onNavigate={handleNavigate} />;
      default: return <div className="p-10 text-center">View não encontrada: {currentView}</div>;
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'STUDENT_DASHBOARD': return 'Dashboard do Aluno';
      case 'STUDENT_ACHIEVEMENTS': return 'Minhas Conquistas';
      case 'STUDENT_HISTORY': return 'Histórico de Atividades';
      case 'COURSE_LIST': return 'Meus Cursos';
      case 'COURSE_DETAILS': return 'Detalhes do Curso';
      case 'COURSE_EDIT': return 'Editor de Curso';
      case 'CHAPTER_DETAIL': return 'Visão Geral do Capítulo';
      case 'CHAPTER_READER': return 'Leitura e Prática Socrática';
      case 'INSTRUCTOR_LIST': return 'Portal do Instrutor';
      case 'INSTRUCTOR_DETAIL': return 'Gestão de Disciplina';
      case 'DISCIPLINE_EDIT': return 'Editor de Disciplina';
      case 'CONTENT_CREATION': return 'Adicionar Conteúdo';
      case 'CONTENT_REVISION': return 'Revisão de Conteúdo AI';
      case 'ADMIN_CONSOLE': return 'Console de Administração';
      case 'ADMIN_CLASSES': return 'Gestão de Turmas';
      case 'USER_MANAGEMENT': return 'Gestão de Usuários';
      case 'SYSTEM_SETTINGS': return 'Configurações do Sistema';
      case 'USER_PROFILE': return 'Meu Perfil';
      case 'ACCOUNT_SETTINGS': return 'Minha Conta';
      default: return settings.platform_name || 'Harven.ai';
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (settingsLoading) {
    return <div className="flex h-screen w-full items-center justify-center bg-harven-bg">Carregando configurações...</div>;
  }

  return (
    <div className="flex h-screen w-full bg-harven-bg dark:bg-gray-950 overflow-hidden">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        userRole={userRole}
        logoUrl={settings.logo_url} // Usa do Context
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={getPageTitle()}
          onNavigate={handleNavigate}
          currentView={currentView}
          onBack={historyStack.length > 0 ? handleBack : undefined}
          logoUrl={settings.logo_url} // Usa do Context
          userRole={userRole}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto no-scrollbar">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
