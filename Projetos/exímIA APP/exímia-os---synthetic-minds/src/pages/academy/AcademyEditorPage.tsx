import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { AcademyAdminEditor } from '../../../components/pages/AcademyAdminEditor';

/**
 * Wrapper component for AcademyAdminEditor that extracts courseId from URL params
 * and provides navigation via React Router
 */
export const AcademyEditorPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // If no courseId in URL, redirect to academy dashboard
  if (!courseId) {
    return <Navigate to="/academy" replace />;
  }

  return (
    <AcademyAdminEditor
      courseId={courseId}
      onBack={() => navigate('/academy')}
    />
  );
};

export default AcademyEditorPage;
