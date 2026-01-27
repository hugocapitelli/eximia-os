'use client';

/**
 * Minds Page - Synthetic Minds Library
 *
 * BLOCO 1.2 - Main page for interacting with AI agents
 */
import { useState, useCallback } from 'react';
import { useChat, useAgents } from '@/hooks';
import { ChatWindow } from '@/components/chat/chat-window';
import { AgentSelector } from '@/components/chat/agent-selector';
import { Button } from '@/components/ui/button';
import { Heading, Text } from '@/components/ui/typography';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft, Brain, MessageSquare, Sparkles } from 'lucide-react';
import type { AgentSummary, Agent } from '@/types/synthetic-minds';

type ViewMode = 'library' | 'chat';

export default function MindsPage() {
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [selectedAgent, setSelectedAgent] = useState<AgentSummary | null>(null);

  // Hooks
  const { agents, isLoading: agentsLoading, error: agentsError } = useAgents();
  const {
    conversation,
    messages,
    isLoading: chatLoading,
    isStreaming,
    streamingContent,
    error: chatError,
    startConversation,
    sendMessage,
    reset: resetChat,
  } = useChat();

  // Handle agent selection to start chat
  const handleStartChat = useCallback(
    async (agent: AgentSummary) => {
      setSelectedAgent(agent);
      setViewMode('chat');

      // Start new conversation
      await startConversation(agent.id, `Chat com ${agent.name}`);
    },
    [startConversation]
  );

  // Handle back to library
  const handleBack = useCallback(() => {
    setViewMode('library');
    setSelectedAgent(null);
    resetChat();
  }, [resetChat]);

  // Handle send message
  const handleSend = useCallback(
    (content: string) => {
      sendMessage(content);
    },
    [sendMessage]
  );

  // Render library view
  if (viewMode === 'library') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-primary" />
            <Heading level="h1">Synthetic Minds</Heading>
          </div>
          <Text className="text-muted-foreground max-w-2xl">
            Biblioteca de mentes sintéticas especializadas. Cada agente foi treinado
            para um domínio específico e pode ajudá-lo com tarefas, decisões e aprendizado.
          </Text>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Brain className="h-5 w-5" />}
            label="Agentes"
            value={agents.length.toString()}
          />
          <StatCard
            icon={<Sparkles className="h-5 w-5" />}
            label="Domínios"
            value={new Set(agents.map((a) => a.domain)).size.toString()}
          />
          <StatCard
            icon={<MessageSquare className="h-5 w-5" />}
            label="Conversas"
            value="0"
          />
          <StatCard
            icon={<Sparkles className="h-5 w-5" />}
            label="Mensagens"
            value="0"
          />
        </div>

        {/* Error */}
        {agentsError && (
          <div className="mb-8 p-4 bg-destructive/10 text-destructive rounded-lg">
            <Text>Erro ao carregar agentes: {agentsError}</Text>
          </div>
        )}

        {/* Agent Selector */}
        <AgentSelector
          agents={agents}
          isLoading={agentsLoading}
          onChat={handleStartChat}
          onSelect={handleStartChat}
        />
      </div>
    );
  }

  // Render chat view
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Error */}
      {chatError && (
        <div className="p-4 bg-destructive/10 text-destructive">
          <Text>Erro: {chatError}</Text>
        </div>
      )}

      {/* Loading state while creating conversation */}
      {chatLoading && !conversation && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <Text>Iniciando conversa com {selectedAgent?.name}...</Text>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {conversation && (
        <ChatWindow
          conversation={conversation}
          messages={messages}
          agent={selectedAgent}
          isLoading={chatLoading}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          onSend={handleSend}
          onBack={handleBack}
          className="flex-1"
        />
      )}
    </div>
  );
}

// Simple stat card component
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-lg bg-card border">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
