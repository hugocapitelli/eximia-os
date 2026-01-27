import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon, type LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";

const iconVariants = cva("shrink-0", {
  variants: {
    size: {
      xs: "size-3",      // 12px
      sm: "size-4",      // 16px
      default: "size-5", // 20px
      lg: "size-6",      // 24px
      xl: "size-8",      // 32px
    },
    color: {
      default: "text-current",
      muted: "text-zinc-400",
      primary: "text-eximia-400",
      success: "text-green-400",
      warning: "text-yellow-400",
      error: "text-red-400",
      info: "text-blue-400",
    },
  },
  defaultVariants: {
    size: "default",
    color: "default",
  },
});

interface IconProps
  extends Omit<LucideProps, "size" | "color">,
    VariantProps<typeof iconVariants> {
  icon: LucideIcon;
}

function Icon({
  icon: IconComponent,
  size,
  color,
  className,
  strokeWidth = 2,
  ...props
}: IconProps) {
  return (
    <IconComponent
      data-slot="icon"
      className={cn(iconVariants({ size, color }), className)}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}

// Re-export commonly used icons for convenience
export {
  // Navigation
  Home,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  // Actions
  Plus,
  Minus,
  Edit,
  Trash2,
  Check,
  Copy,
  Share,
  Download,
  Upload,
  Search,
  Filter,
  Settings,
  MoreHorizontal,
  MoreVertical,
  Archive,
  Pause,
  Play,
  // Objects
  User,
  Users,
  Mail,
  Bell,
  Calendar,
  Clock,
  Folder,
  File,
  FileText,
  Image,
  Link,
  // Status
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  HelpCircle,
  Flame,
  // Modules (ExímIA specific)
  Target,       // Goals
  BookOpen,     // Academy
  Palette,      // Brand
  Compass,      // Journey
  Layers,       // PrototypOS
  Inbox,        // Inbox
  TrendingUp,   // Strategy
  Brain,        // AI/Agents
  Sparkles,     // AI suggestions
  // Misc
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Star,
  Heart,
  Bookmark,
  ExternalLink,
  RefreshCw,
  Loader2,
  LogOut,
  LogIn,
  // Additional icons for Journey module
  Zap,
  Award,
  Mic,
  CalendarDays,
  ListTodo,
  DollarSign,
  Briefcase,
} from "lucide-react";

export { Icon, iconVariants };
export type { IconProps };
