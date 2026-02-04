import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ReadingPageV2 } from './ReadingPageV2';

/**
 * Legacy ReadingPageWrapper - redirects to ReadingPageV2
 * This wrapper now simply redirects to the new reading experience
 * which uses real data from Supabase instead of mock data
 */
export const ReadingPageWrapper: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  // If no bookId in URL, redirect to biblioteca
  if (!bookId) {
    return <Navigate to="/biblioteca" replace />;
  }

  // Redirect to the new reading page (ReadingPageV2)
  // which uses real data from Supabase
  return <Navigate to={`/biblioteca/book/${bookId}/read`} replace />;
};

export default ReadingPageWrapper;
