"use client";

import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-zinc-50 font-medium select-none",
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-xs",
        default: "size-10 text-sm",
        lg: "size-12 text-base",
        xl: "size-16 text-lg",
        "2xl": "size-20 text-xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const statusVariants = cva(
  "absolute rounded-full border-2 border-zinc-950",
  {
    variants: {
      status: {
        online: "bg-green-500",
        offline: "bg-zinc-500",
        busy: "bg-red-500",
        away: "bg-yellow-500",
      },
      size: {
        xs: "size-1.5 -bottom-0 -right-0",
        sm: "size-2 -bottom-0 -right-0",
        default: "size-2.5 bottom-0 right-0",
        lg: "size-3 bottom-0.5 right-0.5",
        xl: "size-3.5 bottom-1 right-1",
        "2xl": "size-4 bottom-1 right-1",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface AvatarProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  status?: "online" | "offline" | "busy" | "away";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Avatar({
  className,
  size,
  src,
  alt = "",
  fallback,
  status,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const showImage = src && !imageError;
  const initials = fallback ? getInitials(fallback) : alt ? getInitials(alt) : "?";

  return (
    <div
      data-slot="avatar"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          unoptimized={src.startsWith("data:") || src.startsWith("blob:")}
        />
      ) : (
        <span className="flex items-center justify-center">
          {initials}
        </span>
      )}

      {status && (
        <span
          data-slot="avatar-status"
          className={cn(statusVariants({ status, size }))}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

// Avatar Group for showing multiple avatars
interface AvatarGroupProps extends React.ComponentProps<"div"> {
  max?: number;
  size?: VariantProps<typeof avatarVariants>["size"];
  children: React.ReactNode;
}

function AvatarGroup({
  className,
  max = 4,
  size = "default",
  children,
  ...props
}: AvatarGroupProps) {
  const avatars = React.Children.toArray(children);
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  const overlapMap = {
    xs: "-space-x-2",
    sm: "-space-x-2.5",
    default: "-space-x-3",
    lg: "-space-x-4",
    xl: "-space-x-5",
    "2xl": "-space-x-6",
  };

  return (
    <div
      data-slot="avatar-group"
      className={cn("flex items-center", overlapMap[size || "default"], className)}
      {...props}
    >
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className="ring-2 ring-zinc-950 rounded-full"
          style={{ zIndex: visibleAvatars.length - index }}
        >
          {React.isValidElement(avatar)
            ? React.cloneElement(avatar as React.ReactElement<AvatarProps>, { size })
            : avatar}
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={cn(
            avatarVariants({ size }),
            "ring-2 ring-zinc-950 bg-zinc-700 text-zinc-300"
          )}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

export { Avatar, AvatarGroup, avatarVariants, statusVariants };
export type { AvatarProps, AvatarGroupProps };
