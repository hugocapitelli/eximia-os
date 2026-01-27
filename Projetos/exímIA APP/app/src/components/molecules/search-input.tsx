"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input, Kbd, Spinner, Search } from "@/components/ui";

interface SearchInputProps extends Omit<React.ComponentProps<"input">, "size"> {
  loading?: boolean;
  showShortcut?: boolean;
  shortcutKey?: string;
  onSearch?: (value: string) => void;
  size?: "sm" | "default" | "lg";
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      loading = false,
      showShortcut = true,
      shortcutKey = "K",
      onSearch,
      size = "default",
      placeholder = "Buscar...",
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      props.onChange?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(value);
      }
      props.onKeyDown?.(e);
    };

    const handleClear = () => {
      setValue("");
      onSearch?.("");
    };

    return (
      <div className={cn("relative", className)}>
        <Input
          ref={ref}
          type="search"
          size={size}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          leftIcon={
            loading ? (
              <Spinner size="sm" />
            ) : (
              <Search className="size-4 text-zinc-400" />
            )
          }
          clearable
          onClear={handleClear}
          className="pr-16"
          {...props}
        />

        {showShortcut && !value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
            <Kbd>⌘</Kbd>
            <Kbd>{shortcutKey}</Kbd>
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
export type { SearchInputProps };
