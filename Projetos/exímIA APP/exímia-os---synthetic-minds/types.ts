
import { LucideIcon } from 'lucide-react';

export type CloneStatus = 'active' | 'wip' | 'inactive';
export type CloneTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

export interface CloneTrait {
  title: string;
  type: 'Critical' | 'Absolute' | 'Filter' | 'Non-Linear';
  description: string;
}

export interface CloneSlider {
  label: string;
  value: number; // 0-100
  leftLabel: string;
  rightLabel: string;
}

export interface Clone {
  id: string;
  name: string;
  avatarUrl: string; // URL or initials
  domain: string;
  description: string;
  tags: string[];
  status: CloneStatus;
  tier: CloneTier;
  rating: number;
  // Extended Profile Data
  role?: string;
  coverImage?: string;
  stats?: {
    apexScore: number;
    neuralData: number;
    topSkill: { name: string; level: number };
  };
  dna?: {
    sliders: CloneSlider[];
    powerWords: string[];
    archetype: { name: string; description: string; quote: string };
    operationalMode: { title: string; description: string };
    traits: CloneTrait[];
  };
}

export interface NavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  path: string;           // Route path for navigation
  isActive?: boolean;
  hasSubmenu?: boolean;
  subItems?: NavItem[];
}

export interface FilterCategory {
  id: string;
  label: string;
  active: boolean;
}

// --- Inbox Types ---

export interface InboxItem {
  id: string;
  type: 'text' | 'voice' | 'link' | 'image';
  content: string; // The text content or URL
  previewUrl?: string; // For images or link thumbnails
  audioDuration?: string; // For voice notes
  timestamp: string;
  status: 'pending' | 'processed' | 'archived';
  aiSuggestion?: {
    targetModule: string; // e.g. "Journey", "Academy"
    targetType: string;   // e.g. "Book", "Goal", "Task"
    confidence: number;   // 0-100
    reason: string;
  };
}

// --- Design System Types ---

export interface DSTypography {
  role: string;
  font: string;
  weight: string;
  size: string;
  lineHeight?: string;
  sample: string;
}

export interface DSColor {
  name: string;
  hex: string;
  usage: string;
  variable?: string;
}

export interface DSComponent {
  id: string;
  name: string;
  type: 'Atom' | 'Molecule' | 'Organism' | 'Template' | 'Page';
  status: 'Stable' | 'WIP' | 'Deprecated';
  description: string;
  codeSnippet?: string; // Code example
  props?: { name: string; type: string; desc: string }[];
}

export interface DSPrinciple {
  name: string;
  description: string;
}

export interface DSTokenDefinition {
  name: string;
  value: string;
  variable: string;
}

export interface DSIdentity {
  mission: string;
  vision: string;
  positioning?: string;
  founder?: string;
  since?: string;
  corpus?: string;
  archetypes: {
    name: string;
    description: string;
    motivation?: string;
    manifestation?: string;
  }[];
}

export interface DesignSystem {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category?: string;
  tags?: string[];
  use_cases?: string[];
  tech_stack?: string[];
  philosophy: string;
  principles?: DSPrinciple[];
  identity: DSIdentity;
  tokens: {
    colors: {
      primary: DSColor;
      scale: DSColor[]; // Monochromatic/Base scale
      semantic?: DSColor[]; // Success, Warning, etc.
      eximiaScale?: DSColor[]; // Specific scale like eximia-50 to 900
    };
    typography: DSTypography[];
    spacing: DSTokenDefinition[];
    radius?: DSTokenDefinition[];
    shadows?: DSTokenDefinition[];
    animations?: {
      name: string;
      duration: string;
      easing: string;
      usage: string;
    }[];
  };
  components: DSComponent[];
}

// --- Course Designer Types ---

export interface ElcStage {
  stageName: 'IMMERSE' | 'REFLECT' | 'CONCEPTUALIZE' | 'EXPERIMENT' | 'CALIBRATE' | 'INTEGRATE';
  percentage: number;
  durationMin: number;
  activities: string[];
  deliverable?: string;
}

export interface ProblemMotor {
  title: string;
  scenario: string;
  tension: string;
  deliverable: string;
}

export interface CourseModule {
  moduleNumber: number;
  title: string;
  durationHours: number;
  problemMotor: ProblemMotor;
  objectives: string[];
  elcStructure: ElcStage[];
}

export interface QualityScore {
  overall: number;
  rating: 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'NEEDS_IMPROVEMENT';
  dimensions: {
    alignment: number;
    bloomProgression: number;
    elcCompleteness: number;
    durationOptimization: number;
    cognitiveLoad: number;
  };
}

export interface CourseBlueprint {
  metadata: {
    title: string;
    targetAudience: string;
    totalDuration: string;
    frameworkMix: string[];
  };
  qualityScore: QualityScore;
  modules: CourseModule[];
}

// --- Content Creation Types ---

export type ContentStatus = 'draft' | 'in_review' | 'scheduled' | 'published' | 'archived';
export type ContentType = 'course' | 'ebook' | 'post' | 'newsletter' | 'video' | 'copy';
export type SourceType = 'youtube' | 'pdf' | 'url' | 'audio' | 'text';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  status: ContentStatus;
  platform?: string; // For social posts
  updatedAt: string;
  progress?: number; // For courses/ebooks
}

export interface SourceItem {
  id: string;
  type: SourceType;
  title: string;
  metadata: string; // e.g. "45 min", "120 pages"
  tags: string[];
  insightsCount: number;
  dateImported: string;
}

// --- Journey Types ---

export interface Goal {
  id: string;
  title: string;
  scope: 'Life' | 'Yearly' | 'Quarterly' | 'Monthly';
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  progress: number; // 0-100
  deadline?: string;
  category: 'Business' | 'Health' | 'Personal' | 'Finance';
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  frequency: 'daily' | 'weekly';
  time?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  coverUrl?: string;
  status: 'reading' | 'to_read' | 'completed' | 'draft' | 'published';
  progress: number;
  totalPage?: number;
  currentPage?: number;
  category?: string;
  isDraft?: boolean;
  description?: string;
  chapters?: { id: string; title: string }[];
  readingTime?: string;
  rating?: number;
  totalReaders?: number;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatarUrl?: string;
  bookCount: number;
  mindId?: string;
}

// --- Academy Types ---

export interface AcademyCourse {
  id: string;
  title: string;
  description: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  lessonsCount: number;
  category: string;
  progress: number;
  isEnrolled: boolean;
  isFavorite?: boolean;
  isFeatured?: boolean;
  coverColor: string; // Tailwind color class for placeholder
  thumbnail?: string;
  instructor?: string;
  skills: string[];
  tags?: string[];
}

export interface AcademyLesson {
  id: string;
  courseId: string;
  title: string;
  order: number;
  content: string;
  durationMinutes: number;
  status: 'locked' | 'unlocked' | 'completed';
}

export interface AcademyTrack {
    id: string;
    title: string;
    description: string;
    courseCount: number;
    completedCount: number;
    icon: LucideIcon;
    color: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  type: 'clarification' | 'challenge' | 'synthesis' | 'feedback' | 'standard';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  status: 'locked' | 'unlocked';
  unlockedAt?: string;
  progress?: number;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
}

// --- Brand Types ---

export interface BrandAsset {
  id: string;
  name: string;
  type: 'logo' | 'image' | 'video' | 'document' | 'font';
  category: string;
  url: string;
  thumbnailUrl?: string;
  status: 'approved' | 'review' | 'draft';
  size: string;
  updatedAt: string;
}

export interface BrandPalette {
  name: string;
  colors: { name: string; hex: string; usage: string }[];
}

export interface BrandTone {
  attribute: string;
  value: number; // 0-100 (e.g., 0=Formal, 100=Casual)
  leftLabel: string;
  rightLabel: string;
}

export interface BrandIdentityData {
  name: string;
  tagline: string;
  mission: string;
  vision: string;
  values: string[];
  archetypes: { name: string; percentage: number; description: string }[];
  tones: BrandTone[];
  palettes: BrandPalette[];
  assets: BrandAsset[];
}

// --- Team Types ---

export interface MemberSkill {
  name: string;
  level: 1 | 2 | 3; // 1: Básico, 2: Proficiente, 3: Expert
  category: 'Hard' | 'Soft';
  validatedBy?: string;
}

export interface MemberGoal {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  period: string;
  keyResults: { text: string; status: 'pending' | 'completed' }[];
}

export interface MemberFeedback {
  id: string;
  date: string;
  type: 'Review' | 'Praise' | 'Improvement';
  author: string;
  content: string;
  rating?: number;
}

export interface MemberTimelineEvent {
  id: string;
  date: string;
  type: 'achievement' | 'promotion' | 'hiring' | 'review';
  title: string;
  description?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Product' | 'Engineering' | 'Marketing' | 'Operations' | 'Executive';
  status: 'Online' | 'In Meeting' | 'Focus' | 'Offline';
  avatarInitials: string;
  performance: number; // 0-100
  cultureFit: number; // 0-100
  projects: number;
  accountType: 'Admin' | 'Member' | 'Viewer';
  permissions: string[]; // List of Module IDs allowed
  
  // Extended Profile Data
  email?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  startDate?: string;
  reportsTo?: string; // ID of the manager
  skills?: MemberSkill[];
  goals?: MemberGoal[];
  feedbacks?: MemberFeedback[];
  timeline?: MemberTimelineEvent[];
}

export interface Department {
  id: string;
  name: string;
  headcount: number;
  budgetUtilization: number;
  lead: string;
}

export interface UserDirective {
  id: string;
  userId: string;
  type: 'feedback' | 'task' | 'note' | 'alignment';
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  createdBy: string;
  status: 'active' | 'completed';
}

// --- Hiring Types ---

export interface PipelineStage {
  id: string;
  name: string;
  count?: number;
}

export interface HiringJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string; // Remote, Hybrid
  openDays: number;
  manager: string; // Name or ID
  status: 'active' | 'closed' | 'draft';
  stages: PipelineStage[];
}

export interface HiringCandidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  avatarInitials: string;
  stage: string; // matches PipelineStage.id
  matchScore: number; // 0-100
  experience: string;
  appliedDate: string;
  lastActivity: string;
  tags: string[];
  notes?: { author: string; date: string; content: string }[];
}

// --- Onboarding Types ---

export interface OnboardingTask {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  type: 'doc' | 'task' | 'meeting' | 'system' | 'course';
  link?: string;
  deadline_day?: number;
  required?: boolean;
}

export interface OnboardingPhase {
  id: string;
  title: string; // e.g. "Semana 1", "Mês 1"
  description: string;
  tasks: OnboardingTask[];
  isLocked: boolean;
}

export interface OnboardingTrack {
  id: string;
  title: string; // e.g. "Product Management Track"
  role: string;
  duration: string;
  phases: OnboardingPhase[];
}

export interface OnboardingProcess {
  id: string;
  memberId: string;
  memberName: string;
  memberRole: string;
  memberAvatar: string;
  startDate: string;
  buddy: string;
  manager: string;
  trackId: string;
  progress: number; // 0-100
  currentPhaseIndex: number;
  status: 'on_track' | 'attention' | 'completed';
  phases: OnboardingPhase[]; // Clone of track phases with current state
}

// --- Performance Types ---

export type ReviewCycle = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Annual';
export type GoalStatus = 'draft' | 'active' | 'completed' | 'cancelled' | 'attention';
export type FeedbackType = 'praise' | 'constructive' | 'goal_related';
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface KeyResult {
  id: string;
  title: string;
  type: 'percentage' | 'number' | 'milestone' | 'boolean';
  target: number;
  current: number;
  progress: number;
}

export interface PerformanceGoal {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  title: string;
  description: string;
  cycle: string;
  status: GoalStatus;
  keyResults: KeyResult[];
  progress: number;
  deadline: string;
  linkedCompanyGoal?: string;
}

export interface PerformanceFeedback {
  id: string;
  fromId: string;
  fromName: string;
  fromAvatar: string;
  toId: string;
  toName: string;
  toAvatar: string;
  type: FeedbackType;
  content: string;
  competency: string;
  date: string;
  visibility: 'private' | 'public' | 'manager';
}

export interface PerformanceReviewCycle {
  id: string;
  name: string;
  status: 'active' | 'calibration' | 'completed' | 'draft';
  deadline: string;
  completionRate: number;
}

// --- Rituals Types ---

export type RitualType = 'daily' | '1on1' | 'weekly' | 'sprint' | 'all_hands' | 'custom';

export interface AgendaItem {
  id: string;
  title: string;
  duration: number; // minutes
  description?: string;
  completed?: boolean;
}

export interface RitualTemplate {
  id: string;
  name: string;
  type: RitualType;
  description: string;
  defaultDuration: number;
  suggestedFrequency: string;
  participants: string; // e.g. "Team", "Leader + 1"
  agenda: AgendaItem[];
  color: string;
  icon: LucideIcon;
}

export interface Ritual {
  id: string;
  title: string;
  type: RitualType;
  date: string;
  time: string;
  duration: number;
  participants: string[]; // List of names or IDs
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  templateId?: string;
}

export interface RitualActionItem {
  id: string;
  text: string;
  assignee: string;
  status: 'pending' | 'done';
  dueDate?: string;
  originRitualId: string;
}
