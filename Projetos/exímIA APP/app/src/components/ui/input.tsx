"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border bg-zinc-900 text-zinc-50 shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-zinc-50 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eximia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-error/20",
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 py-1 text-xs",
        default: "h-10 px-3 py-2 text-sm",
        lg: "h-12 px-4 py-3 text-base",
      },
      variant: {
        default: "border-zinc-700",
        filled: "border-transparent bg-zinc-800",
        ghost: "border-transparent bg-transparent shadow-none",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  clearable?: boolean;
  onClear?: () => void;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      size,
      variant,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      clearable,
      onClear,
      error,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const showClear = clearable && currentValue && String(currentValue).length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }
      onClear?.();
      // Trigger onChange with empty value
      const event = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(event);
    };

    const hasLeftContent = leftIcon || prefix;
    const hasRightContent = rightIcon || suffix || showClear;

    // If no decorations, render simple input
    if (!hasLeftContent && !hasRightContent) {
      return (
        <input
          type={type}
          ref={ref}
          data-slot="input"
          className={cn(inputVariants({ size, variant }), className)}
          value={currentValue}
          onChange={handleChange}
          aria-invalid={error}
          {...props}
        />
      );
    }

    // With decorations, wrap in a container
    const containerSizes = {
      sm: "h-8",
      default: "h-10",
      lg: "h-12",
    };

    const iconSizes = {
      sm: "size-3.5",
      default: "size-4",
      lg: "size-5",
    };

    return (
      <div
        data-slot="input-wrapper"
        className={cn(
          "relative flex items-center rounded-md border bg-zinc-900 shadow-sm transition-colors",
          "focus-within:ring-2 focus-within:ring-eximia-400 focus-within:ring-offset-2 focus-within:ring-offset-zinc-950",
          variant === "default" && "border-zinc-700",
          variant === "filled" && "border-transparent bg-zinc-800",
          variant === "ghost" && "border-transparent bg-transparent shadow-none",
          error && "border-error ring-error/20",
          containerSizes[size || "default"],
          className
        )}
      >
        {/* Left icon or prefix */}
        {hasLeftContent && (
          <div className="flex items-center pl-3 text-zinc-400">
            {leftIcon && (
              <span className={cn(iconSizes[size || "default"])}>
                {leftIcon}
              </span>
            )}
            {prefix && (
              <span className={cn("text-zinc-500", size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm")}>
                {prefix}
              </span>
            )}
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          ref={ref}
          data-slot="input"
          className={cn(
            "flex-1 bg-transparent outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50",
            size === "sm" ? "px-2 text-xs" : size === "lg" ? "px-3 text-base" : "px-3 text-sm",
            hasLeftContent && "pl-2",
            hasRightContent && "pr-2"
          )}
          value={currentValue}
          onChange={handleChange}
          aria-invalid={error}
          {...props}
        />

        {/* Right icon, suffix, or clear button */}
        {hasRightContent && (
          <div className="flex items-center gap-1 pr-3 text-zinc-400">
            {suffix && (
              <span className={cn("text-zinc-500", size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm")}>
                {suffix}
              </span>
            )}
            {showClear && (
              <button
                type="button"
                onClick={handleClear}
                className={cn(
                  "rounded-sm hover:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-eximia-400",
                  iconSizes[size || "default"]
                )}
                aria-label="Clear input"
              >
                <X className="size-full" />
              </button>
            )}
            {rightIcon && !showClear && (
              <span className={cn(iconSizes[size || "default"])}>
                {rightIcon}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
export type { InputProps };
