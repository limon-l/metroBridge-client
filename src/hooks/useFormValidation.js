import { useMemo } from "react";

export default function useFormValidation(values) {
  return useMemo(() => {
    const errors = {};
    Object.entries(values).forEach(([key, value]) => {
      if (!String(value || "").trim()) {
        errors[key] = "This field is required.";
      }
    });
    return errors;
  }, [values]);
}
