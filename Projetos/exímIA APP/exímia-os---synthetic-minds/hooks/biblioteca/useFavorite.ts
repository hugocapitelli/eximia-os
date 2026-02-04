// useFavorite Hook - Toggle favorite with optimistic UI
// EXIMIA-105

import { useState, useCallback } from 'react';
import { toggleFavorite } from '../../services/biblioteca';

interface UseFavoriteResult {
  isFavorite: boolean;
  isLoading: boolean;
  error: string | null;
  toggle: () => Promise<void>;
}

export function useFavorite(
  catalogId: string,
  initialFavorite: boolean = false
): UseFavoriteResult {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(async () => {
    const previousValue = isFavorite;

    // Optimistic update
    setIsFavorite(!isFavorite);
    setIsLoading(true);
    setError(null);

    try {
      const result = await toggleFavorite(catalogId);

      if (!result.success) {
        // Rollback on error
        setIsFavorite(previousValue);
        setError(result.error || 'Erro ao atualizar favorito');
      } else if (result.data) {
        // Sync with server response
        setIsFavorite(result.data.isFavorite);
      }
    } catch (err) {
      // Rollback on exception
      setIsFavorite(previousValue);
      setError('Erro ao atualizar favorito');
    } finally {
      setIsLoading(false);
    }
  }, [catalogId, isFavorite]);

  return {
    isFavorite,
    isLoading,
    error,
    toggle,
  };
}
