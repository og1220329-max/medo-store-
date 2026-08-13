import { cn } from "@/lib/utils";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type Variant = "primary" | "outline" | "ghost" | "danger" | "glass" | "white";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-l from-volt-600 to-glow-600 text-white shadow-glow hover:shadow-glow-lg hover:brightness-110",
  outline:
    "border border-volt-500/40 text-volt-300 hover:border-volt-400 hover:bg-volt-500/10",
  ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
  danger: "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20",
  glass: "glass text-slate-100 hover:bg-white/10",
  white: "bg-white text-night-900 hover:bg-slate-200",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-xl gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-13 px-7 text-base rounded-2xl gap-2.5",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex select-none items-center justify-center font-bold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 focus-ring",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

interface BadgeProps {
  children: ReactNode;
  tone?: "volt" | "rose" | "emerald" | "amber" | "sky";
  className?: string;
}

const TONES: Record<NonNullable<BadgeProps["tone"]>, string> = {
  volt: "bg-volt-500/15 text-volt-300 border-volt-500/30",
  rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  sky: "bg-sky-500/15 text-sky-300 border-sky-500/30",
};

export function Badge({ children, tone = "volt", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, className, children }: FieldProps) {
  return (
    <label className={cn("block", className)}>
      {label && (
        <span className="mb-1.5 block text-sm font-bold text-slate-200">
          {label}
          {!error && hint && (
            <span className="mr-2 text-xs font-normal text-slate-500">{hint}</span>
          )}
        </span>
      )}
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs font-semibold text-rose-400">{error}</span>
      ) : hint && label ? null : hint ? (
        <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}

const fieldBase =
  "w-full rounded-xl border border-white/10 bg-night-800/70 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 transition focus:border-volt-500/60 focus:bg-night-800 focus:ring-2 focus:ring-volt-500/20 focus:outline-none";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-24 resize-y", className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, "cursor-pointer appearance-none", className)} {...props}>
      {children}
    </select>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white/5 text-slate-500">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-200">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}