"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge, ChevronRight } from "@/components/ui";
import { cva, type VariantProps } from "class-variance-authority";

const navItemVariants = cva(
  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
  {
    variants: {
      variant: {
        default: "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50",
        active: "text-zinc-50 bg-zinc-800",
      },
      collapsed: {
        true: "justify-center px-2",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      collapsed: false,
    },
  }
);

interface NavItemProps extends VariantProps<typeof navItemVariants> {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number | string;
  badgeVariant?: "default" | "primary" | "success" | "warning" | "destructive";
  collapsed?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function NavItem({
  href,
  icon,
  label,
  badge,
  badgeVariant = "default",
  collapsed = false,
  children,
  className,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const hasChildren = React.Children.count(children) > 0;

  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  const content = (
    <>
      <span className={cn(
        "flex items-center justify-center size-5 shrink-0",
        isActive ? "text-eximia-400" : "text-zinc-400 group-hover:text-zinc-300"
      )}>
        {icon}
      </span>

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>

          {badge !== undefined && (
            <Badge variant={badgeVariant} size="sm">
              {badge}
            </Badge>
          )}

          {hasChildren && (
            <ChevronRight
              className={cn(
                "size-4 text-zinc-500 transition-transform",
                isExpanded && "rotate-90"
              )}
            />
          )}
        </>
      )}
    </>
  );

  if (collapsed) {
    return (
      <Link
        href={href}
        className={cn(navItemVariants({ variant: isActive ? "active" : "default", collapsed: true }), className)}
        title={label}
      >
        {content}
      </Link>
    );
  }

  if (hasChildren) {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            navItemVariants({ variant: isActive ? "active" : "default", collapsed: false }),
            "w-full"
          )}
        >
          {content}
        </button>

        {isExpanded && (
          <div className="ml-6 mt-1 space-y-1 border-l border-zinc-800 pl-3">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(navItemVariants({ variant: isActive ? "active" : "default", collapsed: false }), className)}
    >
      {content}
    </Link>
  );
}

// Sub-item for nested navigation
interface NavSubItemProps {
  href: string;
  label: string;
  badge?: number | string;
  className?: string;
}

function NavSubItem({ href, label, badge, className }: NavSubItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors",
        isActive
          ? "text-eximia-400 bg-eximia-400/10"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
        className
      )}
    >
      <span className="truncate">{label}</span>
      {badge !== undefined && (
        <Badge variant="outline" size="sm">
          {badge}
        </Badge>
      )}
    </Link>
  );
}

export { NavItem, NavSubItem, navItemVariants };
export type { NavItemProps, NavSubItemProps };
