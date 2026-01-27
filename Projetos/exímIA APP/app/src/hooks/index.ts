/**
 * ExímIA APP - Custom Hooks
 */

// Synthetic Minds (BLOCO 1.2)
export { useChat } from './use-chat';
export { useAgents } from './use-agents';

// Connection Layer (BLOCO 1.3)
export { useEntityLinks, useEntitySearch } from './use-entity-links';
export type { EntitySearchResult, EntitySearchFilters } from './use-entity-links';

// Inbox (BLOCO 2.1)
export { useInbox, useQuickCapture } from './use-inbox';

// Inbox AI (BLOCO 2.2)
export { useInboxAI, useAutoAnalyze } from './use-inbox-ai';

// Journey Goals (BLOCO 3.1)
export { useGoals, useGoal } from './use-goals';

// Journey Habits (BLOCO 3.2)
export { useHabits, useSingleHabit } from './use-habits';
