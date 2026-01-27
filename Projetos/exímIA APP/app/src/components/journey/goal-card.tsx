/**
 * ExímIA APP - GoalCard
 * BLOCO 3.1 - Journey Goals
 *
 * Card component for displaying a goal with progress, status, and key results
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";
import {
  Button,
  Badge,
  Text,
  Target,
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Link as LinkIcon,
  Star,
  Layers,
} from "@/components/ui";
import type {
  Goal,
  GoalStatus,
  GoalCategory,
  GoalPriority,
  GoalScope,
} from "@/types/journey";
import {
  GOAL_STATUS_CONFIG,
  GOAL_CATEGORY_CONFIG,
  GOAL_PRIORITY_CONFIG,
  GOAL_SCOPE_CONFIG,
  getProgressColor,
  getProgressBgColor,
  formatProgress,
} from "@/types/journey";

// ═══════════════════════════════════════════════════════════════════
// PROGRESS BAR COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface ProgressBarProps {
  progress: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const heightClass = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }[size];

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <Text size="xs" muted>
            Progress
          </Text>
          <Text size="xs" className={getProgressColor(progress)}>
            {formatProgress(progress)}
          </Text>
        </div>
      )}
      <div className={cn("w-full bg-surface-600 rounded-full overflow-hidden", heightClass)}>
        <div
          className={cn("h-full rounded-full transition-all duration-300", getProgressBgColor(progress))}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STATUS BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface StatusBadgeProps {
  status: GoalStatus;
  size?: "sm" | "default" | "lg";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = GOAL_STATUS_CONFIG[status];

  return (
    <Badge
      variant="outline"
      size={size}
      className={cn("border-current", config.color)}
      dot
    >
      {config.label}
    </Badge>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PRIORITY BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface PriorityBadgeProps {
  priority: GoalPriority;
  size?: "sm" | "default" | "lg";
}

export function PriorityBadge({ priority, size = "sm" }: PriorityBadgeProps) {
  const config = GOAL_PRIORITY_CONFIG[priority];

  return (
    <Badge
      variant="secondary"
      size={size}
      className={cn(config.bgColor, config.color)}
    >
      {config.label}
    </Badge>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCOPE BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface ScopeBadgeProps {
  scope: GoalScope;
  size?: "sm" | "default" | "lg";
}

export function ScopeBadge({ scope, size = "sm" }: ScopeBadgeProps) {
  const config = GOAL_SCOPE_CONFIG[scope];

  return (
    <Badge variant="secondary" size={size}>
      {config.label}
    </Badge>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CATEGORY BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface CategoryBadgeProps {
  category: GoalCategory;
  size?: "sm" | "default" | "lg";
}

export function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
  const config = GOAL_CATEGORY_CONFIG[category];

  return (
    <Badge variant="secondary" size={size} className={config.color}>
      {config.label}
    </Badge>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GOAL CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  onAddKeyResult?: (goalId: string) => void;
  onAddChild?: (goalId: string) => void;
  onViewLinks?: (goalId: string) => void;
  showDescription?: boolean;
  showKeyResultsCount?: boolean;
  showChildrenCount?: boolean;
  showProgress?: boolean;
  isCompact?: boolean;
  className?: string;
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  onAddKeyResult,
  onAddChild,
  onViewLinks,
  showDescription = true,
  showKeyResultsCount = true,
  showChildrenCount = true,
  showProgress = true,
  isCompact = false,
  className,
}: GoalCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  const categoryConfig = GOAL_CATEGORY_CONFIG[goal.category];

  // Format target date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  const targetDateFormatted = formatDate(goal.target_date);

  // Is overdue?
  const isOverdue =
    goal.target_date &&
    new Date(goal.target_date) < new Date() &&
    goal.status !== "completed" &&
    goal.status !== "cancelled";

  if (isCompact) {
    return (
      <Link href={`/journey/goals/${goal.id}`}>
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg bg-surface-800 border border-surface-600",
            "hover:border-surface-500 hover:bg-surface-700/50 transition-colors cursor-pointer",
            className
          )}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Target className={cn("size-4 shrink-0", categoryConfig.color)} />
              <Text weight="medium" className="truncate">
                {goal.title}
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={goal.status} />
            <Text size="sm" className={getProgressColor(goal.progress)}>
              {formatProgress(goal.progress)}
            </Text>
            <ChevronRight className="size-4 text-gray-500" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Card
      className={cn(
        "bg-surface-800 border-surface-600 hover:border-surface-500 transition-colors",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Scope & Category */}
            <div className="flex items-center gap-2 mb-2">
              <ScopeBadge scope={goal.scope} />
              <CategoryBadge category={goal.category} />
              {goal.priority === "critical" || goal.priority === "high" ? (
                <PriorityBadge priority={goal.priority} />
              ) : null}
            </div>

            {/* Title */}
            <Link href={`/journey/goals/${goal.id}`}>
              <CardTitle className="hover:text-eximia-400 transition-colors cursor-pointer">
                {goal.title}
              </CardTitle>
            </Link>

            {/* Description */}
            {showDescription && goal.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {goal.description}
              </CardDescription>
            )}
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreHorizontal className="size-4" />
            </Button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-surface-700 border border-surface-600 rounded-lg shadow-lg py-1">
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(goal);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-surface-600"
                    >
                      <Edit className="size-4" />
                      Edit Goal
                    </button>
                  )}
                  {onAddKeyResult && (
                    <button
                      onClick={() => {
                        onAddKeyResult(goal.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-surface-600"
                    >
                      <Plus className="size-4" />
                      Add Key Result
                    </button>
                  )}
                  {onAddChild && goal.scope !== "weekly" && (
                    <button
                      onClick={() => {
                        onAddChild(goal.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-surface-600"
                    >
                      <Layers className="size-4" />
                      Add Sub-Goal
                    </button>
                  )}
                  {onViewLinks && (
                    <button
                      onClick={() => {
                        onViewLinks(goal.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-surface-600"
                    >
                      <LinkIcon className="size-4" />
                      View Links
                    </button>
                  )}
                  {onDelete && (
                    <>
                      <div className="border-t border-surface-600 my-1" />
                      <button
                        onClick={() => {
                          onDelete(goal.id);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-surface-600"
                      >
                        <Trash2 className="size-4" />
                        Delete Goal
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        {/* Progress */}
        {showProgress && (
          <ProgressBar progress={goal.progress} showLabel className="mb-4" />
        )}

        {/* Status & Meta Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge status={goal.status} />

            {targetDateFormatted && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue ? "text-red-400" : "text-gray-500"
                )}
              >
                <Calendar className="size-3" />
                {targetDateFormatted}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Key Results Count */}
            {showKeyResultsCount && (goal.key_results_count ?? 0) > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Target className="size-3" />
                {goal.key_results_count} KRs
              </div>
            )}

            {/* Children Count */}
            {showChildrenCount && (goal.children_count ?? 0) > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Layers className="size-3" />
                {goal.children_count} sub-goals
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Why Section (Expandable) */}
      {goal.why && (
        <CardFooter className="pt-0 border-t border-surface-600">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-400 transition-colors w-full py-2"
          >
            {isExpanded ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
            <Star className="size-3 text-yellow-400" />
            Why this matters
          </button>
          {isExpanded && (
            <Text size="sm" muted className="mt-2 italic">
              &quot;{goal.why}&quot;
            </Text>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

export type { GoalCardProps, ProgressBarProps };
