/**
 * ExímIA APP - useInboxAI Hook
 * BLOCO 2.2 - Inbox AI Processing
 *
 * Hook for AI-powered inbox item processing
 */

"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  analyzeInboxItem,
  convertInboxItem,
  createConversionLink,
} from "@/lib/inbox-ai";
import type {
  InboxItem,
  InboxAIAnalysis,
  InboxStatus,
} from "@/types/connection-layer";

interface UseInboxAIReturn {
  isAnalyzing: boolean;
  isConverting: boolean;
  error: string | null;
  analyze: (item: InboxItem) => Promise<InboxAIAnalysis | null>;
  convert: (
    item: InboxItem,
    analysis: InboxAIAnalysis,
    customTitle?: string
  ) => Promise<boolean>;
  dismiss: (itemId: string) => Promise<boolean>;
}

export function useInboxAI(): UseInboxAIReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  /**
   * Analyze an inbox item and store the AI analysis
   */
  const analyze = useCallback(
    async (item: InboxItem): Promise<InboxAIAnalysis | null> => {
      setIsAnalyzing(true);
      setError(null);

      try {
        // Get analysis
        const analysis = await analyzeInboxItem(item);

        // Update the item with analysis
        const { error: updateError } = await supabase
          .from("inbox_items")
          .update({
            ai_analysis: analysis,
            status: "triaged" as InboxStatus,
          })
          .eq("id", item.id);

        if (updateError) throw updateError;

        return analysis;
      } catch (err) {
        logger.error("Error analyzing inbox item:", err);
        setError(err instanceof Error ? err.message : "Analysis failed");
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [supabase]
  );

  /**
   * Convert inbox item to the suggested entity
   */
  const convert = useCallback(
    async (
      item: InboxItem,
      analysis: InboxAIAnalysis,
      customTitle?: string
    ): Promise<boolean> => {
      setIsConverting(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        // Modify analysis with custom title if provided
        const finalAnalysis: InboxAIAnalysis = customTitle
          ? {
              ...analysis,
              extracted_entities: {
                ...analysis.extracted_entities,
                title: customTitle,
              },
            }
          : analysis;

        // Convert the item
        const result = await convertInboxItem(
          item,
          finalAnalysis,
          supabase,
          user.id
        );

        if (!result.success) {
          throw new Error(result.error || "Conversion failed");
        }

        // Create link between inbox item and created entity
        if (result.entityId && result.entityType && result.module) {
          await createConversionLink(
            item.id,
            result.entityId,
            result.entityType,
            result.module,
            supabase,
            user.id
          );
        }

        // Update inbox item status
        const { error: updateError } = await supabase
          .from("inbox_items")
          .update({
            status: "converted" as InboxStatus,
            converted_to_module: result.module,
            converted_to_type: result.entityType,
            converted_to_id: result.entityId,
            processed_at: new Date().toISOString(),
          })
          .eq("id", item.id);

        if (updateError) throw updateError;

        return true;
      } catch (err) {
        logger.error("Error converting inbox item:", err);
        setError(err instanceof Error ? err.message : "Conversion failed");
        return false;
      } finally {
        setIsConverting(false);
      }
    },
    [supabase]
  );

  /**
   * Dismiss an item (archive without converting)
   */
  const dismiss = useCallback(
    async (itemId: string): Promise<boolean> => {
      setError(null);

      try {
        const { error: updateError } = await supabase
          .from("inbox_items")
          .update({
            status: "archived" as InboxStatus,
            processed_at: new Date().toISOString(),
          })
          .eq("id", itemId);

        if (updateError) throw updateError;

        return true;
      } catch (err) {
        logger.error("Error dismissing inbox item:", err);
        setError(err instanceof Error ? err.message : "Dismiss failed");
        return false;
      }
    },
    [supabase]
  );

  return {
    isAnalyzing,
    isConverting,
    error,
    analyze,
    convert,
    dismiss,
  };
}

/**
 * Auto-analyze hook - automatically analyzes items when they are created
 */
interface UseAutoAnalyzeOptions {
  enabled?: boolean;
  onAnalyzed?: (item: InboxItem, analysis: InboxAIAnalysis) => void;
}

export function useAutoAnalyze(
  items: InboxItem[],
  options: UseAutoAnalyzeOptions = {}
) {
  const { enabled = true, onAnalyzed } = options;
  const { analyze } = useInboxAI();

  // Auto-analyze new items that don't have analysis
  const analyzeNewItems = useCallback(async () => {
    if (!enabled) return;

    const newItems = items.filter(
      (item) => item.status === "inbox" && !item.ai_analysis
    );

    for (const item of newItems) {
      const analysis = await analyze(item);
      if (analysis && onAnalyzed) {
        onAnalyzed(item, analysis);
      }
    }
  }, [items, enabled, analyze, onAnalyzed]);

  return { analyzeNewItems };
}
