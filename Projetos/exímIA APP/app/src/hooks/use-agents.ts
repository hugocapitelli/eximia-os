'use client';

/**
 * useAgents - Hook for fetching available agents
 *
 * BLOCO 1.2 - Synthetic Minds
 */
import { useState, useCallback, useEffect } from 'react';
import type { AgentSummary, Agent, AgentSearchFilters } from '@/types/synthetic-minds';

const AGENT_SERVICE_URL =
  process.env.NEXT_PUBLIC_AGENT_SERVICE_URL || 'http://localhost:8000';

interface UseAgentsReturn {
  agents: AgentSummary[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchAgents: (filters: AgentSearchFilters) => Promise<void>;
  getAgent: (agentId: string) => Promise<Agent | null>;
  getAgentBySlug: (slug: string) => Promise<Agent | null>;
}

export function useAgents(initialFilters?: AgentSearchFilters): UseAgentsReturn {
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch agents with optional filters
  const searchAgents = useCallback(async (filters: AgentSearchFilters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.query) params.append('query', filters.query);
      if (filters.domain) params.append('domain', filters.domain);
      if (filters.tier) params.append('tier', filters.tier);
      params.append('limit', '50');

      const response = await fetch(`${AGENT_SERVICE_URL}/api/v1/agents/?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: AgentSummary[] = await response.json();
      setAgents(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch agents';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch with current filters
  const refetch = useCallback(async () => {
    await searchAgents(initialFilters);
  }, [searchAgents, initialFilters]);

  // Get single agent by ID
  const getAgent = useCallback(async (agentId: string): Promise<Agent | null> => {
    try {
      const response = await fetch(`${AGENT_SERVICE_URL}/api/v1/agents/${agentId}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      logger.error('Failed to get agent:', err);
      return null;
    }
  }, []);

  // Get single agent by slug
  const getAgentBySlug = useCallback(async (slug: string): Promise<Agent | null> => {
    try {
      const response = await fetch(`${AGENT_SERVICE_URL}/api/v1/agents/slug/${slug}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      logger.error('Failed to get agent:', err);
      return null;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    searchAgents(initialFilters);
  }, [searchAgents, initialFilters]);

  return {
    agents,
    isLoading,
    error,
    refetch,
    searchAgents,
    getAgent,
    getAgentBySlug,
  };
}
