/**
 * ExímIA APP - Journey Dashboard
 * BLOCO 3.3 - Journey Dashboard
 *
 * Aggregated dashboard with metrics, widgets, AI insights, and quick actions
 */

"use client";

import { useMemo, useCallback } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/templates";
import { Header } from "@/components/organisms";
import { MetricCard } from "@/components/molecules";
import { CompactHabitList, StreakBadge } from "@/components/journey";
import { useHabits } from "@/hooks/use-habits";
import { useGoals } from "@/hooks/use-goals";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Text,
  Badge,
  Spinner,
  Target,
  Flame,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  Plus,
  Zap,
  Brain,
  Sparkles,
  Clock,
  AlertTriangle,
  Award,
  Calendar,
  ArrowRight,
} from "@/components/ui";
import { getProgressColor } from "@/types/journey";
import type { Goal, HabitWithStatus } from "@/types/journey";

// ═══════════════════════════════════════════════════════════════════
// AI INSIGHTS COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface AIInsightsProps {
  goals: Goal[];
  habits: HabitWithStatus[];
}

function AIInsights({ goals, habits }: AIInsightsProps) {
  const insights = useMemo(() => {
    const suggestions: Array<{
      type: "warning" | "tip" | "celebration";
      icon: React.ReactNode;
      message: string;
    }> = [];

    // Check for stalled goals
    const stalledGoals = goals.filter(
      g => g.status === "in_progress" && g.progress < 25
    );
    if (stalledGoals.length > 0) {
      suggestions.push({
        type: "warning",
        icon: <AlertTriangle className="size-4" />,
        message: `${stalledGoals.length} goal${stalledGoals.length > 1 ? "s" : ""} need attention - progress below 25%`,
      });
    }

    // Check for broken streaks risk
    const atRiskHabits = habits.filter(
      h => h.is_due_today && !h.completed_today && h.current_streak >= 7
    );
    if (atRiskHabits.length > 0) {
      suggestions.push({
        type: "warning",
        icon: <Flame className="size-4" />,
        message: `${atRiskHabits.length} streak${atRiskHabits.length > 1 ? "s" : ""} at risk! Complete today to keep the momentum.`,
      });
    }

    // Celebrate achievements
    const longStreaks = habits.filter(h => h.current_streak >= 30);
    if (longStreaks.length > 0) {
      suggestions.push({
        type: "celebration",
        icon: <Award className="size-4" />,
        message: `Amazing! ${longStreaks.length} habit${longStreaks.length > 1 ? "s" : ""} with 30+ day streaks!`,
      });
    }

    // Completed goals
    const completedGoals = goals.filter(g => g.status === "completed");
    if (completedGoals.length > 0) {
      suggestions.push({
        type: "celebration",
        icon: <Target className="size-4" />,
        message: `${completedGoals.length} goal${completedGoals.length > 1 ? "s" : ""} completed! Keep up the great work.`,
      });
    }

    // Tips
    if (goals.length > 0 && habits.length === 0) {
      suggestions.push({
        type: "tip",
        icon: <Sparkles className="size-4" />,
        message: "Tip: Link habits to goals to build consistent progress.",
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        type: "tip",
        icon: <Brain className="size-4" />,
        message: "Looking good! Keep building your journey.",
      });
    }

    return suggestions.slice(0, 3);
  }, [goals, habits]);

  const typeStyles = {
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    tip: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    celebration: "bg-green-500/10 border-green-500/20 text-green-400",
  };

  return (
    <div className="space-y-3">
      {insights.map((insight, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 p-3 rounded-lg border ${typeStyles[insight.type]}`}
        >
          <span className="mt-0.5">{insight.icon}</span>
          <Text size="sm">{insight.message}</Text>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// QUICK ACTIONS COMPONENT
// ═══════════════════════════════════════════════════════════════════

function QuickActions() {
  const actions = [
    {
      label: "New Goal",
      href: "/journey/goals",
      icon: <Target className="size-4" />,
      color: "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30",
    },
    {
      label: "New Habit",
      href: "/journey/habits",
      icon: <Calendar className="size-4" />,
      color: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
    },
    {
      label: "Review Progress",
      href: "/journey/goals",
      icon: <TrendingUp className="size-4" />,
      color: "bg-green-500/20 text-green-400 hover:bg-green-500/30",
    },
    {
      label: "Inbox",
      href: "/inbox",
      icon: <Zap className="size-4" />,
      color: "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${action.color}`}
        >
          {action.icon}
          <Text size="sm" className="font-medium">
            {action.label}
          </Text>
        </Link>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RECENT ACTIVITY COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface RecentActivityProps {
  goals: Goal[];
  habits: HabitWithStatus[];
}

function RecentActivity({ goals, habits }: RecentActivityProps) {
  const activities = useMemo(() => {
    const items: Array<{
      type: "goal" | "habit";
      icon: React.ReactNode;
      title: string;
      subtitle: string;
      time: string;
    }> = [];

    // Recently completed goals
    goals
      .filter(g => g.status === "completed")
      .slice(0, 2)
      .forEach(g => {
        items.push({
          type: "goal",
          icon: <Target className="size-4 text-green-400" />,
          title: g.title,
          subtitle: "Goal completed",
          time: "Recently",
        });
      });

    // Today's habit completions
    habits
      .filter(h => h.completed_today)
      .slice(0, 3)
      .forEach(h => {
        items.push({
          type: "habit",
          icon: <CheckCircle className="size-4 text-green-400" />,
          title: h.title,
          subtitle: `${h.current_streak} day streak`,
          time: "Today",
        });
      });

    return items.slice(0, 4);
  }, [goals, habits]);

  if (activities.length === 0) {
    return (
      <div className="text-center py-4">
        <Clock className="size-8 mx-auto text-surface-500 mb-2" />
        <Text muted size="sm">No recent activity</Text>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-700/50 transition-colors"
        >
          <div className="p-2 bg-surface-700 rounded-lg">
            {activity.icon}
          </div>
          <div className="flex-1 min-w-0">
            <Text size="sm" className="truncate">
              {activity.title}
            </Text>
            <Text size="xs" muted>
              {activity.subtitle}
            </Text>
          </div>
          <Text size="xs" muted>
            {activity.time}
          </Text>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STREAKS OVERVIEW COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface StreaksOverviewProps {
  habits: HabitWithStatus[];
}

function StreaksOverview({ habits }: StreaksOverviewProps) {
  const streakHabits = useMemo(() => {
    return habits
      .filter(h => h.status === "active" && h.current_streak > 0)
      .sort((a, b) => b.current_streak - a.current_streak)
      .slice(0, 5);
  }, [habits]);

  if (streakHabits.length === 0) {
    return (
      <div className="text-center py-4">
        <Flame className="size-8 mx-auto text-surface-500 mb-2" />
        <Text muted size="sm">Complete habits to build streaks</Text>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {streakHabits.map(habit => (
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
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════

export default function JourneyPage() {
  const {
    habits,
    stats: habitStats,
    completeHabit,
    uncompleteHabit,
    isLoading: habitsLoading
  } = useHabits({ autoFetch: true });

  const {
    goals,
    isLoading: goalsLoading
  } = useGoals({ autoFetch: true });

  // Calculate goal stats
  const goalStats = useMemo(() => ({
    total: goals.length,
    inProgress: goals.filter((g) => g.status === "in_progress").length,
    completed: goals.filter((g) => g.status === "completed").length,
    avgProgress: goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
      : 0,
  }), [goals]);

  // Calculate habit progress
  const dailyProgress = habitStats.habits_due_today > 0
    ? Math.round((habitStats.habits_completed_today / habitStats.habits_due_today) * 100)
    : 100;

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Journey" },
  ];

  return (
    <DashboardShell>
      <Header
        breadcrumbs={breadcrumbs}
        title="Journey"
        subtitle="Your goals, habits, and personal growth dashboard"
      />

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Active Goals"
            value={goalStats.inProgress}
            subtitle={`${goalStats.total} total`}
            icon={<Target className="size-5" />}
          />
          <MetricCard
            title="Goal Progress"
            value={`${goalStats.avgProgress}%`}
            subtitle={`${goalStats.completed} completed`}
            icon={<TrendingUp className="size-5" />}
            trend={goalStats.avgProgress >= 50 ? "up" : undefined}
          />
          <MetricCard
            title="Today's Habits"
            value={`${dailyProgress}%`}
            subtitle={`${habitStats.habits_completed_today}/${habitStats.habits_due_today} done`}
            icon={<CheckCircle className="size-5" />}
            trend={dailyProgress >= 100 ? "up" : undefined}
          />
          <MetricCard
            title="Best Streak"
            value={`${habitStats.longest_streak}`}
            subtitle="days"
            icon={<Flame className="size-5" />}
            trend={habitStats.longest_streak >= 7 ? "up" : undefined}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Goals & Habits */}
          <div className="lg:col-span-2 space-y-6">
            {/* Goals Section */}
            <Card className="bg-surface-800 border-surface-600">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="size-5 text-eximia-400" />
                    Goals
                  </CardTitle>
                  <CardDescription>Your objectives and key results</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/journey/goals">
                    View All
                    <ChevronRight className="size-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {goalsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="md" />
                  </div>
                ) : goals.length > 0 ? (
                  <div className="space-y-3">
                    {goals
                      .filter(g => g.status === "in_progress" || g.status === "not_started")
                      .sort((a, b) => {
                        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                      })
                      .slice(0, 4)
                      .map((goal) => (
                        <Link
                          key={goal.id}
                          href={`/journey/goals/${goal.id}`}
                          className="block p-3 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: goal.color || "#6366F1" }}
                              />
                              <Text className="font-medium truncate">{goal.title}</Text>
                            </div>
                            <Text size="sm" className={getProgressColor(goal.progress)}>
                              {goal.progress}%
                            </Text>
                          </div>
                          <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-eximia-400 rounded-full transition-all"
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                        </Link>
                      ))}
                    {goals.length > 4 && (
                      <Link href="/journey/goals">
                        <Text size="sm" muted className="text-center pt-2 hover:text-primary-400">
                          +{goals.length - 4} more goals →
                        </Text>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="size-10 mx-auto text-surface-500 mb-3" />
                    <Text muted className="mb-4">No goals yet</Text>
                    <Button size="sm" asChild>
                      <Link href="/journey/goals">
                        <Plus className="size-4 mr-2" />
                        Create Goal
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Habits Section */}
            <Card className="bg-surface-800 border-surface-600">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="size-5 text-orange-400" />
                    Today's Habits
                  </CardTitle>
                  <CardDescription>Build consistency with daily habits</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/journey/habits">
                    View All
                    <ChevronRight className="size-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {habitsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="md" />
                  </div>
                ) : habits.length > 0 ? (
                  <CompactHabitList
                    habits={habits}
                    onComplete={completeHabit}
                    onUncomplete={uncompleteHabit}
                    maxItems={5}
                  />
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="size-10 mx-auto text-surface-500 mb-3" />
                    <Text muted className="mb-4">No habits yet</Text>
                    <Button size="sm" asChild>
                      <Link href="/journey/habits">
                        <Plus className="size-4 mr-2" />
                        Create Habit
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Insights & Actions */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="bg-surface-800 border-surface-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="size-5 text-purple-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AIInsights goals={goals} habits={habits} />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-surface-800 border-surface-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="size-5 text-yellow-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuickActions />
              </CardContent>
            </Card>

            {/* Streaks Overview */}
            <Card className="bg-surface-800 border-surface-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="size-5 text-orange-400" />
                  Streaks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StreaksOverview habits={habits} />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-surface-800 border-surface-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-5 text-blue-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivity goals={goals} habits={habits} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
