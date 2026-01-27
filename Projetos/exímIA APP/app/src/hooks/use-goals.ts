/**
 * ExímIA APP - useGoals Hook
 * BLOCO 3.1 - Journey Goals
 *
 * Hook for managing goals and key results
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  Goal,
  KeyResult,
  CreateGoalInput,
  UpdateGoalInput,
  CreateKeyResultInput,
  UpdateKeyResultInput,
  GoalFilters,
  GoalStatus,
  GoalScope,
} from "@/types/journey";

interface UseGoalsOptions {
  autoFetch?: boolean;
  filters?: GoalFilters;
}

interface UseGoalsReturn {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  // Goal operations
  fetchGoals: (filters?: GoalFilters) => Promise<void>;
  createGoal: (input: CreateGoalInput) => Promise<Goal | null>;
  updateGoal: (id: string, input: UpdateGoalInput) => Promise<boolean>;
  deleteGoal: (id: string) => Promise<boolean>;
  updateProgress: (id: string, progress: number) => Promise<boolean>;
  updateStatus: (id: string, status: GoalStatus) => Promise<boolean>;
  // Key result operations
  addKeyResult: (input: CreateKeyResultInput) => Promise<KeyResult | null>;
  updateKeyResult: (id: string, input: UpdateKeyResultInput) => Promise<boolean>;
  deleteKeyResult: (id: string) => Promise<boolean>;
  // Utilities
  getGoalById: (id: string) => Promise<Goal | null>;
  getGoalWithKeyResults: (id: string) => Promise<Goal | null>;
  getChildGoals: (parentId: string) => Promise<Goal[]>;
  refetch: () => Promise<void>;
}

export function useGoals(options: UseGoalsOptions = {}): UseGoalsReturn {
  const { autoFetch = true, filters: initialFilters } = options;

  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = createClient();

  // ═══════════════════════════════════════════════════════════════════
  // FETCH GOALS
  // ═══════════════════════════════════════════════════════════════════

  const fetchGoals = useCallback(
    async (filters?: GoalFilters) => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("goals")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false });

        // Apply filters
        const activeFilters = filters || initialFilters;
        if (activeFilters?.scope) {
          query = query.eq("scope", activeFilters.scope);
        }
        if (activeFilters?.status) {
          query = query.eq("status", activeFilters.status);
        }
        if (activeFilters?.category) {
          query = query.eq("category", activeFilters.category);
        }
        if (activeFilters?.priority) {
          query = query.eq("priority", activeFilters.priority);
        }
        if (activeFilters?.parent_id !== undefined) {
          if (activeFilters.parent_id === null) {
            query = query.is("parent_id", null);
          } else {
            query = query.eq("parent_id", activeFilters.parent_id);
          }
        }
        if (activeFilters?.search) {
          query = query.ilike("title", `%${activeFilters.search}%`);
        }

        const { data, error: fetchError, count } = await query;

        if (fetchError) throw fetchError;

        // Fetch key results count for each goal
        const goalsWithCounts = await Promise.all(
          (data || []).map(async (goal) => {
            const { count: krCount } = await supabase
              .from("key_results")
              .select("*", { count: "exact", head: true })
              .eq("goal_id", goal.id);

            const { count: childrenCount } = await supabase
              .from("goals")
              .select("*", { count: "exact", head: true })
              .eq("parent_id", goal.id);

            return {
              ...goal,
              key_results_count: krCount || 0,
              children_count: childrenCount || 0,
            } as Goal;
          })
        );

        setGoals(goalsWithCounts);
        setTotalCount(count || 0);
      } catch (err) {
        logger.error("Error fetching goals:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch goals");
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, initialFilters]
  );

  // ═══════════════════════════════════════════════════════════════════
  // CREATE GOAL
  // ═══════════════════════════════════════════════════════════════════

  const createGoal = useCallback(
    async (input: CreateGoalInput): Promise<Goal | null> => {
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        const goalData = {
          user_id: user.id,
          title: input.title,
          description: input.description,
          why: input.why,
          scope: input.scope,
          parent_id: input.parent_id,
          category: input.category || "personal",
          priority: input.priority || "medium",
          tags: input.tags || [],
          start_date: input.start_date,
          target_date: input.target_date,
          color: input.color,
          icon: input.icon,
          status: "not_started" as GoalStatus,
          progress: 0,
        };

        const { data, error: insertError } = await supabase
          .from("goals")
          .insert(goalData)
          .select()
          .single();

        if (insertError) throw insertError;

        // Add to local state
        const newGoal = { ...data, key_results_count: 0, children_count: 0 } as Goal;
        setGoals((prev) => [newGoal, ...prev]);
        setTotalCount((prev) => prev + 1);

        return newGoal;
      } catch (err) {
        logger.error("Error creating goal:", err);
        setError(err instanceof Error ? err.message : "Failed to create goal");
        return null;
      }
    },
    [supabase]
  );

  // ═══════════════════════════════════════════════════════════════════
  // UPDATE GOAL
  // ═══════════════════════════════════════════════════════════════════

  const updateGoal = useCallback(
    async (id: string, input: UpdateGoalInput): Promise<boolean> => {
      setError(null);

      try {
        // If marking as completed, set completed_at
        const updateData = { ...input };
        if (input.status === "completed" && !input.completed_at) {
          updateData.completed_at = new Date().toISOString();
        }

        const { error: updateError } = await supabase
          .from("goals")
          .update(updateData)
          .eq("id", id);

        if (updateError) throw updateError;

        // Update local state
        setGoals((prev) =>
          prev.map((goal) =>
            goal.id === id ? { ...goal, ...updateData } : goal
          )
        );

        return true;
      } catch (err) {
        logger.error("Error updating goal:", err);
        setError(err instanceof Error ? err.message : "Failed to update goal");
        return false;
      }
    },
    [supabase]
  );

  // ═══════════════════════════════════════════════════════════════════
  // DELETE GOAL
  // ═══════════════════════════════════════════════════════════════════

  const deleteGoal = useCallback(
    async (id: string): Promise<boolean> => {
      setError(null);

      try {
        const { error: deleteError } = await supabase
          .from("goals")
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;

        // Update local state
        setGoals((prev) => prev.filter((goal) => goal.id !== id));
        setTotalCount((prev) => prev - 1);

        return true;
      } catch (err) {
        logger.error("Error deleting goal:", err);
        setError(err instanceof Error ? err.message : "Failed to delete goal");
        return false;
      }
    },
    [supabase]
  );

  // ═══════════════════════════════════════════════════════════════════
  // UPDATE PROGRESS
  // ═══════════════════════════════════════════════════════════════════

  const updateProgress = useCallback(
    async (id: string, progress: number): Promise<boolean> => {
      const clampedProgress = Math.min(100, Math.max(0, progress));

      // Determine status based on progress
      let status: GoalStatus | undefined;
      if (clampedProgress === 0) {
        status = "not_started";
      } else if (clampedProgress === 100) {
        status = "completed";
      } else {
        status = "in_progress";
      }

      return updateGoal(id, { progress: clampedProgress, status });
    },
    [updateGoal]
  );

  // ═══════════════════════════════════════════════════════════════════
  // UPDATE STATUS
  // ═══════════════════════════════════════════════════════════════════

  const updateStatus = useCallback(
    async (id: string, status: GoalStatus): Promise<boolean> => {
      const updates: UpdateGoalInput = { status };

      // Set progress to 100 if completed
      if (status === "completed") {
        updates.progress = 100;
        updates.completed_at = new Date().toISOString();
      }

      return updateGoal(id, updates);
    },
    [updateGoal]
  );

  // ═══════════════════════════════════════════════════════════════════
  // KEY RESULTS
  // ═══════════════════════════════════════════════════════════════════

  const addKeyResult = useCallback(
    async (input: CreateKeyResultInput): Promise<KeyResult | null> => {
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        // Get current max position
        const { data: existing } = await supabase
          .from("key_results")
          .select("position")
          .eq("goal_id", input.goal_id)
          .order("position", { ascending: false })
          .limit(1);

        const maxPosition = existing?.[0]?.position ?? -1;

        const krData = {
          goal_id: input.goal_id,
          user_id: user.id,
          title: input.title,
          description: input.description,
          metric_type: input.metric_type || "percentage",
          target_value: input.target_value ?? 100,
          current_value: input.current_value ?? 0,
          unit: input.unit,
          status: "not_started",
          progress: 0,
          position: input.position ?? maxPosition + 1,
        };

        const { data, error: insertError } = await supabase
          .from("key_results")
          .insert(krData)
          .select()
          .single();

        if (insertError) throw insertError;

        // Update goal's key_results_count in local state
        setGoals((prev) =>
          prev.map((goal) =>
            goal.id === input.goal_id
              ? { ...goal, key_results_count: (goal.key_results_count || 0) + 1 }
              : goal
          )
        );

        return data as KeyResult;
      } catch (err) {
        logger.error("Error adding key result:", err);
        setError(err instanceof Error ? err.message : "Failed to add key result");
        return null;
      }
    },
    [supabase]
  );

  const updateKeyResult = useCallback(
    async (id: string, input: UpdateKeyResultInput): Promise<boolean> => {
      setError(null);

      try {
        const { error: updateError } = await supabase
          .from("key_results")
          .update(input)
          .eq("id", id);

        if (updateError) throw updateError;

        return true;
      } catch (err) {
        logger.error("Error updating key result:", err);
        setError(err instanceof Error ? err.message : "Failed to update key result");
        return false;
      }
    },
    [supabase]
  );

  const deleteKeyResult = useCallback(
    async (id: string): Promise<boolean> => {
      setError(null);

      try {
        // Get goal_id before deleting
        const { data: kr } = await supabase
          .from("key_results")
          .select("goal_id")
          .eq("id", id)
          .single();

        const { error: deleteError } = await supabase
          .from("key_results")
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;

        // Update goal's key_results_count in local state
        if (kr) {
          setGoals((prev) =>
            prev.map((goal) =>
              goal.id === kr.goal_id
                ? { ...goal, key_results_count: Math.max(0, (goal.key_results_count || 0) - 1) }
                : goal
            )
          );
        }

        return true;
      } catch (err) {
        logger.error("Error deleting key result:", err);
        setError(err instanceof Error ? err.message : "Failed to delete key result");
        return false;
      }
    },
    [supabase]
  );

  // ═══════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════

  const getGoalById = useCallback(
    async (id: string): Promise<Goal | null> => {
      try {
        const { data, error: fetchError } = await supabase
          .from("goals")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        return data as Goal;
      } catch (err) {
        logger.error("Error fetching goal:", err);
        return null;
      }
    },
    [supabase]
  );

  const getGoalWithKeyResults = useCallback(
    async (id: string): Promise<Goal | null> => {
      try {
        const { data: goal, error: goalError } = await supabase
          .from("goals")
          .select("*")
          .eq("id", id)
          .single();

        if (goalError) throw goalError;

        const { data: keyResults, error: krError } = await supabase
          .from("key_results")
          .select("*")
          .eq("goal_id", id)
          .order("position", { ascending: true });

        if (krError) throw krError;

        return {
          ...goal,
          key_results: keyResults || [],
          key_results_count: keyResults?.length || 0,
        } as Goal;
      } catch (err) {
        logger.error("Error fetching goal with key results:", err);
        return null;
      }
    },
    [supabase]
  );

  const getChildGoals = useCallback(
    async (parentId: string): Promise<Goal[]> => {
      try {
        const { data, error: fetchError } = await supabase
          .from("goals")
          .select("*")
          .eq("parent_id", parentId)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        return (data || []) as Goal[];
      } catch (err) {
        logger.error("Error fetching child goals:", err);
        return [];
      }
    },
    [supabase]
  );

  const refetch = useCallback(async () => {
    await fetchGoals();
  }, [fetchGoals]);

  // Auto fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchGoals();
    }
  }, [autoFetch, fetchGoals]);

  return {
    goals,
    isLoading,
    error,
    totalCount,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    updateStatus,
    addKeyResult,
    updateKeyResult,
    deleteKeyResult,
    getGoalById,
    getGoalWithKeyResults,
    getChildGoals,
    refetch,
  };
}

// ═══════════════════════════════════════════════════════════════════
// SINGLE GOAL HOOK
// ═══════════════════════════════════════════════════════════════════

interface UseGoalOptions {
  id: string;
  includeKeyResults?: boolean;
}

interface UseGoalReturn {
  goal: Goal | null;
  keyResults: KeyResult[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateGoal: (input: UpdateGoalInput) => Promise<boolean>;
  addKeyResult: (input: Omit<CreateKeyResultInput, "goal_id">) => Promise<KeyResult | null>;
  updateKeyResult: (id: string, input: UpdateKeyResultInput) => Promise<boolean>;
  deleteKeyResult: (id: string) => Promise<boolean>;
}

export function useGoal(options: UseGoalOptions): UseGoalReturn {
  const { id, includeKeyResults = true } = options;

  const [goal, setGoal] = useState<Goal | null>(null);
  const [keyResults, setKeyResults] = useState<KeyResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchGoal = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data: goalData, error: goalError } = await supabase
        .from("goals")
        .select("*")
        .eq("id", id)
        .single();

      if (goalError) throw goalError;

      setGoal(goalData as Goal);

      if (includeKeyResults) {
        const { data: krData, error: krError } = await supabase
          .from("key_results")
          .select("*")
          .eq("goal_id", id)
          .order("position", { ascending: true });

        if (krError) throw krError;

        setKeyResults((krData || []) as KeyResult[]);
      }
    } catch (err) {
      logger.error("Error fetching goal:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch goal");
    } finally {
      setIsLoading(false);
    }
  }, [id, includeKeyResults, supabase]);

  const updateGoalFn = useCallback(
    async (input: UpdateGoalInput): Promise<boolean> => {
      if (!id) return false;

      try {
        const { error: updateError } = await supabase
          .from("goals")
          .update(input)
          .eq("id", id);

        if (updateError) throw updateError;

        setGoal((prev) => (prev ? { ...prev, ...input } : prev));
        return true;
      } catch (err) {
        logger.error("Error updating goal:", err);
        setError(err instanceof Error ? err.message : "Failed to update goal");
        return false;
      }
    },
    [id, supabase]
  );

  const addKeyResultFn = useCallback(
    async (input: Omit<CreateKeyResultInput, "goal_id">): Promise<KeyResult | null> => {
      if (!id) return null;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        const maxPosition = keyResults.length > 0
          ? Math.max(...keyResults.map((kr) => kr.position))
          : -1;

        const krData = {
          goal_id: id,
          user_id: user.id,
          title: input.title,
          description: input.description,
          metric_type: input.metric_type || "percentage",
          target_value: input.target_value ?? 100,
          current_value: input.current_value ?? 0,
          unit: input.unit,
          status: "not_started",
          progress: 0,
          position: input.position ?? maxPosition + 1,
        };

        const { data, error: insertError } = await supabase
          .from("key_results")
          .insert(krData)
          .select()
          .single();

        if (insertError) throw insertError;

        setKeyResults((prev) => [...prev, data as KeyResult]);
        return data as KeyResult;
      } catch (err) {
        logger.error("Error adding key result:", err);
        setError(err instanceof Error ? err.message : "Failed to add key result");
        return null;
      }
    },
    [id, keyResults, supabase]
  );

  const updateKeyResultFn = useCallback(
    async (krId: string, input: UpdateKeyResultInput): Promise<boolean> => {
      try {
        const { error: updateError } = await supabase
          .from("key_results")
          .update(input)
          .eq("id", krId);

        if (updateError) throw updateError;

        setKeyResults((prev) =>
          prev.map((kr) => (kr.id === krId ? { ...kr, ...input } : kr))
        );

        // Refetch goal to get updated progress
        await fetchGoal();

        return true;
      } catch (err) {
        logger.error("Error updating key result:", err);
        setError(err instanceof Error ? err.message : "Failed to update key result");
        return false;
      }
    },
    [supabase, fetchGoal]
  );

  const deleteKeyResultFn = useCallback(
    async (krId: string): Promise<boolean> => {
      try {
        const { error: deleteError } = await supabase
          .from("key_results")
          .delete()
          .eq("id", krId);

        if (deleteError) throw deleteError;

        setKeyResults((prev) => prev.filter((kr) => kr.id !== krId));

        // Refetch goal to get updated progress
        await fetchGoal();

        return true;
      } catch (err) {
        logger.error("Error deleting key result:", err);
        setError(err instanceof Error ? err.message : "Failed to delete key result");
        return false;
      }
    },
    [supabase, fetchGoal]
  );

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  return {
    goal,
    keyResults,
    isLoading,
    error,
    refetch: fetchGoal,
    updateGoal: updateGoalFn,
    addKeyResult: addKeyResultFn,
    updateKeyResult: updateKeyResultFn,
    deleteKeyResult: deleteKeyResultFn,
  };
}
