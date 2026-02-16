/**
 * FormTextarea Component
 * Reusable textarea with label, error state, and character count
 */

"use client";

import { forwardRef } from "react";

interface FormTextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    showCharCount?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    (
        {
            label,
            error,
            helperText,
            required,
            showCharCount,
            maxLength,
            className = "",
            ...props
        },
        ref
    ) => {
        const currentLength = props.value?.toString().length || 0;

        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <textarea
                    ref={ref}
                    maxLength={maxLength}
                    className={`
            block w-full px-4 py-2.5 border rounded-lg
            text-gray-900 placeholder-gray-400
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            resize-none
            ${error
                            ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 bg-white"
                        }
            ${props.disabled ? "bg-gray-100 cursor-not-allowed" : ""}
            ${className}
          `}
                    {...props}
                />
                <div className="flex justify-between items-center mt-1">
                    <div className="flex-1">
                        {error && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
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
                            <p className="text-sm text-gray-500">{helperText}</p>
                        )}
                    </div>
                    {showCharCount && maxLength && (
                        <p className="text-xs text-gray-400">
                            {currentLength}/{maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

FormTextarea.displayName = "FormTextarea";
