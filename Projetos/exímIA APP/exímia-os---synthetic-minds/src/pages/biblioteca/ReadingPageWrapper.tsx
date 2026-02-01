import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ReadingPage } from '../../../components/reading/ReadingPage';
import { JOURNEY_BOOKS } from '../../../constants';

/**
 * Wrapper component for ReadingPage that extracts bookId from URL params
 * and provides navigation via React Router
 */
export const ReadingPageWrapper: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  // If no bookId in URL, redirect to biblioteca
  if (!bookId) {
    return <Navigate to="/biblioteca" replace />;
  }

  // Find the book to get its title and chapters
  const book = JOURNEY_BOOKS.find(b => b.id === bookId);

  if (!book) {
    return <Navigate to="/biblioteca" replace />;
  }

  // Mock chapters for now - in a real app this would come from API/database
  const chapters = [
    { id: '1', number: 1, title: 'Introducao', subtitle: 'Por que o foco profundo importa', content: '<p>O trabalho profundo e a capacidade de focar sem distracao em uma tarefa cognitivamente exigente.</p>' },
    { id: '2', number: 2, title: 'A Ideia', subtitle: 'O que e trabalho profundo', content: '<p>Trabalho profundo sao atividades profissionais realizadas em um estado de concentracao sem distracoes.</p>' },
    { id: '3', number: 3, title: 'A Arte do Foco Profundo', content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>' },
    { id: '4', number: 4, title: 'Praticas Diarias', content: '<p>Estabelecer rotinas e rituais e fundamental para maximizar o trabalho profundo.</p>' },
    { id: '5', number: 5, title: 'Conclusao', content: '<p>O trabalho profundo nao e apenas uma habilidade a ser desenvolvida, mas uma filosofia de vida.</p>' },
  ];

  return (
    <ReadingPage
      bookId={bookId}
      bookTitle={book.title}
      chapters={chapters}
      onBack={() => navigate(`/biblioteca/book/${bookId}`)}
    />
  );
};

export default ReadingPageWrapper;
