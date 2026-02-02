import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademyDashboard } from '../../../components/pages/AcademyDashboard';

/**
 * Wrapper component for AcademyDashboard that provides navigation via React Router
 */
export const AcademyDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AcademyDashboard
      onNavigateToCourse={(courseId) => navigate(`/academy/course/${courseId}`)}
      onEditCourse={(courseId) => navigate(`/academy/course/${courseId}/edit`)}
      onNavigate={(pageId) => {
        // Map page IDs to routes
        const routeMap: Record<string, string> = {
          'academy-catalog': '/academy/catalog',
          'academy-achievements': '/academy/achievements',
          'academy-tracks': '/academy/tracks',
          'academy-community': '/academy/community',
          'academy-favorites': '/academy/favorites',
          'academy-skilltree': '/academy/skilltree',
          'academy-progress': '/academy/progress',
          'academy-socratic': '/academy/socratic',
        };
        const route = routeMap[pageId] || '/academy';
        navigate(route);
      }}
    />
  );
};

export default AcademyDashboardPage;
