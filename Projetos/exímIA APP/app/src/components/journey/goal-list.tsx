/**
 * ExímIA APP - GoalList
 * BLOCO 3.1 - Journey Goals
 *
 * List component for displaying goals with filters
 */

"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Button,
  Input,
  Badge,
  Text,
  Heading,
  Search,
  Filter,
  Plus,
  Target,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  X,
} from "@/components/ui";
import { GoalCard } from "./goal-card";
import type {
  Goal,
  GoalFilters,
  GoalScope,
  GoalStatus,
  GoalCategory,
  GoalPriority,
} from "@/types/journey";
import {
  GOAL_SCOPE_CONFIG,
  GOAL_STATUS_CONFIG,
  GOAL_CATEGORY_CONFIG,
  GOAL_PRIORITY_CONFIG,
} from "@/types/journey";

// ═══════════════════════════════════════════════════════════════════
// FILTER CHIP COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface FilterChipProps {
  label: string;
  value: string;
  isActive: boolean;
  onClick: () => void;
  color?: string;
}

function FilterChip({ label, isActive, onClick, color }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
        isActive
          ? "bg-eximia-400/20 text-eximia-400 border border-eximia-400/50"
          : "bg-surface-700 text-gray-400 border border-surface-600 hover:border-surface-500",
        color && isActive && color
      )}
    >
      {label}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FILTERS BAR COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface FiltersBarProps {
  filters: GoalFilters;
  onFilterChange: (filters: GoalFilters) => void;
  onClearFilters: () => void;
  showScopeFilter?: boolean;
  showStatusFilter?: boolean;
  showCategoryFilter?: boolean;
  showPriorityFilter?: boolean;
}

function FiltersBar({
  filters,
  onFilterChange,
  onClearFilters,
  showScopeFilter = true,
  showStatusFilter = true,
  showCategoryFilter = true,
  showPriorityFilter = false,
}: FiltersBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    filters.scope ||
    filters.status ||
    filters.category ||
    filters.priority ||
    filters.search;

  const activeFilterCount = [
    filters.scope,
    filters.status,
    filters.category,
    filters.priority,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Search & Filter Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
          <Input
            value={filters.search || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value || undefined })
            }
            placeholder="Search goals..."
            className="pl-10"
          />
        </div>

        <Button
          variant={isExpanded ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="size-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="primary" size="sm" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="size-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 bg-surface-800 rounded-lg border border-surface-600 space-y-4">
          {/* Scope Filter */}
          {showScopeFilter && (
            <div>
              <Text size="xs" muted className="mb-2">
                Scope
              </Text>
              <div className="flex flex-wrap gap-2">
                {Object.entries(GOAL_SCOPE_CONFIG).map(([scope, config]) => (
                  <FilterChip
                    key={scope}
                    label={config.label}
                    value={scope}
                    isActive={filters.scope === scope}
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        scope: filters.scope === scope ? undefined : (scope as GoalScope),
                      })
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Status Filter */}
          {showStatusFilter && (
            <div>
              <Text size="xs" muted className="mb-2">
                Status
              </Text>
              <div className="flex flex-wrap gap-2">
                {Object.entries(GOAL_STATUS_CONFIG).map(([status, config]) => (
                  <FilterChip
                    key={status}
                    label={config.label}
                    value={status}
                    isActive={filters.status === status}
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        status:
                          filters.status === status ? undefined : (status as GoalStatus),
                      })
                    }
                    color={config.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          {showCategoryFilter && (
            <div>
              <Text size="xs" muted className="mb-2">
                Category
              </Text>
              <div className="flex flex-wrap gap-2">
                {Object.entries(GOAL_CATEGORY_CONFIG).map(([category, config]) => (
                  <FilterChip
                    key={category}
                    label={config.label}
                    value={category}
                    isActive={filters.category === category}
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        category:
                          filters.category === category
                            ? undefined
                            : (category as GoalCategory),
                      })
                    }
                    color={config.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Priority Filter */}
          {showPriorityFilter && (
            <div>
              <Text size="xs" muted className="mb-2">
                Priority
              </Text>
              <div className="flex flex-wrap gap-2">
                {Object.entries(GOAL_PRIORITY_CONFIG).map(([priority, config]) => (
                  <FilterChip
                    key={priority}
                    label={config.label}
                    value={priority}
                    isActive={filters.priority === priority}
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        priority:
                          filters.priority === priority
                            ? undefined
                            : (priority as GoalPriority),
                      })
                    }
                    color={config.color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCOPE GROUP COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface ScopeGroupProps {
  scope: GoalScope;
  goals: Goal[];
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  onAddKeyResult?: (goalId: string) => void;
  onAddChild?: (goalId: string) => void;
  onViewLinks?: (goalId: string) => void;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

function ScopeGroup({
  scope,
  goals,
  onEdit,
  onDelete,
  onAddKeyResult,
  onAddChild,
  onViewLinks,
  isCollapsible = true,
  defaultExpanded = true,
}: ScopeGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const config = GOAL_SCOPE_CONFIG[scope];

  if (goals.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Scope Header */}
      <button
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center gap-2 w-full",
          isCollapsible && "cursor-pointer"
        )}
      >
        {isCollapsible && (
          isExpanded ? (
            <ChevronDown className="size-4 text-gray-500" />
          ) : (
            <ChevronRight className="size-4 text-gray-500" />
          )
        )}
        <Heading level={5} className="text-gray-300">
          {config.label}
        </Heading>
        <Badge variant="secondary" size="sm">
          {goals.length}
        </Badge>
      </button>

      {/* Goals */}
      {isExpanded && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddKeyResult={onAddKeyResult}
              onAddChild={onAddChild}
              onViewLinks={onViewLinks}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GOAL LIST COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface GoalListProps {
  goals: Goal[];
  isLoading?: boolean;
  error?: string | null;
  filters?: GoalFilters;
  onFilterChange?: (filters: GoalFilters) => void;
  onRefresh?: () => void;
  onCreate?: () => void;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  onAddKeyResult?: (goalId: string) => void;
  onAddChild?: (goalId: string) => void;
  onViewLinks?: (goalId: string) => void;
  showFilters?: boolean;
  showGroupByScope?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function GoalList({
  goals,
  isLoading = false,
  error,
  filters = {},
  onFilterChange,
  onRefresh,
  onCreate,
  onEdit,
  onDelete,
  onAddKeyResult,
  onAddChild,
  onViewLinks,
  showFilters = true,
  showGroupByScope = true,
  emptyTitle = "No goals yet",
  emptyDescription = "Create your first goal to get started",
  className,
}: GoalListProps) {
  // Group goals by scope
  const groupedGoals = useMemo(() => {
    if (!showGroupByScope) return { all: goals };

    const groups: Record<GoalScope, Goal[]> = {
      life: [],
      yearly: [],
      quarterly: [],
      monthly: [],
      weekly: [],
    };

    goals.forEach((goal) => {
      groups[goal.scope].push(goal);
    });

    return groups;
  }, [goals, showGroupByScope]);

  // Handle filter change
  const handleFilterChange = (newFilters: GoalFilters) => {
    onFilterChange?.(newFilters);
  };

  // Clear filters
  const handleClearFilters = () => {
    onFilterChange?.({});
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filters */}
      {showFilters && onFilterChange && (
        <FiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <Text className="text-red-400">{error}</Text>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="mt-2"
            >
              <RefreshCw className="size-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 text-eximia-400 animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="size-12 mx-auto text-gray-500 mb-4" />
          <Heading level={4} className="text-gray-300 mb-2">
            {emptyTitle}
          </Heading>
          <Text muted className="mb-4">
            {emptyDescription}
          </Text>
          {onCreate && (
            <Button variant="primary" onClick={onCreate}>
              <Plus className="size-4 mr-2" />
              Create Goal
            </Button>
          )}
        </div>
      )}

      {/* Goals List */}
      {!isLoading && !error && goals.length > 0 && (
        <>
          {showGroupByScope ? (
            // Grouped by Scope
            <div className="space-y-8">
              {(Object.entries(groupedGoals) as [GoalScope, Goal[]][])
                .filter(([_, scopeGoals]) => scopeGoals.length > 0)
                .sort(
                  ([a], [b]) =>
                    GOAL_SCOPE_CONFIG[a].order - GOAL_SCOPE_CONFIG[b].order
                )
                .map(([scope, scopeGoals]) => (
                  <ScopeGroup
                    key={scope}
                    scope={scope}
                    goals={scopeGoals}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddKeyResult={onAddKeyResult}
                    onAddChild={onAddChild}
                    onViewLinks={onViewLinks}
                  />
                ))}
            </div>
          ) : (
            // Flat List
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddKeyResult={onAddKeyResult}
                  onAddChild={onAddChild}
                  onViewLinks={onViewLinks}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export type { GoalListProps, FiltersBarProps, ScopeGroupProps };
