import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { MindDetail } from '../../../components/pages/MindDetail';

/**
 * Wrapper component for MindDetail that extracts mindId from URL params
 * and provides navigation via React Router
 */
export const MindDetailPage: React.FC = () => {
  const { mindId } = useParams<{ mindId: string }>();
  const navigate = useNavigate();

  // If no mindId in URL, redirect to synthetic minds list
  if (!mindId) {
    return <Navigate to="/synthetic-minds" replace />;
  }

  return (
    <MindDetail
      mindId={mindId}
      onBack={() => navigate('/synthetic-minds')}
    />
  );
};

export default MindDetailPage;
