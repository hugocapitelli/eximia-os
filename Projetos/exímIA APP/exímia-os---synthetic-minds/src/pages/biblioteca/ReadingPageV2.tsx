// ReadingPageV2 - Immersive reading experience with new ReadingMode
// EXIMIA-202, EXIMIA-203, EXIMIA-204, EXIMIA-205, EXIMIA-206

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ReadingMode } from '../../components/biblioteca';
import {
  getSummaryWithChapters,
  getBookSummaries,
  getUserReadingProgress,
  getUserPreferences,
} from '../../services/biblioteca';
import type {
  SummaryWithChapters,
  SummaryReadingProgress,
  UserReadingPreferences,
} from '../../types/biblioteca';
import toast from 'react-hot-toast';

export const ReadingPageV2: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<SummaryWithChapters | null>(null);
  const [progress, setProgress] = useState<SummaryReadingProgress | null>(null);
  const [preferences, setPreferences] = useState<UserReadingPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get summary ID from URL or fetch first available
  const summaryIdFromUrl = searchParams.get('summary');

  useEffect(() => {
    if (!bookId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        let summaryId = summaryIdFromUrl;

        // If no summary ID in URL, fetch the first available
        if (!summaryId) {
          const summariesResult = await getBookSummaries(bookId);
          if (summariesResult.success && summariesResult.data && summariesResult.data.length > 0) {
            // Get first published summary
            const publishedSummary = summariesResult.data.find(s => s.status === 'published');
            if (publishedSummary) {
              summaryId = publishedSummary.id;
            } else {
              setError('Nenhum resumo publicado disponível para este livro');
              setLoading(false);
              return;
            }
          } else {
            setError('Nenhum resumo disponível para este livro');
            setLoading(false);
            return;
          }
        }

        // Load summary with chapters
        const summaryResult = await getSummaryWithChapters(summaryId);
        if (!summaryResult.success || !summaryResult.data) {
          setError(summaryResult.error || 'Erro ao carregar resumo');
          setLoading(false);
          return;
        }

        setSummary(summaryResult.data);

        // Load user progress and preferences in parallel
        const [progressResult, preferencesResult] = await Promise.all([
          getUserReadingProgress(summaryId),
          getUserPreferences(),
        ]);

        if (progressResult.success && progressResult.data) {
          setProgress(progressResult.data);
        }

        if (preferencesResult.success && preferencesResult.data) {
          setPreferences(preferencesResult.data);
        }
      } catch (err) {
        console.error('Error loading reading data:', err);
        setError('Erro ao carregar dados de leitura');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookId, summaryIdFromUrl]);

  // Redirect if no bookId
  if (!bookId) {
    return <Navigate to="/biblioteca" replace />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-zinc-400">Carregando resumo...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !summary) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-red-400 mb-4">{error || 'Resumo não encontrado'}</p>
          <button
            onClick={() => navigate(`/biblioteca/book/${bookId}`)}
            className="px-6 py-3 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors"
          >
            Voltar para o Livro
          </button>
        </div>
      </div>
    );
  }

  return (
    <ReadingMode
      summary={summary}
      initialChapter={progress?.current_chapter || 1}
      userPreferences={preferences || undefined}
      progress={progress || undefined}
      onBack={() => navigate(`/biblioteca/book/${bookId}`)}
    />
  );
};

export default ReadingPageV2;
