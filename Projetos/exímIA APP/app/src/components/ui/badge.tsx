import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-eximia-400 focus:ring-offset-2 focus:ring-offset-zinc-950",
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
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface BadgeProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof badgeVariants> {
  /** Optional dot indicator before text */
  dot?: boolean;
  /** Dot color - defaults to variant color */
  dotColor?: string;
}

function Badge({
  className,
  variant,
  size,
  dot,
  dotColor,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "mr-1.5 size-1.5 rounded-full",
            dotColor || (
              variant === "success" ? "bg-green-400" :
              variant === "warning" ? "bg-yellow-400" :
              variant === "destructive" ? "bg-red-400" :
              variant === "info" ? "bg-blue-400" :
              variant === "primary" ? "bg-eximia-400" :
              "bg-current"
            )
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
