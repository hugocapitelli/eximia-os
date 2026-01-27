"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Button,
  Heading,
  ChevronRight,
  Menu,
  Bell,
  Settings,
} from "@/components/ui";
import { SearchInput } from "@/components/molecules";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  showSearch?: boolean;
  onMenuClick?: () => void;
  className?: string;
}

function Header({
  title,
  subtitle,
  icon,
  breadcrumbs = [],
  actions,
  showSearch = false,
  onMenuClick,
  className,
}: HeaderProps) {
  return (
    <header
      data-slot="header"
      className={cn(
        "flex items-center justify-between h-16 px-4 lg:px-6 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm",
        className
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Mobile menu button */}
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMenuClick}
            className="lg:hidden text-zinc-400"
          >
            <Menu className="size-5" />
          </Button>
        )}

        {/* Breadcrumbs (desktop) */}
        {breadcrumbs.length > 0 && (
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight className="size-4 text-zinc-600" />
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-zinc-400">{item.label}</span>
                )}
              </React.Fragment>
            ))}
            <ChevronRight className="size-4 text-zinc-600" />
          </nav>
        )}

        {/* Title */}
        <div className="flex items-center gap-2 min-w-0">
          {icon && (
            <span className="text-eximia-400 shrink-0">{icon}</span>
          )}
          <div className="min-w-0">
            <Heading level="h1" className="text-lg font-semibold truncate">
              {title}
            </Heading>
            {subtitle && (
              <p className="text-sm text-zinc-500 truncate">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Search (desktop) */}
        {showSearch && (
          <div className="hidden lg:block w-64">
            <SearchInput size="sm" />
          </div>
        )}

        {/* Custom actions */}
        {actions}

        {/* Notifications */}
        <Button variant="ghost" size="icon-sm" className="text-zinc-400 relative">
          <Bell className="size-5" />
          <span className="absolute top-1 right-1 size-2 bg-eximia-400 rounded-full" />
        </Button>

        {/* Settings (mobile) */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden text-zinc-400"
          asChild
        >
          <Link href="/settings">
            <Settings className="size-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}

export { Header };
export type { HeaderProps, BreadcrumbItem };
