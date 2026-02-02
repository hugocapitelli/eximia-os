
export type ViewType = 
  | 'STUDENT_DASHBOARD' 
  | 'STUDENT_ACHIEVEMENTS'
  | 'STUDENT_HISTORY'
  | 'COURSE_LIST'
  | 'COURSE_DETAILS' 
  | 'COURSE_EDIT'
  | 'CHAPTER_DETAIL'
  | 'CHAPTER_READER' 
  | 'INSTRUCTOR_LIST' 
  | 'INSTRUCTOR_DETAIL' 
  | 'DISCIPLINE_EDIT'
  | 'CONTENT_CREATION'
  | 'CONTENT_REVISION'
  | 'ADMIN_CONSOLE'
  | 'ADMIN_CLASSES'
  | 'USER_MANAGEMENT'
  | 'SYSTEM_SETTINGS'
  | 'USER_PROFILE'
  | 'ACCOUNT_SETTINGS';

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  students: number;
  category: string;
  thumbnail: string;
  status: 'Ativo' | 'Rascunho' | 'Arquivado';
}

export type InitiativeStatus = 'NOT_PLANNED' | 'PLANNED' | 'ON_TRACK' | 'ATTENTION' | 'CRITICAL' | 'DONE';
export type InitiativeLevel = 'STRATEGIC' | 'TACTICAL' | 'OPERATIONAL';

export interface HoshinPerspective {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface HoshinInitiative {
  id: string;
  code: string;
  title: string;
  owner: string;
  status: InitiativeStatus;
  level: InitiativeLevel;
  perspectiveId: string;
  startDate: string;
  deadline: string;
  description?: string;
  iceScore: number;
  parentId?: string | null;
}

// ============================================
// API REQUEST TYPES
// ============================================

export interface LoginRequest {
  ra: string;
  password: string;
}

export interface DisciplineCreateRequest {
  name: string;
  code: string;
  department: string;
}

export interface DisciplineUpdateRequest {
  title?: string;
  name?: string;
  department?: string;
  description?: string;
}

export interface CourseCreateRequest {
  title: string;
  description?: string;
  discipline_id?: string;
  instructor?: string;
  category?: string;
  status?: 'Ativo' | 'Rascunho' | 'Arquivado';
}

export interface CourseUpdateRequest {
  title?: string;
  description?: string;
  instructor?: string;
  category?: string;
  status?: 'Ativo' | 'Rascunho' | 'Arquivado';
}

export interface ChapterCreateRequest {
  title: string;
  description?: string;
  order?: number;
}

export interface ChapterUpdateRequest {
  title?: string;
  description?: string;
  order?: number;
}

export interface ContentCreateRequest {
  title: string;
  type?: 'video' | 'text' | 'pdf' | 'quiz' | 'audio';
  text_content?: string;
  body?: string;
  content_url?: string;
  order?: number;
}

export interface ContentUpdateRequest {
  title?: string;
  type?: 'video' | 'text' | 'pdf' | 'quiz' | 'audio';
  text_content?: string;
  body?: string;
  content_url?: string;
  order?: number;
}

export interface QuestionCreateRequest {
  text: string;
  skill?: 'aplicacao' | 'analise' | 'sintese';
  intention?: string;
  difficulty?: 'iniciante' | 'intermediario' | 'avancado';
}

export interface QuestionUpdateRequest {
  text?: string;
  skill?: string;
  intention?: string;
  difficulty?: string;
}

export interface UserCreateRequest {
  ra: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  title?: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
  title?: string;
  ra?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface Discipline {
  id: string;
  code?: string;
  name?: string;
  title?: string;
  department?: string;
  description?: string;
  image?: string;
  students?: number;
  courses_count?: number;
  created_at?: string;
}

export interface Chapter {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order: number;
  contents_count?: number;
  created_at?: string;
}

export interface Content {
  id: string;
  chapter_id: string;
  title: string;
  type: 'video' | 'text' | 'pdf' | 'quiz' | 'audio';
  text_content?: string;
  body?: string;
  content_url?: string;
  audio_url?: string;
  order?: number;
  created_at?: string;
}

export interface Question {
  id: string;
  content_id: string;
  text: string;
  skill?: string;
  intention?: string;
  difficulty?: string;
  created_at?: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  ra: string;
  role: string;
  title?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface LoginResponse {
  token: string;
  user: UserData;
}

export interface DashboardStats {
  total_users?: number;
  total_courses?: number;
  total_disciplines?: number;
  total_chapters?: number;
  active_sessions?: number;
}

export interface SystemSettings {
  platform_name?: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  login_logo_url?: string;
  login_background_url?: string;
  modules_enabled?: Record<string, boolean>;
}

export interface AdminAction {
  type: string;
  message: string;
  author: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  link?: string;
  created_at?: string;
}

export interface NotificationCreateRequest {
  user_id: string;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  link?: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  content_id: string;
  chapter_id?: string;
  course_id?: string;
  status: 'active' | 'completed' | 'exported';
  performance_score?: number;
  started_at?: string;
  completed_at?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agent_type?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface ChatMessageCreateRequest {
  role: 'user' | 'assistant' | 'system';
  content: string;
  agent_type?: string;
  metadata?: Record<string, unknown>;
}

export interface ChatSessionCreateRequest {
  user_id: string;
  content_id: string;
  chapter_id?: string;
  course_id?: string;
}

// ============================================
// AI SERVICE TYPES
// ============================================

export interface AIQuestionGenerationRequest {
  chapter_content: string;
  chapter_title?: string;
  learning_objective?: string;
  difficulty?: 'iniciante' | 'intermediario' | 'avancado';
  max_questions?: number;
}

export interface AISocraticDialogueRequest {
  student_message: string;
  chapter_content: string;
  initial_question: { text: string; skill?: string; intention?: string };
  conversation_history?: Array<{ role: string; content: string; timestamp?: string }>;
  interactions_remaining?: number;
  session_id?: string;
  chapter_id?: string;
}

export interface AIDetectionRequest {
  text: string;
  context?: Record<string, unknown>;
  interaction_metadata?: Record<string, unknown>;
}

export interface AIEditRequest {
  orientador_response: string;
  context?: Record<string, unknown>;
}

export interface AIValidateRequest {
  edited_response: string;
  context?: Record<string, unknown>;
}

export interface AIOrganizeSessionRequest {
  action: 'save_message' | 'finalize_session' | 'export_to_moodle' | 'get_session_status' | 'validate_export_payload';
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface TTSGenerateRequest {
  text: string;
  voice_id?: string;
  model_id?: string;
  content_id?: string;
}

export interface TTSSummaryRequest {
  content_id: string;
  style?: 'resumo' | 'explicacao' | 'podcast';
  voice_id?: string;
}

export interface TranscriptionRequest {
  content_id: string;
  audio_url?: string;
}

// ============================================
// UPLOAD TYPES
// ============================================

export interface UploadResponse {
  url: string;
  filename?: string;
  type?: string;
  size?: number;
  mime_type?: string;
}

// ============================================
// USER STATS & ACTIVITY TYPES
// ============================================

export interface UserStats {
  courses_completed?: number;
  chapters_completed?: number;
  total_time_minutes?: number;
  achievements_count?: number;
  certificates_count?: number;
}

export interface UserActivity {
  id: string;
  user_id: string;
  action: string;
  target_type?: string;
  target_id?: string;
  target_title?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface UserActivityCreateRequest {
  action: string;
  target_type?: string;
  target_id?: string;
  target_title?: string;
  metadata?: Record<string, unknown>;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  course_title?: string;
  issued_at?: string;
  certificate_url?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  unlocked: boolean;
  unlocked_at?: string;
}

export interface CourseProgress {
  course_id: string;
  total_contents: number;
  completed_contents: number;
  progress_percentage: number;
  last_accessed?: string;
}

// ============================================
// INTEGRATION TYPES
// ============================================

export interface IntegrationStatus {
  jacad: { connected: boolean; last_sync?: string };
  moodle: { connected: boolean; last_sync?: string };
}

export interface SyncLog {
  id: string;
  system: string;
  operation: string;
  status: 'success' | 'error' | 'pending';
  details?: string;
  created_at?: string;
}

export interface MoodleExportFilters {
  user_id?: string;
  discipline_id?: string;
  start_date?: string;
  end_date?: string;
  export_format?: 'portfolio' | 'xapi';
}

// ============================================
// SEARCH TYPES
// ============================================

export interface SearchResults {
  courses?: Course[];
  disciplines?: Discipline[];
  chapters?: Chapter[];
  contents?: Content[];
  users?: UserData[];
}

export interface LogSearchParams {
  query?: string;
  log_type?: string;
  limit?: number;
  offset?: number;
}
