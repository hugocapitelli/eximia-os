'use client';

/**
 * ChatInput - Message input with send button
 */
import * as React from 'react';
import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Send, Mic, Paperclip } from 'lucide-react';

export interface ChatInputProps {
  onSend: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  showAttachments?: boolean;
  showVoice?: boolean;
}

export function ChatInput({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  isLoading = false,
  className,
  showAttachments = false,
  showVoice = false,
}: ChatInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = content.trim();
      if (!trimmed || disabled || isLoading) return;

      onSend(trimmed);
      setContent('');

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    },
    [content, disabled, isLoading, onSend]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  }, []);

  const isDisabled = disabled || isLoading;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex items-end gap-2 p-4 border-t bg-background',
        className
      )}
    >
      {/* Attachments button */}
      {showAttachments && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isDisabled}
          className="shrink-0"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
      )}

      {/* Input container */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled}
          rows={1}
          className={cn(
            'w-full resize-none rounded-2xl border border-input bg-background',
            'px-4 py-3 text-sm',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'min-h-[48px] max-h-[200px]'
          )}
        />
      </div>

      {/* Voice button */}
      {showVoice && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isDisabled}
          className="shrink-0"
        >
          <Mic className="h-5 w-5" />
        </Button>
      )}

      {/* Send button */}
      <Button
        type="submit"
        size="icon"
        disabled={isDisabled || !content.trim()}
        className="shrink-0 rounded-full h-12 w-12"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}
