
import React from 'react';
import { cn } from '../../lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  items: TabItem[] | string[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, activeTab, onChange, className }) => {
  return (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
      {items.map((item) => {
        const id = typeof item === 'string' ? item : item.id;
        const label = typeof item === 'string' ? item : item.label;
        const icon = typeof item === 'string' ? null : item.icon;
        
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2",
              isActive 
                ? "bg-background text-foreground shadow-sm" 
                : "hover:bg-background/50 hover:text-foreground"
            )}
          >
            {icon && <span className={cn("material-symbols-outlined text-[16px]", isActive ? "fill-1" : "")}>{icon}</span>}
            {label}
          </button>
        );
      })}
    </div>
  );
};
