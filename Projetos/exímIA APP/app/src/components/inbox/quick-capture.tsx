/**
 * ExímIA APP - QuickCapture
 * BLOCO 2.1 - Inbox Capture
 *
 * Quick capture input for inbox items
 */

"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button, Input, Plus, Loader2, Check, Sparkles } from "@/components/ui";
import { Text } from "@/components/ui";

interface QuickCaptureProps {
  onCapture: (content: string) => Promise<void>;
  isCapturing?: boolean;
  placeholder?: string;
  showTip?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function QuickCapture({
  onCapture,
  isCapturing = false,
  placeholder = "Capture anything... thought, idea, task, link",
  showTip = true,
  autoFocus = false,
  className,
}: QuickCaptureProps) {
  const [content, setContent] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isCapturing) return;

    try {
      await onCapture(content.trim());
      setContent("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Capture failed:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-eximia-400" />
            <Input
              ref={inputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="pl-10 pr-4 h-12 bg-surface-700 border-surface-600 focus:border-eximia-500/50"
              disabled={isCapturing}
            />
          </div>
          <Button
            type="submit"
            disabled={!content.trim() || isCapturing}
            className="h-12 px-6"
          >
            {isCapturing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : showSuccess ? (
              <Check className="size-4 text-green-400" />
            ) : (
              <>
                <Plus className="size-4 mr-2" />
                Capture
              </>
            )}
          </Button>
        </div>
      </form>

      {showTip && (
        <Text size="xs" muted className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 text-xs bg-surface-700 rounded border border-surface-600">
            Enter
          </kbd>
          to capture quickly
        </Text>
      )}
    </div>
  );
}

// Floating quick capture (for global hotkey)
interface FloatingCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (content: string) => Promise<void>;
}

export function FloatingCapture({
  isOpen,
  onClose,
  onCapture,
}: FloatingCaptureProps) {
  const [content, setContent] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setContent("");
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isCapturing) return;

    setIsCapturing(true);
    try {
      await onCapture(content.trim());
      setContent("");
      onClose();
    } catch (error) {
      console.error("Capture failed:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Capture box */}
      <div className="relative z-10 w-full max-w-2xl mx-4">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-eximia-400" />
            <input
              ref={inputRef}
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Quick capture..."
              className={cn(
                "w-full h-14 pl-12 pr-4",
                "bg-surface-800 border border-surface-600 rounded-xl",
                "text-white placeholder:text-gray-500",
                "focus:outline-none focus:border-eximia-500/50 focus:ring-2 focus:ring-eximia-500/20",
                "text-lg"
              )}
              disabled={isCapturing}
            />
            {isCapturing && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 animate-spin" />
            )}
          </div>
        </form>

        <div className="flex items-center justify-between mt-3 px-1">
          <Text size="xs" muted>
            <kbd className="px-1.5 py-0.5 bg-surface-700 rounded border border-surface-600">
              Enter
            </kbd>{" "}
            to capture
          </Text>
          <Text size="xs" muted>
            <kbd className="px-1.5 py-0.5 bg-surface-700 rounded border border-surface-600">
              Esc
            </kbd>{" "}
            to close
          </Text>
        </div>
      </div>
    </div>
  );
}

export type { QuickCaptureProps, FloatingCaptureProps };
