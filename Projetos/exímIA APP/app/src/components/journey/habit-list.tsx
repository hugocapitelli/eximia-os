/**
 * ExímIA APP - HabitList
 * BLOCO 3.2 - Journey Habits
 *
 * List of habits with filtering
 */

"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Text,
  Button,
  Input,
  Search,
  RefreshCw,
  Loader2,
  Target,
} from "@/components/ui";
import { HabitCard } from "./habit-card";
import type { HabitWithStatus, HabitFilters, HabitStatus } from "@/types/journey";

interface HabitListProps {
  habits: HabitWithStatus[];
  isLoading?: boolean;
  onComplete?: (id: string) => Promise<void>;
  onUncomplete?: (id: string) => Promise<void>;
  onEdit?: (habit: HabitWithStatus) => void;
  onDelete?: (id: string) => Promise<void>;
  onPause?: (id: string) => Promise<void>;
  onResume?: (id: string) => Promise<void>;
  onRefresh?: () => void;
  showFilters?: boolean;
  showSearch?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function HabitList({
  habits,
  isLoading = false,
  onComplete,
  onUncomplete,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onRefresh,
  showFilters = true,
  showSearch = true,
  emptyTitle = "No habits yet",
  emptyDescription = "Create your first habit to start tracking",
  className,
}: HabitListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<HabitStatus | "all">("all");
  const [viewMode, setViewMode] = useState<"due" | "all">("due");

  // Filter habits
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      // Search filter
      if (search && !habit.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && habit.status !== statusFilter) {
        return false;
      }

      // View mode filter
      if (viewMode === "due" && !habit.is_due_today) {
        return false;
      }

      return true;
    });
  }, [habits, search, statusFilter, viewMode]);

  // Group by completion status for "due" view
  const { pending, completed } = useMemo(() => {
    if (viewMode !== "due") {
      return { pending: filteredHabits, completed: [] };
    }

    return {
      pending: filteredHabits.filter((h) => !h.completed_today && h.status === "active"),
      completed: filteredHabits.filter((h) => h.completed_today && h.status === "active"),
    };
  }, [filteredHabits, viewMode]);

  // Loading state
  if (isLoading && habits.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12", className)}>
        <Loader2 className="size-8 animate-spin text-gray-400 mb-4" />
        <Text muted>Loading habits...</Text>
      </div>
    );
  }

  // Empty state
  if (habits.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12", className)}>
        <div className="p-4 rounded-full bg-surface-700 mb-4">
          <Target className="size-8 text-gray-400" />
        </div>
        <Text className="text-lg font-medium mb-1">{emptyTitle}</Text>
        <Text muted>{emptyDescription}</Text>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filters */}
      {(showFilters || showSearch) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          {showSearch && (
            <div className="flex-1">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search habits..."
                leftIcon={<Search className="size-4" />}
                clearable
                onClear={() => setSearch("")}
              />
            </div>
          )}

          {/* View Mode Toggle */}
          {showFilters && (
            <div className="flex gap-2">
              <Button
                variant={viewMode === "due" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("due")}
              >
                Due Today
              </Button>
              <Button
                variant={viewMode === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("all")}
              >
                All Habits
              </Button>
            </div>
          )}

          {/* Refresh */}
          {onRefresh && (
            <Button
              variant="outline"
              size="icon-sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
            </Button>
          )}
        </div>
      )}

      {/* Status Filter (when showing all) */}
      {showFilters && viewMode === "all" && (
        <div className="flex gap-2">
          {(["all", "active", "paused", "archived"] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      )}

      {/* Habits List */}
      {viewMode === "due" ? (
        <>
          {/* Pending Section */}
          {pending.length > 0 && (
            <div className="space-y-3">
              <Text size="sm" muted className="uppercase tracking-wide">
                To Do ({pending.length})
              </Text>
              {pending.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={onComplete}
                  onUncomplete={onUncomplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPause={onPause}
                  onResume={onResume}
                />
              ))}
            </div>
          )}

          {/* Completed Section */}
          {completed.length > 0 && (
            <div className="space-y-3 mt-6">
              <Text size="sm" muted className="uppercase tracking-wide">
                Completed ({completed.length})
              </Text>
              {completed.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={onComplete}
                  onUncomplete={onUncomplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPause={onPause}
                  onResume={onResume}
                />
              ))}
            </div>
          )}

          {/* No habits due today */}
          {pending.length === 0 && completed.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Text className="text-lg font-medium text-green-400 mb-1">
                All done for today!
              </Text>
              <Text muted>No habits scheduled for today</Text>
            </div>
          )}
        </>
      ) : (
        // All habits view
        <div className="space-y-3">
          {filteredHabits.length > 0 ? (
            filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={onComplete}
                onUncomplete={onUncomplete}
                onEdit={onEdit}
                onDelete={onDelete}
                onPause={onPause}
                onResume={onResume}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Text muted>No habits match your filters</Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Compact list version for dashboard widgets
interface CompactHabitListProps {
  habits: HabitWithStatus[];
  onComplete?: (id: string) => Promise<void>;
  onUncomplete?: (id: string) => Promise<void>;
  maxItems?: number;
  className?: string;
}

export function CompactHabitList({
  habits,
  onComplete,
  onUncomplete,
  maxItems = 5,
  className,
}: CompactHabitListProps) {
  // Only show active, due today habits
  const dueHabits = useMemo(() => {
    return habits
      .filter((h) => h.status === "active" && h.is_due_today)
      .slice(0, maxItems);
  }, [habits, maxItems]);

  if (dueHabits.length === 0) {
    return (
      <div className={cn("text-center py-4", className)}>
        <Text muted>No habits due today</Text>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {dueHabits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onComplete={onComplete}
          onUncomplete={onUncomplete}
          compact
          showActions={false}
        />
      ))}
    </div>
  );
}

export type { HabitListProps, CompactHabitListProps };
