'use client';

/**
 * useChat - Hook for managing chat state with streaming support
 *
 * BLOCO 1.2 - Synthetic Minds
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import type {
  Conversation,
  Message,
  AgentSummary,
  UseChatOptions,
  StreamChunk,
} from '@/types/synthetic-minds';

const AGENT_SERVICE_URL =
  process.env.NEXT_PUBLIC_AGENT_SERVICE_URL || 'http://localhost:8000';

interface UseChatReturn {
  // State
  conversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;

  // Actions
  startConversation: (agentId: string, title?: string) => Promise<Conversation | null>;
  sendMessage: (content: string) => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { agent_id, conversation_id, onMessage, onError, onStreamStart, onStreamEnd } = options;

  // State
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get auth token
  const getAuthToken = useCallback(async (): Promise<string | null> => {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  }, []);

  // Make authenticated request
  const authFetch = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${AGENT_SERVICE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      return response;
    },
    [getAuthToken]
  );

  // Start a new conversation
  const startConversation = useCallback(
    async (agentId: string, title?: string): Promise<Conversation | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authFetch('/api/v1/chat/conversations', {
          method: 'POST',
          body: JSON.stringify({
            agent_id: agentId,
            title: title || undefined,
          }),
        });

        const newConversation: Conversation = await response.json();
        setConversation(newConversation);
        setMessages([]);
        return newConversation;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to start conversation';
        setError(message);
        onError?.(new Error(message));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [authFetch, onError]
  );

  // Load existing conversation
  const loadConversation = useCallback(
    async (conversationId: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authFetch(`/api/v1/chat/conversations/${conversationId}`);
        const conv: Conversation = await response.json();
        setConversation(conv);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load conversation';
        setError(message);
        onError?.(new Error(message));
      } finally {
        setIsLoading(false);
      }
    },
    [authFetch, onError]
  );

  // Load messages for conversation
  const loadMessages = useCallback(
    async (conversationId: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authFetch(
          `/api/v1/chat/conversations/${conversationId}/messages?limit=50`
        );
        const msgs: Message[] = await response.json();
        setMessages(msgs);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load messages';
        setError(message);
        onError?.(new Error(message));
      } finally {
        setIsLoading(false);
      }
    },
    [authFetch, onError]
  );

  // Send message with streaming
  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!conversation) {
        setError('No active conversation');
        return;
      }

      // Cancel any existing stream
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setIsStreaming(true);
      setStreamingContent('');
      setError(null);

      // Optimistically add user message
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: conversation.id,
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const token = await getAuthToken();
        if (!token) {
          throw new Error('Not authenticated');
        }

        onStreamStart?.();

        const response = await fetch(
          `${AGENT_SERVICE_URL}/api/v1/chat/conversations/${conversation.id}/messages/stream`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content }),
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let accumulatedContent = '';
        let finalMessage: Message | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data: StreamChunk = JSON.parse(line.slice(6));

                if (data.type === 'content' && data.content) {
                  accumulatedContent += data.content;
                  setStreamingContent(accumulatedContent);
                } else if (data.type === 'done' && data.message_id) {
                  finalMessage = {
                    id: data.message_id,
                    conversation_id: conversation.id,
                    role: 'assistant',
                    content: accumulatedContent,
                    tokens_used: data.tokens_used,
                    created_at: new Date().toISOString(),
                  };
                } else if (data.type === 'error') {
                  throw new Error(data.error || 'Stream error');
                }
              } catch (parseError) {
                // Skip malformed chunks but log the issue
                logger.warn('Failed to parse SSE chunk', {
                  line,
                  error: parseError instanceof Error ? parseError.message : String(parseError),
                });
              }
            }
          }
        }

        // Update messages with final assistant message
        if (finalMessage) {
          setMessages((prev) => [...prev, finalMessage!]);
          onMessage?.(finalMessage);
          onStreamEnd?.(finalMessage);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was cancelled, don't show error
          return;
        }
        const message = err instanceof Error ? err.message : 'Failed to send message';
        setError(message);
        onError?.(new Error(message));
        // Remove optimistic user message on error
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
        setStreamingContent('');
      }
    },
    [conversation, getAuthToken, onMessage, onError, onStreamStart, onStreamEnd]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset state
  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setConversation(null);
    setMessages([]);
    setIsLoading(false);
    setIsStreaming(false);
    setStreamingContent('');
    setError(null);
  }, []);

  // Load initial conversation if provided
  useEffect(() => {
    if (conversation_id && !conversation) {
      loadConversation(conversation_id).then(() => {
        loadMessages(conversation_id);
      });
    }
  }, [conversation_id, conversation, loadConversation, loadMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    conversation,
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    error,
    startConversation,
    sendMessage,
    loadConversation,
    loadMessages,
    clearError,
    reset,
  };
}
