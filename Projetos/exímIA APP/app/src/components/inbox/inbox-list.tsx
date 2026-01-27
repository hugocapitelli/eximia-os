/**
 * ExímIA APP - InboxList
 * BLOCO 2.1 - Inbox Capture
 *
 * List of inbox items with filters
 */

"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Filter, Loader2, Inbox, RefreshCw } from "@/components/ui";
import { Heading, Text } from "@/components/ui";
import { InboxItemCard } from "./inbox-item";
import type { InboxItem, InboxStatus, InboxContentType } from "@/types/connection-layer";

// Filter options
const STATUS_FILTERS: { value: InboxStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "inbox", label: "New" },
  { value: "processing", label: "Processing" },
  { value: "triaged", label: "Triaged" },
  { value: "converted", label: "Converted" },
  { value: "archived", label: "Archived" },
];

interface InboxListProps {
  items: InboxItem[];
  isLoading?: boolean;
  onArchive?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onProcess?: (id: string) => Promise<void>;
  onSelect?: (item: InboxItem) => void;
  onRefresh?: () => void;
  selectedItemId?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function InboxList({
  items,
  isLoading = false,
  onArchive,
  onDelete,
  onProcess,
  onSelect,
  onRefresh,
  selectedItemId,
  emptyTitle = "Inbox Empty",
  emptyDescription = "Capture something to get started",
  className,
}: InboxListProps) {
  const [statusFilter, setStatusFilter] = useState<InboxStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<InboxContentType | "all">("all");

  // Filter items
  const filteredItems = items.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (typeFilter !== "all" && item.content_type !== typeFilter) return false;
    return true;
  });

  // Group items by status for display
  const newItems = filteredItems.filter((i) => i.status === "inbox");
  const processingItems = filteredItems.filter((i) => i.status === "processing");
  const otherItems = filteredItems.filter(
    (i) => !["inbox", "processing"].includes(i.status)
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Inbox className="size-5 text-eximia-400" />
          <Heading level={5}>Inbox</Heading>
          {items.length > 0 && (
            <span className="px-2 py-0.5 text-xs bg-eximia-500/10 text-eximia-400 rounded-full">
              {newItems.length} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-surface-700 rounded-lg">
            {STATUS_FILTERS.slice(0, 4).map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  "px-3 py-1 text-xs rounded-md transition-colors",
                  statusFilter === filter.value
                    ? "bg-eximia-500/20 text-eximia-400"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={cn("size-4", isLoading && "animate-spin")}
              />
            </Button>
          )}
        </div>
      </div>

      {/* Items */}
      {isLoading && items.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 text-gray-400 animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-surface-700 mb-4">
            <Inbox className="size-8 text-gray-500" />
          </div>
          <Heading level={5} className="text-gray-400">
            {emptyTitle}
          </Heading>
          <Text size="sm" muted className="mt-1">
            {emptyDescription}
          </Text>
        </div>
      ) : (
        <div className="space-y-6">
          {/* New Items Section */}
          {newItems.length > 0 && (
            <div className="space-y-2">
              <Text size="xs" weight="medium" muted className="uppercase tracking-wider">
                New ({newItems.length})
              </Text>
              <div className="space-y-2">
                {newItems.map((item) => (
                  <InboxItemCard
                    key={item.id}
                    item={item}
                    onArchive={onArchive ? () => onArchive(item.id) : undefined}
                    onDelete={onDelete ? () => onDelete(item.id) : undefined}
                    onProcess={onProcess ? () => onProcess(item.id) : undefined}
                    onSelect={onSelect}
                    isSelected={item.id === selectedItemId}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Processing Items Section */}
          {processingItems.length > 0 && (
            <div className="space-y-2">
              <Text size="xs" weight="medium" muted className="uppercase tracking-wider">
                Processing ({processingItems.length})
              </Text>
              <div className="space-y-2">
                {processingItems.map((item) => (
                  <InboxItemCard
                    key={item.id}
                    item={item}
                    onSelect={onSelect}
                    isSelected={item.id === selectedItemId}
                    showActions={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Items Section */}
          {otherItems.length > 0 && statusFilter !== "inbox" && (
            <div className="space-y-2">
              <Text size="xs" weight="medium" muted className="uppercase tracking-wider">
                History ({otherItems.length})
              </Text>
              <div className="space-y-2">
                {otherItems.map((item) => (
                  <InboxItemCard
                    key={item.id}
                    item={item}
                    onSelect={onSelect}
                    isSelected={item.id === selectedItemId}
                    showActions={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export type { InboxListProps };
