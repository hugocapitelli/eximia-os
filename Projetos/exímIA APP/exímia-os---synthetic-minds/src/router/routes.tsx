import React, { Suspense, lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { FullscreenLayout } from '../layouts/FullscreenLayout';

// Error Boundary
import { RouteErrorBoundary } from '../components/ErrorBoundary';

// Auth pages (loaded eagerly for fast initial load)
import { Login } from '../../components/pages/Login';
import { ForgotPassword } from '../../components/pages/ForgotPassword';
import { ResetPassword } from '../../components/pages/ResetPassword';
import { AuthCallback } from '../../components/pages/AuthCallback';

// Protected Route wrapper
import { ProtectedRoute } from '../components/ProtectedRoute';

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#050505]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
  </div>
);

// Lazy load page wrappers (with proper navigation)
const AcademyDashboardPage = lazy(() => import('../pages/academy/AcademyDashboardPage'));
const AcademyLessonPage = lazy(() => import('../pages/academy/AcademyLessonPage'));
const AcademyEditorPage = lazy(() => import('../pages/academy/AcademyEditorPage'));
const AcademyCatalogPage = lazy(() => import('../pages/academy/AcademyCatalogPage'));
const AcademyFavoritesPage = lazy(() => import('../pages/academy/AcademyFavoritesPage'));
const AcademyTracksPage = lazy(() => import('../pages/academy/AcademyTracksPage'));
const AcademyCommunityPage = lazy(() => import('../pages/academy/AcademyCommunityPage'));

const BibliotecaPage = lazy(() => import('../pages/biblioteca/BibliotecaPage'));
const BookDetailPageWrapper = lazy(() => import('../pages/biblioteca/BookDetailPageWrapper'));
const AuthorDetailPageWrapper = lazy(() => import('../pages/biblioteca/AuthorDetailPageWrapper'));
const ReadingPageWrapper = lazy(() => import('../pages/biblioteca/ReadingPageWrapper'));
const ReadingPage = lazy(() => import('../pages/biblioteca/ReadingPage'));

const DesignSystemLibraryPage = lazy(() => import('../pages/design-system/DesignSystemLibraryPage'));
const DesignSystemViewerPage = lazy(() => import('../pages/design-system/DesignSystemViewerPage'));
const MindDetailPage = lazy(() => import('../pages/synthetic-minds/MindDetailPage'));

// Lazy load original page components (no props needed)
const Inbox = lazy(() => import('../../components/pages/Inbox').then(m => ({ default: m.Inbox })));
const JourneyDashboard = lazy(() => import('../../components/pages/JourneyDashboard').then(m => ({ default: m.JourneyDashboard })));
const JourneyGoals = lazy(() => import('../../components/pages/JourneyGoals').then(m => ({ default: m.JourneyGoals })));
const JourneyHabits = lazy(() => import('../../components/pages/JourneyHabits').then(m => ({ default: m.JourneyHabits })));
const JourneyCalendar = lazy(() => import('../../components/pages/JourneyCalendar').then(m => ({ default: m.JourneyCalendar })));
const JourneyBooks = lazy(() => import('../../components/pages/JourneyBooks').then(m => ({ default: m.JourneyBooks })));
const JourneyAuthors = lazy(() => import('../../components/pages/JourneyAuthors').then(m => ({ default: m.JourneyAuthors })));

const AcademyAchievements = lazy(() => import('../../components/pages/AcademyAchievements').then(m => ({ default: m.AcademyAchievements })));
const AcademySkillTree = lazy(() => import('../../components/pages/AcademySkillTree').then(m => ({ default: m.AcademySkillTree })));
const AcademyProgress = lazy(() => import('../../components/pages/AcademyProgress').then(m => ({ default: m.AcademyProgress })));
const AcademySocraticSessions = lazy(() => import('../../components/pages/AcademySocraticSessions').then(m => ({ default: m.AcademySocraticSessions })));

const StrategyDashboard = lazy(() => import('../../components/pages/StrategyDashboard').then(m => ({ default: m.StrategyDashboard })));
const StrategyCycles = lazy(() => import('../../components/pages/StrategyCycles').then(m => ({ default: m.StrategyCycles })));
const StrategyInitiatives = lazy(() => import('../../components/pages/StrategyInitiatives').then(m => ({ default: m.StrategyInitiatives })));
const StrategyKPIs = lazy(() => import('../../components/pages/StrategyKPIs').then(m => ({ default: m.StrategyKPIs })));
const StrategyRoadmap = lazy(() => import('../../components/pages/StrategyRoadmap').then(m => ({ default: m.StrategyRoadmap })));

const FinanceDashboard = lazy(() => import('../../components/pages/FinanceDashboard').then(m => ({ default: m.FinanceDashboard })));
const FinanceRevenues = lazy(() => import('../../components/pages/FinanceRevenues').then(m => ({ default: m.FinanceRevenues })));
const FinanceExpenses = lazy(() => import('../../components/pages/FinanceExpenses').then(m => ({ default: m.FinanceExpenses })));
const FinanceProjections = lazy(() => import('../../components/pages/FinanceProjections').then(m => ({ default: m.FinanceProjections })));
const FinanceSaaSMetrics = lazy(() => import('../../components/pages/FinanceSaaSMetrics').then(m => ({ default: m.FinanceSaaSMetrics })));
const FinanceReports = lazy(() => import('../../components/pages/FinanceReports').then(m => ({ default: m.FinanceReports })));

const TeamDashboard = lazy(() => import('../../components/pages/TeamDashboard').then(m => ({ default: m.TeamDashboard })));
const UserManagement = lazy(() => import('../../components/pages/UserManagement').then(m => ({ default: m.UserManagement })));

const BrandDashboard = lazy(() => import('../../components/pages/BrandDashboard').then(m => ({ default: m.BrandDashboard })));
const BrandVisualIdentity = lazy(() => import('../../components/pages/BrandVisualIdentity').then(m => ({ default: m.BrandVisualIdentity })));
const BrandVoice = lazy(() => import('../../components/pages/BrandVoice').then(m => ({ default: m.BrandVoice })));
const BrandAssets = lazy(() => import('../../components/pages/BrandAssets').then(m => ({ default: m.BrandAssets })));

const ContentDashboard = lazy(() => import('../../components/pages/ContentDashboard').then(m => ({ default: m.ContentDashboard })));
const CourseDesigner = lazy(() => import('../../components/pages/CourseDesigner').then(m => ({ default: m.CourseDesigner })));
const ContentCurator = lazy(() => import('../../components/pages/ContentCurator').then(m => ({ default: m.ContentCurator })));
const ContentEbooks = lazy(() => import('../../components/pages/ContentEbooks').then(m => ({ default: m.ContentEbooks })));
const ContentSocial = lazy(() => import('../../components/pages/ContentSocial').then(m => ({ default: m.ContentSocial })));
const ContentNewsletter = lazy(() => import('../../components/pages/ContentNewsletter').then(m => ({ default: m.ContentNewsletter })));
const ContentVideos = lazy(() => import('../../components/pages/ContentVideos').then(m => ({ default: m.ContentVideos })));
const ContentCopyBank = lazy(() => import('../../components/pages/ContentCopyBank').then(m => ({ default: m.ContentCopyBank })));

const SyntheticMinds = lazy(() => import('../../components/pages/SyntheticMinds').then(m => ({ default: m.SyntheticMinds })));

// Admin page wrappers
const AdminAcademyStudioPage = lazy(() => import('../pages/admin/AdminAcademyStudioPage'));
const AdminTrackManagerPage = lazy(() => import('../pages/admin/AdminTrackManagerPage'));
const AdminCarouselPage = lazy(() => import('../pages/admin/AdminCarouselPage'));
const AdminLibraryBooksPage = lazy(() => import('../pages/admin/AdminLibraryBooksPage'));
const AdminLibraryAuthorsPage = lazy(() => import('../pages/admin/AdminLibraryAuthorsPage'));
const AdminDSComponentsPage = lazy(() => import('../pages/admin/AdminDSComponentsPage'));
const AdminDSTokensPage = lazy(() => import('../pages/admin/AdminDSTokensPage'));
const AdminSettingsPage = lazy(() => import('../pages/admin/AdminSettingsPage'));
const AdminAccessControlPage = lazy(() => import('../pages/admin/AdminAccessControlPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'));

// New Admin Biblioteca Pages
const AdminSummariesPage = lazy(() => import('../pages/admin/AdminSummariesPage'));
const AdminChapterEditorPage = lazy(() => import('../pages/admin/AdminChapterEditorPage'));

export const routes: RouteObject[] = [
  // Public routes
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },

  // Fullscreen routes (no sidebar) - must be before MainLayout routes
  {
    element: (
      <ProtectedRoute>
        <FullscreenLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/academy/course/:courseId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AcademyLessonPage />
          </Suspense>
        ),
      },
      {
        path: '/academy/course/:courseId/edit',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AcademyEditorPage />
          </Suspense>
        ),
      },
      {
        path: '/biblioteca/book/:bookId/read',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReadingPage />
          </Suspense>
        ),
      },
      {
        path: '/biblioteca/book/:bookId/read-legacy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReadingPageWrapper />
          </Suspense>
        ),
      },
      {
        path: '/biblioteca/summary/:summaryId/read',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReadingPage />
          </Suspense>
        ),
      },
    ],
  },

  // Protected routes with MainLayout
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      // Root redirect
      {
        index: true,
        element: <Navigate to="/inbox" replace />,
      },

      // Inbox
      {
        path: 'inbox',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Inbox />
          </Suspense>
        ),
      },

      // Journey
      {
        path: 'journey',
        element: (
          <Suspense fallback={<PageLoader />}>
            <JourneyDashboard />
          </Suspense>
        ),
      },
      {
        path: 'journey/goals',
        element: (
          <Suspense fallback={<PageLoader />}>
            <JourneyGoals />
          </Suspense>
        ),
      },
      {
        path: 'journey/habits',
        element: (
          <Suspense fallback={<PageLoader />}>
            <JourneyHabits />
          </Suspense>
        ),
      },
      {
        path: 'journey/calendar',
        element: (
          <Suspense fallback={<PageLoader />}>
            <JourneyCalendar />
          </Suspense>
        ),
      },

      // Biblioteca
      {
        path: 'biblioteca',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BibliotecaPage />
          </Suspense>
        ),
      },
      {
        path: 'biblioteca/books',
        element: (
          <Suspense fallback={<PageLoader />}>
            <JourneyBooks />
          </Suspense>
        ),
      },
      {
        path: 'biblioteca/authors',
        element: (
          <Suspense fallback={<PageLoader />}>
            <JourneyAuthors />
          </Suspense>
        ),
      },
      {
        path: 'biblioteca/book/:bookId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BookDetailPageWrapper />
          </Suspense>
        ),
      },
      {
        path: 'biblioteca/author/:authorName',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthorDetailPageWrapper />
          </Suspense>
        ),
      },

      // Academy (standard views)
      {
        path: 'academy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AcademyDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'academy/catalog',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AcademyCatalogPage />
          </Suspense>
        ),
      },
      {
        path: 'academy/achievements',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AcademyAchievements />
          </Suspense>
        ),
      },
      {
        path: 'academy/tracks',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AcademyTracksPage />
          </Suspense>
        ),
      },
      {
        path: 'academy/community',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AcademyCommunityPage />
          </Suspense>
        ),
      },
      {
        path: 'academy/favorites',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AcademyFavoritesPage />
          </Suspense>
        ),
      },
      {
        path: 'academy/skilltree',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AcademySkillTree />
          </Suspense>
        ),
      },
      {
        path: 'academy/progress',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AcademyProgress />
          </Suspense>
        ),
      },
      {
        path: 'academy/socratic',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AcademySocraticSessions />
          </Suspense>
        ),
      },

      // Strategy
      {
        path: 'strategy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <StrategyDashboard />
          </Suspense>
        ),
      },
      {
        path: 'strategy/cycles',
        element: (
          <Suspense fallback={<PageLoader />}>
            <StrategyCycles />
          </Suspense>
        ),
      },
      {
        path: 'strategy/initiatives',
        element: (
          <Suspense fallback={<PageLoader />}>
            <StrategyInitiatives />
          </Suspense>
        ),
      },
      {
        path: 'strategy/kpis',
        element: (
          <Suspense fallback={<PageLoader />}>
            <StrategyKPIs />
          </Suspense>
        ),
      },
      {
        path: 'strategy/roadmap',
        element: (
          <Suspense fallback={<PageLoader />}>
            <StrategyRoadmap />
          </Suspense>
        ),
      },

      // Finance
      {
        path: 'finance',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FinanceDashboard />
          </Suspense>
        ),
      },
      {
        path: 'finance/revenues',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FinanceRevenues />
          </Suspense>
        ),
      },
      {
        path: 'finance/expenses',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FinanceExpenses />
          </Suspense>
        ),
      },
      {
        path: 'finance/projections',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FinanceProjections />
          </Suspense>
        ),
      },
      {
        path: 'finance/saas',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FinanceSaaSMetrics />
          </Suspense>
        ),
      },
      {
        path: 'finance/reports',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FinanceReports />
          </Suspense>
        ),
      },

      // Team
      {
        path: 'team',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeamDashboard view="overview" />
          </Suspense>
        ),
      },
      {
        path: 'team/org',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeamDashboard view="org" />
          </Suspense>
        ),
      },
      {
        path: 'team/members',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeamDashboard view="members" />
          </Suspense>
        ),
      },
      {
        path: 'team/hiring',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeamDashboard view="hiring" />
          </Suspense>
        ),
      },
      {
        path: 'team/onboarding',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeamDashboard view="onboarding" />
          </Suspense>
        ),
      },
      {
        path: 'team/performance',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeamDashboard view="performance" />
          </Suspense>
        ),
      },
      {
        path: 'team/rituals',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeamDashboard view="rituals" />
          </Suspense>
        ),
      },
      {
        path: 'team/culture',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeamDashboard view="culture" />
          </Suspense>
        ),
      },
      {
        path: 'team/comms',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeamDashboard view="comms" />
          </Suspense>
        ),
      },
      {
        path: 'team/management',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserManagement />
          </Suspense>
        ),
      },

      // Brand
      {
        path: 'brand',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BrandDashboard />
          </Suspense>
        ),
      },
      {
        path: 'brand/visual',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BrandVisualIdentity />
          </Suspense>
        ),
      },
      {
        path: 'brand/voice',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BrandVoice />
          </Suspense>
        ),
      },
      {
        path: 'brand/assets',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BrandAssets />
          </Suspense>
        ),
      },

      // Content
      {
        path: 'content',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContentDashboard />
          </Suspense>
        ),
      },
      {
        path: 'content/courses',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CourseDesigner />
          </Suspense>
        ),
      },
      {
        path: 'content/curator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContentCurator />
          </Suspense>
        ),
      },
      {
        path: 'content/ebooks',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContentEbooks />
          </Suspense>
        ),
      },
      {
        path: 'content/social',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContentSocial />
          </Suspense>
        ),
      },
      {
        path: 'content/newsletter',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContentNewsletter />
          </Suspense>
        ),
      },
      {
        path: 'content/videos',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContentVideos />
          </Suspense>
        ),
      },
      {
        path: 'content/copies',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContentCopyBank />
          </Suspense>
        ),
      },

      // Design System
      {
        path: 'design-system',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DesignSystemLibraryPage />
          </Suspense>
        ),
      },
      {
        path: 'design-system/:dsId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DesignSystemViewerPage />
          </Suspense>
        ),
      },

      // Synthetic Minds
      {
        path: 'synthetic-minds',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SyntheticMinds />
          </Suspense>
        ),
      },
      {
        path: 'synthetic-minds/:mindId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MindDetailPage />
          </Suspense>
        ),
      },

      // Admin routes
      {
        path: 'admin/academy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminAcademyStudioPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/academy/tracks',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminTrackManagerPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/academy/carousel',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminCarouselPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/library/books',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminLibraryBooksPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/library/authors',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminLibraryAuthorsPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/ds/components',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminDSComponentsPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/ds/tokens',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminDSTokensPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminSettingsPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/access-control',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminAccessControlPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminUsersPage />
          </Suspense>
        ),
      },
      // Admin Biblioteca Routes
      {
        path: 'admin/summaries',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminSummariesPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/summaries/:summaryId/edit',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminChapterEditorPage />
          </Suspense>
        ),
      },

      // Placeholder routes
      {
        path: 'sales',
        element: <div className="p-10 text-center text-zinc-500">Pagina em construcao: Vendas</div>,
      },
      {
        path: 'sales/ai',
        element: <div className="p-10 text-center text-zinc-500">Pagina em construcao: Sales AI</div>,
      },
      {
        path: 'crm',
        element: <div className="p-10 text-center text-zinc-500">Pagina em construcao: CRM</div>,
      },

      // Catch-all for unknown routes (404)
      {
        path: '*',
        element: <RouteErrorBoundary />,
      },
    ],
  },
];
