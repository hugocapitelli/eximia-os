import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademyFavorites } from '../../../components/pages/AcademyFavorites';

/**
 * Wrapper component for AcademyFavorites that provides navigation via React Router
 */
export const AcademyFavoritesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AcademyFavorites
      onNavigateToCourse={(courseId) => navigate(`/academy/course/${courseId}`)}
      onNavigate={(pageId) => {
        const routeMap: Record<string, string> = {
          'academy-dashboard': '/academy',
          'academy-catalog': '/academy/catalog',
        };
        const route = routeMap[pageId] || '/academy';
        navigate(route);
      }}
    />
  );
};

export default AcademyFavoritesPage;
