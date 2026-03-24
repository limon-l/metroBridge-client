import { cn } from "../../utils/cn";

export default function InputField({
  label,
  id,
  error,
  className,
  hint,
  required,
  ...props
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label className="text-small font-medium text-gray-700" htmlFor={id}>
          {label}
          {required ? <span className="text-accent"> *</span> : null}
        </label>
      ) : null}
      <input
        className={cn(
          "w-full rounded-card border bg-white px-4 py-3 text-body text-gray-800 outline-none transition",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-border focus:border-primary-light focus:ring-2 focus:ring-blue-100",
        )}
        id={id}
        {...props}
      />
      {error ? (
        <p className="text-small text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-small text-neutral">{hint}</p>
      ) : null}
    </div>
  );
}
