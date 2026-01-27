/**
 * ExímIA APP - Journey Components
 * BLOCO 3.1 - Journey Goals
 * BLOCO 3.2 - Journey Habits
 */

// ==========================================================================
// GOALS (BLOCO 3.1)
// ==========================================================================

// Goal Card & Related
export { GoalCard, ProgressBar, StatusBadge, PriorityBadge, ScopeBadge, CategoryBadge } from "./goal-card";
export type { GoalCardProps, ProgressBarProps } from "./goal-card";

// Key Result Item
export { KeyResultItem, KeyResultsList } from "./key-result-item";
export type { KeyResultItemProps, KeyResultsListProps } from "./key-result-item";

// Goal Form
export { GoalForm, KeyResultForm } from "./goal-form";
export type { GoalFormProps, KeyResultFormProps } from "./goal-form";

// Goal List
export { GoalList } from "./goal-list";
export type { GoalListProps, FiltersBarProps, ScopeGroupProps } from "./goal-list";

// ==========================================================================
// HABITS (BLOCO 3.2)
// ==========================================================================

// Habit Card
export { HabitCard } from "./habit-card";
export type { HabitCardProps } from "./habit-card";

// Habit Form
export { HabitForm, HabitFormModal } from "./habit-form";
export type { HabitFormProps, HabitFormModalProps } from "./habit-form";

// Habit List
export { HabitList, CompactHabitList } from "./habit-list";
export type { HabitListProps, CompactHabitListProps } from "./habit-list";

// Habit Tracker (Calendar views)
export { HabitTracker, MiniHabitCalendar, HabitHeatmap } from "./habit-tracker";
export type { HabitTrackerProps, MiniHabitCalendarProps, HabitHeatmapProps } from "./habit-tracker";

// Streak Badge
export { StreakBadge, StreakIndicator, BadgeCollection } from "./streak-badge";
export type { StreakBadgeProps, StreakIndicatorProps, BadgeCollectionProps } from "./streak-badge";
