import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { BookDetailPage } from '../../../components/pages/BookDetailPage';

/**
 * Wrapper component for BookDetailPage that extracts bookId from URL params
 * and provides navigation via React Router
 */
export const BookDetailPageWrapper: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  // If no bookId in URL, redirect to biblioteca
  if (!bookId) {
    return <Navigate to="/biblioteca" replace />;
  }

  return (
    <BookDetailPage
      bookId={bookId}
      onBack={() => navigate('/biblioteca')}
      onNavigateToAuthor={(authorName) => navigate(`/biblioteca/author/${encodeURIComponent(authorName)}`)}
      onNavigateToCourse={(courseId) => navigate(`/academy/course/${courseId}`)}
      onStartReading={() => navigate(`/biblioteca/book/${bookId}/read`)}
    />
  );
};

export default BookDetailPageWrapper;
