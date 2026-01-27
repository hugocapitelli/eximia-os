'use client';

/**
 * MessageList - Scrollable list of messages
 */
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MessageBubble } from './message-bubble';
import { Spinner } from '@/components/ui/spinner';
import type { Message } from '@/types/synthetic-minds';

export interface MessageListProps {
  messages: Message[];
  agentName?: string;
  agentAvatar?: string;
  userName?: string;
  userAvatar?: string;
  isLoading?: boolean;
  streamingContent?: string;
  className?: string;
}

export function MessageList({
  messages,
  agentName,
  agentAvatar,
  userName,
  userAvatar,
  isLoading = false,
  streamingContent,
  className,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={cn('flex-1 flex items-center justify-center', className)}>
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Inicie uma conversa</p>
          <p className="text-sm">Envie uma mensagem para começar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex-1 overflow-y-auto', className)}>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          agentName={agentName}
          agentAvatar={agentAvatar}
          userName={userName}
          userAvatar={userAvatar}
        />
      ))}

      {/* Streaming message */}
      {streamingContent && (
        <MessageBubble
          message={{
            id: 'streaming',
            conversation_id: '',
            role: 'assistant',
            content: streamingContent,
            created_at: new Date().toISOString(),
          }}
          agentName={agentName}
          agentAvatar={agentAvatar}
          isStreaming
        />
      )}

      {/* Loading indicator */}
      {isLoading && !streamingContent && (
        <div className="flex items-center gap-2 px-4 py-4">
          <Spinner size="sm" />
          <span className="text-sm text-muted-foreground">
            {agentName || 'Assistant'} is typing...
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
