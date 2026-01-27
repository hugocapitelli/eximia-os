/**
 * ExímIA APP - Journey Types
 * BLOCO 3.1 - Journey Goals
 * BLOCO 3.2 - Journey Habits
 */

// ═══════════════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════════════

export type GoalStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'paused'
  | 'cancelled';

export type GoalCategory =
  | 'business'
  | 'personal'
  | 'health'
  | 'finance'
  | 'education';

export type GoalPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type GoalScope =
  | 'life'
  | 'yearly'
  | 'quarterly'
  | 'monthly'
  | 'weekly';

export type KeyResultStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'at_risk';

export type MetricType =
  | 'percentage'
  | 'number'
  | 'currency'
  | 'boolean';

// ═══════════════════════════════════════════════════════════════════
// GOAL
// ═══════════════════════════════════════════════════════════════════

export interface Goal {
  id: string;
  user_id: string;

  // Core
  title: string;
  description?: string;
  why?: string;

  // Hierarchy
  scope: GoalScope;
  parent_id?: string;

  // Categorization
  category: GoalCategory;
  priority: GoalPriority;
  tags: string[];

  // Status & Progress
  status: GoalStatus;
  progress: number; // 0-100

  // Dates
  start_date?: string;
  target_date?: string;
  completed_at?: string;

  // Visual
  color?: string;
  icon?: string;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Computed (from queries)
  key_results_count?: number;
  children_count?: number;
  key_results?: KeyResult[];
  parent?: Goal;
  children?: Goal[];
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  why?: string;
  scope: GoalScope;
  parent_id?: string;
  category?: GoalCategory;
  priority?: GoalPriority;
  tags?: string[];
  start_date?: string;
  target_date?: string;
  color?: string;
  icon?: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  why?: string;
  scope?: GoalScope;
  parent_id?: string | null;
  category?: GoalCategory;
  priority?: GoalPriority;
  tags?: string[];
  status?: GoalStatus;
  progress?: number;
  start_date?: string | null;
  target_date?: string | null;
  completed_at?: string | null;
  color?: string | null;
  icon?: string | null;
}

// ═══════════════════════════════════════════════════════════════════
// KEY RESULT
// ═══════════════════════════════════════════════════════════════════

export interface KeyResult {
  id: string;
  goal_id: string;
  user_id: string;

  // Core
  title: string;
  description?: string;

  // Metrics
  metric_type: MetricType;
  target_value: number;
  current_value: number;
  unit?: string;

  // Status & Progress
  status: KeyResultStatus;
  progress: number; // 0-100

  // Order
  position: number;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface CreateKeyResultInput {
  goal_id: string;
  title: string;
  description?: string;
  metric_type?: MetricType;
  target_value?: number;
  current_value?: number;
  unit?: string;
  position?: number;
}

export interface UpdateKeyResultInput {
  title?: string;
  description?: string;
  metric_type?: MetricType;
  target_value?: number;
  current_value?: number;
  unit?: string;
  status?: KeyResultStatus;
  position?: number;
}

// ═══════════════════════════════════════════════════════════════════
// FILTERS
// ═══════════════════════════════════════════════════════════════════

export interface GoalFilters {
  scope?: GoalScope;
  status?: GoalStatus;
  category?: GoalCategory;
  priority?: GoalPriority;
  parent_id?: string | null;
  search?: string;
}

// ═══════════════════════════════════════════════════════════════════
// DISPLAY HELPERS
// ═══════════════════════════════════════════════════════════════════

export const GOAL_STATUS_CONFIG: Record<GoalStatus, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  not_started: {
    label: 'Not Started',
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/20',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/20',
  },
  completed: {
    label: 'Completed',
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
  },
  paused: {
    label: 'Paused',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-400',
    bgColor: 'bg-red-400/20',
  },
};

export const GOAL_CATEGORY_CONFIG: Record<GoalCategory, {
  label: string;
  icon: string;
  color: string;
}> = {
  business: {
    label: 'Business',
    icon: 'Briefcase',
    color: 'text-purple-400',
  },
  personal: {
    label: 'Personal',
    icon: 'User',
    color: 'text-blue-400',
  },
  health: {
    label: 'Health',
    icon: 'Heart',
    color: 'text-red-400',
  },
  finance: {
    label: 'Finance',
    icon: 'DollarSign',
    color: 'text-green-400',
  },
  education: {
    label: 'Education',
    icon: 'BookOpen',
    color: 'text-orange-400',
  },
};

export const GOAL_PRIORITY_CONFIG: Record<GoalPriority, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  low: {
    label: 'Low',
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/20',
  },
  medium: {
    label: 'Medium',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/20',
  },
  high: {
    label: 'High',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/20',
  },
  critical: {
    label: 'Critical',
    color: 'text-red-400',
    bgColor: 'bg-red-400/20',
  },
};

export const GOAL_SCOPE_CONFIG: Record<GoalScope, {
  label: string;
  description: string;
  icon: string;
  order: number;
}> = {
  life: {
    label: 'Life Vision',
    description: 'Long-term vision and purpose',
    icon: 'Star',
    order: 1,
  },
  yearly: {
    label: 'Yearly Goal',
    description: 'What to achieve this year',
    icon: 'Calendar',
    order: 2,
  },
  quarterly: {
    label: 'Quarterly Goal',
    description: 'This quarter\'s focus',
    icon: 'Target',
    order: 3,
  },
  monthly: {
    label: 'Monthly Goal',
    description: 'Monthly objectives',
    icon: 'CalendarDays',
    order: 4,
  },
  weekly: {
    label: 'Weekly Goal',
    description: 'This week\'s tasks',
    icon: 'ListTodo',
    order: 5,
  },
};

export const KEY_RESULT_STATUS_CONFIG: Record<KeyResultStatus, {
  label: string;
  color: string;
}> = {
  not_started: {
    label: 'Not Started',
    color: 'text-gray-400',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-blue-400',
  },
  completed: {
    label: 'Completed',
    color: 'text-green-400',
  },
  at_risk: {
    label: 'At Risk',
    color: 'text-red-400',
  },
};

// ═══════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

export function getProgressColor(progress: number): string {
  if (progress >= 100) return 'text-green-400';
  if (progress >= 75) return 'text-blue-400';
  if (progress >= 50) return 'text-yellow-400';
  if (progress >= 25) return 'text-orange-400';
  return 'text-gray-400';
}

export function getProgressBgColor(progress: number): string {
  if (progress >= 100) return 'bg-green-400';
  if (progress >= 75) return 'bg-blue-400';
  if (progress >= 50) return 'bg-yellow-400';
  if (progress >= 25) return 'bg-orange-400';
  return 'bg-gray-400';
}

export function formatProgress(progress: number): string {
  return `${Math.round(progress)}%`;
}

export function canHaveChildren(scope: GoalScope): boolean {
  return scope !== 'weekly';
}

export function getChildScope(scope: GoalScope): GoalScope | null {
  const hierarchy: Record<GoalScope, GoalScope | null> = {
    life: 'yearly',
    yearly: 'quarterly',
    quarterly: 'monthly',
    monthly: 'weekly',
    weekly: null,
  };
  return hierarchy[scope];
}

export function getParentScope(scope: GoalScope): GoalScope | null {
  const hierarchy: Record<GoalScope, GoalScope | null> = {
    life: null,
    yearly: 'life',
    quarterly: 'yearly',
    monthly: 'quarterly',
    weekly: 'monthly',
  };
  return hierarchy[scope];
}

// ═══════════════════════════════════════════════════════════════════
// HABIT ENUMS (BLOCO 3.2)
// ═══════════════════════════════════════════════════════════════════

export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export type HabitStatus = 'active' | 'paused' | 'archived' | 'completed';

// Day of week (0 = Sunday, 1 = Monday, etc.)
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// ═══════════════════════════════════════════════════════════════════
// HABIT BADGE
// ═══════════════════════════════════════════════════════════════════

export interface HabitBadge {
  milestone: number;
  name: string;
  earned_at: string;
}

// ═══════════════════════════════════════════════════════════════════
// HABIT
// ═══════════════════════════════════════════════════════════════════

export interface Habit {
  id: string;
  user_id: string;

  // Basic info
  title: string;
  description?: string;
  icon: string;
  color: string;

  // Frequency configuration
  frequency: HabitFrequency;
  target_days: DayOfWeek[]; // For weekly habits
  target_count: number; // Times per period

  // Streak tracking
  current_streak: number;
  best_streak: number;
  total_completions: number;

  // Status
  status: HabitStatus;

  // Goal linking
  linked_goal_id?: string;

  // Gamification
  badges: HabitBadge[];

  // Timestamps
  created_at: string;
  updated_at: string;
  last_completed_at?: string;
  archived_at?: string;
}

export interface CreateHabitInput {
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  frequency?: HabitFrequency;
  target_days?: DayOfWeek[];
  target_count?: number;
  linked_goal_id?: string;
}

export interface UpdateHabitInput {
  title?: string;
  description?: string;
  icon?: string;
  color?: string;
  frequency?: HabitFrequency;
  target_days?: DayOfWeek[];
  target_count?: number;
  status?: HabitStatus;
  linked_goal_id?: string;
}

// ═══════════════════════════════════════════════════════════════════
// HABIT COMPLETION
// ═══════════════════════════════════════════════════════════════════

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string; // DATE format: YYYY-MM-DD
  notes?: string;
  created_at: string;
}

export interface CreateCompletionInput {
  notes?: string;
}

// ═══════════════════════════════════════════════════════════════════
// HABIT WITH COMPLETION STATUS (for today)
// ═══════════════════════════════════════════════════════════════════

export interface HabitWithStatus extends Habit {
  completed_today: boolean;
  is_due_today: boolean;
  completion_rate: number;
}

// ═══════════════════════════════════════════════════════════════════
// HABIT STATS
// ═══════════════════════════════════════════════════════════════════

export interface HabitStats {
  total_habits: number;
  active_habits: number;
  habits_due_today: number;
  habits_completed_today: number;
  overall_completion_rate: number;
  longest_streak: number;
  total_completions_today: number;
}

// ═══════════════════════════════════════════════════════════════════
// HABIT FILTERS
// ═══════════════════════════════════════════════════════════════════

export interface HabitFilters {
  status?: HabitStatus;
  frequency?: HabitFrequency;
  linked_goal_id?: string;
  search?: string;
}

// ═══════════════════════════════════════════════════════════════════
// CALENDAR VIEW DATA
// ═══════════════════════════════════════════════════════════════════

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  completions: HabitCompletion[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

export interface CalendarMonth {
  year: number;
  month: number; // 0-11
  days: CalendarDay[];
}

// ═══════════════════════════════════════════════════════════════════
// HABIT API RESPONSES
// ═══════════════════════════════════════════════════════════════════

export interface HabitsResponse {
  data: Habit[];
  count: number;
}

export interface HabitWithStatusResponse {
  data: HabitWithStatus[];
  count: number;
}

export interface CompletionsResponse {
  data: HabitCompletion[];
  count: number;
}

// ═══════════════════════════════════════════════════════════════════
// HABIT CONSTANTS
// ═══════════════════════════════════════════════════════════════════

export const FREQUENCY_LABELS: Record<HabitFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export const HABIT_STATUS_LABELS: Record<HabitStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  archived: 'Archived',
  completed: 'Completed',
};

export const HABIT_STATUS_CONFIG: Record<HabitStatus, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  active: {
    label: 'Active',
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
  },
  paused: {
    label: 'Paused',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
  },
  archived: {
    label: 'Archived',
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/20',
  },
  completed: {
    label: 'Completed',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/20',
  },
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

export const DAY_LABELS_FULL: Record<DayOfWeek, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

export const BADGE_INFO: Record<number, { name: string; icon: string; description: string }> = {
  7: {
    name: 'First Week',
    icon: '🔥',
    description: '7 days streak achieved',
  },
  30: {
    name: 'One Month Strong',
    icon: '💪',
    description: '30 days streak achieved',
  },
  100: {
    name: 'Century Club',
    icon: '🏆',
    description: '100 days streak achieved',
  },
};

export const DEFAULT_HABIT_ICONS = [
  '🎯', '💪', '📚', '🏃', '🧘', '💧', '😴', '🥗',
  '✍️', '🎨', '🎵', '💻', '🌱', '🧠', '❤️', '⭐',
];

export const DEFAULT_HABIT_COLORS = [
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
];

// ═══════════════════════════════════════════════════════════════════
// HABIT UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

export function isHabitDueToday(
  frequency: HabitFrequency,
  targetDays: DayOfWeek[]
): boolean {
  const today = new Date().getDay() as DayOfWeek;

  switch (frequency) {
    case 'daily':
      return true;
    case 'weekly':
      if (!targetDays || targetDays.length === 0) return true;
      return targetDays.includes(today);
    case 'monthly':
      return true; // Can be refined later
    default:
      return false;
  }
}

export function getStreakColor(streak: number): string {
  if (streak >= 100) return 'text-yellow-400';
  if (streak >= 30) return 'text-purple-400';
  if (streak >= 7) return 'text-orange-400';
  if (streak > 0) return 'text-green-400';
  return 'text-gray-400';
}

export function getStreakBgColor(streak: number): string {
  if (streak >= 100) return 'bg-yellow-400/20';
  if (streak >= 30) return 'bg-purple-400/20';
  if (streak >= 7) return 'bg-orange-400/20';
  if (streak > 0) return 'bg-green-400/20';
  return 'bg-gray-400/20';
}

export function formatStreak(streak: number): string {
  if (streak === 0) return 'No streak';
  if (streak === 1) return '1 day';
  return `${streak} days`;
}

export function getCompletionRateColor(rate: number): string {
  if (rate >= 90) return 'text-green-400';
  if (rate >= 70) return 'text-blue-400';
  if (rate >= 50) return 'text-yellow-400';
  if (rate >= 25) return 'text-orange-400';
  return 'text-red-400';
}
