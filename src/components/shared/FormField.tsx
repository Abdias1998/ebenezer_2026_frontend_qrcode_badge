import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/** Libellé + champ + message d'erreur, au style des formulaires d'inscription. */
export function FormField({
  id,
  label,
  required,
  optional,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={id} className="field-label">
        {label} {required && <span className="required-star">*</span>}
        {optional && (
          <span className="text-gray-400 font-normal">(facultatif)</span>
        )}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
