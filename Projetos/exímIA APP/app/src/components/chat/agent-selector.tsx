'use client';

/**
 * AgentSelector - Grid of agents for selection
 */
import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { AgentCard } from './agent-card';
import { Search } from 'lucide-react';
import type { AgentSummary } from '@/types/synthetic-minds';

export interface AgentSelectorProps {
  agents: AgentSummary[];
  isLoading?: boolean;
  onSelect?: (agent: AgentSummary) => void;
  onChat?: (agent: AgentSummary) => void;
  className?: string;
}

export function AgentSelector({
  agents,
  isLoading = false,
  onSelect,
  onChat,
  className,
}: AgentSelectorProps) {
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  // Get unique domains
  const domains = [...new Set(agents.map((a) => a.domain))];

  // Filter agents
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      !search ||
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.description.toLowerCase().includes(search.toLowerCase()) ||
      agent.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesDomain = !selectedDomain || agent.domain === selectedDomain;

    return matchesSearch && matchesDomain;
  });

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, tag ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Domain filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedDomain(null)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm transition-colors',
              !selectedDomain
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            )}
          >
            Todos
          </button>
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm transition-colors',
                selectedDomain === domain
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-muted-foreground">
            Nenhum agente encontrado
          </p>
          <p className="text-sm text-muted-foreground">
            Tente ajustar sua busca ou filtros
          </p>
        </div>
      )}

      {/* Agent grid */}
      {!isLoading && filteredAgents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onSelect={onSelect}
              onChat={onChat}
            />
          ))}
        </div>
      )}
    </div>
  );
}
