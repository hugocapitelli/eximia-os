import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademyCatalog } from '../../../components/pages/AcademyCatalog';

/**
 * Wrapper component for AcademyCatalog that provides navigation via React Router
 */
export const AcademyCatalogPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AcademyCatalog
      onNavigateToCourse={(courseId) => navigate(`/academy/course/${courseId}`)}
    />
  );
};

export default AcademyCatalogPage;
