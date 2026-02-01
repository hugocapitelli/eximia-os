import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { AuthorDetailPage } from '../../../components/pages/AuthorDetailPage';

/**
 * Wrapper component for AuthorDetailPage that extracts authorName from URL params
 * and provides navigation via React Router
 */
export const AuthorDetailPageWrapper: React.FC = () => {
  const { authorName } = useParams<{ authorName: string }>();
  const navigate = useNavigate();

  // If no authorName in URL, redirect to biblioteca
  if (!authorName) {
    return <Navigate to="/biblioteca" replace />;
  }

  return (
    <AuthorDetailPage
      authorName={decodeURIComponent(authorName)}
      onBack={() => navigate('/biblioteca')}
      onNavigateToBook={(bookId) => navigate(`/biblioteca/book/${bookId}`)}
      onNavigateToMind={(mindId) => navigate(`/synthetic-minds/${mindId}`)}
    />
  );
};

export default AuthorDetailPageWrapper;
