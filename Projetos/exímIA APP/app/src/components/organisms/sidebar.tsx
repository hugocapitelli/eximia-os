"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Button,
  Avatar,
  Text,
  Home,
  Target,
  BookOpen,
  Palette,
  Compass,
  Layers,
  Inbox,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Brain,
  Sparkles,
} from "@/components/ui";
import { NavItem } from "@/components/molecules";

interface SidebarProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    plan?: string;
  };
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onSignOut?: () => void;
  className?: string;
}

const mainNavItems = [
  { href: "/dashboard", icon: <Home className="size-5" />, label: "Dashboard" },
  { href: "/journey/goals", icon: <Target className="size-5" />, label: "Goals" },
  { href: "/inbox", icon: <Inbox className="size-5" />, label: "Inbox", badge: 3 },
  { href: "/journey", icon: <Compass className="size-5" />, label: "Journey" },
  { href: "/academy", icon: <BookOpen className="size-5" />, label: "Academy" },
  { href: "/brand", icon: <Palette className="size-5" />, label: "Brand" },
  { href: "/prototypos", icon: <Layers className="size-5" />, label: "PrototypOS" },
];

const agentNavItems = [
  { href: "/minds", icon: <Brain className="size-5" />, label: "Minds" },
  { href: "/copilot", icon: <Sparkles className="size-5" />, label: "Copilot" },
];

function Sidebar({
  user,
  collapsed = false,
  onCollapsedChange,
  onSignOut,
  className,
}: SidebarProps) {
  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "flex flex-col h-full bg-zinc-950 border-r border-zinc-800 transition-all duration-300",
        collapsed ? "w-16" : "w-60",
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-zinc-800",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-eximia-400 flex items-center justify-center">
              <span className="text-zinc-900 font-bold text-sm">E</span>
            </div>
            <Text weight="semibold" className="text-lg">ExímIA</Text>
          </Link>
        )}

        {collapsed && (
          <Link href="/dashboard">
            <div className="size-8 rounded-lg bg-eximia-400 flex items-center justify-center">
              <span className="text-zinc-900 font-bold text-sm">E</span>
            </div>
          </Link>
        )}

        {!collapsed && onCollapsedChange && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onCollapsedChange(true)}
            className="text-zinc-400"
          >
            <ChevronLeft className="size-4" />
          </Button>
        )}
      </div>

      {/* Quick Action */}
      {!collapsed && (
        <div className="p-3">
          <Button className="w-full justify-start gap-2" size="sm">
            <Plus className="size-4" />
            Nova Meta
          </Button>
        </div>
      )}

      {collapsed && (
        <div className="p-2">
          <Button size="icon-sm" className="w-full">
            <Plus className="size-4" />
          </Button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {mainNavItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            collapsed={collapsed}
          />
        ))}

        {/* Separator */}
        <div className="my-3 border-t border-zinc-800" />

        {/* Agents Section */}
        {!collapsed && (
          <Text size="xs" color="muted" className="px-3 py-2 uppercase tracking-wider">
            AI
          </Text>
        )}

        {agentNavItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-800 p-2 space-y-1">
        <NavItem
          href="/settings"
          icon={<Settings className="size-5" />}
          label="Configurações"
          collapsed={collapsed}
        />

        {/* User Card */}
        {user && (
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors",
            collapsed && "justify-center"
          )}>
            <Avatar
              size={collapsed ? "sm" : "default"}
              fallback={user.name || user.email || "U"}
              src={user.avatar}
              status="online"
            />

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <Text size="sm" weight="medium" className="truncate">
                  {user.name || user.email}
                </Text>
                {user.plan && (
                  <Text size="xs" color="muted" className="truncate">
                    {user.plan}
                  </Text>
                )}
              </div>
            )}

            {!collapsed && onSignOut && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onSignOut}
                className="text-zinc-400 shrink-0"
              >
                <LogOut className="size-4" />
              </Button>
            )}
          </div>
        )}

        {/* Collapse toggle (when collapsed) */}
        {collapsed && onCollapsedChange && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onCollapsedChange(false)}
            className="w-full text-zinc-400"
          >
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </aside>
  );
}

export { Sidebar };
export type { SidebarProps };
