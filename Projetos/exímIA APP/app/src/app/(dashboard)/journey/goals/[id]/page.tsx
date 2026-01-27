/**
 * ExímIA APP - Goal Detail Page
 * BLOCO 3.1 - Journey Goals
 *
 * Detail page for viewing and managing a single goal with key results
 */

"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/templates";
import { Header } from "@/components/organisms";
import { EntityCard } from "@/components/organisms/entity-card";
import {
  GoalForm,
  KeyResultForm,
  KeyResultsList,
  ProgressBar,
  StatusBadge,
  PriorityBadge,
  ScopeBadge,
  CategoryBadge,
} from "@/components/journey";
import { useGoal } from "@/hooks/use-goals";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Heading,
  Text,
  Badge,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  Calendar,
  Star,
  Layers,
  Target,
  Loader2,
  CheckCircle,
  X,
} from "@/components/ui";
import type { UpdateGoalInput, GoalStatus, MetricType } from "@/types/journey";
import {
  GOAL_STATUS_CONFIG,
  formatProgress,
  getProgressColor,
  canHaveChildren,
  getChildScope,
} from "@/types/journey";

// ═══════════════════════════════════════════════════════════════════
// MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

function Modal({ isOpen, onClose, children, size = "md" }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${sizeClasses[size]} mx-4 bg-surface-800 border border-surface-600 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STATUS SELECTOR
// ═══════════════════════════════════════════════════════════════════

interface StatusSelectorProps {
  currentStatus: GoalStatus;
  onStatusChange: (status: GoalStatus) => void;
  disabled?: boolean;
}

function StatusSelector({
  currentStatus,
  onStatusChange,
  disabled,
}: StatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const statuses: GoalStatus[] = [
    "not_started",
    "in_progress",
    "completed",
    "paused",
    "cancelled",
  ];

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2"
      >
        <StatusBadge status={currentStatus} size="default" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-surface-700 border border-surface-600 rounded-lg shadow-lg py-1">
            {statuses.map((status) => {
              const config = GOAL_STATUS_CONFIG[status];
              return (
                <button
                  key={status}
                  onClick={() => {
                    onStatusChange(status);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-surface-600 ${
                    status === currentStatus ? "bg-surface-600" : ""
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${config.bgColor.replace("/20", "")}`}
                  />
                  <span className={config.color}>{config.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GOAL DETAIL PAGE
// ═══════════════════════════════════════════════════════════════════

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params.id as string;

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isKeyResultModalOpen, setIsKeyResultModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Goal hook
  const {
    goal,
    keyResults,
    isLoading,
    error,
    updateGoal,
    addKeyResult,
    updateKeyResult,
    deleteKeyResult,
  } = useGoal({ id: goalId, includeKeyResults: true });

  // ═══════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════

  // Handle update goal
  const handleUpdateGoal = useCallback(
    async (data: UpdateGoalInput) => {
      setIsSubmitting(true);
      const success = await updateGoal(data);
      if (success) {
        setIsEditModalOpen(false);
      }
      setIsSubmitting(false);
    },
    [updateGoal]
  );

  // Handle status change
  const handleStatusChange = useCallback(
    async (status: GoalStatus) => {
      await updateGoal({
        status,
        ...(status === "completed" && { progress: 100, completed_at: new Date().toISOString() }),
      });
    },
    [updateGoal]
  );

  // Handle delete goal
  const handleDeleteGoal = useCallback(async () => {
    if (!window.confirm("Are you sure you want to delete this goal? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    // Note: This should use the deleteGoal from useGoals hook
    // For now, we'll redirect back
    router.push("/journey/goals");
  }, [router]);

  // Handle add key result
  const handleAddKeyResult = useCallback(
    async (data: {
      title: string;
      description?: string;
      metric_type: string;
      target_value: number;
      unit?: string;
    }) => {
      setIsSubmitting(true);
      const result = await addKeyResult({
        title: data.title,
        description: data.description,
        metric_type: data.metric_type as unknown,
        target_value: data.target_value,
        unit: data.unit,
      });

      if (result) {
        setIsKeyResultModalOpen(false);
      }
      setIsSubmitting(false);
    },
    [addKeyResult]
  );

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Not set";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════

  // Loading state
  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="size-8 text-eximia-400 animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  // Error state
  if (error || !goal) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <X className="size-12 text-red-400" />
          <Heading level={4} className="text-gray-300">
            Goal not found
          </Heading>
          <Text muted>{error || "The goal you're looking for doesn't exist."}</Text>
          <Link href="/journey/goals">
            <Button variant="primary">
              <ArrowLeft className="size-4 mr-2" />
              Back to Goals
            </Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Journey", href: "/journey" },
    { label: "Goals", href: "/journey/goals" },
    { label: goal.title },
  ];

  // Is overdue?
  const isOverdue =
    goal.target_date &&
    new Date(goal.target_date) < new Date() &&
    goal.status !== "completed" &&
    goal.status !== "cancelled";

  return (
    <DashboardShell>
      <Header
        breadcrumbs={breadcrumbs}
        title={goal.title}
        subtitle={goal.description}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="size-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300"
              onClick={handleDeleteGoal}
              disabled={isDeleting}
            >
              <Trash2 className="size-4 mr-2" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <Card className="bg-surface-800 border-surface-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="size-5 text-eximia-400" />
                    Progress
                  </CardTitle>
                  <StatusSelector
                    currentStatus={goal.status}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Text size="lg" weight="bold" className={getProgressColor(goal.progress)}>
                      {formatProgress(goal.progress)}
                    </Text>
                    {goal.status === "completed" && (
                      <Badge variant="success">
                        <CheckCircle className="size-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <ProgressBar progress={goal.progress} size="lg" />
                </div>
              </CardContent>
            </Card>

            {/* Key Results */}
            <Card className="bg-surface-800 border-surface-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="size-5 text-blue-400" />
                    Key Results
                    {keyResults.length > 0 && (
                      <Badge variant="secondary" size="sm">
                        {keyResults.length}
                      </Badge>
                    )}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsKeyResultModalOpen(true)}
                  >
                    <Plus className="size-4 mr-1" />
                    Add KR
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <KeyResultsList
                  keyResults={keyResults}
                  onUpdate={updateKeyResult}
                  onDelete={deleteKeyResult}
                  onAdd={() => setIsKeyResultModalOpen(true)}
                  emptyMessage="Add key results to track measurable outcomes"
                />
              </CardContent>
            </Card>

            {/* Entity Card with Connections */}
            <EntityCard
              module="journey"
              entityType="goal"
              entityId={goal.id}
              title={goal.title}
              description={goal.description}
              showLinks
              maxVisibleLinks={5}
            />
          </div>

          {/* Right Column - Meta Info */}
          <div className="space-y-6">
            {/* Details Card */}
            <Card className="bg-surface-800 border-surface-600">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Scope */}
                <div className="flex items-center justify-between">
                  <Text size="sm" muted>
                    Scope
                  </Text>
                  <ScopeBadge scope={goal.scope} />
                </div>

                {/* Category */}
                <div className="flex items-center justify-between">
                  <Text size="sm" muted>
                    Category
                  </Text>
                  <CategoryBadge category={goal.category} />
                </div>

                {/* Priority */}
                <div className="flex items-center justify-between">
                  <Text size="sm" muted>
                    Priority
                  </Text>
                  <PriorityBadge priority={goal.priority} />
                </div>

                {/* Dates */}
                <div className="border-t border-surface-600 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Text size="sm" muted className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      Start Date
                    </Text>
                    <Text size="sm">{formatDate(goal.start_date)}</Text>
                  </div>

                  <div className="flex items-center justify-between">
                    <Text size="sm" muted className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      Target Date
                    </Text>
                    <Text
                      size="sm"
                      className={isOverdue ? "text-red-400" : undefined}
                    >
                      {formatDate(goal.target_date)}
                      {isOverdue && " (Overdue)"}
                    </Text>
                  </div>

                  {goal.completed_at && (
                    <div className="flex items-center justify-between">
                      <Text size="sm" muted className="flex items-center gap-1">
                        <CheckCircle className="size-3" />
                        Completed
                      </Text>
                      <Text size="sm" className="text-green-400">
                        {formatDate(goal.completed_at)}
                      </Text>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {goal.tags && goal.tags.length > 0 && (
                  <div className="border-t border-surface-600 pt-4">
                    <Text size="sm" muted className="mb-2">
                      Tags
                    </Text>
                    <div className="flex flex-wrap gap-1">
                      {goal.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Why This Matters */}
            {goal.why && (
              <Card className="bg-surface-800 border-surface-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="size-5 text-yellow-400" />
                    Why This Matters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Text className="italic text-gray-300">"{goal.why}"</Text>
                </CardContent>
              </Card>
            )}

            {/* Sub-Goals Quick Link */}
            {canHaveChildren(goal.scope) && (
              <Card className="bg-surface-800 border-surface-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="size-5 text-purple-400" />
                    Sub-Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/journey/goals?parent_id=${goal.id}`}
                    className="block"
                  >
                    <Button variant="ghost" size="sm" className="w-full">
                      <Plus className="size-4 mr-2" />
                      Create {getChildScope(goal.scope)} goal
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Goal Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        size="lg"
      >
        <GoalForm
          goal={goal}
          onSubmit={handleUpdateGoal}
          onCancel={() => setIsEditModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Add Key Result Modal */}
      <Modal
        isOpen={isKeyResultModalOpen}
        onClose={() => setIsKeyResultModalOpen(false)}
        size="md"
      >
        <KeyResultForm
          goalId={goal.id}
          onSubmit={handleAddKeyResult}
          onCancel={() => setIsKeyResultModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </DashboardShell>
  );
}
