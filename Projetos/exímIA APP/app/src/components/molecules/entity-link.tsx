"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import {
  Target,
  BookOpen,
  Compass,
  User,
  Folder,
  FileText,
  Calendar,
  CheckCircle,
  Brain,
} from "@/components/ui";

type EntityType =
  | "goal"
  | "project"
  | "habit"
  | "note"
  | "person"
  | "event"
  | "task"
  | "agent"
  | "resource"
  | "area";

const entityConfig: Record<
  EntityType,
  { icon: LucideIcon; color: string; bgColor: string }
> = {
  goal: {
    icon: Target,
    color: "text-eximia-400",
    bgColor: "bg-eximia-400/10 hover:bg-eximia-400/20",
  },
  project: {
    icon: Folder,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10 hover:bg-blue-400/20",
  },
  habit: {
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-400/10 hover:bg-green-400/20",
  },
  note: {
    icon: FileText,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10 hover:bg-purple-400/20",
  },
  person: {
    icon: User,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10 hover:bg-pink-400/20",
  },
  event: {
    icon: Calendar,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10 hover:bg-orange-400/20",
  },
  task: {
    icon: CheckCircle,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10 hover:bg-cyan-400/20",
  },
  agent: {
    icon: Brain,
    color: "text-violet-400",
    bgColor: "bg-violet-400/10 hover:bg-violet-400/20",
  },
  resource: {
    icon: BookOpen,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 hover:bg-amber-400/20",
  },
  area: {
    icon: Compass,
    color: "text-teal-400",
    bgColor: "bg-teal-400/10 hover:bg-teal-400/20",
  },
};

interface EntityLinkProps {
  type: EntityType;
  id: string;
  label: string;
  href?: string;
  className?: string;
  showIcon?: boolean;
  onClick?: () => void;
}

function EntityLink({
  type,
  id,
  label,
  href,
  className,
  showIcon = true,
  onClick,
}: EntityLinkProps) {
  const config = entityConfig[type];
  const Icon = config.icon;

  const defaultHref = `/${type}s/${id}`;
  const finalHref = href || defaultHref;

  const content = (
    <>
      {showIcon && <Icon className={cn("size-3.5 shrink-0", config.color)} />}
      <span className="truncate">{label}</span>
    </>
  );

  const baseClasses = cn(
    "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors",
    config.bgColor,
    config.color,
    className
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={baseClasses}>
        {content}
      </button>
    );
  }

  return (
    <Link href={finalHref} className={baseClasses}>
      {content}
    </Link>
  );
}

// Entity Badge (non-clickable version)
interface EntityBadgeProps {
  type: EntityType;
  label: string;
  className?: string;
  showIcon?: boolean;
}

function EntityBadge({
  type,
  label,
  className,
  showIcon = true,
}: EntityBadgeProps) {
  const config = entityConfig[type];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
        config.bgColor,
        config.color,
        className
      )}
    >
      {showIcon && <Icon className={cn("size-3.5 shrink-0", config.color)} />}
      <span className="truncate">{label}</span>
    </span>
  );
}

export { EntityLink, EntityBadge, entityConfig };
export type { EntityLinkProps, EntityBadgeProps, EntityType };
