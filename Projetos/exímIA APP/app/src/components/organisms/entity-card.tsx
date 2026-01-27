/**
 * ExímIA APP - EntityCard
 * BLOCO 1.3 - Connection Layer UI
 *
 * Card component that displays an entity with its connections
 */

"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";
import {
  Button,
  Plus,
  Link as LinkIcon,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "@/components/ui";
import { Text } from "@/components/ui";
import { EntityLink, EntityBadge } from "@/components/molecules";
import { LinkModal } from "./link-modal";
import { useEntityLinks } from "@/hooks/use-entity-links";
import type {
  ModuleType,
  EntityType,
  LinkedEntity,
  CreateLinkInput,
} from "@/types/connection-layer";

// Entity display type mapping
const entityToDisplayType = (type: EntityType): string => {
  const mapping: Record<EntityType, string> = {
    goal: "goal",
    habit: "habit",
    book: "resource",
    event: "event",
    course: "resource",
    lesson: "resource",
    session: "event",
    initiative: "project",
    cycle: "area",
    kpi: "goal",
    brand_identity: "area",
    asset: "resource",
    palette: "resource",
    project: "project",
    prd: "note",
    design_system: "resource",
    inbox_item: "task",
  };
  return mapping[type] || "note";
};

// Route mapping for entities
const getEntityRoute = (module: ModuleType, type: EntityType, id: string): string => {
  const routes: Record<ModuleType, Record<string, string>> = {
    journey: {
      goal: `/journey/goals/${id}`,
      habit: `/journey/habits/${id}`,
      book: `/journey/library/${id}`,
      event: `/journey/calendar/${id}`,
    },
    academy: {
      course: `/academy/courses/${id}`,
      lesson: `/academy/lessons/${id}`,
      session: `/academy/sessions/${id}`,
    },
    strategy: {
      initiative: `/strategy/initiatives/${id}`,
      cycle: `/strategy/cycles/${id}`,
      kpi: `/strategy/kpis/${id}`,
    },
    brand: {
      brand_identity: `/brand/identity/${id}`,
      asset: `/brand/assets/${id}`,
      palette: `/brand/palettes/${id}`,
    },
    prototyper: {
      project: `/prototyper/projects/${id}`,
      prd: `/prototyper/prds/${id}`,
      design_system: `/prototyper/design-systems/${id}`,
    },
    inbox: {
      inbox_item: `/inbox/${id}`,
    },
    system: {},
  };

  return routes[module]?.[type] || `/${module}/${type}s/${id}`;
};

// Module icons/colors
const MODULE_CONFIG: Record<ModuleType, { icon: string; color: string; label: string }> = {
  journey: { icon: "🎯", color: "text-eximia-400", label: "Journey" },
  academy: { icon: "📚", color: "text-blue-400", label: "Academy" },
  strategy: { icon: "🧭", color: "text-purple-400", label: "Strategy" },
  brand: { icon: "🎨", color: "text-pink-400", label: "Brand" },
  prototyper: { icon: "⚡", color: "text-orange-400", label: "PrototypOS" },
  inbox: { icon: "📥", color: "text-yellow-400", label: "Inbox" },
  system: { icon: "⚙️", color: "text-gray-400", label: "System" },
};

interface EntityCardProps {
  // Entity info
  module: ModuleType;
  entityType: EntityType;
  entityId: string;
  title: string;
  description?: string;

  // Optional slots
  children?: React.ReactNode;
  footer?: React.ReactNode;

  // Link management
  showLinks?: boolean;
  maxVisibleLinks?: number;
  onLinkCreated?: (link: unknown) => void;
  onLinkDeleted?: (linkId: string) => void;

  // Styling
  className?: string;
}

export function EntityCard({
  module,
  entityType,
  entityId,
  title,
  description,
  children,
  footer,
  showLinks = true,
  maxVisibleLinks = 3,
  onLinkCreated,
  onLinkDeleted,
  className,
}: EntityCardProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isLinksExpanded, setIsLinksExpanded] = useState(false);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

  const {
    links,
    isLoading: isLoadingLinks,
    fetchLinks,
    createLink,
    deleteLink,
    updateLinkAccess,
  } = useEntityLinks({ entityType, entityId });

  // Fetch links on mount
  useEffect(() => {
    if (showLinks && entityId) {
      fetchLinks();
    }
  }, [showLinks, entityId, fetchLinks]);

  // Handle link creation
  const handleCreateLink = async (input: CreateLinkInput) => {
    const newLink = await createLink(input);
    if (newLink && onLinkCreated) {
      onLinkCreated(newLink);
    }
  };

  // Handle link deletion
  const handleDeleteLink = async (linkId: string) => {
    setDeletingLinkId(linkId);
    const success = await deleteLink(linkId);
    if (success && onLinkDeleted) {
      onLinkDeleted(linkId);
    }
    setDeletingLinkId(null);
  };

  // Handle link click
  const handleLinkClick = (link: LinkedEntity) => {
    updateLinkAccess(link.id);
  };

  // Group links by direction
  const incomingLinks = links.filter((l) => l.direction === "incoming");
  const outgoingLinks = links.filter((l) => l.direction === "outgoing");
  const visibleLinks = isLinksExpanded ? links : links.slice(0, maxVisibleLinks);
  const hasMoreLinks = links.length > maxVisibleLinks;

  return (
    <>
      <Card className={cn("bg-surface-800 border-surface-600", className)}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span>{MODULE_CONFIG[module].icon}</span>
                <span
                  className={cn("text-xs font-medium", MODULE_CONFIG[module].color)}
                >
                  {MODULE_CONFIG[module].label}
                </span>
              </div>
              <CardTitle className="truncate">{title}</CardTitle>
              {description && (
                <CardDescription className="line-clamp-2">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        {children && <CardContent>{children}</CardContent>}

        {/* Links Section */}
        {showLinks && (
          <CardContent className="pt-0">
            <div className="border-t border-surface-600 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <LinkIcon className="size-4 text-gray-400" />
                  <Text size="sm" weight="medium" className="text-gray-300">
                    Connections
                  </Text>
                  {links.length > 0 && (
                    <span className="px-1.5 py-0.5 text-xs bg-surface-600 rounded-full text-gray-400">
                      {links.length}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLinkModalOpen(true)}
                >
                  <Plus className="size-4 mr-1" />
                  Add
                </Button>
              </div>

              {isLoadingLinks ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="size-5 text-gray-400 animate-spin" />
                </div>
              ) : links.length === 0 ? (
                <div className="py-4 text-center">
                  <Text size="sm" muted>
                    No connections yet
                  </Text>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setIsLinkModalOpen(true)}
                  >
                    <Plus className="size-4 mr-1" />
                    Create first connection
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {visibleLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-surface-700/50 hover:bg-surface-700 transition-colors group"
                    >
                      <span className="text-xs text-gray-500 w-16 shrink-0">
                        {link.direction === "incoming" ? "← from" : "→ to"}
                      </span>
                      <Link
                        href={getEntityRoute(link.linked_module, link.linked_type, link.linked_id)}
                        onClick={() => handleLinkClick(link)}
                        className="flex-1 min-w-0"
                      >
                        <div className="flex items-center gap-2">
                          <EntityBadge
                            type={entityToDisplayType(link.linked_type) as unknown}
                            label={link.linked_type}
                          />
                          <span
                            className={cn(
                              "text-xs",
                              MODULE_CONFIG[link.linked_module].color
                            )}
                          >
                            {MODULE_CONFIG[link.linked_module].icon}
                          </span>
                          <ExternalLink className="size-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                      <span className="text-xs text-gray-500 px-2 py-0.5 bg-surface-600 rounded">
                        {link.relationship.replace(/_/g, " ")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteLink(link.id);
                        }}
                        disabled={deletingLinkId === link.id}
                      >
                        {deletingLinkId === link.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Trash2 className="size-3 text-red-400" />
                        )}
                      </Button>
                    </div>
                  ))}

                  {hasMoreLinks && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => setIsLinksExpanded(!isLinksExpanded)}
                    >
                      {isLinksExpanded ? (
                        <>
                          <ChevronUp className="size-4 mr-1" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="size-4 mr-1" />
                          Show {links.length - maxVisibleLinks} more
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        )}

        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>

      {/* Link Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSubmit={handleCreateLink}
        sourceModule={module}
        sourceType={entityType}
        sourceId={entityId}
        sourceTitle={title}
        existingLinkIds={links.map((l) => l.linked_id)}
      />
    </>
  );
}

export type { EntityCardProps };
