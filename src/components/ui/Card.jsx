import { cn } from "../../utils/cn";

export default function Card({ children, className }) {
  return (
    <section
      className={cn(
        "rounded-card border border-border bg-white p-6 shadow-soft",
        className,
      )}>
      {children}
    </section>
  );
}
