"use client";

import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text"
          >
            {label}
          </label>
        )}
        {hint && !error && (
          <p className="text-xs text-muted -mt-0.5">{hint}</p>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full rounded-lg border px-3 py-2 text-sm text-text bg-white placeholder:text-gray-400 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
            error
              ? "border-danger focus:ring-danger"
              : "border-border hover:border-gray-300",
            className,
          ].join(" ")}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
