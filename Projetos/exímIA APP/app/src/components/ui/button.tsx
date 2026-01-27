import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-eximia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
  {
    variants: {
      variant: {
        default:
          "bg-eximia-400 text-zinc-900 shadow-sm hover:bg-eximia-500 active:scale-[0.98]",
        primary:
          "bg-eximia-400 text-zinc-900 shadow-sm hover:bg-eximia-500 active:scale-[0.98]",
        destructive:
          "bg-error text-zinc-50 shadow-sm hover:bg-error/90 active:scale-[0.98]",
        outline:
          "border border-zinc-700 bg-transparent text-zinc-50 shadow-sm hover:bg-zinc-800 hover:border-zinc-600 active:scale-[0.98]",
        secondary:
          "bg-zinc-800 text-zinc-50 shadow-sm hover:bg-zinc-700 active:scale-[0.98]",
        ghost:
          "text-zinc-50 hover:bg-zinc-800 active:scale-[0.98]",
        link:
          "text-eximia-400 underline-offset-4 hover:underline",
        success:
          "bg-success text-zinc-50 shadow-sm hover:bg-success/90 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-4 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const isDisabled = disabled || loading;

  return (
    <Comp
      data-slot="button"
      data-loading={loading}
      className={cn(
        buttonVariants({ variant, size, className }),
        loading && "pointer-events-none"
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner
            size={size === "sm" || size === "icon-sm" ? "sm" : "default"}
            className="shrink-0"
          />
          {size !== "icon" && size !== "icon-sm" && size !== "icon-lg" && (
            <span className="sr-only">Loading</span>
          )}
          {size !== "icon" && size !== "icon-sm" && size !== "icon-lg" && children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
