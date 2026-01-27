"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, X } from "@/components/ui";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

function MobileDrawer({ open, onClose, children, className }: MobileDrawerProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        data-slot="mobile-drawer"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 lg:hidden",
          "transform transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 z-10"
        >
          <X className="size-5" />
        </Button>

        {children}
      </div>
    </>
  );
}

export { MobileDrawer };
export type { MobileDrawerProps };
