'use client';

/**
 * MessageBubble - Individual message in chat
 */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import type { Message } from '@/types/synthetic-minds';

export interface MessageBubbleProps {
  message: Message;
  agentName?: string;
  agentAvatar?: string;
  userName?: string;
  userAvatar?: string;
  isStreaming?: boolean;
}

export function MessageBubble({
  message,
  agentName = 'Assistant',
  agentAvatar,
  userName = 'You',
  userAvatar,
  isStreaming = false,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-3 py-4 px-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <Avatar
        size="sm"
        src={isUser ? userAvatar : agentAvatar}
        alt={isUser ? userName : agentName}
        fallback={isUser ? userName : agentName}
        className="shrink-0"
      />

      {/* Content */}
      <div
        className={cn(
          'flex flex-col gap-1 max-w-[80%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        {/* Name */}
        <span className="text-xs text-muted-foreground">
          {isUser ? userName : agentName}
        </span>

        {/* Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-2',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-muted rounded-tl-sm',
            isStreaming && 'animate-pulse'
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
            )}
          </p>
        </div>

        {/* Metadata */}
        {message.tokens_used && (
          <span className="text-[10px] text-muted-foreground">
            {message.tokens_used} tokens
          </span>
        )}
      </div>
    </div>
  );
}
