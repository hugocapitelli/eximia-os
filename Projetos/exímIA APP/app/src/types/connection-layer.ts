/**
 * ExímIA APP - Connection Layer Types
 * BLOCO 1.1 - Schema TypeScript
 */

// ═══════════════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════════════

export type ModuleType =
  | 'journey'
  | 'academy'
  | 'strategy'
  | 'brand'
  | 'prototyper'
  | 'inbox'
  | 'system';

export type EntityType =
  // Journey
  | 'goal'
  | 'habit'
  | 'book'
  | 'event'
  // Academy
  | 'course'
  | 'lesson'
  | 'session'
  // Strategy
  | 'initiative'
  | 'cycle'
  | 'kpi'
  // Brand
  | 'brand_identity'
  | 'asset'
  | 'palette'
  // PrototypOS
  | 'project'
  | 'prd'
  | 'design_system'
  // Inbox
  | 'inbox_item';

export type EventStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type LinkType = 'cascaded' | 'suggested' | 'manual' | 'derived';

export type LinkCreator = 'system' | 'user' | 'ai';

export type SuggestionType =
  | 'create_entity'
  | 'link_entities'
  | 'complete_entity'
  | 'update_entity'
  | 'enroll_course'
  | 'start_habit'
  | 'review_progress'
  | 'adjust_deadline';

export type SuggestionStatus =
  | 'pending'
  | 'shown'
  | 'accepted'
  | 'dismissed'
  | 'snoozed'
  | 'expired';

export type SuggestionPriority = 'low' | 'medium' | 'high';

export type SuggestionDisplay = 'toast' | 'card' | 'modal' | 'notification';

export type NotificationType =
  | 'reminder'
  | 'alert'
  | 'suggestion'
  | 'celebration'
  | 'digest'
  | 'system';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type NotificationStatus =
  | 'pending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'actioned'
  | 'dismissed';

export type NotificationChannel = 'in_app' | 'push' | 'email';

export type InboxContentType = 'text' | 'voice' | 'image' | 'link' | 'file';

export type InboxSource =
  | 'quick_capture'
  | 'voice'
  | 'email'
  | 'api'
  | 'share'
  | 'screenshot';

export type InboxStatus =
  | 'inbox'
  | 'processing'
  | 'triaged'
  | 'converted'
  | 'archived';

// ═══════════════════════════════════════════════════════════════════
// EVENT
// ═══════════════════════════════════════════════════════════════════

export interface SystemEvent {
  id: string;
  type: string;
  source_module: ModuleType;
  entity_type: EntityType;
  entity_id: string;
  data: Record<string, unknown>;
  user_id: string;
  workspace_id?: string;
  correlation_id?: string;
  created_at: string;
  processed_at?: string;
  status: EventStatus;
}

export interface CreateEventInput {
  type: string;
  source_module: ModuleType;
  entity_type: EntityType;
  entity_id: string;
  data?: Record<string, unknown>;
  correlation_id?: string;
}

// ═══════════════════════════════════════════════════════════════════
// ENTITY LINK
// ═══════════════════════════════════════════════════════════════════

export interface EntityLink {
  id: string;
  source_module: ModuleType;
  source_type: EntityType;
  source_id: string;
  target_module: ModuleType;
  target_type: EntityType;
  target_id: string;
  link_type: LinkType;
  relationship: string;
  strength: number;
  bidirectional: boolean;
  user_id: string;
  created_by: LinkCreator;
  created_reason?: string;
  created_at: string;
  last_accessed_at?: string;
}

export interface CreateLinkInput {
  source_module: ModuleType;
  source_type: EntityType;
  source_id: string;
  target_module: ModuleType;
  target_type: EntityType;
  target_id: string;
  relationship: string;
  link_type?: LinkType;
  strength?: number;
  bidirectional?: boolean;
  created_reason?: string;
}

export interface LinkedEntity {
  id: string;
  direction: 'incoming' | 'outgoing';
  linked_module: ModuleType;
  linked_type: EntityType;
  linked_id: string;
  link_type: LinkType;
  relationship: string;
  strength: number;
  created_at: string;
}

// ═══════════════════════════════════════════════════════════════════
// SUGGESTION
// ═══════════════════════════════════════════════════════════════════

export interface SuggestionAction {
  type: string;
  module: ModuleType;
  params: Record<string, unknown>;
}

export interface TriggerEntity {
  type: EntityType;
  id: string;
  title: string;
}

export interface Suggestion {
  id: string;
  user_id: string;
  trigger_event_id?: string;
  trigger_event_type?: string;
  trigger_entity_type?: EntityType;
  trigger_entity_id?: string;
  trigger_entity_title?: string;
  suggestion_type: SuggestionType;
  action_type: string;
  action_module: ModuleType;
  action_params: Record<string, unknown>;
  title: string;
  description?: string;
  reasoning?: string;
  confidence: number;
  prefilled_data?: Record<string, unknown>;
  target_module?: ModuleType;
  target_route?: string;
  priority: SuggestionPriority;
  display_type: SuggestionDisplay;
  status: SuggestionStatus;
  created_at: string;
  shown_at?: string;
  decided_at?: string;
  expires_at?: string;
  snooze_until?: string;
}

export interface CreateSuggestionInput {
  suggestion_type: SuggestionType;
  action_type: string;
  action_module: ModuleType;
  action_params?: Record<string, unknown>;
  title: string;
  description?: string;
  reasoning?: string;
  confidence: number;
  prefilled_data?: Record<string, unknown>;
  target_module?: ModuleType;
  target_route?: string;
  priority?: SuggestionPriority;
  display_type?: SuggestionDisplay;
  expires_at?: string;
  trigger_event_id?: string;
  trigger_entity_type?: EntityType;
  trigger_entity_id?: string;
  trigger_entity_title?: string;
}

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATION
// ═══════════════════════════════════════════════════════════════════

export interface NotificationAction {
  label: string;
  action: string;
  params?: Record<string, unknown>;
  style?: 'primary' | 'secondary' | 'destructive';
}

export interface RelatedEntity {
  type: EntityType;
  id: string;
  title: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  action_url?: string;
  action_label?: string;
  actions?: NotificationAction[];
  source_module?: ModuleType;
  related_entity_type?: EntityType;
  related_entity_id?: string;
  related_entity_title?: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  status: NotificationStatus;
  scheduled_for?: string;
  sent_at?: string;
  read_at?: string;
  actioned_at?: string;
  created_at: string;
}

export interface CreateNotificationInput {
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  action_url?: string;
  action_label?: string;
  actions?: NotificationAction[];
  source_module?: ModuleType;
  related_entity_type?: EntityType;
  related_entity_id?: string;
  related_entity_title?: string;
  channels?: NotificationChannel[];
  priority?: NotificationPriority;
  scheduled_for?: string;
}

// ═══════════════════════════════════════════════════════════════════
// INBOX ITEM
// ═══════════════════════════════════════════════════════════════════

export interface InboxAIAnalysis {
  suggested_module: ModuleType;
  suggested_entity_type: EntityType;
  confidence: number;
  reasoning: string;
  extracted_entities?: {
    title?: string;
    date?: string;
    category?: string;
    tags?: string[];
  };
}

export interface InboxConvertedTo {
  module: ModuleType;
  type: EntityType;
  id: string;
}

export interface InboxItem {
  id: string;
  user_id: string;
  content: string;
  content_type: InboxContentType;
  attachments?: Record<string, unknown>[];
  source: InboxSource;
  source_metadata?: Record<string, unknown>;
  ai_analysis?: InboxAIAnalysis;
  status: InboxStatus;
  converted_to_module?: ModuleType;
  converted_to_type?: EntityType;
  converted_to_id?: string;
  created_at: string;
  processed_at?: string;
}

export interface CreateInboxItemInput {
  content: string;
  content_type?: InboxContentType;
  attachments?: Record<string, unknown>[];
  source?: InboxSource;
  source_metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════
// API RESPONSES
// ═══════════════════════════════════════════════════════════════════

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface EventsResponse extends PaginatedResponse<SystemEvent> {}
export interface LinksResponse extends PaginatedResponse<EntityLink> {}
export interface SuggestionsResponse extends PaginatedResponse<Suggestion> {}
export interface NotificationsResponse extends PaginatedResponse<Notification> {}
export interface InboxItemsResponse extends PaginatedResponse<InboxItem> {}

// ═══════════════════════════════════════════════════════════════════
// FILTERS
// ═══════════════════════════════════════════════════════════════════

export interface EventFilters {
  type?: string;
  source_module?: ModuleType;
  entity_type?: EntityType;
  entity_id?: string;
  status?: EventStatus;
  since?: string;
  until?: string;
}

export interface LinkFilters {
  entity_type?: EntityType;
  entity_id?: string;
  link_type?: LinkType;
  source_module?: ModuleType;
  target_module?: ModuleType;
}

export interface SuggestionFilters {
  status?: SuggestionStatus;
  priority?: SuggestionPriority;
  suggestion_type?: SuggestionType;
  target_module?: ModuleType;
}

export interface NotificationFilters {
  type?: NotificationType;
  status?: NotificationStatus;
  priority?: NotificationPriority;
  source_module?: ModuleType;
  unread_only?: boolean;
}

export interface InboxFilters {
  status?: InboxStatus;
  content_type?: InboxContentType;
  source?: InboxSource;
}
