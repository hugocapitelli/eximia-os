/**
 * ExímIA APP - Goals Page
 * BLOCO 3.1 - Journey Goals
 *
 * Main page for managing goals with CRUD operations
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { DashboardShell } from "@/components/templates";
import { Header } from "@/components/organisms";
import {
  GoalList,
  GoalForm,
  KeyResultForm,
} from "@/components/journey";
import { useGoals } from "@/hooks/use-goals";
import {
  Button,
  Plus,
  Target,
  TrendingUp,
  Loader2,
} from "@/components/ui";
import { MetricCard } from "@/components/molecules";
import type {
  Goal,
  GoalFilters,
  CreateGoalInput,
  UpdateGoalInput,
} from "@/types/journey";
import type { MetricType } from "@/types/journey";

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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={`relative w-full ${sizeClasses[size]} mx-4 bg-surface-800 border border-surface-600 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GOALS PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function GoalsPage() {
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isKeyResultModalOpen, setIsKeyResultModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [parentGoal, setParentGoal] = useState<Goal | null>(null);
  const [selectedGoalIdForKR, setSelectedGoalIdForKR] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<GoalFilters>({});

  // Goals hook
  const {
    goals,
    isLoading,
    error,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    addKeyResult,
  } = useGoals({ autoFetch: true, filters });

  // Refresh when filters change
  useEffect(() => {
    fetchGoals(filters);
  }, [filters, fetchGoals]);

  // ═══════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════

  // Open create modal
  const handleOpenCreate = useCallback((parent?: Goal) => {
    setParentGoal(parent || null);
    setSelectedGoal(null);
    setIsCreateModalOpen(true);
  }, []);

  // Open edit modal
  const handleOpenEdit = useCallback((goal: Goal) => {
    setSelectedGoal(goal);
    setIsEditModalOpen(true);
  }, []);

  // Open key result modal
  const handleOpenKeyResult = useCallback((goalId: string) => {
    setSelectedGoalIdForKR(goalId);
    setIsKeyResultModalOpen(true);
  }, []);

  // Handle create goal
  const handleCreateGoal = useCallback(
    async (data: CreateGoalInput | UpdateGoalInput) => {
      setIsSubmitting(true);
      const result = await createGoal(data as CreateGoalInput);
      if (result) {
        setIsCreateModalOpen(false);
        setParentGoal(null);
      }
      setIsSubmitting(false);
    },
    [createGoal]
  );

  // Handle update goal
  const handleUpdateGoal = useCallback(
    async (data: CreateGoalInput | UpdateGoalInput) => {
      if (!selectedGoal) return;

      setIsSubmitting(true);
      const success = await updateGoal(selectedGoal.id, data as UpdateGoalInput);
      if (success) {
        setIsEditModalOpen(false);
        setSelectedGoal(null);
      }
      setIsSubmitting(false);
    },
    [selectedGoal, updateGoal]
  );

  // Handle delete goal
  const handleDeleteGoal = useCallback(
    async (goalId: string) => {
      if (!window.confirm("Are you sure you want to delete this goal?")) return;
      await deleteGoal(goalId);
    },
    [deleteGoal]
  );

  // Handle add child goal
  const handleAddChild = useCallback(
    async (goalId: string) => {
      const goal = goals.find((g) => g.id === goalId);
      if (goal) {
        handleOpenCreate(goal);
      }
    },
    [goals, handleOpenCreate]
  );

  // Handle add key result
  const handleAddKeyResult = useCallback(
    async (data: {
      title: string;
      description?: string;
      metric_type: string;
      target_value: number;
      unit?: string;
    }) => {
      if (!selectedGoalIdForKR) return;

      setIsSubmitting(true);
      const result = await addKeyResult({
        goal_id: selectedGoalIdForKR,
        title: data.title,
        description: data.description,
        metric_type: data.metric_type as MetricType,
        target_value: data.target_value,
        unit: data.unit,
      });

      if (result) {
        setIsKeyResultModalOpen(false);
        setSelectedGoalIdForKR(null);
        await fetchGoals(filters);
      }
      setIsSubmitting(false);
    },
    [selectedGoalIdForKR, addKeyResult, fetchGoals, filters]
  );

  // Handle view links (placeholder)
  const handleViewLinks = useCallback((goalId: string) => {
    // TODO: Implement link modal
    logger.info("View links for goal:", goalId);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((newFilters: GoalFilters) => {
    setFilters(newFilters);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchGoals(filters);
  }, [fetchGoals, filters]);

  // ═══════════════════════════════════════════════════════════════════
  // COMPUTED VALUES
  // ═══════════════════════════════════════════════════════════════════

  // Calculate stats
  const stats = {
    total: goals.length,
    inProgress: goals.filter((g) => g.status === "in_progress").length,
    completed: goals.filter((g) => g.status === "completed").length,
    avgProgress: goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
      : 0,
  };

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Journey", href: "/journey" },
    { label: "Goals" },
  ];

  return (
    <DashboardShell>
      <Header
        breadcrumbs={breadcrumbs}
        title="Goals"
        subtitle="Track your objectives and key results"
        actions={
          <Button variant="primary" onClick={() => handleOpenCreate()}>
            <Plus className="size-4 mr-2" />
            New Goal
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total Goals"
            value={stats.total}
            icon={<Target className="size-5" />}
          />
          <MetricCard
            title="In Progress"
            value={stats.inProgress}
            icon={<Loader2 className="size-5" />}
            trend={stats.inProgress > 0 ? "up" : undefined}
          />
          <MetricCard
            title="Completed"
            value={stats.completed}
            icon={<TrendingUp className="size-5" />}
            trend={stats.completed > 0 ? "up" : undefined}
          />
          <MetricCard
            title="Avg Progress"
            value={`${stats.avgProgress}%`}
            icon={<TrendingUp className="size-5" />}
          />
        </div>

        {/* Goals List */}
        <GoalList
          goals={goals}
          isLoading={isLoading}
          error={error}
          filters={filters}
          onFilterChange={handleFilterChange}
          onRefresh={handleRefresh}
          onCreate={() => handleOpenCreate()}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteGoal}
          onAddKeyResult={handleOpenKeyResult}
          onAddChild={handleAddChild}
          onViewLinks={handleViewLinks}
          showFilters
          showGroupByScope
        />
      </div>

      {/* Create Goal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setParentGoal(null);
        }}
        size="lg"
      >
        <GoalForm
          parentGoal={parentGoal}
          onSubmit={handleCreateGoal}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setParentGoal(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Edit Goal Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGoal(null);
        }}
        size="lg"
      >
        {selectedGoal && (
          <GoalForm
            goal={selectedGoal}
            onSubmit={handleUpdateGoal}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedGoal(null);
            }}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      {/* Add Key Result Modal */}
      <Modal
        isOpen={isKeyResultModalOpen}
        onClose={() => {
          setIsKeyResultModalOpen(false);
          setSelectedGoalIdForKR(null);
        }}
        size="md"
      >
        {selectedGoalIdForKR && (
          <KeyResultForm
            goalId={selectedGoalIdForKR}
            onSubmit={handleAddKeyResult}
            onCancel={() => {
              setIsKeyResultModalOpen(false);
              setSelectedGoalIdForKR(null);
            }}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>
    </DashboardShell>
  );
}
