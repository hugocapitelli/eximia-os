import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardContent,
  Text,
  Badge,
  TrendingUp,
} from "@/components/ui";
import { TrendingDown, Minus } from "lucide-react";

interface MetricCardProps extends React.ComponentProps<typeof Card> {
  label?: string;
  title?: string; // Alias for label
  value: string | number;
  icon?: React.ReactNode;
  period?: string;
  subtitle?: string; // Additional context
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "neutral"; // Direct trend control
  progress?: number;
  loading?: boolean;
}

function MetricCard({
  label,
  title,
  value,
  icon,
  period,
  subtitle,
  change,
  changeLabel,
  trend: propTrend,
  progress,
  loading = false,
  className,
  ...props
}: MetricCardProps) {
  // Use title as fallback for label
  const displayLabel = label || title || "";
  // Calculate trend from change if not provided directly
  const trend = propTrend || (change !== undefined ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : undefined);

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const trendColor = trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-zinc-400";
  const trendBg = trend === "up" ? "bg-green-400/10" : trend === "down" ? "bg-red-400/10" : "bg-zinc-400/10";

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="flex items-center justify-center size-8 rounded-lg bg-zinc-800 text-zinc-400">
                {icon}
              </div>
            )}
            <div>
              <Text size="sm" color="muted" className="leading-none">
                {displayLabel}
              </Text>
              {(period || subtitle) && (
                <Text size="xs" color="subtle" className="mt-0.5">
                  {subtitle || period}
                </Text>
              )}
            </div>
          </div>

          {trend && (
            <Badge
              variant="outline"
              size="sm"
              className={cn("gap-1", trendBg, trendColor, "border-transparent")}
            >
              <TrendIcon className="size-3" />
              {Math.abs(change || 0)}%
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {loading ? (
          <div className="h-9 bg-zinc-800 rounded animate-pulse" />
        ) : (
          <Text
            as="div"
            size="xl"
            weight="bold"
            className="text-3xl tabular-nums tracking-tight"
          >
            {value}
          </Text>
        )}

        {changeLabel && (
          <Text size="xs" color="muted" className="mt-1">
            {changeLabel}
          </Text>
        )}

        {progress !== undefined && (
          <div className="mt-3">
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-eximia-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <Text size="xs" color="muted" className="mt-1">
              {progress}% concluído
            </Text>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { MetricCard };
export type { MetricCardProps };
