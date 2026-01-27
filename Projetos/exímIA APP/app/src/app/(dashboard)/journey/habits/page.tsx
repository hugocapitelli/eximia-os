/**
 * ExímIA APP - Habits Page
 * BLOCO 3.2 - Journey Habits
 *
 * Main page for managing habits with CRUD operations and tracking
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { DashboardShell } from "@/components/templates";
import { Header } from "@/components/organisms";
import {
  HabitList,
  HabitFormModal,
  HabitTracker,
  StreakBadge,
} from "@/components/journey";
import { useHabits } from "@/hooks/use-habits";
import { MetricCard } from "@/components/molecules";
import {
  Button,
  Text,
  Plus,
  Target,
  TrendingUp,
  Calendar,
  Flame,
  CheckCircle,
} from "@/components/ui";
import type {
  HabitWithStatus,
  CreateHabitInput,
  UpdateHabitInput,
} from "@/types/journey";

// ═══════════════════════════════════════════════════════════════════
// HABITS PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function HabitsPage() {
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<HabitWithStatus | null>(null);
  const [showTracker, setShowTracker] = useState(false);
  const [trackerHabit, setTrackerHabit] = useState<HabitWithStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Habits hook
  const {
    habits,
    isLoading,
    error,
    totalCount,
    stats,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit,
    getCalendarMonth,
    refetch,
  } = useHabits({ autoFetch: true });

  // ═══════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════

  // Open create modal
  const handleOpenCreate = useCallback(() => {
    setSelectedHabit(null);
    setIsFormModalOpen(true);
  }, []);

  // Open edit modal
  const handleOpenEdit = useCallback((habit: HabitWithStatus) => {
    setSelectedHabit(habit);
    setIsFormModalOpen(true);
  }, []);

  // Close form modal
  const handleCloseForm = useCallback(() => {
    setIsFormModalOpen(false);
    setSelectedHabit(null);
  }, []);

  // Handle form submit
  const handleFormSubmit = useCallback(
    async (data: CreateHabitInput | UpdateHabitInput): Promise<boolean> => {
      setIsSubmitting(true);

      let success = false;
      if (selectedHabit) {
        // Update existing habit
        success = await updateHabit(selectedHabit.id, data as UpdateHabitInput);
      } else {
        // Create new habit
        const result = await createHabit(data as CreateHabitInput);
        success = !!result;
      }

      setIsSubmitting(false);

      if (success) {
        handleCloseForm();
      }

      return success;
    },
    [selectedHabit, createHabit, updateHabit, handleCloseForm]
  );

  // Handle complete habit
  const handleComplete = useCallback(
    async (id: string) => {
      await completeHabit(id);
    },
    [completeHabit]
  );

  // Handle uncomplete habit
  const handleUncomplete = useCallback(
    async (id: string) => {
      await uncompleteHabit(id);
    },
    [uncompleteHabit]
  );

  // Handle delete habit
  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this habit?")) return;
      await deleteHabit(id);
    },
    [deleteHabit]
  );

  // Handle pause habit
  const handlePause = useCallback(
    async (id: string) => {
      await updateHabit(id, { status: "paused" });
    },
    [updateHabit]
  );

  // Handle resume habit
  const handleResume = useCallback(
    async (id: string) => {
      await updateHabit(id, { status: "active" });
    },
    [updateHabit]
  );

  // Handle view tracker
  const handleViewTracker = useCallback((habit: HabitWithStatus) => {
    setTrackerHabit(habit);
    setShowTracker(true);
  }, []);

  // Handle close tracker
  const handleCloseTracker = useCallback(() => {
    setShowTracker(false);
    setTrackerHabit(null);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Journey", href: "/journey" },
    { label: "Habits" },
  ];

  // Calculate daily progress
  const dailyProgress = stats.habits_due_today > 0
    ? Math.round((stats.habits_completed_today / stats.habits_due_today) * 100)
    : 100;

  return (
    <DashboardShell>
      <Header
        breadcrumbs={breadcrumbs}
        title="Habits"
        subtitle="Build consistency, track your streaks"
        actions={
          <Button onClick={handleOpenCreate}>
            <Plus className="size-4 mr-2" />
            New Habit
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Today's Progress"
            value={`${dailyProgress}%`}
            subtitle={`${stats.habits_completed_today} of ${stats.habits_due_today} done`}
            icon={<CheckCircle className="size-5" />}
            trend={dailyProgress >= 100 ? "up" : undefined}
          />
          <MetricCard
            title="Active Habits"
            value={stats.active_habits}
            subtitle={`${stats.total_habits} total`}
            icon={<Target className="size-5" />}
          />
          <MetricCard
            title="Best Streak"
            value={`${stats.longest_streak} days`}
            icon={<Flame className="size-5" />}
            trend={stats.longest_streak >= 7 ? "up" : undefined}
          />
          <MetricCard
            title="Completion Rate"
            value={`${stats.overall_completion_rate}%`}
            subtitle="Last 30 days"
            icon={<TrendingUp className="size-5" />}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <Text className="text-red-400">{error}</Text>
          </div>
        )}

        {/* Main Content - Split View on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Habits List - 2 columns */}
          <div className="lg:col-span-2">
            <HabitList
              habits={habits}
              isLoading={isLoading}
              onComplete={handleComplete}
              onUncomplete={handleUncomplete}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onPause={handlePause}
              onResume={handleResume}
              onRefresh={handleRefresh}
              showFilters
              showSearch
              emptyTitle="No habits yet"
              emptyDescription="Create your first habit to start building consistency"
            />
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Quick Stats Card */}
            <div className="bg-surface-800 border border-surface-600 rounded-xl p-4">
              <Text className="font-semibold mb-4">Streaks Overview</Text>

              {habits.filter(h => h.status === "active" && h.current_streak > 0).length > 0 ? (
                <div className="space-y-3">
                  {habits
                    .filter(h => h.status === "active" && h.current_streak > 0)
                    .sort((a, b) => b.current_streak - a.current_streak)
                    .slice(0, 5)
                    .map(habit => (
                      <div
                        key={habit.id}
                        className="flex items-center justify-between py-2 border-b border-surface-700 last:border-0"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span>{habit.icon}</span>
                          <Text size="sm" className="truncate">
                            {habit.title}
                          </Text>
                        </div>
                        <StreakBadge streak={habit.current_streak} size="sm" />
                      </div>
                    ))
                  }
                </div>
              ) : (
                <Text muted size="sm" className="text-center py-4">
                  Complete habits to build streaks
                </Text>
              )}
            </div>

            {/* Calendar Preview */}
            {trackerHabit && (
              <HabitTracker
                habit={trackerHabit}
                getCalendarMonth={getCalendarMonth}
                onDateClick={(date, hasCompletion) => {
                  // Could implement date-specific completion toggle here
                  logger.info("Date clicked:", date, hasCompletion);
                }}
              />
            )}

            {/* Show calendar for first active habit if none selected */}
            {!trackerHabit && habits.filter(h => h.status === "active").length > 0 && (
              <HabitTracker
                habit={habits.filter(h => h.status === "active")[0]}
                getCalendarMonth={getCalendarMonth}
              />
            )}
          </div>
        </div>

        {/* Stats Footer */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-surface-600">
            <Text size="sm" muted>
              {totalCount} total habit{totalCount !== 1 ? "s" : ""}
            </Text>
            <Text size="sm" muted>
              {stats.habits_completed_today} completed today
            </Text>
          </div>
        )}
      </div>

      {/* Create/Edit Habit Modal */}
      <HabitFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseForm}
        habit={selectedHabit}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />
    </DashboardShell>
  );
}
