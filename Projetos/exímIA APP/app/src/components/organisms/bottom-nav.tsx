"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import {
  Home,
  Target,
  Plus,
  BookOpen,
  Settings,
} from "@/components/ui";

interface BottomNavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  isAction?: boolean;
}

const defaultItems: BottomNavItem[] = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/goals", icon: Target, label: "Metas" },
  { href: "/capture", icon: Plus, label: "Capturar", isAction: true },
  { href: "/academy", icon: BookOpen, label: "Academy" },
  { href: "/settings", icon: Settings, label: "Mais" },
];

interface BottomNavProps {
  items?: BottomNavItem[];
  className?: string;
}

function BottomNav({ items = defaultItems, className }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      data-slot="bottom-nav"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden",
        "bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800",
        "safe-area-pb",
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center -mt-4"
              >
                <div className="flex items-center justify-center size-14 rounded-full bg-eximia-400 shadow-lg shadow-eximia-400/30">
                  <Icon className="size-6 text-zinc-900" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
                isActive ? "text-eximia-400" : "text-zinc-400"
              )}
            >
              <Icon className="size-5" />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { BottomNav };
export type { BottomNavProps, BottomNavItem };
