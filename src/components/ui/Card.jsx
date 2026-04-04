import { cn } from "../../utils/cn";

export default function Card({ children, className, onClick }) {
  return (
    <section
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-card border border-border bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        className,
      )}>
      {children}
    </section>
  );
}
