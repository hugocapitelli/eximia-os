/**
 * ExímIA APP - Inbox AI Processing
 * BLOCO 2.2 - Smart Triage
 *
 * AI-powered classification and routing for inbox items
 */

import type {
  InboxItem,
  InboxAIAnalysis,
  ModuleType,
  EntityType,
} from "@/types/connection-layer";

// Triage rules based on content patterns
const TRIAGE_RULES: {
  patterns: RegExp[];
  module: ModuleType;
  entityType: EntityType;
  confidence: number;
  keywords: string[];
}[] = [
  // Books
  {
    patterns: [
      /ler\s+(o\s+)?livro/i,
      /book:/i,
      /livro:/i,
      /leitura:/i,
      /começar?\s+a?\s*ler/i,
    ],
    keywords: ["livro", "book", "ler", "leitura", "autor"],
    module: "journey",
    entityType: "book",
    confidence: 0.95,
  },
  // Goals
  {
    patterns: [
      /meta:/i,
      /goal:/i,
      /objetivo:/i,
      /quero\s+(conseguir|alcançar|atingir)/i,
      /preciso\s+(de|fazer)/i,
    ],
    keywords: ["meta", "goal", "objetivo", "alcançar", "atingir", "conseguir"],
    module: "journey",
    entityType: "goal",
    confidence: 0.9,
  },
  // Habits
  {
    patterns: [
      /hábito:/i,
      /habit:/i,
      /todo\s+dia/i,
      /diariamente/i,
      /criar\s+(o\s+)?hábito/i,
      /rotina:/i,
    ],
    keywords: ["hábito", "habit", "rotina", "diário", "diariamente", "todo dia"],
    module: "journey",
    entityType: "habit",
    confidence: 0.9,
  },
  // Tasks
  {
    patterns: [
      /tarefa:/i,
      /task:/i,
      /todo:/i,
      /fazer:/i,
      /lembrar\s+de/i,
      /não\s+esquecer/i,
    ],
    keywords: ["tarefa", "task", "todo", "fazer", "lembrar"],
    module: "journey",
    entityType: "event", // tasks as events
    confidence: 0.85,
  },
  // Initiatives
  {
    patterns: [
      /ideia\s+(para|de)/i,
      /projeto:/i,
      /iniciativa:/i,
      /lançar/i,
      /criar\s+(um|uma|o|a)?\s*(negócio|empresa|startup|projeto)/i,
    ],
    keywords: ["ideia", "projeto", "iniciativa", "lançar", "negócio", "startup"],
    module: "strategy",
    entityType: "initiative",
    confidence: 0.75,
  },
  // Courses
  {
    patterns: [
      /aprender/i,
      /estudar/i,
      /curso:/i,
      /course:/i,
      /fazer\s+(um\s+)?curso/i,
    ],
    keywords: ["aprender", "estudar", "curso", "course", "aula"],
    module: "academy",
    entityType: "course",
    confidence: 0.8,
  },
];

// Extract potential title from content
function extractTitle(content: string, entityType: EntityType): string {
  // Remove common prefixes
  let title = content
    .replace(/^(meta|goal|objetivo|tarefa|task|todo|livro|book|hábito|habit|curso|course|ideia|projeto):\s*/i, "")
    .replace(/^(ler|fazer|criar|aprender|estudar)\s+/i, "")
    .replace(/^(o|a|um|uma)\s+/i, "");

  // Limit length
  if (title.length > 100) {
    title = title.substring(0, 100).trim() + "...";
  }

  return title.trim();
}

// Extract category from content
function extractCategory(content: string, entityType: EntityType): string | undefined {
  const contentLower = content.toLowerCase();

  if (entityType === "goal") {
    if (contentLower.includes("saúde") || contentLower.includes("exercício") || contentLower.includes("fitness")) {
      return "health";
    }
    if (contentLower.includes("negócio") || contentLower.includes("trabalho") || contentLower.includes("carreira")) {
      return "business";
    }
    if (contentLower.includes("financ") || contentLower.includes("dinheiro") || contentLower.includes("investir")) {
      return "finance";
    }
    if (contentLower.includes("aprend") || contentLower.includes("estud") || contentLower.includes("curso")) {
      return "education";
    }
    return "personal";
  }

  return undefined;
}

// Extract tags from content
function extractTags(content: string): string[] {
  const tags: string[] = [];

  // Look for hashtags
  const hashtagMatches = content.match(/#(\w+)/g);
  if (hashtagMatches) {
    tags.push(...hashtagMatches.map((t) => t.replace("#", "")));
  }

  // Look for @mentions (could be related to people)
  const mentionMatches = content.match(/@(\w+)/g);
  if (mentionMatches) {
    tags.push(...mentionMatches.map((m) => m.replace("@", "")));
  }

  return tags;
}

/**
 * Analyze inbox item content and suggest classification
 */
export async function analyzeInboxItem(item: InboxItem): Promise<InboxAIAnalysis> {
  const content = item.content.toLowerCase();

  // Find best matching rule
  let bestMatch: typeof TRIAGE_RULES[0] | null = null;
  let bestScore = 0;

  for (const rule of TRIAGE_RULES) {
    let score = 0;

    // Check patterns
    for (const pattern of rule.patterns) {
      if (pattern.test(item.content)) {
        score += 0.5;
      }
    }

    // Check keywords
    for (const keyword of rule.keywords) {
      if (content.includes(keyword)) {
        score += 0.2;
      }
    }

    // Adjust by base confidence
    score = score * rule.confidence;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = rule;
    }
  }

  // Default to goal if no match
  if (!bestMatch || bestScore < 0.3) {
    bestMatch = {
      patterns: [],
      keywords: [],
      module: "journey",
      entityType: "goal",
      confidence: 0.5,
    };
    bestScore = 0.5;
  }

  // Build analysis result
  const analysis: InboxAIAnalysis = {
    suggested_module: bestMatch.module,
    suggested_entity_type: bestMatch.entityType,
    confidence: Math.min(bestScore, 0.99),
    reasoning: buildReasoning(item.content, bestMatch),
    extracted_entities: {
      title: extractTitle(item.content, bestMatch.entityType),
      category: extractCategory(item.content, bestMatch.entityType),
      tags: extractTags(item.content),
    },
  };

  return analysis;
}

function buildReasoning(
  content: string,
  rule: typeof TRIAGE_RULES[0]
): string {
  const matchedKeywords = rule.keywords.filter((k) =>
    content.toLowerCase().includes(k)
  );

  if (matchedKeywords.length > 0) {
    return `Detected keywords: ${matchedKeywords.join(", ")}`;
  }

  return `Pattern matched for ${rule.entityType}`;
}

/**
 * Convert inbox item to the suggested entity type
 */
export interface ConversionResult {
  success: boolean;
  entityId?: string;
  entityType?: EntityType;
  module?: ModuleType;
  error?: string;
}

export async function convertInboxItem(
  item: InboxItem,
  analysis: InboxAIAnalysis,
  supabase: import('@supabase/supabase-js').SupabaseClient,
  userId: string
): Promise<ConversionResult> {
  const { suggested_module, suggested_entity_type, extracted_entities } = analysis;

  try {
    let entityId: string | undefined;

    // Create entity based on type
    switch (suggested_entity_type) {
      case "goal": {
        const { data, error } = await supabase
          .from("goals")
          .insert({
            user_id: userId,
            title: extracted_entities?.title || item.content.substring(0, 100),
            category: extracted_entities?.category || "personal",
            status: "not_started",
            scope: "quarterly",
            progress: 0,
            priority: "medium",
            type: "objective",
          })
          .select("id")
          .single();

        if (error) throw error;
        entityId = data.id;
        break;
      }

      case "habit": {
        const { data, error } = await supabase
          .from("habits")
          .insert({
            user_id: userId,
            name: extracted_entities?.title || item.content.substring(0, 100),
            frequency: "daily",
            status: "active",
            streak: 0,
            best_streak: 0,
            completion_rate: 0,
            reminder_enabled: false,
          })
          .select("id")
          .single();

        if (error) throw error;
        entityId = data.id;
        break;
      }

      case "book": {
        // Extract author if possible
        const authorMatch = item.content.match(/(?:de|by|por)\s+([^,.\n]+)/i);
        const author = authorMatch ? authorMatch[1].trim() : "Unknown";

        const { data, error } = await supabase
          .from("books")
          .insert({
            user_id: userId,
            title: extracted_entities?.title || item.content.substring(0, 100),
            author,
            status: "to_read",
            total_pages: 0,
            current_page: 0,
            is_favorite: false,
          })
          .select("id")
          .single();

        if (error) throw error;
        entityId = data.id;
        break;
      }

      case "initiative": {
        const { data, error } = await supabase
          .from("initiatives")
          .insert({
            user_id: userId,
            title: extracted_entities?.title || item.content.substring(0, 100),
            status: "draft",
            priority: "medium",
          })
          .select("id")
          .single();

        if (error) throw error;
        entityId = data.id;
        break;
      }

      case "course": {
        // For courses, we might just create a note or suggestion
        // Since courses are typically external resources
        const { data, error } = await supabase
          .from("goals")
          .insert({
            user_id: userId,
            title: `Learn: ${extracted_entities?.title || item.content.substring(0, 100)}`,
            category: "education",
            status: "not_started",
            scope: "quarterly",
            progress: 0,
            priority: "medium",
            type: "objective",
          })
          .select("id")
          .single();

        if (error) throw error;
        entityId = data.id;
        break;
      }

      default: {
        // Default: create as a goal
        const { data, error } = await supabase
          .from("goals")
          .insert({
            user_id: userId,
            title: extracted_entities?.title || item.content.substring(0, 100),
            category: "personal",
            status: "not_started",
            scope: "quarterly",
            progress: 0,
            priority: "medium",
            type: "task",
          })
          .select("id")
          .single();

        if (error) throw error;
        entityId = data.id;
      }
    }

    return {
      success: true,
      entityId,
      entityType: suggested_entity_type,
      module: suggested_module,
    };
  } catch (error) {
    console.error("Error converting inbox item:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Conversion failed",
    };
  }
}

/**
 * Create entity link between inbox item and created entity
 */
export async function createConversionLink(
  inboxItemId: string,
  entityId: string,
  entityType: EntityType,
  module: ModuleType,
  supabase: unknown,
  userId: string
): Promise<void> {
  try {
    await supabase.from("entity_links").insert({
      user_id: userId,
      source_module: "inbox",
      source_type: "inbox_item",
      source_id: inboxItemId,
      target_module: module,
      target_type: entityType,
      target_id: entityId,
      link_type: "cascaded",
      relationship: "converted_to",
      strength: 1.0,
      bidirectional: false,
      created_by: "ai",
      created_reason: "Auto-converted from inbox item",
    });
  } catch (error) {
    console.error("Error creating conversion link:", error);
  }
}
