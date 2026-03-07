import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-body font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-brand hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
      secondary: "bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0",
      ghost: "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900",
      danger: "bg-red-500 text-white hover:bg-red-600 hover:-translate-y-0.5",
      outline: "border-2 border-brand-500 text-brand-600 hover:bg-brand-50 hover:-translate-y-0.5",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-7 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
