import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Custom navigation hook that wraps React Router's useNavigate
 * Provides type-safe navigation helpers for common app routes
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Go back in history
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Navigate to a specific path
  const goTo = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Personal
  const goToInbox = useCallback(() => navigate('/inbox'), [navigate]);
  const goToJourney = useCallback(() => navigate('/journey'), [navigate]);
  const goToJourneyGoals = useCallback(() => navigate('/journey/goals'), [navigate]);
  const goToJourneyHabits = useCallback(() => navigate('/journey/habits'), [navigate]);
  const goToJourneyCalendar = useCallback(() => navigate('/journey/calendar'), [navigate]);

  // Biblioteca
  const goToBiblioteca = useCallback(() => navigate('/biblioteca'), [navigate]);
  const goToBook = useCallback((bookId: string) => navigate(`/biblioteca/book/${bookId}`), [navigate]);
  const goToBookReading = useCallback((bookId: string) => navigate(`/biblioteca/book/${bookId}/read`), [navigate]);
  const goToAuthor = useCallback((authorName: string) => navigate(`/biblioteca/author/${encodeURIComponent(authorName)}`), [navigate]);

  // Academy
  const goToAcademy = useCallback(() => navigate('/academy'), [navigate]);
  const goToAcademyCatalog = useCallback(() => navigate('/academy/catalog'), [navigate]);
  const goToCourse = useCallback((courseId: string) => navigate(`/academy/course/${courseId}`), [navigate]);
  const goToCourseEdit = useCallback((courseId: string) => navigate(`/academy/course/${courseId}/edit`), [navigate]);
  const goToAcademyTracks = useCallback(() => navigate('/academy/tracks'), [navigate]);
  const goToAcademyFavorites = useCallback(() => navigate('/academy/favorites'), [navigate]);

  // Strategy
  const goToStrategy = useCallback(() => navigate('/strategy'), [navigate]);
  const goToStrategyCycles = useCallback(() => navigate('/strategy/cycles'), [navigate]);
  const goToStrategyInitiatives = useCallback(() => navigate('/strategy/initiatives'), [navigate]);

  // Finance
  const goToFinance = useCallback(() => navigate('/finance'), [navigate]);
  const goToFinanceRevenues = useCallback(() => navigate('/finance/revenues'), [navigate]);
  const goToFinanceExpenses = useCallback(() => navigate('/finance/expenses'), [navigate]);

  // Team
  const goToTeam = useCallback(() => navigate('/team'), [navigate]);
  const goToTeamView = useCallback((view: string) => navigate(`/team/${view}`), [navigate]);
  const goToUserManagement = useCallback(() => navigate('/team/management'), [navigate]);

  // Brand
  const goToBrand = useCallback(() => navigate('/brand'), [navigate]);

  // Content
  const goToContent = useCallback(() => navigate('/content'), [navigate]);

  // Design System
  const goToDesignSystem = useCallback(() => navigate('/design-system'), [navigate]);
  const goToDesignSystemViewer = useCallback((dsId: string) => navigate(`/design-system/${dsId}`), [navigate]);

  // Synthetic Minds
  const goToSyntheticMinds = useCallback(() => navigate('/synthetic-minds'), [navigate]);
  const goToMindDetail = useCallback((mindId: string) => navigate(`/synthetic-minds/${mindId}`), [navigate]);

  // Admin
  const goToAdminAcademy = useCallback(() => navigate('/admin/academy'), [navigate]);
  const goToAdminLibrary = useCallback(() => navigate('/admin/library/books'), [navigate]);
  const goToAdminSettings = useCallback(() => navigate('/admin/settings'), [navigate]);

  // Check if a path is active (current location)
  const isActive = useCallback((path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }, [location.pathname]);

  // Check if current path starts with prefix
  const isInSection = useCallback((prefix: string) => {
    return location.pathname.startsWith(prefix);
  }, [location.pathname]);

  return {
    // Core navigation
    navigate,
    location,
    goBack,
    goTo,
    isActive,
    isInSection,
    currentPath: location.pathname,

    // Personal
    goToInbox,
    goToJourney,
    goToJourneyGoals,
    goToJourneyHabits,
    goToJourneyCalendar,

    // Biblioteca
    goToBiblioteca,
    goToBook,
    goToBookReading,
    goToAuthor,

    // Academy
    goToAcademy,
    goToAcademyCatalog,
    goToCourse,
    goToCourseEdit,
    goToAcademyTracks,
    goToAcademyFavorites,

    // Strategy
    goToStrategy,
    goToStrategyCycles,
    goToStrategyInitiatives,

    // Finance
    goToFinance,
    goToFinanceRevenues,
    goToFinanceExpenses,

    // Team
    goToTeam,
    goToTeamView,
    goToUserManagement,

    // Brand
    goToBrand,

    // Content
    goToContent,

    // Design System
    goToDesignSystem,
    goToDesignSystemViewer,

    // Synthetic Minds
    goToSyntheticMinds,
    goToMindDetail,

    // Admin
    goToAdminAcademy,
    goToAdminLibrary,
    goToAdminSettings,
  };
};

/**
 * Route path constants for type-safe navigation
 */
export const ROUTES = {
  // Auth
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  authCallback: '/auth/callback',

  // Personal
  inbox: '/inbox',
  journey: {
    root: '/journey',
    goals: '/journey/goals',
    habits: '/journey/habits',
    calendar: '/journey/calendar',
  },

  // Biblioteca
  biblioteca: {
    root: '/biblioteca',
    books: '/biblioteca/books',
    authors: '/biblioteca/authors',
    book: (id: string) => `/biblioteca/book/${id}`,
    bookRead: (id: string) => `/biblioteca/book/${id}/read`,
    author: (name: string) => `/biblioteca/author/${encodeURIComponent(name)}`,
  },

  // Academy
  academy: {
    root: '/academy',
    catalog: '/academy/catalog',
    achievements: '/academy/achievements',
    tracks: '/academy/tracks',
    community: '/academy/community',
    favorites: '/academy/favorites',
    skilltree: '/academy/skilltree',
    progress: '/academy/progress',
    socratic: '/academy/socratic',
    course: (id: string) => `/academy/course/${id}`,
    courseEdit: (id: string) => `/academy/course/${id}/edit`,
  },

  // Strategy
  strategy: {
    root: '/strategy',
    cycles: '/strategy/cycles',
    initiatives: '/strategy/initiatives',
    kpis: '/strategy/kpis',
    roadmap: '/strategy/roadmap',
  },

  // Finance
  finance: {
    root: '/finance',
    revenues: '/finance/revenues',
    expenses: '/finance/expenses',
    projections: '/finance/projections',
    saas: '/finance/saas',
    reports: '/finance/reports',
  },

  // Team
  team: {
    root: '/team',
    org: '/team/org',
    members: '/team/members',
    hiring: '/team/hiring',
    onboarding: '/team/onboarding',
    performance: '/team/performance',
    rituals: '/team/rituals',
    culture: '/team/culture',
    comms: '/team/comms',
    management: '/team/management',
  },

  // Brand
  brand: {
    root: '/brand',
    visual: '/brand/visual',
    voice: '/brand/voice',
    assets: '/brand/assets',
  },

  // Content
  content: {
    root: '/content',
    courses: '/content/courses',
    curator: '/content/curator',
    ebooks: '/content/ebooks',
    social: '/content/social',
    newsletter: '/content/newsletter',
    videos: '/content/videos',
    copies: '/content/copies',
  },

  // Design System
  designSystem: {
    root: '/design-system',
    viewer: (id: string) => `/design-system/${id}`,
  },

  // Synthetic Minds
  syntheticMinds: {
    root: '/synthetic-minds',
    detail: (id: string) => `/synthetic-minds/${id}`,
  },

  // Admin
  admin: {
    academy: '/admin/academy',
    academyTracks: '/admin/academy/tracks',
    academyCarousel: '/admin/academy/carousel',
    libraryBooks: '/admin/library/books',
    libraryAuthors: '/admin/library/authors',
    dsComponents: '/admin/ds/components',
    dsTokens: '/admin/ds/tokens',
    settings: '/admin/settings',
    accessControl: '/admin/access-control',
  },
} as const;
