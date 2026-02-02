import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JourneyLibrary } from '../../../components/pages/JourneyLibrary';

/**
 * Wrapper component for JourneyLibrary that provides navigation via React Router
 */
export const BibliotecaPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <JourneyLibrary
      onNavigateToBook={(bookId) => navigate(`/biblioteca/book/${bookId}`)}
      onNavigateToAuthor={(authorName) => navigate(`/biblioteca/author/${encodeURIComponent(authorName)}`)}
    />
  );
};

export default BibliotecaPage;
