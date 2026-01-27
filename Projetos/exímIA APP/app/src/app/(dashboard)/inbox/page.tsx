/**
 * ExímIA APP - Inbox Page
 * BLOCO 2.1 - Inbox Capture
 * BLOCO 2.2 - Inbox AI Processing
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { DashboardShell } from "@/components/templates";
import { Header } from "@/components/organisms";
import { QuickCapture, InboxList, TriageModal } from "@/components/inbox";
import { useInbox } from "@/hooks/use-inbox";
import { useInboxAI } from "@/hooks/use-inbox-ai";
import { Heading, Text, Kbd, Button, Sparkles, Loader2 } from "@/components/ui";
import type { InboxItem, InboxAIAnalysis } from "@/types/connection-layer";

export default function InboxPage() {
  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);
  const [triageItem, setTriageItem] = useState<InboxItem | null>(null);
  const [triageAnalysis, setTriageAnalysis] = useState<InboxAIAnalysis | null>(null);
  const [isAutoAnalyzing, setIsAutoAnalyzing] = useState(false);

  const {
    items,
    isLoading,
    error,
    totalCount,
    fetchItems,
    createItem,
    updateItem,
    archiveItem,
    deleteItem,
  } = useInbox({ autoFetch: true });

  const { analyze, convert, dismiss, isAnalyzing, isConverting } = useInboxAI();

  // Handle capture
  const handleCapture = useCallback(
    async (content: string) => {
      const newItem = await createItem({ content });

      // Auto-analyze the new item
      if (newItem) {
        const analysis = await analyze(newItem);
        if (analysis) {
          // Update local state with analysis
          await fetchItems();
        }
      }
    },
    [createItem, analyze, fetchItems]
  );

  // Handle archive
  const handleArchive = useCallback(
    async (id: string) => {
      await archiveItem(id);
    },
    [archiveItem]
  );

  // Handle delete
  const handleDelete = useCallback(
    async (id: string) => {
      await deleteItem(id);
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    },
    [deleteItem, selectedItem]
  );

  // Handle process (open triage modal)
  const handleProcess = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      // If already has analysis, show triage modal
      if (item.ai_analysis) {
        setTriageItem(item);
        setTriageAnalysis(item.ai_analysis);
        return;
      }

      // Otherwise, analyze first
      const analysis = await analyze(item);
      if (analysis) {
        setTriageItem({ ...item, ai_analysis: analysis });
        setTriageAnalysis(analysis);
        await fetchItems(); // Refresh to get updated item
      }
    },
    [items, analyze, fetchItems]
  );

  // Handle triage accept
  const handleTriageAccept = useCallback(
    async (item: InboxItem, analysis: InboxAIAnalysis, customTitle?: string) => {
      await convert(item, analysis, customTitle);
      setTriageItem(null);
      setTriageAnalysis(null);
      await fetchItems();
    },
    [convert, fetchItems]
  );

  // Handle triage dismiss
  const handleTriageDismiss = useCallback(
    async (item: InboxItem) => {
      await dismiss(item.id);
      setTriageItem(null);
      setTriageAnalysis(null);
      await fetchItems();
    },
    [dismiss, fetchItems]
  );

  // Handle select
  const handleSelect = useCallback((item: InboxItem) => {
    setSelectedItem(item);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchItems();
  }, [fetchItems]);

  // Auto-analyze all pending items
  const handleAutoAnalyze = useCallback(async () => {
    setIsAutoAnalyzing(true);
    const pendingItems = items.filter(
      (item) => item.status === "inbox" && !item.ai_analysis
    );

    for (const item of pendingItems) {
      await analyze(item);
    }

    await fetchItems();
    setIsAutoAnalyzing(false);
  }, [items, analyze, fetchItems]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + I for global capture
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "i") {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>(
          '[data-capture-input]'
        );
        if (input) {
          input.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Inbox" },
  ];

  // Count items needing triage
  const pendingTriageCount = items.filter(
    (item) => item.status === "inbox" && !item.ai_analysis
  ).length;

  return (
    <DashboardShell>
      <Header
        breadcrumbs={breadcrumbs}
        title="Inbox"
        subtitle="Capture everything, organize later"
        actions={
          pendingTriageCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAutoAnalyze}
              disabled={isAutoAnalyzing}
            >
              {isAutoAnalyzing ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="size-4 mr-2" />
              )}
              Analyze {pendingTriageCount} items
            </Button>
          ) : undefined
        }
      />

      <div className="p-6 space-y-6">
        {/* Quick Capture Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Heading level={5}>Quick Capture</Heading>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Kbd>Ctrl</Kbd>
              <span>+</span>
              <Kbd>Shift</Kbd>
              <span>+</span>
              <Kbd>I</Kbd>
            </div>
          </div>
          <QuickCapture
            onCapture={handleCapture}
            isCapturing={isAnalyzing}
            placeholder="Capture a thought, idea, task, or link..."
            showTip={false}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <Text className="text-red-400">{error}</Text>
          </div>
        )}

        {/* Inbox List */}
        <InboxList
          items={items}
          isLoading={isLoading}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onProcess={handleProcess}
          onSelect={handleSelect}
          onRefresh={handleRefresh}
          selectedItemId={selectedItem?.id}
          emptyTitle="Your inbox is empty"
          emptyDescription="Capture your first thought, idea, or task above"
        />

        {/* Stats Footer */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-surface-600">
            <Text size="sm" muted>
              {totalCount} total items
            </Text>
            <Text size="sm" muted>
              {items.filter((i) => i.status === "inbox").length} pending
              {" | "}
              {items.filter((i) => i.ai_analysis).length} analyzed
            </Text>
          </div>
        )}
      </div>

      {/* Triage Modal */}
      {triageItem && triageAnalysis && (
        <TriageModal
          isOpen={true}
          onClose={() => {
            setTriageItem(null);
            setTriageAnalysis(null);
          }}
          item={triageItem}
          analysis={triageAnalysis}
          onAccept={handleTriageAccept}
          onDismiss={handleTriageDismiss}
        />
      )}
    </DashboardShell>
  );
}
