/**
 * ExímIA APP - useEntityLinks Hook
 * BLOCO 1.3 - Connection Layer UI
 *
 * Hook for managing entity links (Connection Layer)
 */

"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  EntityLink,
  LinkedEntity,
  CreateLinkInput,
  ModuleType,
  EntityType,
  LinkType,
} from "@/types/connection-layer";

interface UseEntityLinksOptions {
  entityType: EntityType;
  entityId: string;
}

interface UseEntityLinksReturn {
  links: LinkedEntity[];
  isLoading: boolean;
  error: string | null;
  fetchLinks: () => Promise<void>;
  createLink: (input: CreateLinkInput) => Promise<EntityLink | null>;
  deleteLink: (linkId: string) => Promise<boolean>;
  updateLinkAccess: (linkId: string) => Promise<void>;
}

export function useEntityLinks({
  entityType,
  entityId,
}: UseEntityLinksOptions): UseEntityLinksReturn {
  const [links, setLinks] = useState<LinkedEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchLinks = useCallback(async () => {
    if (!entityId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use the helper function from the database
      const { data, error: fetchError } = await supabase.rpc(
        "get_entity_links",
        {
          p_entity_type: entityType,
          p_entity_id: entityId,
        }
      );

      if (fetchError) throw fetchError;

      const mappedLinks: LinkedEntity[] = (data || []).map((link: unknown) => ({
        id: link.id,
        direction: link.direction as "incoming" | "outgoing",
        linked_module: link.linked_module as ModuleType,
        linked_type: link.linked_type as EntityType,
        linked_id: link.linked_id,
        link_type: link.link_type as LinkType,
        relationship: link.relationship,
        strength: parseFloat(link.strength),
        created_at: link.created_at,
      }));

      setLinks(mappedLinks);
    } catch (err) {
      logger.error("Error fetching links:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch links");
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId, supabase]);

  const createLink = useCallback(
    async (input: CreateLinkInput): Promise<EntityLink | null> => {
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        const linkData = {
          source_module: input.source_module,
          source_type: input.source_type,
          source_id: input.source_id,
          target_module: input.target_module,
          target_type: input.target_type,
          target_id: input.target_id,
          relationship: input.relationship,
          link_type: input.link_type || "manual",
          strength: input.strength ?? 1.0,
          bidirectional: input.bidirectional ?? true,
          created_by: "user",
          created_reason: input.created_reason,
          user_id: user.id,
        };

        const { data, error: insertError } = await supabase
          .from("entity_links")
          .insert(linkData)
          .select()
          .single();

        if (insertError) throw insertError;

        // Refresh links after creating
        await fetchLinks();

        return data as EntityLink;
      } catch (err) {
        logger.error("Error creating link:", err);
        setError(err instanceof Error ? err.message : "Failed to create link");
        return null;
      }
    },
    [supabase, fetchLinks]
  );

  const deleteLink = useCallback(
    async (linkId: string): Promise<boolean> => {
      setError(null);

      try {
        const { error: deleteError } = await supabase
          .from("entity_links")
          .delete()
          .eq("id", linkId);

        if (deleteError) throw deleteError;

        // Update local state
        setLinks((prev) => prev.filter((link) => link.id !== linkId));
        return true;
      } catch (err) {
        logger.error("Error deleting link:", err);
        setError(err instanceof Error ? err.message : "Failed to delete link");
        return false;
      }
    },
    [supabase]
  );

  const updateLinkAccess = useCallback(
    async (linkId: string): Promise<void> => {
      try {
        await supabase
          .from("entity_links")
          .update({ last_accessed_at: new Date().toISOString() })
          .eq("id", linkId);
      } catch (err) {
        logger.error("Error updating link access:", err);
      }
    },
    [supabase]
  );

  return {
    links,
    isLoading,
    error,
    fetchLinks,
    createLink,
    deleteLink,
    updateLinkAccess,
  };
}

// Hook for searching entities to link
interface EntitySearchResult {
  id: string;
  type: EntityType;
  module: ModuleType;
  title: string;
  subtitle?: string;
}

interface UseEntitySearchReturn {
  results: EntitySearchResult[];
  isSearching: boolean;
  search: (query: string, filters?: EntitySearchFilters) => Promise<void>;
  clearResults: () => void;
}

interface EntitySearchFilters {
  modules?: ModuleType[];
  types?: EntityType[];
  limit?: number;
}

export function useEntitySearch(): UseEntitySearchReturn {
  const [results, setResults] = useState<EntitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const supabase = createClient();

  const search = useCallback(
    async (query: string, filters?: EntitySearchFilters) => {
      if (!query || query.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);

      try {
        const searchResults: EntitySearchResult[] = [];
        const limit = filters?.limit || 10;

        // Search goals
        if (
          !filters?.types ||
          filters.types.includes("goal") ||
          !filters?.modules ||
          filters.modules.includes("journey")
        ) {
          const { data: goals } = await supabase
            .from("goals")
            .select("id, title, category")
            .ilike("title", `%${query}%`)
            .limit(limit);

          if (goals) {
            searchResults.push(
              ...goals.map((g) => ({
                id: g.id,
                type: "goal" as EntityType,
                module: "journey" as ModuleType,
                title: g.title,
                subtitle: g.category,
              }))
            );
          }
        }

        // Search habits
        if (
          !filters?.types ||
          filters.types.includes("habit") ||
          !filters?.modules ||
          filters.modules.includes("journey")
        ) {
          const { data: habits } = await supabase
            .from("habits")
            .select("id, name, frequency")
            .ilike("name", `%${query}%`)
            .limit(limit);

          if (habits) {
            searchResults.push(
              ...habits.map((h) => ({
                id: h.id,
                type: "habit" as EntityType,
                module: "journey" as ModuleType,
                title: h.name,
                subtitle: h.frequency,
              }))
            );
          }
        }

        // Search books
        if (
          !filters?.types ||
          filters.types.includes("book") ||
          !filters?.modules ||
          filters.modules.includes("journey")
        ) {
          const { data: books } = await supabase
            .from("books")
            .select("id, title, author")
            .ilike("title", `%${query}%`)
            .limit(limit);

          if (books) {
            searchResults.push(
              ...books.map((b) => ({
                id: b.id,
                type: "book" as EntityType,
                module: "journey" as ModuleType,
                title: b.title,
                subtitle: b.author,
              }))
            );
          }
        }

        // Search initiatives
        if (
          !filters?.types ||
          filters.types.includes("initiative") ||
          !filters?.modules ||
          filters.modules.includes("strategy")
        ) {
          const { data: initiatives } = await supabase
            .from("initiatives")
            .select("id, title, status")
            .ilike("title", `%${query}%`)
            .limit(limit);

          if (initiatives) {
            searchResults.push(
              ...initiatives.map((i) => ({
                id: i.id,
                type: "initiative" as EntityType,
                module: "strategy" as ModuleType,
                title: i.title,
                subtitle: i.status,
              }))
            );
          }
        }

        // Search courses
        if (
          !filters?.types ||
          filters.types.includes("course") ||
          !filters?.modules ||
          filters.modules.includes("academy")
        ) {
          const { data: courses } = await supabase
            .from("courses")
            .select("id, title, instructor")
            .ilike("title", `%${query}%`)
            .limit(limit);

          if (courses) {
            searchResults.push(
              ...courses.map((c) => ({
                id: c.id,
                type: "course" as EntityType,
                module: "academy" as ModuleType,
                title: c.title,
                subtitle: c.instructor,
              }))
            );
          }
        }

        setResults(searchResults.slice(0, limit));
      } catch (err) {
        logger.error("Error searching entities:", err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [supabase]
  );

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    isSearching,
    search,
    clearResults,
  };
}

export type { EntitySearchResult, EntitySearchFilters };
