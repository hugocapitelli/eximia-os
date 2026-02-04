import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SummaryWithChapters, UserReadingPreferences, SummaryReadingProgress } from '../../types/biblioteca';
import { getSummaryWithChapters, getReadingProgress } from '../../lib/actions/summaries';
import { getReadingPreferences } from '../../lib/actions/preferences/reading';
import { ReadingMode } from '../../components/biblioteca/ReadingMode/ReadingMode';

export function ReadingPage() {
  const { summaryId } = useParams<{ summaryId: string }>();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<SummaryWithChapters | null>(null);
  const [progress, setProgress] = useState<SummaryReadingProgress | null>(null);
  const [preferences, setPreferences] = useState<UserReadingPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!summaryId) {
        setError('No summary ID provided');
        setLoading(false);
        return;
      }

      try {
        // Load summary with chapters
        const summaryResult = await getSummaryWithChapters(summaryId);
        if (!summaryResult.success || !summaryResult.data) {
          setError('Summary not found or not published');
          setLoading(false);
          return;
        }

        setSummary(summaryResult.data);

        // Load user progress and preferences in parallel
        const [progressResult, preferencesResult] = await Promise.all([
          getReadingProgress(summaryResult.data.id),
          getReadingPreferences(),
        ]);

        if (progressResult.success) {
          setProgress(progressResult.data);
        }

        if (preferencesResult.success) {
          setPreferences(preferencesResult.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading reading data:', err);
        setError('Failed to load reading content');
        setLoading(false);
      }
    };

    loadData();
  }, [summaryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 text-lg">{error || 'Book not found'}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <ReadingMode
      summary={summary}
      initialChapter={progress?.current_chapter || 1}
      progress={progress}
      userPreferences={preferences}
      onBack={() => navigate(-1)}
    />
  );
}

export default ReadingPage;
