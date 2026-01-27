import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* ==========================================================================
   HEADING
   ========================================================================== */

const headingVariants = cva("font-semibold tracking-tight text-zinc-50", {
  variants: {
    level: {
      h1: "text-4xl lg:text-5xl",
      h2: "text-3xl lg:text-4xl",
      h3: "text-2xl lg:text-3xl",
      h4: "text-xl lg:text-2xl",
      h5: "text-lg lg:text-xl",
      h6: "text-base lg:text-lg",
    },
    color: {
      default: "text-zinc-50",
      muted: "text-zinc-400",
      primary: "text-eximia-400",
      gradient: "text-gradient-eximia",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    level: "h2",
    color: "default",
    weight: "semibold",
  },
});

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "color">,
    VariantProps<typeof headingVariants> {
  as?: HeadingLevel;
}

function Heading({
  className,
  level = "h2",
  color,
  weight,
  as,
  children,
  ...props
}: HeadingProps) {
  const Component = as || level || "h2";

  return (
    <Component
      data-slot="heading"
      className={cn(headingVariants({ level, color, weight }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

/* ==========================================================================
   TEXT
   ========================================================================== */

const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    color: {
      default: "text-zinc-50",
      muted: "text-zinc-400",
      subtle: "text-zinc-500",
      primary: "text-eximia-400",
      success: "text-green-400",
      warning: "text-yellow-400",
      error: "text-red-400",
      info: "text-blue-400",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      snug: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
  },
  defaultVariants: {
    size: "base",
    color: "default",
    weight: "normal",
    leading: "normal",
    align: "left",
  },
});

interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div";
}

function Text({
  className,
  size,
  color,
  weight,
  leading,
  align,
  as: Component = "p",
  children,
  ...props
}: TextProps) {
  return (
    <Component
      data-slot="text"
      className={cn(textVariants({ size, color, weight, leading, align }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

/* ==========================================================================
   LABEL
   ========================================================================== */

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      color: {
        default: "text-zinc-200",
        muted: "text-zinc-400",
        primary: "text-eximia-400",
        error: "text-red-400",
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-red-400",
        false: "",
      },
    },
    defaultVariants: {
      color: "default",
      required: false,
    },
  }
);

interface LabelProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "color">,
    VariantProps<typeof labelVariants> {}

function Label({
  className,
  color,
  required,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(labelVariants({ color, required }), className)}
      {...props}
    >
      {children}
    </label>
  );
}

/* ==========================================================================
   CODE (Inline code)
   ========================================================================== */

type CodeProps = React.HTMLAttributes<HTMLElement>;

function Code({ className, children, ...props }: CodeProps) {
  return (
    <code
      data-slot="code"
      className={cn(
        "relative rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-sm text-eximia-400",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

/* ==========================================================================
   KBD (Keyboard key)
   ========================================================================== */

type KbdProps = React.HTMLAttributes<HTMLElement>;

function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

export {
  Heading,
  headingVariants,
  Text,
  textVariants,
  Label,
  labelVariants,
  Code,
  Kbd,
};
export type { HeadingProps, TextProps, LabelProps, CodeProps, KbdProps };
