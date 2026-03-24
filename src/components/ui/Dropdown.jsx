import { cn } from "../../utils/cn";

export default function Dropdown({ label, id, options, className, ...props }) {
  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label className="text-small font-medium text-gray-700" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <select
        className="w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-700 outline-none focus:border-primary-light focus:ring-2 focus:ring-blue-100"
        id={id}
        {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
