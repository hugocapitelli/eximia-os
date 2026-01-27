'use client';

/**
 * ChatWindow - Complete chat interface
 */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import type { Conversation, Message, AgentSummary } from '@/types/synthetic-minds';

export interface ChatWindowProps {
  conversation?: Conversation | null;
  messages: Message[];
  agent?: AgentSummary | null;
  isLoading?: boolean;
  isStreaming?: boolean;
  streamingContent?: string;
  userName?: string;
  userAvatar?: string;
  onSend: (content: string) => void;
  onBack?: () => void;
  className?: string;
}

export function ChatWindow({
  conversation,
  messages,
  agent,
  isLoading = false,
  isStreaming = false,
  streamingContent,
  userName,
  userAvatar,
  onSend,
  onBack,
  className,
}: ChatWindowProps) {
  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b shrink-0">
        {/* Back button */}
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Agent info */}
        {agent && (
          <>
            <Avatar
              size="default"
              src={agent.avatar_url}
              alt={agent.name}
              fallback={agent.name}
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold truncate">{agent.name}</h2>
              <p className="text-xs text-muted-foreground truncate">
                {agent.domain}
                {agent.fidelity_score && ` • ${agent.fidelity_score}% fidelity`}
              </p>
            </div>
          </>
        )}

        {/* Title fallback */}
        {!agent && conversation?.title && (
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{conversation.title}</h2>
          </div>
        )}

        {/* Menu */}
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </header>

      {/* Messages */}
      <MessageList
        messages={messages}
        agentName={agent?.name}
        agentAvatar={agent?.avatar_url || undefined}
        userName={userName}
        userAvatar={userAvatar}
        isLoading={isLoading}
        streamingContent={streamingContent}
        className="flex-1"
      />

      {/* Input */}
      <ChatInput
        onSend={onSend}
        disabled={isStreaming}
        isLoading={isLoading}
        placeholder={`Message ${agent?.name || 'Assistant'}...`}
      />
    </div>
  );
}
