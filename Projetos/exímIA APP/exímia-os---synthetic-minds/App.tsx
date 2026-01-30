
import React, { useState } from 'react';
import './src/test-connection'; // Auto-test Supabase connection
import { Sidebar } from './components/organisms/Sidebar';
import { DesignSystemViewer } from './components/pages/DesignSystemViewer';
import { DesignSystemLibrary } from './components/pages/DesignSystemLibrary';
import { JourneyDashboard } from './components/pages/JourneyDashboard';
import { JourneyGoals } from './components/pages/JourneyGoals';
import { JourneyHabits } from './components/pages/JourneyHabits';
import { JourneyLibrary } from './components/pages/JourneyLibrary';
import { JourneyBooks } from './components/pages/JourneyBooks';
import { JourneyAuthors } from './components/pages/JourneyAuthors';
import { JourneyCalendar } from './components/pages/JourneyCalendar';
import { AcademyDashboard } from './components/pages/AcademyDashboard';
import { AcademyLesson } from './components/pages/AcademyLesson';
import { AcademyCatalog } from './components/pages/AcademyCatalog';
import { AcademyAchievements } from './components/pages/AcademyAchievements';
import { AcademyTracks } from './components/pages/AcademyTracks';
import { AcademyCommunity } from './components/pages/AcademyCommunity';
import { AcademyFavorites } from './components/pages/AcademyFavorites';
import { AcademyAdminEditor } from './components/pages/AcademyAdminEditor';
import { AcademySkillTree } from './components/pages/AcademySkillTree';
import { AcademyProgress } from './components/pages/AcademyProgress';
import { AcademySocraticSessions } from './components/pages/AcademySocraticSessions';
import { BrandDashboard } from './components/pages/BrandDashboard';
import { BrandVisualIdentity } from './components/pages/BrandVisualIdentity';
import { BrandVoice } from './components/pages/BrandVoice';
import { BrandAssets } from './components/pages/BrandAssets';
import { Inbox } from './components/pages/Inbox';
import { CourseDesigner } from './components/pages/CourseDesigner';
import { FinanceDashboard } from './components/pages/FinanceDashboard';
import { FinanceRevenues } from './components/pages/FinanceRevenues';
import { FinanceExpenses } from './components/pages/FinanceExpenses';
import { FinanceProjections } from './components/pages/FinanceProjections';
import { FinanceSaaSMetrics } from './components/pages/FinanceSaaSMetrics';
import { FinanceReports } from './components/pages/FinanceReports';
import { StrategyDashboard } from './components/pages/StrategyDashboard';
import { StrategyCycles } from './components/pages/StrategyCycles';
import { StrategyInitiatives } from './components/pages/StrategyInitiatives';
import { StrategyKPIs } from './components/pages/StrategyKPIs';
import { StrategyRoadmap } from './components/pages/StrategyRoadmap';
import { SyntheticMinds } from './components/pages/SyntheticMinds';
import { MindDetail } from './components/pages/MindDetail';
import { TeamDashboard } from './components/pages/TeamDashboard';
import { UserManagement } from './components/pages/UserManagement';
import { ContentDashboard } from './components/pages/ContentDashboard';
import { ContentCurator } from './components/pages/ContentCurator';
import { ContentSocial } from './components/pages/ContentSocial';
import { ContentNewsletter } from './components/pages/ContentNewsletter';
import { ContentCopyBank } from './components/pages/ContentCopyBank';
import { ContentEbooks } from './components/pages/ContentEbooks';
import { ContentVideos } from './components/pages/ContentVideos';
import { BookDetailPage } from './components/pages/BookDetailPage';
import { AuthorDetailPage } from './components/pages/AuthorDetailPage';
import { ReadingPage } from './components/reading/ReadingPage';
import { AdminAcademyStudio } from './components/pages/AdminAcademyStudio';
import { AdminTrackManager } from './components/pages/AdminTrackManager';
import { AdminHeroCarouselEditor } from './components/pages/AdminHeroCarouselEditor';
import { AdminLibraryBooks } from './components/pages/AdminLibraryBooks';
import { AdminLibraryAuthors } from './components/pages/AdminLibraryAuthors';
import { AdminDSComponents } from './components/pages/AdminDSComponents';
import { AdminDSTokens } from './components/pages/AdminDSTokens';
import { AdminSettings } from './components/pages/AdminSettings';

export default function App() {
  const [activePage, setActivePage] = useState<string>('content-dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedDSId, setSelectedDSId] = useState<string>('eximia-os-v6');
  const [selectedMindId, setSelectedMindId] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedAuthorName, setSelectedAuthorName] = useState<string | null>(null);

  // Helper for Academy navigation
  const handleAcademyNavigation = (courseId: string) => {
      setSelectedCourseId(courseId);
      setActivePage('academy-lesson');
  };

  // Helper for Academy Editor navigation
  const handleAcademyEdit = (courseId: string) => {
      setSelectedCourseId(courseId);
      setActivePage('academy-editor');
  };

  // Helper for Academy Page switching
  const handleAcademyPageChange = (pageId: string) => {
      setActivePage(pageId);
  }

  // Helper for DS navigation
  const handleDSNavigation = (dsId: string) => {
      setSelectedDSId(dsId);
      setActivePage('ds-viewer');
  };

  // Page Content Renderer
  const renderContent = () => {
    switch (activePage) {
      // Inbox Route
      case 'inbox': return <Inbox />;

      // Finance Routes
      case 'finance-dashboard': return <FinanceDashboard />;
      case 'finance-transactions': return <FinanceDashboard />;
      case 'finance-revenues': return <FinanceRevenues onBack={() => setActivePage('finance-dashboard')} />;
      case 'finance-expenses': return <FinanceExpenses onBack={() => setActivePage('finance-dashboard')} />;
      case 'finance-projections': return <FinanceProjections onBack={() => setActivePage('finance-dashboard')} />;
      case 'finance-saas': return <FinanceSaaSMetrics onBack={() => setActivePage('finance-dashboard')} />;
      case 'finance-reports': return <FinanceReports onBack={() => setActivePage('finance-dashboard')} />;

      // Strategy Routes
      case 'strategy-dashboard': return <StrategyDashboard />;
      case 'strategy-forge': return <StrategyDashboard />;
      case 'strategy-warroom': return <StrategyDashboard />;
      case 'strategy-cycles': return <StrategyCycles onBack={() => setActivePage('strategy-dashboard')} />;
      case 'strategy-initiatives': return <StrategyInitiatives onBack={() => setActivePage('strategy-dashboard')} />;
      case 'strategy-kpis': return <StrategyKPIs onBack={() => setActivePage('strategy-dashboard')} />;
      case 'strategy-roadmap': return <StrategyRoadmap onBack={() => setActivePage('strategy-dashboard')} />;

      // Content Routes (New)
      case 'content': return <ContentDashboard />;
      case 'content-dashboard': return <ContentDashboard />;
      case 'content-courses': return <CourseDesigner />;
      case 'course-designer': return <CourseDesigner />; // Keep legacy route just in case
      case 'content-curator': return <ContentCurator />;
      case 'content-ebooks': return <ContentEbooks />;
      case 'content-social': return <ContentSocial />;
      case 'content-newsletter': return <ContentNewsletter />;
      case 'content-videos': return <ContentVideos />;
      case 'content-copies': return <ContentCopyBank />;

      // Team Route (Expanded)
      case 'team': return <TeamDashboard view="overview" />;
      case 'team-dashboard': return <TeamDashboard view="overview" />;
      case 'team-org': return <TeamDashboard view="org" />;
      case 'team-members': return <TeamDashboard view="members" />;
      case 'team-hiring': return <TeamDashboard view="hiring" />;
      case 'team-onboarding': return <TeamDashboard view="onboarding" />;
      case 'team-performance': return <TeamDashboard view="performance" />;
      case 'team-rituals': return <TeamDashboard view="rituals" />;
      case 'team-culture': return <TeamDashboard view="culture" />;
      case 'team-comms': return <TeamDashboard view="comms" />;
      case 'team-offboarding': return <TeamDashboard view="offboarding" />;
      case 'team-management': return <UserManagement />;

      // Journey Routes
      case 'journey-dashboard': return <JourneyDashboard />;
      case 'journey-goals': return <JourneyGoals />;
      case 'journey-habits': return <JourneyHabits />;
      case 'journey-calendar': return <JourneyCalendar onBack={() => setActivePage('journey-dashboard')} />;

      // Biblioteca (Independent)
      case 'biblioteca': return <JourneyLibrary onNavigateToBook={(bookId) => { setSelectedBookId(bookId); setActivePage('book-detail'); }} onNavigateToAuthor={(authorName) => { setSelectedAuthorName(authorName); setActivePage('author-detail'); }} />;
      case 'journey-library': return <JourneyLibrary onNavigateToBook={(bookId) => { setSelectedBookId(bookId); setActivePage('book-detail'); }} onNavigateToAuthor={(authorName) => { setSelectedAuthorName(authorName); setActivePage('author-detail'); }} />;
      case 'journey-books': return <JourneyBooks onBack={() => setActivePage('biblioteca')} />;
      case 'journey-authors': return <JourneyAuthors onBack={() => setActivePage('biblioteca')} />;
      case 'book-detail': return selectedBookId ? <BookDetailPage bookId={selectedBookId} onBack={() => setActivePage('biblioteca')} onNavigateToAuthor={(authorName) => { setSelectedAuthorName(authorName); setActivePage('author-detail'); }} onNavigateToCourse={handleAcademyNavigation} onStartReading={() => setActivePage('book-reading')} /> : <JourneyLibrary />;
      case 'book-reading': return selectedBookId ? (
        <ReadingPage
          bookId={selectedBookId}
          bookTitle="Deep Work"
          chapters={[
            { id: '1', number: 1, title: 'Introdução', subtitle: 'Por que o foco profundo importa', content: '<p>O trabalho profundo é a capacidade de focar sem distração em uma tarefa cognitivamente exigente. É uma habilidade que permite dominar informações complexas rapidamente e produzir resultados melhores em menos tempo.</p><p>Neste livro, Cal Newport argumenta que em um mundo cada vez mais distraído, aqueles que conseguem cultivar a capacidade de trabalho profundo prosperarão.</p><blockquote>"O trabalho profundo é tão importante que podemos considerar uma superpotência do século XXI."</blockquote><p>Newport divide as estratégias em quatro categorias principais que serão exploradas nos próximos capítulos.</p>' },
            { id: '2', number: 2, title: 'A Ideia', subtitle: 'O que é trabalho profundo', content: '<p>Trabalho profundo são atividades profissionais realizadas em um estado de concentração sem distrações que levam suas capacidades cognitivas ao limite.</p><h2>Características do Trabalho Profundo</h2><ul><li>Requer concentração total</li><li>Produz valor significativo</li><li>É difícil de replicar</li><li>Melhora suas habilidades</li></ul><p>Em contraste, trabalho superficial são tarefas de tipo logístico que podem ser realizadas enquanto distraído. Essas tarefas não criam muito valor novo e são fáceis de replicar.</p>' },
            { id: '3', number: 3, title: 'A Arte do Foco Profundo', content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><blockquote>"O trabalho profundo é a capacidade de focar sem distração em uma tarefa cognitivamente exigente."</blockquote><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>' },
            { id: '4', number: 4, title: 'Práticas Diárias', content: '<p>Estabelecer rotinas e rituais é fundamental para maximizar o trabalho profundo. Newport recomenda blocos de tempo dedicados onde você se isola de todas as distrações.</p><h3>Estratégias Práticas</h3><ol><li>Agende blocos de trabalho profundo</li><li>Elimine distrações tecnológicas</li><li>Pratique o tédio produtivo</li><li>Defina métricas claras</li></ol>' },
            { id: '5', number: 5, title: 'Conclusão', content: '<p>O trabalho profundo não é apenas uma habilidade a ser desenvolvida, mas uma filosofia de vida que pode transformar sua carreira e sua produtividade.</p><p>Ao dominar essa capacidade, você se posiciona para prosperar em um mundo que valoriza cada vez mais a excelência e a especialização.</p>' },
          ]}
          onBack={() => setActivePage('book-detail')}
        />
      ) : <JourneyLibrary />;
      case 'author-detail': return selectedAuthorName ? <AuthorDetailPage authorName={selectedAuthorName} onBack={() => setActivePage('biblioteca')} onNavigateToBook={(bookId) => { setSelectedBookId(bookId); setActivePage('book-detail'); }} onNavigateToMind={(mindId) => { setSelectedMindId(mindId); setActivePage('synthetic-minds'); }} /> : <JourneyLibrary />;
      
      // Academy Routes
      case 'academy-dashboard': return <AcademyDashboard onNavigateToCourse={handleAcademyNavigation} onEditCourse={handleAcademyEdit} onNavigate={handleAcademyPageChange} />;
      case 'academy-catalog': return <AcademyCatalog onNavigateToCourse={handleAcademyNavigation} />;
      case 'academy-achievements': return <AcademyAchievements />;
      case 'academy-tracks': return <AcademyTracks onNavigate={handleAcademyPageChange} />;
      case 'academy-community': return <AcademyCommunity onNavigate={handleAcademyPageChange} />;
      case 'academy-favorites': return <AcademyFavorites onNavigateToCourse={handleAcademyNavigation} onNavigate={handleAcademyPageChange} />;
      case 'academy-lesson': 
         return selectedCourseId 
            ? <AcademyLesson courseId={selectedCourseId} onBack={() => setActivePage('academy-dashboard')} />
            : <AcademyDashboard onNavigateToCourse={handleAcademyNavigation} onNavigate={handleAcademyPageChange} />;
      case 'academy-editor':
          return selectedCourseId
            ? <AcademyAdminEditor courseId={selectedCourseId} onBack={() => setActivePage('academy-dashboard')} />
            : <AcademyDashboard onNavigateToCourse={handleAcademyNavigation} onNavigate={handleAcademyPageChange} />;
      case 'academy-skilltree': return <AcademySkillTree onBack={() => setActivePage('academy-dashboard')} />;
      case 'academy-progress': return <AcademyProgress onBack={() => setActivePage('academy-dashboard')} />;
      case 'academy-socratic': return <AcademySocraticSessions onBack={() => setActivePage('academy-dashboard')} />;

      // Brand Routes
      case 'brand-dashboard': return <BrandDashboard />;
      case 'brand-visual': return <BrandVisualIdentity />;
      case 'brand-voice': return <BrandVoice />;
      case 'brand-assets': return <BrandAssets />;

      // Design System Routes
      case 'ds-library': return <DesignSystemLibrary onSelectDS={handleDSNavigation} />;
      case 'ds-viewer': return (
          <DesignSystemViewer 
            dsId={selectedDSId} 
            onBack={() => setActivePage('ds-library')} 
            onSwitch={setSelectedDSId}
          />
      );
      case 'design-system': return <DesignSystemLibrary onSelectDS={handleDSNavigation} />;

      // Synthetic Minds (AI) Routes
      case 'synthetic-minds': return <SyntheticMinds />;
      case 'mind-detail': return <MindDetail mindId={selectedMindId || 'gary-halbert'} onBack={() => setActivePage('synthetic-minds')} />;

      // Admin Routes (PM1-006)
      case 'admin-academy-studio':
      case 'admin-courses': return <AdminAcademyStudio onBack={() => setActivePage('academy-dashboard')} onNavigate={(pageId) => { if (pageId === 'academy-editor' && selectedCourseId) setActivePage('academy-editor'); }} />;
      case 'admin-tracks': return <AdminTrackManager onBack={() => setActivePage('admin-academy-studio')} onNavigate={handleAcademyPageChange} />;
      case 'admin-carousel': return <AdminHeroCarouselEditor onBack={() => setActivePage('admin-academy-studio')} onNavigate={handleAcademyPageChange} />;
      case 'admin-library-editor':
      case 'admin-books': return <AdminLibraryBooks onBack={() => setActivePage('biblioteca')} onNavigate={handleAcademyPageChange} />;
      case 'admin-authors': return <AdminLibraryAuthors onBack={() => setActivePage('biblioteca')} onNavigate={handleAcademyPageChange} />;
      case 'admin-ds-manager':
      case 'admin-components': return <AdminDSComponents onBack={() => setActivePage('ds-library')} onNavigate={handleAcademyPageChange} />;
      case 'admin-tokens': return <AdminDSTokens onBack={() => setActivePage('ds-library')} onNavigate={handleAcademyPageChange} />;
      case 'admin-settings': return <AdminSettings onBack={() => setActivePage('academy-dashboard')} onNavigate={handleAcademyPageChange} />;

      // Restored Modules Placeholders
      case 'sales': return <div className="p-10 text-center text-zinc-500">Página em construção: Vendas</div>;
      case 'sales-ai': return <div className="p-10 text-center text-zinc-500">Página em construção: Sales AI</div>;
      case 'crm': return <div className="p-10 text-center text-zinc-500">Página em construção: CRM</div>;
      case 'content-calendar': return <div className="p-10 text-center text-zinc-500">Página em construção: Content Calendar</div>;
      case 'content-ideas': return <div className="p-10 text-center text-zinc-500">Página em construção: Content Ideas</div>;

      default:
        return <div className="p-10 text-center text-zinc-500">Página em construção: {activePage}</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-200 font-sans selection:bg-amber-500/30 selection:text-white">
      {/* 1. Sidebar */}
      <Sidebar 
        onNavigate={(id) => setActivePage(id)} 
        activePageId={activePage}
      />

      <main className={`flex-1 transition-all duration-300 ease-in-out ${activePage === 'academy-lesson' || activePage === 'academy-editor' ? 'ml-0 z-50 fixed inset-0' : 'ml-20 md:ml-64'}`}>
        {renderContent()}
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
