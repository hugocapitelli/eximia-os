/**
 * ExímIA APP - HabitCard
 * BLOCO 3.2 - Journey Habits
 *
 * Individual habit display with check button
 */

"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  Button,
  Check,
  MoreHorizontal,
  Edit,
  Trash2,
  Pause,
  Play,
  Loader2,
  Text,
} from "@/components/ui";
import { StreakIndicator } from "./streak-badge";
import type { HabitWithStatus, HabitFrequency } from "@/types/journey";
import { FREQUENCY_LABELS, DAY_LABELS, DayOfWeek } from "@/types/journey";

interface HabitCardProps {
  habit: HabitWithStatus;
  onComplete?: (id: string) => Promise<void>;
  onUncomplete?: (id: string) => Promise<void>;
  onEdit?: (habit: HabitWithStatus) => void;
  onDelete?: (id: string) => Promise<void>;
  onPause?: (id: string) => Promise<void>;
  onResume?: (id: string) => Promise<void>;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export function HabitCard({
  habit,
  onComplete,
  onUncomplete,
  onEdit,
  onDelete,
  onPause,
  onResume,
  showActions = true,
  compact = false,
  className,
}: HabitCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    if (isToggling) return;

    setIsToggling(true);
    try {
      if (habit.completed_today) {
        await onUncomplete?.(habit.id);
      } else {
        await onComplete?.(habit.id);
      }
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting || !onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(habit.id);
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const handlePauseToggle = async () => {
    if (habit.status === "paused") {
      await onResume?.(habit.id);
    } else {
      await onPause?.(habit.id);
    }
    setShowMenu(false);
  };

  // Format target days for weekly habits
  const formatTargetDays = (days: DayOfWeek[]): string => {
    if (!days || days.length === 0) return "Every day";
    if (days.length === 7) return "Every day";
    return days.map((d) => DAY_LABELS[d]).join(", ");
  };

  const isActive = habit.status === "active";
  const canComplete = isActive && habit.is_due_today;

  if (compact) {
    return (
      <Card
        className={cn(
          "bg-surface-800 border-surface-600 transition-all",
          !isActive && "opacity-60",
          className
        )}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {/* Check Button */}
            <button
              onClick={handleToggle}
              disabled={isToggling || !canComplete}
              className={cn(
                "size-8 rounded-full flex items-center justify-center transition-all shrink-0",
                "border-2",
                habit.completed_today
                  ? "bg-green-500 border-green-500 text-white"
                  : canComplete
                  ? "border-gray-500 hover:border-green-500 text-transparent hover:text-green-500"
                  : "border-gray-700 text-transparent cursor-not-allowed"
              )}
            >
              {isToggling ? (
                <Loader2 className="size-4 animate-spin text-gray-400" />
              ) : (
                <Check className="size-4" />
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span>{habit.icon}</span>
                <Text className={cn("font-medium truncate", habit.completed_today && "line-through text-gray-500")}>
                  {habit.title}
                </Text>
              </div>
            </div>

            {/* Streak */}
            <StreakIndicator streak={habit.current_streak} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "bg-surface-800 border-surface-600 transition-all",
        !isActive && "opacity-60",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Check Button */}
          <button
            onClick={handleToggle}
            disabled={isToggling || !canComplete}
            className={cn(
              "size-12 rounded-full flex items-center justify-center transition-all shrink-0 mt-1",
              "border-2",
              habit.completed_today
                ? "bg-green-500 border-green-500 text-white"
                : canComplete
                ? "border-gray-500 hover:border-green-500 text-transparent hover:text-green-500"
                : "border-gray-700 text-transparent cursor-not-allowed"
            )}
            style={{
              borderColor: !habit.completed_today && canComplete ? habit.color : undefined,
            }}
          >
            {isToggling ? (
              <Loader2 className="size-5 animate-spin text-gray-400" />
            ) : (
              <Check className="size-5" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{habit.icon}</span>
              <Text
                className={cn(
                  "text-lg font-semibold truncate",
                  habit.completed_today && "line-through text-gray-500"
                )}
              >
                {habit.title}
              </Text>
            </div>

            {habit.description && (
              <Text size="sm" muted className="mb-2 line-clamp-1">
                {habit.description}
              </Text>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{FREQUENCY_LABELS[habit.frequency]}</span>
              {habit.frequency === "weekly" && habit.target_days.length > 0 && (
                <span>{formatTargetDays(habit.target_days)}</span>
              )}
              <StreakIndicator streak={habit.current_streak} />
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Completion Rate (30 days)</span>
                <span>{Math.round(habit.completion_rate)}%</span>
              </div>
              <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${habit.completion_rate}%`,
                    backgroundColor: habit.color,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          {showActions && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400"
              >
                <MoreHorizontal className="size-4" />
              </Button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-8 z-20 w-40 rounded-lg bg-surface-700 border border-surface-600 shadow-lg py-1">
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(habit);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-surface-600"
                      >
                        <Edit className="size-4" />
                        Edit
                      </button>
                    )}
                    {(onPause || onResume) && (
                      <button
                        onClick={handlePauseToggle}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-surface-600"
                      >
                        {habit.status === "paused" ? (
                          <>
                            <Play className="size-4" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause className="size-4" />
                            Pause
                          </>
                        )}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-surface-600"
                      >
                        {isDeleting ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export type { HabitCardProps };
