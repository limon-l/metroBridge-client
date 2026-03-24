import { cn } from "../../utils/cn";

const variants = {
  default: "bg-slate-100 text-neutral",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  accent: "bg-red-100 text-accent",
};

export default function Badge({ children, variant = "default", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-small font-medium",
        variants[variant],
        className,
      )}>
      {children}
    </span>
  );
}
