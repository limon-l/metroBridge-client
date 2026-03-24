import { cn } from "../../utils/cn";

const variantClasses = {
  primary:
    "bg-primary text-white hover:bg-primary-light active:bg-primary-dark transition-colors duration-150",
  secondary:
    "border border-border bg-white text-primary hover:bg-slate-50 active:bg-slate-100 transition-colors duration-150",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition-colors duration-150",
  cta: "bg-accent text-white hover:bg-red-700 active:bg-red-800 transition-colors duration-150",
};

const sizeClasses = {
  sm: "px-3 py-2 text-small",
  md: "px-4 py-2.5 text-body",
  lg: "px-5 py-3 text-body",
};

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-card font-semibold transition-all duration-200 hover:shadow-soft hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100 disabled:hover:shadow-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      type={type}
      {...props}>
      {children}
    </button>
  );
}
