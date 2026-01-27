/**
 * ExímIA APP - HabitTracker
 * BLOCO 3.2 - Journey Habits
 *
 * Calendar view with completion history
 */

"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Text,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "@/components/ui";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, getDay } from "date-fns";
import type { Habit, HabitCompletion, CalendarMonth } from "@/types/journey";
import { DAY_LABELS } from "@/types/journey";

interface HabitTrackerProps {
  habit: Habit;
  getCalendarMonth: (habitId: string, year: number, month: number) => Promise<CalendarMonth>;
  onDateClick?: (date: string, hasCompletion: boolean) => void;
  className?: string;
}

export function HabitTracker({
  habit,
  getCalendarMonth,
  onDateClick,
  className,
}: HabitTrackerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarMonth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch calendar data
  const fetchCalendar = useCallback(async () => {
    setIsLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const data = await getCalendarMonth(habit.id, year, month);
      setCalendarData(data);
    } catch (err) {
      console.error("Error fetching calendar:", err);
    } finally {
      setIsLoading(false);
    }
  }, [habit.id, currentDate, getCalendarMonth]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  // Navigation
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Build calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of month (0 = Sunday)
  const firstDayOfMonth = getDay(monthStart);

  // Create completion map for quick lookup
  const completionMap = new Map<string, HabitCompletion[]>();
  calendarData?.days.forEach((day) => {
    if (day.completions.length > 0) {
      completionMap.set(day.date, day.completions);
    }
  });

  // Calculate stats for the month
  const totalCompletions = calendarData?.days.reduce(
    (sum, day) => sum + day.completions.length,
    0
  ) || 0;
  const daysWithCompletions = calendarData?.days.filter(
    (day) => day.completions.length > 0
  ).length || 0;

  return (
    <Card className={cn("bg-surface-800 border-surface-600", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>{habit.icon}</span>
            {habit.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={goToNextMonth}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
        <Text muted className="text-center mt-2">
          {format(currentDate, "MMMM yyyy")}
        </Text>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {([0, 1, 2, 3, 4, 5, 6] as const).map((day) => (
                <div
                  key={day}
                  className="text-center text-xs text-gray-500 font-medium py-2"
                >
                  {DAY_LABELS[day]}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Days */}
              {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const completions = completionMap.get(dateStr);
                const hasCompletion = !!completions && completions.length > 0;
                const isTodayDate = isToday(day);
                const isPast = day < new Date();

                return (
                  <button
                    key={dateStr}
                    onClick={() => onDateClick?.(dateStr, hasCompletion)}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center text-sm",
                      "transition-colors relative",
                      hasCompletion
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        : isPast
                        ? "text-gray-600 hover:bg-surface-700"
                        : "text-gray-400 hover:bg-surface-700",
                      isTodayDate && "ring-2 ring-eximia-400 ring-offset-1 ring-offset-surface-800"
                    )}
                  >
                    {format(day, "d")}
                    {hasCompletion && (
                      <span
                        className="absolute bottom-1 size-1.5 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-surface-600 flex items-center justify-between text-sm">
              <Text muted>
                {daysWithCompletions} days completed
              </Text>
              <Text muted>
                {totalCompletions} total check-ins
              </Text>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Mini calendar for dashboard widgets
interface MiniHabitCalendarProps {
  habit: Habit;
  completions: HabitCompletion[];
  days?: number;
  className?: string;
}

export function MiniHabitCalendar({
  habit,
  completions,
  days = 7,
  className,
}: MiniHabitCalendarProps) {
  // Build completion set
  const completionDates = new Set(completions.map((c) => c.completed_date));

  // Get last N days
  const today = new Date();
  const recentDays = Array.from({ length: days }).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (days - 1 - i));
    return date;
  });

  return (
    <div className={cn("flex gap-1", className)}>
      {recentDays.map((day) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const hasCompletion = completionDates.has(dateStr);
        const isTodayDate = isToday(day);

        return (
          <div
            key={dateStr}
            className={cn(
              "size-6 rounded flex items-center justify-center text-xs",
              hasCompletion
                ? "bg-green-500/30 text-green-400"
                : "bg-surface-700 text-gray-500",
              isTodayDate && "ring-1 ring-eximia-400"
            )}
            title={format(day, "MMM d")}
          >
            {format(day, "d")}
          </div>
        );
      })}
    </div>
  );
}

// Year heatmap view (GitHub style)
interface HabitHeatmapProps {
  habit: Habit;
  completions: HabitCompletion[];
  className?: string;
}

export function HabitHeatmap({
  habit,
  completions,
  className,
}: HabitHeatmapProps) {
  // Build completion count map
  const completionCounts = new Map<string, number>();
  completions.forEach((c) => {
    const count = completionCounts.get(c.completed_date) || 0;
    completionCounts.set(c.completed_date, count + 1);
  });

  // Get last 365 days
  const today = new Date();
  const days = Array.from({ length: 365 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (364 - i));
    return date;
  });

  // Group by week
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  // Pad start to align with Sunday
  const firstDay = days[0];
  const firstDayOfWeek = getDay(firstDay);
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null as unknown);
  }

  days.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getIntensity = (count: number): string => {
    if (count === 0) return "bg-surface-700";
    if (count === 1) return "bg-green-900/50";
    if (count === 2) return "bg-green-700/50";
    if (count >= 3) return "bg-green-500/50";
    return "bg-surface-700";
  };

  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="flex gap-0.5 min-w-max">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-0.5">
            {week.map((day, dayIndex) => {
              if (!day) {
                return <div key={dayIndex} className="size-3" />;
              }

              const dateStr = format(day, "yyyy-MM-dd");
              const count = completionCounts.get(dateStr) || 0;

              return (
                <div
                  key={dateStr}
                  className={cn(
                    "size-3 rounded-sm",
                    getIntensity(count)
                  )}
                  title={`${format(day, "MMM d, yyyy")}: ${count} completion${count !== 1 ? "s" : ""}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-0.5">
          <div className="size-3 rounded-sm bg-surface-700" />
          <div className="size-3 rounded-sm bg-green-900/50" />
          <div className="size-3 rounded-sm bg-green-700/50" />
          <div className="size-3 rounded-sm bg-green-500/50" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

export type { HabitTrackerProps, MiniHabitCalendarProps, HabitHeatmapProps };
