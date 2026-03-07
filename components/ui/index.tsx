// Card
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-100 shadow-card transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Badge
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-body", variants[variant], className)}>
      {children}
    </span>
  );
}

// Avatar
interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-lg", xl: "h-20 w-20 text-2xl" };
  const initials = name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "?";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover flex-shrink-0", sizes[size], className)}
      />
    );
  }
  return (
    <div className={cn("rounded-full bg-brand-500 flex items-center justify-center font-display font-bold text-white flex-shrink-0", sizes[size], className)}>
      {initials}
    </div>
  );
}

// Star Rating
interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md";
  showValue?: boolean;
}

export function Rating({ value, max = 5, size = "sm", showValue = true }: RatingProps) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={cn(starSize, i < Math.round(value) ? "text-amber-400" : "text-slate-200")}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {showValue && <span className="text-xs text-slate-500 ml-0.5 font-body">{value?.toFixed(1)}</span>}
    </div>
  );
}

// Spinner
export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("h-8 w-8 rounded-full border-2 border-slate-200 border-t-brand-500 animate-spin", className)} />
  );
}

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5 font-body">{label}</label>}
      <select
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-body text-slate-900",
          "focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent",
          "transition-all duration-200 cursor-pointer",
          error && "border-red-400",
          className
        )}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-500 font-body">{error}</p>}
    </div>
  );
}

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5 font-body">{label}</label>}
      <textarea
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-body text-slate-900 placeholder:text-slate-400 resize-none",
          "focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent",
          "transition-all duration-200",
          error && "border-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500 font-body">{error}</p>}
    </div>
  );
}

// EmptyState
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-slate-300">{icon}</div>}
      <h3 className="font-display text-lg font-semibold text-slate-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 font-body mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  );
}

// StatusBadge
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: "success" | "info" | "danger" | "warning" | "default" }> = {
    confirmed: { label: "Confirmed", variant: "info" },
    completed: { label: "Completed", variant: "success" },
    cancelled: { label: "Cancelled", variant: "danger" },
    active: { label: "Active", variant: "success" },
    banned: { label: "Banned", variant: "danger" },
  };
  const config = map[status] || { label: status, variant: "default" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
