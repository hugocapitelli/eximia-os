/**
 * ExímIA APP - LinkModal
 * BLOCO 1.3 - Connection Layer UI
 *
 * Modal for creating/editing entity links
 */

"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Button,
  Input,
  X,
  Link as LinkIcon,
  Search,
  Loader2,
  ChevronDown,
} from "@/components/ui";
import { Heading, Text, Label } from "@/components/ui";
import { EntityBadge } from "@/components/molecules";
import { useEntitySearch, type EntitySearchResult } from "@/hooks/use-entity-links";
import type {
  ModuleType,
  EntityType,
  CreateLinkInput,
} from "@/types/connection-layer";

// Relationship options
const RELATIONSHIPS = [
  { value: "supports", label: "Supports", description: "This entity supports the target" },
  { value: "related_to", label: "Related to", description: "General relationship" },
  { value: "derived_from", label: "Derived from", description: "This entity was created from the target" },
  { value: "parent_of", label: "Parent of", description: "This is a parent entity" },
  { value: "child_of", label: "Child of", description: "This is a child entity" },
  { value: "blocks", label: "Blocks", description: "This entity blocks the target" },
  { value: "blocked_by", label: "Blocked by", description: "This entity is blocked by target" },
  { value: "influences", label: "Influences", description: "This entity influences the target" },
] as const;

// Module configuration
const MODULE_CONFIG: Record<ModuleType, { label: string; color: string }> = {
  journey: { label: "Journey", color: "text-eximia-400" },
  academy: { label: "Academy", color: "text-blue-400" },
  strategy: { label: "Strategy", color: "text-purple-400" },
  brand: { label: "Brand", color: "text-pink-400" },
  prototyper: { label: "PrototypOS", color: "text-orange-400" },
  inbox: { label: "Inbox", color: "text-yellow-400" },
  system: { label: "System", color: "text-gray-400" },
};

// Entity type to simple display type mapping
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

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateLinkInput) => Promise<void>;
  sourceModule: ModuleType;
  sourceType: EntityType;
  sourceId: string;
  sourceTitle: string;
  existingLinkIds?: string[];
}

export function LinkModal({
  isOpen,
  onClose,
  onSubmit,
  sourceModule,
  sourceType,
  sourceId,
  sourceTitle,
  existingLinkIds = [],
}: LinkModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<EntitySearchResult | null>(null);
  const [relationship, setRelationship] = useState<string>("related_to");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);

  const { results, isSearching, search, clearResults } = useEntitySearch();

  // Filter out already linked entities
  const filteredResults = results.filter(
    (r) => !existingLinkIds.includes(r.id) && r.id !== sourceId
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        search(searchQuery);
      } else {
        clearResults();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, search, clearResults]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedEntity(null);
      setRelationship("related_to");
      clearResults();
    }
  }, [isOpen, clearResults]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntity) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        source_module: sourceModule,
        source_type: sourceType,
        source_id: sourceId,
        target_module: selectedEntity.module,
        target_type: selectedEntity.type,
        target_id: selectedEntity.id,
        relationship,
        bidirectional: true,
      });
      onClose();
    } catch (error) {
      console.error("Error creating link:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-surface-800 border border-surface-600 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-600">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-eximia-500/10">
              <LinkIcon className="size-5 text-eximia-400" />
            </div>
            <div>
              <Heading level={4}>Create Connection</Heading>
              <Text size="sm" muted>
                Link entities across modules
              </Text>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Source Entity */}
          <div className="space-y-2">
            <Label>From</Label>
            <div className="flex items-center gap-2 p-3 bg-surface-700 rounded-lg border border-surface-600">
              <EntityBadge
                type={entityToDisplayType(sourceType) as unknown}
                label={sourceTitle}
              />
              <Text size="sm" muted className="ml-auto">
                {MODULE_CONFIG[sourceModule].label}
              </Text>
            </div>
          </div>

          {/* Relationship */}
          <div className="space-y-2">
            <Label>Relationship</Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRelationshipDropdown(!showRelationshipDropdown)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2",
                  "bg-surface-700 border border-surface-600 rounded-lg",
                  "hover:border-surface-500 transition-colors"
                )}
              >
                <span className="text-sm text-white">
                  {RELATIONSHIPS.find((r) => r.value === relationship)?.label}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-gray-400 transition-transform",
                    showRelationshipDropdown && "rotate-180"
                  )}
                />
              </button>

              {showRelationshipDropdown && (
                <div className="absolute z-10 w-full mt-1 py-1 bg-surface-700 border border-surface-600 rounded-lg shadow-lg">
                  {RELATIONSHIPS.map((rel) => (
                    <button
                      key={rel.value}
                      type="button"
                      onClick={() => {
                        setRelationship(rel.value);
                        setShowRelationshipDropdown(false);
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-left hover:bg-surface-600 transition-colors",
                        relationship === rel.value && "bg-surface-600"
                      )}
                    >
                      <Text size="sm" className="text-white">
                        {rel.label}
                      </Text>
                      <Text size="xs" muted>
                        {rel.description}
                      </Text>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Target Entity Search */}
          <div className="space-y-2">
            <Label>To</Label>
            {selectedEntity ? (
              <div className="flex items-center gap-2 p-3 bg-surface-700 rounded-lg border border-eximia-500/50">
                <EntityBadge
                  type={entityToDisplayType(selectedEntity.type) as unknown}
                  label={selectedEntity.title}
                />
                <Text size="sm" muted className="ml-auto">
                  {MODULE_CONFIG[selectedEntity.module].label}
                </Text>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEntity(null)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search entities to link..."
                    className="pl-10"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 animate-spin" />
                  )}
                </div>

                {/* Search Results */}
                {filteredResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 py-1 bg-surface-700 border border-surface-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => {
                          setSelectedEntity(result);
                          setSearchQuery("");
                          clearResults();
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-surface-600 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <EntityBadge
                            type={entityToDisplayType(result.type) as unknown}
                            label={result.title}
                            showIcon={false}
                          />
                          <span
                            className={cn(
                              "text-xs ml-auto",
                              MODULE_CONFIG[result.module].color
                            )}
                          >
                            {MODULE_CONFIG[result.module].label}
                          </span>
                        </div>
                        {result.subtitle && (
                          <Text size="xs" muted className="mt-0.5">
                            {result.subtitle}
                          </Text>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery.length >= 2 && !isSearching && filteredResults.length === 0 && (
                  <div className="absolute z-10 w-full mt-1 p-4 bg-surface-700 border border-surface-600 rounded-lg">
                    <Text size="sm" muted className="text-center">
                      No entities found
                    </Text>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-600">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedEntity || isSubmitting}
              loading={isSubmitting}
            >
              <LinkIcon className="size-4 mr-2" />
              Create Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export type { LinkModalProps };
