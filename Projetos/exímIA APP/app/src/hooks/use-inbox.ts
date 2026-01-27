/**
 * ExímIA APP - useInbox Hook
 * BLOCO 2.1 - Inbox Capture
 *
 * Hook for managing inbox items
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  InboxItem,
  CreateInboxItemInput,
  InboxStatus,
  InboxContentType,
  InboxFilters,
} from "@/types/connection-layer";

interface UseInboxOptions {
  autoFetch?: boolean;
  filters?: InboxFilters;
}

interface UseInboxReturn {
  items: InboxItem[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  fetchItems: (filters?: InboxFilters) => Promise<void>;
  createItem: (input: CreateInboxItemInput) => Promise<InboxItem | null>;
  updateItem: (id: string, updates: Partial<InboxItem>) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  archiveItem: (id: string) => Promise<boolean>;
  processItem: (id: string) => Promise<boolean>;
}

export function useInbox(options: UseInboxOptions = {}): UseInboxReturn {
  const { autoFetch = true, filters: initialFilters } = options;

  const [items, setItems] = useState<InboxItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = createClient();

  const fetchItems = useCallback(
    async (filters?: InboxFilters) => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("inbox_items")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false });

        // Apply filters
        const activeFilters = filters || initialFilters;
        if (activeFilters?.status) {
          query = query.eq("status", activeFilters.status);
        }
        if (activeFilters?.content_type) {
          query = query.eq("content_type", activeFilters.content_type);
        }
        if (activeFilters?.source) {
          query = query.eq("source", activeFilters.source);
        }

        const { data, error: fetchError, count } = await query;

        if (fetchError) throw fetchError;

        setItems(data as InboxItem[]);
        setTotalCount(count || 0);
      } catch (err) {
        logger.error("Error fetching inbox items:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch items");
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, initialFilters]
  );

  const createItem = useCallback(
    async (input: CreateInboxItemInput): Promise<InboxItem | null> => {
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        const itemData = {
          user_id: user.id,
          content: input.content,
          content_type: input.content_type || "text",
          attachments: input.attachments,
          source: input.source || "quick_capture",
          source_metadata: input.source_metadata,
          status: "inbox" as InboxStatus,
        };

        const { data, error: insertError } = await supabase
          .from("inbox_items")
          .insert(itemData)
          .select()
          .single();

        if (insertError) throw insertError;

        // Add to local state
        setItems((prev) => [data as InboxItem, ...prev]);
        setTotalCount((prev) => prev + 1);

        return data as InboxItem;
      } catch (err) {
        logger.error("Error creating inbox item:", err);
        setError(err instanceof Error ? err.message : "Failed to create item");
        return null;
      }
    },
    [supabase]
  );

  const updateItem = useCallback(
    async (id: string, updates: Partial<InboxItem>): Promise<boolean> => {
      setError(null);

      try {
        const { error: updateError } = await supabase
          .from("inbox_items")
          .update(updates)
          .eq("id", id);

        if (updateError) throw updateError;

        // Update local state
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          )
        );

        return true;
      } catch (err) {
        logger.error("Error updating inbox item:", err);
        setError(err instanceof Error ? err.message : "Failed to update item");
        return false;
      }
    },
    [supabase]
  );

  const deleteItem = useCallback(
    async (id: string): Promise<boolean> => {
      setError(null);

      try {
        const { error: deleteError } = await supabase
          .from("inbox_items")
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;

        // Update local state
        setItems((prev) => prev.filter((item) => item.id !== id));
        setTotalCount((prev) => prev - 1);

        return true;
      } catch (err) {
        logger.error("Error deleting inbox item:", err);
        setError(err instanceof Error ? err.message : "Failed to delete item");
        return false;
      }
    },
    [supabase]
  );

  const archiveItem = useCallback(
    async (id: string): Promise<boolean> => {
      return updateItem(id, { status: "archived" as InboxStatus });
    },
    [updateItem]
  );

  const processItem = useCallback(
    async (id: string): Promise<boolean> => {
      return updateItem(id, {
        status: "processing" as InboxStatus,
        processed_at: new Date().toISOString(),
      });
    },
    [updateItem]
  );

  // Auto fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchItems();
    }
  }, [autoFetch, fetchItems]);

  return {
    items,
    isLoading,
    error,
    totalCount,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    archiveItem,
    processItem,
  };
}

// Quick capture hook for simpler usage
interface UseQuickCaptureReturn {
  capture: (content: string) => Promise<InboxItem | null>;
  isCapturing: boolean;
  error: string | null;
}

export function useQuickCapture(): UseQuickCaptureReturn {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const capture = useCallback(
    async (content: string): Promise<InboxItem | null> => {
      if (!content.trim()) return null;

      setIsCapturing(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        const { data, error: insertError } = await supabase
          .from("inbox_items")
          .insert({
            user_id: user.id,
            content: content.trim(),
            content_type: "text",
            source: "quick_capture",
            status: "inbox",
          })
          .select()
          .single();

        if (insertError) throw insertError;

        return data as InboxItem;
      } catch (err) {
        logger.error("Error capturing:", err);
        setError(err instanceof Error ? err.message : "Failed to capture");
        return null;
      } finally {
        setIsCapturing(false);
      }
    },
    [supabase]
  );

  return {
    capture,
    isCapturing,
    error,
  };
}
