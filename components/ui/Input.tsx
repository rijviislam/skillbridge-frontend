import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5 font-body">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-body text-slate-900 placeholder:text-slate-400",
              "focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent",
              "transition-all duration-200",
              "disabled:bg-slate-50 disabled:text-slate-500",
              error && "border-red-400 focus:ring-red-400",
              icon && "pl-10",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500 font-body">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
