/**
 * ExímIA APP - GoalForm
 * BLOCO 3.1 - Journey Goals
 *
 * Form component for creating and editing goals
 */

"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Button,
  Input,
  Text,
  Heading,
  X,
  Target,
  Calendar,
  Star,
  Loader2,
} from "@/components/ui";
import { FormField } from "@/components/molecules";
import type {
  Goal,
  CreateGoalInput,
  UpdateGoalInput,
  GoalScope,
  GoalCategory,
  GoalPriority,
} from "@/types/journey";
import {
  GOAL_SCOPE_CONFIG,
  GOAL_CATEGORY_CONFIG,
  GOAL_PRIORITY_CONFIG,
  getChildScope,
} from "@/types/journey";

// ═══════════════════════════════════════════════════════════════════
// SELECT COMPONENTS
// ═══════════════════════════════════════════════════════════════════

interface SelectOption {
  value: string;
  label: string;
  description?: string;
  color?: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

function SelectField({
  label,
  value,
  options,
  onChange,
  error,
  required,
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-200">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full h-10 px-3 rounded-md bg-surface-700 border border-surface-600",
          "text-gray-200 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-eximia-400 focus:border-transparent",
          error && "border-red-400 focus:ring-red-400"
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <Text size="xs" className="text-red-400">{error}</Text>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GOAL FORM COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface GoalFormProps {
  goal?: Goal | null;
  parentGoal?: Goal | null;
  initialScope?: GoalScope;
  onSubmit: (data: CreateGoalInput | UpdateGoalInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export function GoalForm({
  goal,
  parentGoal,
  initialScope,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className,
}: GoalFormProps) {
  const isEditing = !!goal;

  // Determine initial scope
  const getInitialScope = (): GoalScope => {
    if (goal) return goal.scope;
    if (initialScope) return initialScope;
    if (parentGoal) return getChildScope(parentGoal.scope) || "monthly";
    return "monthly";
  };

  // Form state
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [why, setWhy] = useState(goal?.why || "");
  const [scope, setScope] = useState<GoalScope>(getInitialScope());
  const [category, setCategory] = useState<GoalCategory>(goal?.category || "personal");
  const [priority, setPriority] = useState<GoalPriority>(goal?.priority || "medium");
  const [targetDate, setTargetDate] = useState(goal?.target_date || "");
  const [startDate, setStartDate] = useState(goal?.start_date || "");

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Scope options
  const scopeOptions: SelectOption[] = Object.entries(GOAL_SCOPE_CONFIG).map(
    ([value, config]) => ({
      value,
      label: config.label,
      description: config.description,
    })
  );

  // Category options
  const categoryOptions: SelectOption[] = Object.entries(GOAL_CATEGORY_CONFIG).map(
    ([value, config]) => ({
      value,
      label: config.label,
      color: config.color,
    })
  );

  // Priority options
  const priorityOptions: SelectOption[] = Object.entries(GOAL_PRIORITY_CONFIG).map(
    ([value, config]) => ({
      value,
      label: config.label,
      color: config.color,
    })
  );

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (targetDate && startDate && new Date(targetDate) < new Date(startDate)) {
      newErrors.targetDate = "Target date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const formData: CreateGoalInput | UpdateGoalInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      why: why.trim() || undefined,
      scope,
      category,
      priority,
      start_date: startDate || undefined,
      target_date: targetDate || undefined,
      parent_id: parentGoal?.id,
    };

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="size-6 text-eximia-400" />
          <Heading level={4}>
            {isEditing ? "Edit Goal" : "Create Goal"}
          </Heading>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
        >
          <X className="size-5" />
        </Button>
      </div>

      {/* Parent Goal Info */}
      {parentGoal && (
        <div className="p-3 bg-surface-700/50 rounded-lg border border-surface-600">
          <Text size="xs" muted className="mb-1">
            Parent Goal
          </Text>
          <Text weight="medium">{parentGoal.title}</Text>
        </div>
      )}

      {/* Title */}
      <FormField label="Goal Title" required error={errors.title}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to achieve?"
          autoFocus
        />
      </FormField>

      {/* Description */}
      <FormField label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your goal in detail..."
          rows={3}
          className={cn(
            "w-full px-3 py-2 rounded-md bg-surface-700 border border-surface-600",
            "text-gray-200 text-sm placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-eximia-400 focus:border-transparent",
            "resize-none"
          )}
        />
      </FormField>

      {/* Why (Purpose) */}
      <FormField
        label="Why This Matters"
        hint="Your motivation and purpose for this goal"
      >
        <div className="relative">
          <Star className="absolute left-3 top-3 size-4 text-yellow-400" />
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="Why is this goal important to you?"
            rows={2}
            className={cn(
              "w-full pl-10 pr-3 py-2 rounded-md bg-surface-700 border border-surface-600",
              "text-gray-200 text-sm placeholder:text-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-eximia-400 focus:border-transparent",
              "resize-none"
            )}
          />
        </div>
      </FormField>

      {/* Scope & Category Row */}
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Scope"
          value={scope}
          options={scopeOptions}
          onChange={(v) => setScope(v as GoalScope)}
          required
        />

        <SelectField
          label="Category"
          value={category}
          options={categoryOptions}
          onChange={(v) => setCategory(v as GoalCategory)}
        />
      </div>

      {/* Priority */}
      <SelectField
        label="Priority"
        value={priority}
        options={priorityOptions}
        onChange={(v) => setPriority(v as GoalPriority)}
      />

      {/* Date Row */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Start Date">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-10"
            />
          </div>
        </FormField>

        <FormField label="Target Date" error={errors.targetDate}>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="pl-10"
            />
          </div>
        </FormField>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-600">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              {isEditing ? "Saving..." : "Creating..."}
            </>
          ) : (
            <>
              {isEditing ? "Save Changes" : "Create Goal"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════
// KEY RESULT FORM COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface KeyResultFormProps {
  goalId: string;
  onSubmit: (data: {
    title: string;
    description?: string;
    metric_type: string;
    target_value: number;
    unit?: string;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function KeyResultForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: KeyResultFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [metricType, setMetricType] = useState("percentage");
  const [targetValue, setTargetValue] = useState("100");
  const [unit, setUnit] = useState("%");

  const metricTypeOptions: SelectOption[] = [
    { value: "percentage", label: "Percentage (%)" },
    { value: "number", label: "Number" },
    { value: "currency", label: "Currency (R$)" },
    { value: "boolean", label: "Yes/No" },
  ];

  // Handle metric type change - update unit and target value
  const handleMetricTypeChange = (newType: string) => {
    setMetricType(newType);
    if (newType === "percentage") {
      setUnit("%");
      setTargetValue("100");
    } else if (newType === "currency") {
      setUnit("R$");
    } else if (newType === "boolean") {
      setUnit("");
      setTargetValue("1");
    } else {
      setUnit("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      metric_type: metricType,
      target_value: parseFloat(targetValue) || 100,
      unit: unit || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Heading level={5}>Add Key Result</Heading>

      <FormField label="Title" required>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Increase revenue by 20%"
          autoFocus
        />
      </FormField>

      <FormField label="Description">
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details..."
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Metric Type"
          value={metricType}
          options={metricTypeOptions}
          onChange={handleMetricTypeChange}
        />

        <FormField label="Target Value">
          <div className="flex gap-2">
            <Input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              min={0}
              className="flex-1"
            />
            {metricType !== "boolean" && (
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Unit"
                className="w-20"
              />
            )}
          </div>
        </FormField>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? (
            <Loader2 className="size-4 mr-2 animate-spin" />
          ) : null}
          Add Key Result
        </Button>
      </div>
    </form>
  );
}

export type { GoalFormProps, KeyResultFormProps };
