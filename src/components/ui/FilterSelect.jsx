import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { cn } from "../../utils/cn";

export default function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  className,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selectedOption = useMemo(
    () => options.find((item) => item.value === value),
    [options, value],
  );

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-card border border-border bg-white px-3 py-2 text-small text-gray-700 transition-all duration-200",
          open
            ? "ring-2 ring-blue-100 border-primary-light"
            : "hover:border-primary-light",
        )}
        onClick={() => setOpen((prev) => !prev)}>
        <span>{selectedOption?.label || placeholder}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={cn(
            "text-xs text-neutral transition-transform duration-200",
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      <div
        className={cn(
          "absolute z-20 mt-2 w-full origin-top rounded-card border border-border bg-white shadow-soft transition-all duration-200",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-95 opacity-0",
        )}>
        <div className="max-h-56 overflow-y-auto py-1">
          {options.map((item) => {
            const selected = item.value === value;
            return (
              <button
                key={item.value || "empty"}
                type="button"
                onClick={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-left text-small transition-colors duration-150",
                  selected
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-slate-50",
                )}>
                <span>{item.label}</span>
                {selected ? (
                  <FontAwesomeIcon icon={faCheck} className="text-xs" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
