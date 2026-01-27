/**
 * ExímIA APP - StreakBadge
 * BLOCO 3.2 - Journey Habits
 *
 * Badge component showing current streak
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { getStreakColor, getStreakBgColor, formatStreak, BADGE_INFO } from "@/types/journey";

interface StreakBadgeProps {
  streak: number;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function StreakBadge({
  streak,
  showIcon = true,
  showLabel = true,
  size = "default",
  className,
}: StreakBadgeProps) {
  const textColor = getStreakColor(streak);
  const bgColor = getStreakBgColor(streak);

  // Find the highest milestone achieved
  const milestones = [100, 30, 7];
  const achievedMilestone = milestones.find((m) => streak >= m);
  const badgeInfo = achievedMilestone ? BADGE_INFO[achievedMilestone] : null;

  return (
    <Badge
      variant="outline"
      size={size}
      className={cn(
        "border-transparent",
        bgColor,
        textColor,
        className
      )}
    >
      {showIcon && (
        <span className="mr-1">
          {badgeInfo ? badgeInfo.icon : "🔥"}
        </span>
      )}
      {showLabel && formatStreak(streak)}
    </Badge>
  );
}

// Compact version for cards
interface StreakIndicatorProps {
  streak: number;
  className?: string;
}

export function StreakIndicator({ streak, className }: StreakIndicatorProps) {
  const textColor = getStreakColor(streak);

  if (streak === 0) return null;

  return (
    <div className={cn("flex items-center gap-1", textColor, className)}>
      <span>🔥</span>
      <span className="text-sm font-medium">{streak}</span>
    </div>
  );
}

// Badge collection display
interface BadgeCollectionProps {
  badges: Array<{ milestone: number; name: string; earned_at: string }>;
  className?: string;
}

export function BadgeCollection({ badges, className }: BadgeCollectionProps) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {badges.map((badge) => {
        const info = BADGE_INFO[badge.milestone];
        if (!info) return null;

        return (
          <div
            key={badge.milestone}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-700 text-sm"
            title={`${info.name} - ${info.description}`}
          >
            <span>{info.icon}</span>
            <span className="text-gray-300">{info.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export type { StreakBadgeProps, StreakIndicatorProps, BadgeCollectionProps };
