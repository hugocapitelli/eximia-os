import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademyCommunity } from '../../../components/pages/AcademyCommunity';

/**
 * Wrapper component for AcademyCommunity that provides navigation via React Router
 */
export const AcademyCommunityPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AcademyCommunity
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

export default AcademyCommunityPage;
