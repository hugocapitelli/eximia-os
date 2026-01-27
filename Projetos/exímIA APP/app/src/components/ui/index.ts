// ==========================================================================
// ExímIA OS - UI Components (Atoms)
// Based on shadcn/ui with ExímIA theme
// Version: 1.0.0 (BLOCO 0.4)
// ==========================================================================

// Button
export { Button, buttonVariants } from "./button";
export type { ButtonProps } from "./button";

// Input
export { Input, inputVariants } from "./input";
export type { InputProps } from "./input";

// Card
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";

// Badge
export { Badge, badgeVariants } from "./badge";
export type { BadgeProps } from "./badge";

// Avatar
export { Avatar, AvatarGroup, avatarVariants, statusVariants } from "./avatar";
export type { AvatarProps, AvatarGroupProps } from "./avatar";

// Spinner
export { Spinner, spinnerVariants } from "./spinner";

// Icon (Lucide wrapper + re-exports)
export { Icon, iconVariants } from "./icon";
export type { IconProps } from "./icon";

// Re-export commonly used icons
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
  // Modules
  Target,
  BookOpen,
  Palette,
  Compass,
  Layers,
  Inbox,
  TrendingUp,
  Brain,
  Sparkles,
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
} from "./icon";

// Typography
export {
  Heading,
  headingVariants,
  Text,
  textVariants,
  Label,
  labelVariants,
  Code,
  Kbd,
} from "./typography";
export type {
  HeadingProps,
  TextProps,
  LabelProps,
  CodeProps,
  KbdProps,
} from "./typography";
