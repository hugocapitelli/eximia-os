/**
 * ExímIA APP - InboxItemCard
 * BLOCO 2.1 - Inbox Capture
 *
 * Individual inbox item display
 */

"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Button,
  Trash2,
  Archive,
  Check,
  MoreHorizontal,
  FileText,
  Image,
  Link as LinkIcon,
  Mic,
  File,
  Loader2,
  Sparkles,
  ChevronRight,
} from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { Text, Badge } from "@/components/ui";
import type { InboxItem, InboxContentType, InboxStatus } from "@/types/connection-layer";

// Content type icons
const CONTENT_TYPE_ICONS: Record<InboxContentType, React.ComponentType<{ className?: string }>> = {
  text: FileText,
  voice: Mic,
  image: Image,
  link: LinkIcon,
  file: File,
};

// Status colors
const STATUS_CONFIG: Record<InboxStatus, { label: string; color: string }> = {
  inbox: { label: "New", color: "bg-blue-500/10 text-blue-400" },
  processing: { label: "Processing", color: "bg-yellow-500/10 text-yellow-400" },
  triaged: { label: "Triaged", color: "bg-purple-500/10 text-purple-400" },
  converted: { label: "Converted", color: "bg-green-500/10 text-green-400" },
  archived: { label: "Archived", color: "bg-gray-500/10 text-gray-400" },
};

interface InboxItemCardProps {
  item: InboxItem;
  onArchive?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onProcess?: (id: string) => Promise<void>;
  onSelect?: (item: InboxItem) => void;
  isSelected?: boolean;
  showActions?: boolean;
  className?: string;
}

export function InboxItemCard({
  item,
  onArchive,
  onDelete,
  onProcess,
  onSelect,
  isSelected = false,
  showActions = true,
  className,
}: InboxItemCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const ContentIcon = CONTENT_TYPE_ICONS[item.content_type];
  const statusConfig = STATUS_CONFIG[item.status];

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onArchive) return;
    setIsArchiving(true);
    try {
      await onArchive(item.id);
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(item.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleProcess = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onProcess) return;
    setIsProcessing(true);
    try {
      await onProcess(item.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(item.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Card
      className={cn(
        "bg-surface-800 border-surface-600 transition-all cursor-pointer",
        "hover:border-surface-500",
        isSelected && "border-eximia-500/50 ring-1 ring-eximia-500/20",
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Content Type Icon */}
          <div className="p-2 rounded-lg bg-surface-700 shrink-0">
            <ContentIcon className="size-4 text-gray-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("text-xs px-2 py-0.5 rounded-full", statusConfig.color)}>
                {statusConfig.label}
              </span>
              <Text size="xs" muted>
                {timeAgo}
              </Text>
            </div>

            <Text className="line-clamp-2 text-white">
              {item.content}
            </Text>

            {/* AI Analysis Suggestion */}
            {item.ai_analysis && item.status === "inbox" && (
              <div className="mt-2 flex items-center gap-2 p-2 bg-eximia-500/10 rounded-lg">
                <Sparkles className="size-3 text-eximia-400" />
                <Text size="xs" className="text-eximia-400">
                  Suggested: {item.ai_analysis.suggested_entity_type}
                </Text>
                <span className="text-xs text-eximia-400/60">
                  ({Math.round(item.ai_analysis.confidence * 100)}% confident)
                </span>
                <ChevronRight className="size-3 text-eximia-400 ml-auto" />
              </div>
            )}

            {/* Converted Info */}
            {item.status === "converted" && item.converted_to_type && (
              <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
                <Check className="size-3" />
                Converted to {item.converted_to_type}
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && item.status === "inbox" && (
            <div className="flex items-center gap-1 shrink-0">
              {onProcess && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleProcess}
                  disabled={isProcessing}
                  title="Process"
                >
                  {isProcessing ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                </Button>
              )}
              {onArchive && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleArchive}
                  disabled={isArchiving}
                  title="Archive"
                >
                  {isArchiving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Archive className="size-4" />
                  )}
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  title="Delete"
                  className="hover:text-red-400"
                >
                  {isDeleting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export type { InboxItemCardProps };
