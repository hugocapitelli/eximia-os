// ReadingContent Component - Chapter content area
// EXIMIA-202

import type { SummaryChapter, ThemeConfig, FontSizeConfig } from '../../../types/biblioteca';

interface ReadingContentProps {
  chapter?: SummaryChapter;
  themeConfig: ThemeConfig;
  fontConfig: FontSizeConfig;
}

// Simple markdown to HTML converter
function parseMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Blockquote
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br/>');
}

export function ReadingContent({
  chapter,
  themeConfig,
  fontConfig,
}: ReadingContentProps) {
  if (!chapter) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Capítulo não encontrado</p>
      </div>
    );
  }

  const htmlContent = parseMarkdown(chapter.content);

  return (
    <main className="flex-1 py-8">
      <div className="container max-w-[650px] mx-auto px-4">
        {/* Chapter Header */}
        <div className="mb-8 text-center">
          <p
            className="text-sm uppercase tracking-wider mb-2"
            style={{ color: themeConfig.colors.muted }}
          >
            Capítulo {chapter.chapter_number}
          </p>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: themeConfig.colors.text }}
          >
            {chapter.title}
          </h1>
          {chapter.subtitle && (
            <p
              className="mt-2"
              style={{ color: themeConfig.colors.muted }}
            >
              {chapter.subtitle}
            </p>
          )}
        </div>

        {/* Chapter Content */}
        <article
          className="prose prose-lg max-w-none"
          style={{
            fontSize: fontConfig.size,
            lineHeight: fontConfig.lineHeight,
            color: themeConfig.colors.text,
          }}
          dangerouslySetInnerHTML={{ __html: `<p>${htmlContent}</p>` }}
        />
      </div>
    </main>
  );
}
