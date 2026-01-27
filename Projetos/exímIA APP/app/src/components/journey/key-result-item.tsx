/**
 * ExímIA APP - KeyResultItem
 * BLOCO 3.1 - Journey Goals
 *
 * Component for displaying and editing a key result
 */

"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Button,
  Input,
  Badge,
  Text,
  Edit,
  Trash2,
  Check,
  X,
  TrendingUp,
  AlertTriangle,
} from "@/components/ui";
import type { KeyResult, KeyResultStatus, UpdateKeyResultInput } from "@/types/journey";
import { KEY_RESULT_STATUS_CONFIG, getProgressColor, formatProgress } from "@/types/journey";
import { ProgressBar } from "./goal-card";

// ═══════════════════════════════════════════════════════════════════
// KR STATUS BADGE
// ═══════════════════════════════════════════════════════════════════

interface KRStatusBadgeProps {
  status: KeyResultStatus;
}

function KRStatusBadge({ status }: KRStatusBadgeProps) {
  const config = KEY_RESULT_STATUS_CONFIG[status];

  return (
    <Badge variant="outline" size="sm" className={cn("border-current", config.color)}>
      {status === "at_risk" && <AlertTriangle className="size-3 mr-1" />}
      {config.label}
    </Badge>
  );
}

// ═══════════════════════════════════════════════════════════════════
// KEY RESULT ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface KeyResultItemProps {
  keyResult: KeyResult;
  onUpdate?: (id: string, input: UpdateKeyResultInput) => Promise<boolean>;
  onDelete?: (id: string) => Promise<boolean>;
  isEditable?: boolean;
  className?: string;
}

export function KeyResultItem({
  keyResult,
  onUpdate,
  onDelete,
  isEditable = true,
  className,
}: KeyResultItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentValue, setCurrentValue] = useState(keyResult.current_value.toString());
  const [title, setTitle] = useState(keyResult.title);

  // Format value display
  const formatValue = (value: number) => {
    if (keyResult.metric_type === "currency") {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    }
    if (keyResult.metric_type === "boolean") {
      return value >= keyResult.target_value ? "Yes" : "No";
    }
    return `${value}${keyResult.unit ? ` ${keyResult.unit}` : ""}`;
  };

  // Handle value update
  const handleUpdateValue = async () => {
    if (!onUpdate) return;

    const newValue = parseFloat(currentValue);
    if (isNaN(newValue)) return;

    setIsUpdating(true);
    const success = await onUpdate(keyResult.id, {
      current_value: newValue,
      title: title !== keyResult.title ? title : undefined,
    });

    if (success) {
      setIsEditing(false);
    }
    setIsUpdating(false);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!onDelete) return;

    if (window.confirm("Are you sure you want to delete this key result?")) {
      await onDelete(keyResult.id);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setCurrentValue(keyResult.current_value.toString());
    setTitle(keyResult.title);
    setIsEditing(false);
  };

  // Quick increment/decrement
  const handleQuickUpdate = async (delta: number) => {
    if (!onUpdate) return;

    const newValue = Math.max(0, keyResult.current_value + delta);
    setIsUpdating(true);
    await onUpdate(keyResult.id, { current_value: newValue });
    setIsUpdating(false);
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg bg-surface-700/50 border border-surface-600",
        "hover:border-surface-500 transition-colors",
        className
      )}
    >
      {isEditing ? (
        // Edit Mode
        <div className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Key result title"
            className="bg-surface-600"
          />

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Text size="xs" muted className="mb-1">
                Current Value
              </Text>
              <Input
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="bg-surface-600"
              />
            </div>

            <div className="flex-1">
              <Text size="xs" muted className="mb-1">
                Target Value
              </Text>
              <div className="h-10 flex items-center px-3 bg-surface-600 rounded-md text-gray-400">
                {formatValue(keyResult.target_value)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              <X className="size-4 mr-1" />
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleUpdateValue}
              disabled={isUpdating}
            >
              <Check className="size-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="size-4 text-eximia-400" />
                <Text weight="medium" className="truncate">
                  {keyResult.title}
                </Text>
              </div>
              {keyResult.description && (
                <Text size="sm" muted className="line-clamp-1">
                  {keyResult.description}
                </Text>
              )}
            </div>

            {isEditable && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="size-3" />
                </Button>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-red-400 hover:text-red-300"
                    onClick={handleDelete}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <ProgressBar progress={keyResult.progress} size="sm" />

          {/* Value & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Current / Target */}
              <div className="text-sm">
                <span className={getProgressColor(keyResult.progress)}>
                  {formatValue(keyResult.current_value)}
                </span>
                <span className="text-gray-500 mx-1">/</span>
                <span className="text-gray-400">
                  {formatValue(keyResult.target_value)}
                </span>
              </div>

              {/* Quick Update Buttons */}
              {isEditable && onUpdate && keyResult.metric_type === "number" && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 text-xs"
                    onClick={() => handleQuickUpdate(-1)}
                    disabled={isUpdating || keyResult.current_value <= 0}
                  >
                    -
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 text-xs"
                    onClick={() => handleQuickUpdate(1)}
                    disabled={isUpdating}
                  >
                    +
                  </Button>
                </div>
              )}
            </div>

            <KRStatusBadge status={keyResult.status} />
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// KEY RESULTS LIST COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface KeyResultsListProps {
  keyResults: KeyResult[];
  onUpdate?: (id: string, input: UpdateKeyResultInput) => Promise<boolean>;
  onDelete?: (id: string) => Promise<boolean>;
  onAdd?: () => void;
  isEditable?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function KeyResultsList({
  keyResults,
  onUpdate,
  onDelete,
  onAdd,
  isEditable = true,
  emptyMessage = "No key results yet",
  className,
}: KeyResultsListProps) {
  if (keyResults.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <TrendingUp className="size-8 mx-auto text-gray-500 mb-2" />
        <Text muted>{emptyMessage}</Text>
        {onAdd && isEditable && (
          <Button variant="ghost" size="sm" className="mt-2" onClick={onAdd}>
            Add Key Result
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {keyResults.map((kr) => (
        <KeyResultItem
          key={kr.id}
          keyResult={kr}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isEditable={isEditable}
        />
      ))}

      {onAdd && isEditable && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full border border-dashed border-surface-500"
          onClick={onAdd}
        >
          + Add Key Result
        </Button>
      )}
    </div>
  );
}

export type { KeyResultItemProps, KeyResultsListProps };
