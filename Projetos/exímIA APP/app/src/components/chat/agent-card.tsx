'use client';

/**
 * AgentCard - Card displaying an agent in the library
 */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Star, MessageCircle } from 'lucide-react';
import type { AgentSummary, AgentTier } from '@/types/synthetic-minds';

const TIER_COLORS: Record<AgentTier, string> = {
  tier_0: 'bg-gray-500',
  tier_1: 'bg-yellow-500',
  tier_2: 'bg-purple-500',
  tier_3: 'bg-blue-500',
};

const TIER_LABELS: Record<AgentTier, string> = {
  tier_0: 'Diagnostic',
  tier_1: 'Master',
  tier_2: 'Systematizer',
  tier_3: 'Specialist',
};

export interface AgentCardProps {
  agent: AgentSummary;
  onSelect?: (agent: AgentSummary) => void;
  onChat?: (agent: AgentSummary) => void;
  className?: string;
}

export function AgentCard({
  agent,
  onSelect,
  onChat,
  className,
}: AgentCardProps) {
  const tierColor = TIER_COLORS[agent.tier];
  const tierLabel = TIER_LABELS[agent.tier];

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]',
        'bg-card border-border',
        className
      )}
      onClick={() => onSelect?.(agent)}
    >
      <CardContent className="pt-6">
        {/* Avatar & Status */}
        <div className="flex flex-col items-center mb-4">
          <Avatar
            size="2xl"
            src={agent.avatar_url}
            alt={agent.name}
            fallback={agent.name}
            status={agent.status === 'active' ? 'online' : 'offline'}
          />
        </div>

        {/* Name & Domain */}
        <div className="text-center mb-3">
          <h3 className="font-semibold text-lg">{agent.name}</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {agent.domain}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 text-center mb-4">
          {agent.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 justify-center mb-4">
          {agent.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          {/* Rating */}
          {agent.avg_rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span>{agent.avg_rating.toFixed(1)}</span>
            </div>
          )}

          {/* Fidelity */}
          {agent.fidelity_score && (
            <div className="flex items-center gap-1">
              <span className={cn('h-2 w-2 rounded-full', tierColor)} />
              <span>{agent.fidelity_score}%</span>
            </div>
          )}

          {/* Invocations */}
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{agent.times_invoked}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onChat?.(agent);
          }}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Conversar
        </Button>
      </CardFooter>
    </Card>
  );
}
