/**
 * ExímIA APP - useHabits Hook
 * BLOCO 3.2 - Journey Habits
 *
 * Hook for managing habits and completions
 */

"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";
import type {
  Habit,
  HabitWithStatus,
  HabitCompletion,
  CreateHabitInput,
  UpdateHabitInput,
  HabitFilters,
  HabitStats,
  CalendarDay,
  CalendarMonth,
  DayOfWeek,
} from "@/types/journey";
import { isHabitDueToday } from "@/types/journey";

interface UseHabitsOptions {
  autoFetch?: boolean;
  filters?: HabitFilters;
}

interface UseHabitsReturn {
  // Data
  habits: HabitWithStatus[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  stats: HabitStats;

  // CRUD Operations
  fetchHabits: (filters?: HabitFilters) => Promise<void>;
  createHabit: (input: CreateHabitInput) => Promise<Habit | null>;
  updateHabit: (id: string, input: UpdateHabitInput) => Promise<boolean>;
  deleteHabit: (id: string) => Promise<boolean>;

  // Completion Operations
  completeHabit: (id: string, notes?: string) => Promise<HabitCompletion | null>;
  uncompleteHabit: (id: string, date?: string) => Promise<boolean>;
  getTodayStatus: (habitId: string) => boolean;

  // History
  getCompletionHistory: (habitId: string, days?: number) => Promise<HabitCompletion[]>;
  getCalendarMonth: (habitId: string, year: number, month: number) => Promise<CalendarMonth>;

  // Refresh
  refetch: () => Promise<void>;
}

export function useHabits(options: UseHabitsOptions = {}): UseHabitsReturn {
  const { autoFetch = true, filters: initialFilters } = options;

  const [habits, setHabits] = useState<HabitWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [todayCompletions, setTodayCompletions] = useState<Set<string>>(new Set());

  const supabase = createClient();

  // Calculate stats from habits
  const stats = useMemo<HabitStats>(() => {
    const activeHabits = habits.filter((h) => h.status === "active");
    const dueToday = habits.filter((h) => h.is_due_today && h.status === "active");
    const completedToday = habits.filter((h) => h.completed_today && h.status === "active");
    const longestStreak = Math.max(0, ...habits.map((h) => h.best_streak));
    const totalRate = activeHabits.length > 0
      ? activeHabits.reduce((sum, h) => sum + h.completion_rate, 0) / activeHabits.length
      : 0;

    return {
      total_habits: habits.length,
      active_habits: activeHabits.length,
      habits_due_today: dueToday.length,
      habits_completed_today: completedToday.length,
      overall_completion_rate: Math.round(totalRate),
      longest_streak: longestStreak,
      total_completions_today: completedToday.length,
    };
  }, [habits]);

  // Fetch today's completions
  const fetchTodayCompletions = useCallback(async () => {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const { data, error: fetchError } = await supabase
        .from("habit_completions")
        .select("habit_id")
        .eq("completed_date", today);

      if (fetchError) throw fetchError;

      setTodayCompletions(new Set(data?.map((c) => c.habit_id) || []));
      return new Set(data?.map((c) => c.habit_id) || []);
    } catch (err) {
      logger.error("Error fetching today completions:", err);
      return new Set<string>();
    }
  }, [supabase]);

  // Fetch habits with status
  const fetchHabits = useCallback(
    async (filters?: HabitFilters) => {
      setIsLoading(true);
      setError(null);

      try {
        // First get today's completions
        const completions = await fetchTodayCompletions();

        // Build query
        let query = supabase
          .from("habits")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false });

        // Apply filters
        const activeFilters = filters || initialFilters;
        if (activeFilters?.status) {
          query = query.eq("status", activeFilters.status);
        }
        if (activeFilters?.frequency) {
          query = query.eq("frequency", activeFilters.frequency);
        }
        if (activeFilters?.linked_goal_id) {
          query = query.eq("linked_goal_id", activeFilters.linked_goal_id);
        }
        if (activeFilters?.search) {
          query = query.ilike("title", `%${activeFilters.search}%`);
        }

        const { data, error: fetchError, count } = await query;

        if (fetchError) throw fetchError;

        // Enrich habits with today status
        const habitsWithStatus: HabitWithStatus[] = (data || []).map((habit) => ({
          ...habit,
          badges: habit.badges || [],
          completed_today: completions.has(habit.id),
          is_due_today: isHabitDueToday(
            habit.frequency,
            (habit.target_days || []) as DayOfWeek[]
          ),
          completion_rate: 0, // Will be calculated below
        }));

        // Fetch completion rates for each habit (in parallel)
        const ratesPromises = habitsWithStatus.map(async (habit) => {
          const { data: rateData } = await supabase.rpc("get_habit_completion_rate", {
            p_habit_id: habit.id,
            p_days: 30,
          });
          return { id: habit.id, rate: rateData || 0 };
        });

        const rates = await Promise.all(ratesPromises);
        const ratesMap = new Map(rates.map((r) => [r.id, r.rate]));

        // Update habits with completion rates
        const finalHabits = habitsWithStatus.map((habit) => ({
          ...habit,
          completion_rate: ratesMap.get(habit.id) || 0,
        }));

        setHabits(finalHabits);
        setTotalCount(count || 0);
      } catch (err) {
        logger.error("Error fetching habits:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch habits");
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, initialFilters, fetchTodayCompletions]
  );

  // Create habit
  const createHabit = useCallback(
    async (input: CreateHabitInput): Promise<Habit | null> => {
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        const habitData = {
          user_id: user.id,
          title: input.title,
          description: input.description,
          icon: input.icon || "🎯",
          color: input.color || "#6366F1",
          frequency: input.frequency || "daily",
          target_days: input.target_days || [],
          target_count: input.target_count || 1,
          linked_goal_id: input.linked_goal_id,
          status: "active",
          current_streak: 0,
          best_streak: 0,
          total_completions: 0,
          badges: [],
        };

        const { data, error: insertError } = await supabase
          .from("habits")
          .insert(habitData)
          .select()
          .single();

        if (insertError) throw insertError;

        // Add to local state
        const newHabit: HabitWithStatus = {
          ...data,
          badges: data.badges || [],
          completed_today: false,
          is_due_today: isHabitDueToday(
            data.frequency,
            (data.target_days || []) as DayOfWeek[]
          ),
          completion_rate: 0,
        };

        setHabits((prev) => [newHabit, ...prev]);
        setTotalCount((prev) => prev + 1);

        return data as Habit;
      } catch (err) {
        logger.error("Error creating habit:", err);
        setError(err instanceof Error ? err.message : "Failed to create habit");
        return null;
      }
    },
    [supabase]
  );

  // Update habit
  const updateHabit = useCallback(
    async (id: string, input: UpdateHabitInput): Promise<boolean> => {
      setError(null);

      try {
        const { error: updateError } = await supabase
          .from("habits")
          .update(input)
          .eq("id", id);

        if (updateError) throw updateError;

        // Update local state
        setHabits((prev) =>
          prev.map((habit) => {
            if (habit.id === id) {
              const updated = { ...habit, ...input };
              return {
                ...updated,
                is_due_today: isHabitDueToday(
                  updated.frequency,
                  (updated.target_days || []) as DayOfWeek[]
                ),
              };
            }
            return habit;
          })
        );

        return true;
      } catch (err) {
        logger.error("Error updating habit:", err);
        setError(err instanceof Error ? err.message : "Failed to update habit");
        return false;
      }
    },
    [supabase]
  );

  // Delete habit
  const deleteHabit = useCallback(
    async (id: string): Promise<boolean> => {
      setError(null);

      try {
        const { error: deleteError } = await supabase
          .from("habits")
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;

        // Update local state
        setHabits((prev) => prev.filter((habit) => habit.id !== id));
        setTotalCount((prev) => prev - 1);

        return true;
      } catch (err) {
        logger.error("Error deleting habit:", err);
        setError(err instanceof Error ? err.message : "Failed to delete habit");
        return false;
      }
    },
    [supabase]
  );

  // Complete habit
  const completeHabit = useCallback(
    async (id: string, notes?: string): Promise<HabitCompletion | null> => {
      setError(null);

      try {
        // Use the database function
        const { data, error: completeError } = await supabase.rpc("complete_habit", {
          p_habit_id: id,
          p_notes: notes || null,
        });

        if (completeError) throw completeError;

        // Refresh the habit to get updated streak
        const { data: updatedHabit, error: fetchError } = await supabase
          .from("habits")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        // Update local state
        setHabits((prev) =>
          prev.map((habit) => {
            if (habit.id === id) {
              return {
                ...habit,
                ...updatedHabit,
                badges: updatedHabit.badges || [],
                completed_today: true,
              };
            }
            return habit;
          })
        );

        setTodayCompletions((prev) => new Set([...prev, id]));

        return data as HabitCompletion;
      } catch (err) {
        logger.error("Error completing habit:", err);
        setError(err instanceof Error ? err.message : "Failed to complete habit");
        return null;
      }
    },
    [supabase]
  );

  // Uncomplete habit
  const uncompleteHabit = useCallback(
    async (id: string, date?: string): Promise<boolean> => {
      setError(null);

      try {
        const targetDate = date || format(new Date(), "yyyy-MM-dd");

        // Use the database function
        const { data, error: uncompleteError } = await supabase.rpc("uncomplete_habit", {
          p_habit_id: id,
          p_date: targetDate,
        });

        if (uncompleteError) throw uncompleteError;

        if (!data) {
          return false; // Nothing was deleted
        }

        // Refresh the habit to get updated streak
        const { data: updatedHabit, error: fetchError } = await supabase
          .from("habits")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        // Update local state
        const isTargetToday = targetDate === format(new Date(), "yyyy-MM-dd");

        setHabits((prev) =>
          prev.map((habit) => {
            if (habit.id === id) {
              return {
                ...habit,
                ...updatedHabit,
                badges: updatedHabit.badges || [],
                completed_today: isTargetToday ? false : habit.completed_today,
              };
            }
            return habit;
          })
        );

        if (isTargetToday) {
          setTodayCompletions((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }

        return true;
      } catch (err) {
        logger.error("Error uncompleting habit:", err);
        setError(err instanceof Error ? err.message : "Failed to uncomplete habit");
        return false;
      }
    },
    [supabase]
  );

  // Get today status for a specific habit
  const getTodayStatus = useCallback(
    (habitId: string): boolean => {
      return todayCompletions.has(habitId);
    },
    [todayCompletions]
  );

  // Get completion history
  const getCompletionHistory = useCallback(
    async (habitId: string, days: number = 30): Promise<HabitCompletion[]> => {
      try {
        const startDate = format(
          new Date(Date.now() - days * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd"
        );

        const { data, error: fetchError } = await supabase
          .from("habit_completions")
          .select("*")
          .eq("habit_id", habitId)
          .gte("completed_date", startDate)
          .order("completed_date", { ascending: false });

        if (fetchError) throw fetchError;

        return data as HabitCompletion[];
      } catch (err) {
        logger.error("Error fetching completion history:", err);
        return [];
      }
    },
    [supabase]
  );

  // Get calendar month data
  const getCalendarMonth = useCallback(
    async (habitId: string, year: number, month: number): Promise<CalendarMonth> => {
      try {
        const monthStart = startOfMonth(new Date(year, month));
        const monthEnd = endOfMonth(new Date(year, month));

        const startStr = format(monthStart, "yyyy-MM-dd");
        const endStr = format(monthEnd, "yyyy-MM-dd");

        const { data, error: fetchError } = await supabase
          .from("habit_completions")
          .select("*")
          .eq("habit_id", habitId)
          .gte("completed_date", startStr)
          .lte("completed_date", endStr);

        if (fetchError) throw fetchError;

        const completionsMap = new Map<string, HabitCompletion[]>();
        (data || []).forEach((completion) => {
          const date = completion.completed_date;
          if (!completionsMap.has(date)) {
            completionsMap.set(date, []);
          }
          completionsMap.get(date)!.push(completion as HabitCompletion);
        });

        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

        const days: CalendarDay[] = daysInMonth.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          return {
            date: dateStr,
            completions: completionsMap.get(dateStr) || [],
            isToday: isToday(date),
            isCurrentMonth: true,
          };
        });

        return {
          year,
          month,
          days,
        };
      } catch (err) {
        logger.error("Error fetching calendar month:", err);
        return {
          year,
          month,
          days: [],
        };
      }
    },
    [supabase]
  );

  // Refetch
  const refetch = useCallback(async () => {
    await fetchHabits();
  }, [fetchHabits]);

  // Auto fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchHabits();
    }
  }, [autoFetch, fetchHabits]);

  return {
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
    getTodayStatus,
    getCompletionHistory,
    getCalendarMonth,
    refetch,
  };
}

// Single habit hook for detail views
interface UseSingleHabitReturn {
  habit: HabitWithStatus | null;
  completions: HabitCompletion[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  complete: (notes?: string) => Promise<boolean>;
  uncomplete: (date?: string) => Promise<boolean>;
  update: (input: UpdateHabitInput) => Promise<boolean>;
  remove: () => Promise<boolean>;
}

export function useSingleHabit(habitId: string | null): UseSingleHabitReturn {
  const [habit, setHabit] = useState<HabitWithStatus | null>(null);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchHabit = useCallback(async () => {
    if (!habitId) {
      setHabit(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch habit
      const { data: habitData, error: habitError } = await supabase
        .from("habits")
        .select("*")
        .eq("id", habitId)
        .single();

      if (habitError) throw habitError;

      // Check today's completion
      const today = format(new Date(), "yyyy-MM-dd");
      const { data: todayCompletion } = await supabase
        .from("habit_completions")
        .select("id")
        .eq("habit_id", habitId)
        .eq("completed_date", today)
        .maybeSingle();

      // Get completion rate
      const { data: rateData } = await supabase.rpc("get_habit_completion_rate", {
        p_habit_id: habitId,
        p_days: 30,
      });

      // Fetch recent completions
      const { data: completionsData } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("habit_id", habitId)
        .order("completed_date", { ascending: false })
        .limit(30);

      const habitWithStatus: HabitWithStatus = {
        ...habitData,
        badges: habitData.badges || [],
        completed_today: !!todayCompletion,
        is_due_today: isHabitDueToday(
          habitData.frequency,
          (habitData.target_days || []) as DayOfWeek[]
        ),
        completion_rate: rateData || 0,
      };

      setHabit(habitWithStatus);
      setCompletions(completionsData || []);
    } catch (err) {
      logger.error("Error fetching habit:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch habit");
    } finally {
      setIsLoading(false);
    }
  }, [supabase, habitId]);

  const complete = useCallback(
    async (notes?: string): Promise<boolean> => {
      if (!habitId) return false;

      try {
        const { error: completeError } = await supabase.rpc("complete_habit", {
          p_habit_id: habitId,
          p_notes: notes || null,
        });

        if (completeError) throw completeError;

        await fetchHabit();
        return true;
      } catch (err) {
        logger.error("Error completing habit:", err);
        setError(err instanceof Error ? err.message : "Failed to complete habit");
        return false;
      }
    },
    [supabase, habitId, fetchHabit]
  );

  const uncomplete = useCallback(
    async (date?: string): Promise<boolean> => {
      if (!habitId) return false;

      try {
        const targetDate = date || format(new Date(), "yyyy-MM-dd");
        const { error: uncompleteError } = await supabase.rpc("uncomplete_habit", {
          p_habit_id: habitId,
          p_date: targetDate,
        });

        if (uncompleteError) throw uncompleteError;

        await fetchHabit();
        return true;
      } catch (err) {
        logger.error("Error uncompleting habit:", err);
        setError(err instanceof Error ? err.message : "Failed to uncomplete habit");
        return false;
      }
    },
    [supabase, habitId, fetchHabit]
  );

  const update = useCallback(
    async (input: UpdateHabitInput): Promise<boolean> => {
      if (!habitId) return false;

      try {
        const { error: updateError } = await supabase
          .from("habits")
          .update(input)
          .eq("id", habitId);

        if (updateError) throw updateError;

        await fetchHabit();
        return true;
      } catch (err) {
        logger.error("Error updating habit:", err);
        setError(err instanceof Error ? err.message : "Failed to update habit");
        return false;
      }
    },
    [supabase, habitId, fetchHabit]
  );

  const remove = useCallback(async (): Promise<boolean> => {
    if (!habitId) return false;

    try {
      const { error: deleteError } = await supabase
        .from("habits")
        .delete()
        .eq("id", habitId);

      if (deleteError) throw deleteError;

      setHabit(null);
      return true;
    } catch (err) {
      logger.error("Error deleting habit:", err);
      setError(err instanceof Error ? err.message : "Failed to delete habit");
      return false;
    }
  }, [supabase, habitId]);

  useEffect(() => {
    fetchHabit();
  }, [fetchHabit]);

  return {
    habit,
    completions,
    isLoading,
    error,
    refetch: fetchHabit,
    complete,
    uncomplete,
    update,
    remove,
  };
}
