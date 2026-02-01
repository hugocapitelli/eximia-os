import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademyTracks } from '../../../components/pages/AcademyTracks';

/**
 * Wrapper component for AcademyTracks that provides navigation via React Router
 */
export const AcademyTracksPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AcademyTracks
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

export default AcademyTracksPage;
