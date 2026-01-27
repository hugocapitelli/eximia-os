/**
 * ExímIA APP - Synthetic Minds Types
 * BLOCO 1.2 - Schema TypeScript
 */

// ═══════════════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════════════

export type AgentTier = 'tier_0' | 'tier_1' | 'tier_2' | 'tier_3';

export type AgentStatus = 'active' | 'validating' | 'inactive';

export type ConversationStatus = 'active' | 'archived';

export type MessageRole = 'user' | 'assistant' | 'system';

// ═══════════════════════════════════════════════════════════════════
// AGENT
// ═══════════════════════════════════════════════════════════════════

export interface Agent {
  id: string;
  name: string;
  slug: string;
  domain: string;
  subdomain?: string;
  tier: AgentTier;
  version: string;
  status: AgentStatus;
  fidelity_score?: number;
  avatar_url?: string;
  description: string;
  use_cases: string[];
  avoid_cases: string[];
  system_prompt: string;
  knowledge_bases?: Record<string, unknown>;
  tags: string[];
  times_invoked: number;
  avg_rating?: number;
  default_model?: string;
  temperature?: number;
  max_tokens?: number;
  created_at: string;
  updated_at: string;
}

export interface AgentSummary {
  id: string;
  name: string;
  slug: string;
  domain: string;
  tier: AgentTier;
  status: AgentStatus;
  fidelity_score?: number;
  avatar_url?: string;
  description: string;
  tags: string[];
  times_invoked: number;
  avg_rating?: number;
}

export interface AgentSearchFilters {
  query?: string;
  domain?: string;
  tier?: AgentTier;
  status?: AgentStatus;
  tags?: string[];
}

// ═══════════════════════════════════════════════════════════════════
// CONVERSATION
// ═══════════════════════════════════════════════════════════════════

export interface Conversation {
  id: string;
  user_id: string;
  agent_id: string;
  title?: string;
  status: ConversationStatus;
  metadata?: Record<string, unknown>;
  message_count: number;
  total_tokens: number;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  // Joined
  agent?: AgentSummary;
}

export interface CreateConversationInput {
  agent_id: string;
  title?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateConversationInput {
  title?: string;
  status?: ConversationStatus;
  metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════
// MESSAGE
// ═══════════════════════════════════════════════════════════════════

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  tokens_used?: number;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface SendMessageInput {
  content: string;
  metadata?: Record<string, unknown>;
}

export interface StreamChunk {
  type: 'content' | 'done' | 'error';
  content?: string;
  message_id?: string;
  tokens_used?: number;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════
// AGENT RATING
// ═══════════════════════════════════════════════════════════════════

export interface AgentRating {
  id: string;
  agent_id: string;
  user_id: string;
  conversation_id?: string;
  rating: number;
  feedback?: string;
  created_at: string;
}

export interface CreateRatingInput {
  agent_id: string;
  rating: number;
  feedback?: string;
  conversation_id?: string;
}

// ═══════════════════════════════════════════════════════════════════
// CHAT STATE
// ═══════════════════════════════════════════════════════════════════

export interface ChatState {
  conversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}

export interface UseChatOptions {
  agent_id?: string;
  conversation_id?: string;
  onMessage?: (message: Message) => void;
  onError?: (error: Error) => void;
  onStreamStart?: () => void;
  onStreamEnd?: (message: Message) => void;
}

// ═══════════════════════════════════════════════════════════════════
// API RESPONSES
// ═══════════════════════════════════════════════════════════════════

export interface AgentsResponse {
  data: AgentSummary[];
  count: number;
}

export interface ConversationsResponse {
  data: Conversation[];
  count: number;
}

export interface MessagesResponse {
  data: Message[];
  count: number;
}

export interface ConversationWithMessages {
  conversation: Conversation;
  messages: Message[];
}

// ═══════════════════════════════════════════════════════════════════
// TIER DESCRIPTIONS
// ═══════════════════════════════════════════════════════════════════

export const TIER_INFO: Record<AgentTier, { label: string; description: string; color: string }> = {
  tier_0: {
    label: 'Diagnostic',
    description: 'Diagnóstico e análise, não execução',
    color: 'gray',
  },
  tier_1: {
    label: 'Master',
    description: 'Fidelity ≥90%, máxima qualidade',
    color: 'gold',
  },
  tier_2: {
    label: 'Systematizer',
    description: 'Fidelity ≥85%, frameworks estruturados',
    color: 'purple',
  },
  tier_3: {
    label: 'Specialist',
    description: 'Fidelity ≥80%, domínio específico',
    color: 'blue',
  },
};

// ═══════════════════════════════════════════════════════════════════
// DOMAIN ICONS
// ═══════════════════════════════════════════════════════════════════

export const DOMAIN_ICONS: Record<string, string> = {
  General: '🤖',
  Strategy: '🎯',
  Education: '📚',
  Copywriting: '✍️',
  Finance: '💰',
  Technology: '💻',
  Design: '🎨',
  Psychology: '🧠',
  Marketing: '📢',
  Sales: '🤝',
};
