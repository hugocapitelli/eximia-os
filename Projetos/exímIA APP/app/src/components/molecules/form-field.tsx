"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label, Input, Text, type InputProps } from "@/components/ui";

interface FormFieldProps extends Omit<InputProps, "error"> {
  label: string;
  name: string;
  description?: string;
  error?: string;
  required?: boolean;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      name,
      description,
      error,
      required,
      className,
      ...inputProps
    },
    ref
  ) => {
    const id = React.useId();
    const inputId = `${id}-${name}`;
    const descriptionId = `${id}-${name}-description`;
    const errorId = `${id}-${name}-error`;

    return (
      <div className={cn("space-y-2", className)}>
        <Label
          htmlFor={inputId}
          required={required}
          color={error ? "error" : "default"}
        >
          {label}
        </Label>

        <Input
          ref={ref}
          id={inputId}
          name={name}
          error={!!error}
          aria-describedby={
            error ? errorId : description ? descriptionId : undefined
          }
          aria-invalid={!!error}
          aria-required={required}
          {...inputProps}
        />

        {description && !error && (
          <Text
            id={descriptionId}
            size="xs"
            color="muted"
          >
            {description}
          </Text>
        )}

        {error && (
          <Text
            id={errorId}
            size="xs"
            color="error"
            role="alert"
          >
            {error}
          </Text>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export { FormField };
export type { FormFieldProps };
