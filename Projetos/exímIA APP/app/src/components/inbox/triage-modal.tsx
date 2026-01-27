/**
 * ExímIA APP - TriageModal
 * BLOCO 2.2 - Inbox AI Processing
 *
 * Modal for reviewing and accepting AI suggestions
 */

"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Button,
  X,
  Sparkles,
  Check,
  Edit,
  Loader2,
  Target,
  CheckCircle,
  BookOpen,
  Compass,
  Folder,
  ChevronDown,
} from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { Heading, Text, Label, Input } from "@/components/ui";
import type {
  InboxItem,
  InboxAIAnalysis,
  ModuleType,
  EntityType,
} from "@/types/connection-layer";

// Entity type icons and colors
const ENTITY_CONFIG: Record<
  EntityType,
  { icon: React.ComponentType<{ className?: string }>; label: string; color: string }
> = {
  goal: { icon: Target, label: "Goal", color: "text-eximia-400" },
  habit: { icon: CheckCircle, label: "Habit", color: "text-green-400" },
  book: { icon: BookOpen, label: "Book", color: "text-amber-400" },
  event: { icon: Compass, label: "Event", color: "text-orange-400" },
  course: { icon: BookOpen, label: "Course", color: "text-blue-400" },
  lesson: { icon: BookOpen, label: "Lesson", color: "text-blue-400" },
  session: { icon: Compass, label: "Session", color: "text-purple-400" },
  initiative: { icon: Folder, label: "Initiative", color: "text-purple-400" },
  cycle: { icon: Compass, label: "Cycle", color: "text-purple-400" },
  kpi: { icon: Target, label: "KPI", color: "text-purple-400" },
  brand_identity: { icon: Folder, label: "Brand", color: "text-pink-400" },
  asset: { icon: Folder, label: "Asset", color: "text-pink-400" },
  palette: { icon: Folder, label: "Palette", color: "text-pink-400" },
  project: { icon: Folder, label: "Project", color: "text-orange-400" },
  prd: { icon: Folder, label: "PRD", color: "text-orange-400" },
  design_system: { icon: Folder, label: "Design System", color: "text-orange-400" },
  inbox_item: { icon: Folder, label: "Inbox", color: "text-yellow-400" },
};

// Module config
const MODULE_CONFIG: Record<ModuleType, { label: string; color: string }> = {
  journey: { label: "Journey", color: "bg-eximia-500/10 text-eximia-400" },
  academy: { label: "Academy", color: "bg-blue-500/10 text-blue-400" },
  strategy: { label: "Strategy", color: "bg-purple-500/10 text-purple-400" },
  brand: { label: "Brand", color: "bg-pink-500/10 text-pink-400" },
  prototyper: { label: "PrototypOS", color: "bg-orange-500/10 text-orange-400" },
  inbox: { label: "Inbox", color: "bg-yellow-500/10 text-yellow-400" },
  system: { label: "System", color: "bg-gray-500/10 text-gray-400" },
};

// Available destinations
const DESTINATIONS: { module: ModuleType; type: EntityType }[] = [
  { module: "journey", type: "goal" },
  { module: "journey", type: "habit" },
  { module: "journey", type: "book" },
  { module: "strategy", type: "initiative" },
  { module: "academy", type: "course" },
];

interface TriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InboxItem;
  analysis: InboxAIAnalysis;
  onAccept: (
    item: InboxItem,
    analysis: InboxAIAnalysis,
    customTitle?: string
  ) => Promise<void>;
  onDismiss: (item: InboxItem) => Promise<void>;
}

export function TriageModal({
  isOpen,
  onClose,
  item,
  analysis,
  onAccept,
  onDismiss,
}: TriageModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [customTitle, setCustomTitle] = useState(
    analysis.extracted_entities?.title || item.content
  );
  const [selectedDestination, setSelectedDestination] = useState<{
    module: ModuleType;
    type: EntityType;
  }>({
    module: analysis.suggested_module,
    type: analysis.suggested_entity_type,
  });
  const [showDestinationPicker, setShowDestinationPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  const EntityIcon = ENTITY_CONFIG[selectedDestination.type].icon;
  const confidencePercent = Math.round(analysis.confidence * 100);

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      const modifiedAnalysis: InboxAIAnalysis = {
        ...analysis,
        suggested_module: selectedDestination.module,
        suggested_entity_type: selectedDestination.type,
        extracted_entities: {
          ...analysis.extracted_entities,
          title: customTitle,
        },
      };
      await onAccept(item, modifiedAnalysis, customTitle);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = async () => {
    setIsDismissing(true);
    try {
      await onDismiss(item);
      onClose();
    } finally {
      setIsDismissing(false);
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
              <Sparkles className="size-5 text-eximia-400" />
            </div>
            <div>
              <Heading level={4}>Smart Triage</Heading>
              <Text size="sm" muted>
                AI-powered suggestion
              </Text>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Original Content */}
          <div className="space-y-2">
            <Label>Original capture</Label>
            <Card className="bg-surface-700 border-surface-600">
              <CardContent className="p-4">
                <Text className="text-white">{item.content}</Text>
              </CardContent>
            </Card>
          </div>

          {/* AI Suggestion */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>AI Suggestion</Label>
              <span className="text-xs text-eximia-400">
                {confidencePercent}% confident
              </span>
            </div>

            {/* Destination selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDestinationPicker(!showDestinationPicker)}
                className={cn(
                  "w-full flex items-center gap-3 p-4",
                  "bg-surface-700 border border-surface-600 rounded-lg",
                  "hover:border-surface-500 transition-colors"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    MODULE_CONFIG[selectedDestination.module].color
                  )}
                >
                  <EntityIcon className="size-5" />
                </div>
                <div className="flex-1 text-left">
                  <Text weight="medium" className="text-white">
                    {ENTITY_CONFIG[selectedDestination.type].label}
                  </Text>
                  <Text size="sm" muted>
                    {MODULE_CONFIG[selectedDestination.module].label}
                  </Text>
                </div>
                <ChevronDown
                  className={cn(
                    "size-5 text-gray-400 transition-transform",
                    showDestinationPicker && "rotate-180"
                  )}
                />
              </button>

              {/* Dropdown */}
              {showDestinationPicker && (
                <div className="absolute z-10 w-full mt-1 py-1 bg-surface-700 border border-surface-600 rounded-lg shadow-lg">
                  {DESTINATIONS.map((dest) => {
                    const DestIcon = ENTITY_CONFIG[dest.type].icon;
                    const isSelected =
                      dest.module === selectedDestination.module &&
                      dest.type === selectedDestination.type;

                    return (
                      <button
                        key={`${dest.module}-${dest.type}`}
                        type="button"
                        onClick={() => {
                          setSelectedDestination(dest);
                          setShowDestinationPicker(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-600 transition-colors",
                          isSelected && "bg-surface-600"
                        )}
                      >
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            MODULE_CONFIG[dest.module].color
                          )}
                        >
                          <DestIcon className="size-4" />
                        </div>
                        <div className="text-left">
                          <Text size="sm" className="text-white">
                            {ENTITY_CONFIG[dest.type].label}
                          </Text>
                          <Text size="xs" muted>
                            {MODULE_CONFIG[dest.module].label}
                          </Text>
                        </div>
                        {isSelected && (
                          <Check className="size-4 text-eximia-400 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reasoning */}
            {analysis.reasoning && (
              <Text size="xs" muted className="italic">
                "{analysis.reasoning}"
              </Text>
            )}
          </div>

          {/* Title Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Title</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="size-3 mr-1" />
                {isEditing ? "Done" : "Edit"}
              </Button>
            </div>
            {isEditing ? (
              <Input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="bg-surface-700 border-surface-600"
              />
            ) : (
              <Card className="bg-surface-700 border-surface-600">
                <CardContent className="p-3">
                  <Text className="text-white">{customTitle}</Text>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Extracted Info */}
          {analysis.extracted_entities?.category && (
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-500">Category:</span>{" "}
                <span className="text-white">
                  {analysis.extracted_entities.category}
                </span>
              </div>
              {analysis.extracted_entities.tags &&
                analysis.extracted_entities.tags.length > 0 && (
                  <div>
                    <span className="text-gray-500">Tags:</span>{" "}
                    <span className="text-white">
                      {analysis.extracted_entities.tags.join(", ")}
                    </span>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-600">
          <Button
            variant="ghost"
            onClick={handleDismiss}
            disabled={isDismissing || isSubmitting}
            loading={isDismissing}
          >
            Dismiss
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isSubmitting || isDismissing || !customTitle.trim()}
              loading={isSubmitting}
            >
              <Check className="size-4 mr-2" />
              Accept & Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { TriageModalProps };
