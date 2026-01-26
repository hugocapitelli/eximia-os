import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-eximia-400 focus:ring-offset-2 focus:ring-offset-zinc-950",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-700 text-zinc-200",
        primary:
          "border-transparent bg-eximia-400/20 text-eximia-400",
        secondary:
          "border-transparent bg-zinc-800 text-zinc-300",
        destructive:
          "border-transparent bg-error/20 text-red-400",
        success:
          "border-transparent bg-success/20 text-green-400",
        warning:
          "border-transparent bg-warning/20 text-yellow-400",
        info:
          "border-transparent bg-info/20 text-blue-400",
        outline:
          "border-zinc-600 text-zinc-400 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
