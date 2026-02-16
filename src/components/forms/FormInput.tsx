/**
 * FormInput Component
 * Reusable text input with label, error state, and optional features
 */

"use client";

import { forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
    required?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, helperText, required, className = "", ...props }, ref) => {
        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                    ref={ref}
                    className={`
            block w-full px-4 py-2.5 border rounded-lg
            text-gray-900 placeholder-gray-400
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error
                            ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 bg-white"
                        }
            ${props.disabled ? "bg-gray-100 cursor-not-allowed" : ""}
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

FormInput.displayName = "FormInput";
