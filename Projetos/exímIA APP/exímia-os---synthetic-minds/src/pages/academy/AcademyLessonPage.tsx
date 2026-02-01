import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { AcademyLesson } from '../../../components/pages/AcademyLesson';

/**
 * Wrapper component for AcademyLesson that extracts courseId from URL params
 * and provides navigation via React Router
 */
export const AcademyLessonPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // If no courseId in URL, redirect to academy dashboard
  if (!courseId) {
    return <Navigate to="/academy" replace />;
  }

  return (
    <AcademyLesson
      courseId={courseId}
      onBack={() => navigate('/academy')}
    />
  );
};

export default AcademyLessonPage;
