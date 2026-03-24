import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";

export default function MotionReveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(node);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.18,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        isVisible ? "translate-y-0 opacity-100" : "opacity-0",
        className,
      )}
      ref={ref}
      style={{
        transform: isVisible ? "translateY(0px)" : `translateY(${y}px)`,
        transitionDelay: `${delay}ms`,
      }}>
      {children}
    </div>
  );
}
