/**
 * ExímIA APP - HabitForm
 * BLOCO 3.2 - Journey Habits
 *
 * Form for creating/editing habits
 */

"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Label,
  Text,
  X,
  Check,
  Loader2,
} from "@/components/ui";
import type {
  Habit,
  CreateHabitInput,
  UpdateHabitInput,
  HabitFrequency,
  DayOfWeek,
} from "@/types/journey";
import {
  FREQUENCY_LABELS,
  DAY_LABELS,
  DEFAULT_HABIT_ICONS,
  DEFAULT_HABIT_COLORS,
} from "@/types/journey";

interface HabitFormProps {
  habit?: Habit | null;
  onSubmit: (data: CreateHabitInput | UpdateHabitInput) => Promise<boolean>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function HabitForm({
  habit,
  onSubmit,
  onCancel,
  isLoading = false,
  className,
}: HabitFormProps) {
  const isEditing = !!habit;

  // Form state
  const [title, setTitle] = useState(habit?.title || "");
  const [description, setDescription] = useState(habit?.description || "");
  const [icon, setIcon] = useState(habit?.icon || "🎯");
  const [color, setColor] = useState(habit?.color || "#6366F1");
  const [frequency, setFrequency] = useState<HabitFrequency>(habit?.frequency || "daily");
  const [targetDays, setTargetDays] = useState<DayOfWeek[]>(habit?.target_days || []);
  const [targetCount, setTargetCount] = useState(habit?.target_count || 1);

  // UI state
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when habit changes
  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setDescription(habit.description || "");
      setIcon(habit.icon);
      setColor(habit.color);
      setFrequency(habit.frequency);
      setTargetDays(habit.target_days || []);
      setTargetCount(habit.target_count);
    }
  }, [habit]);

  // Toggle day selection
  const toggleDay = (day: DayOfWeek) => {
    setTargetDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (frequency === "weekly" && targetDays.length === 0) {
      newErrors.targetDays = "Select at least one day";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data: CreateHabitInput | UpdateHabitInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      icon,
      color,
      frequency,
      target_days: frequency === "weekly" ? targetDays : [],
      target_count: targetCount,
    };

    const success = await onSubmit(data);
    if (success && !isEditing) {
      // Reset form on successful create
      setTitle("");
      setDescription("");
      setIcon("🎯");
      setColor("#6366F1");
      setFrequency("daily");
      setTargetDays([]);
      setTargetCount(1);
    }
  };

  return (
    <Card className={cn("bg-surface-800 border-surface-600", className)}>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Habit" : "New Habit"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update your habit details" : "Create a new habit to track"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Icon */}
          <div className="flex gap-4">
            {/* Icon Picker */}
            <div className="relative">
              <Label className="mb-2 block">Icon</Label>
              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className={cn(
                  "size-12 rounded-lg border border-surface-600 bg-surface-700",
                  "flex items-center justify-center text-2xl",
                  "hover:border-surface-500 transition-colors"
                )}
              >
                {icon}
              </button>

              {showIconPicker && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowIconPicker(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 z-20 p-3 rounded-lg bg-surface-700 border border-surface-600 shadow-lg">
                    <div className="grid grid-cols-4 gap-2">
                      {DEFAULT_HABIT_ICONS.map((i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setIcon(i);
                            setShowIconPicker(false);
                          }}
                          className={cn(
                            "size-10 rounded-lg flex items-center justify-center text-xl",
                            "hover:bg-surface-600 transition-colors",
                            icon === i && "bg-surface-600 ring-2 ring-eximia-400"
                          )}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Title */}
            <div className="flex-1">
              <Label htmlFor="title" className="mb-2 block">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Morning meditation"
                error={!!errors.title}
              />
              {errors.title && (
                <Text size="xs" className="text-red-400 mt-1">
                  {errors.title}
                </Text>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="mb-2 block">
              Description (optional)
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why is this habit important?"
            />
          </div>

          {/* Color */}
          <div>
            <Label className="mb-2 block">Color</Label>
            <div className="flex gap-2">
              {DEFAULT_HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "size-8 rounded-full transition-transform",
                    "hover:scale-110",
                    color === c && "ring-2 ring-white ring-offset-2 ring-offset-surface-800"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <Label className="mb-2 block">Frequency</Label>
            <div className="flex gap-2">
              {(Object.keys(FREQUENCY_LABELS) as HabitFrequency[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    frequency === f
                      ? "bg-eximia-400 text-zinc-900"
                      : "bg-surface-700 text-gray-300 hover:bg-surface-600"
                  )}
                >
                  {FREQUENCY_LABELS[f]}
                </button>
              ))}
            </div>
          </div>

          {/* Target Days (for weekly) */}
          {frequency === "weekly" && (
            <div>
              <Label className="mb-2 block">Target Days</Label>
              <div className="flex gap-2">
                {([0, 1, 2, 3, 4, 5, 6] as DayOfWeek[]).map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "size-10 rounded-full text-sm font-medium transition-colors",
                      targetDays.includes(day)
                        ? "bg-eximia-400 text-zinc-900"
                        : "bg-surface-700 text-gray-300 hover:bg-surface-600"
                    )}
                  >
                    {DAY_LABELS[day]}
                  </button>
                ))}
              </div>
              {errors.targetDays && (
                <Text size="xs" className="text-red-400 mt-1">
                  {errors.targetDays}
                </Text>
              )}
            </div>
          )}

          {/* Target Count */}
          <div>
            <Label htmlFor="targetCount" className="mb-2 block">
              Times per {frequency === "daily" ? "day" : frequency === "weekly" ? "week" : "month"}
            </Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                disabled={targetCount <= 1}
              >
                -
              </Button>
              <span className="w-12 text-center text-lg font-semibold">{targetCount}</span>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => setTargetCount(targetCount + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-surface-600">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Check className="size-4 mr-2" />
              )}
              {isEditing ? "Save Changes" : "Create Habit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Modal version
interface HabitFormModalProps extends Omit<HabitFormProps, "className"> {
  isOpen: boolean;
  onClose: () => void;
}

export function HabitFormModal({
  isOpen,
  onClose,
  habit,
  onSubmit,
  isLoading,
}: HabitFormModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (data: CreateHabitInput | UpdateHabitInput) => {
    const success = await onSubmit(data);
    if (success) {
      onClose();
    }
    return success;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="absolute -top-10 right-0 text-gray-400 hover:text-white"
        >
          <X className="size-5" />
        </Button>
        <HabitForm
          habit={habit}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export type { HabitFormProps, HabitFormModalProps };
