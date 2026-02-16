/**
 * Form Validation Utilities
 * Reusable validation functions for forms
 */

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
  message?: string;
}

export function validateField(
  value: unknown,
  rules: ValidationRule,
): string | undefined {
  // Required check
  if (rules.required) {
    if (value === null || value === undefined || value === "") {
      return rules.message || "This field is required";
    }
    if (typeof value === "string" && !value.trim()) {
      return rules.message || "This field is required";
    }
  }

  // Skip other validations if value is empty and not required
  if (!value && !rules.required) {
    return undefined;
  }

  // Min number check
  if (rules.min !== undefined && typeof value === "number") {
    if (value < rules.min) {
      return rules.message || `Value must be at least ${rules.min}`;
    }
  }

  // Max number check
  if (rules.max !== undefined && typeof value === "number") {
    if (value > rules.max) {
      return rules.message || `Value must be at most ${rules.max}`;
    }
  }

  // Min length check
  if (rules.minLength !== undefined && typeof value === "string") {
    if (value.length < rules.minLength) {
      return rules.message || `Must be at least ${rules.minLength} characters`;
    }
  }

  // Max length check
  if (rules.maxLength !== undefined && typeof value === "string") {
    if (value.length > rules.maxLength) {
      return rules.message || `Must be at most ${rules.maxLength} characters`;
    }
  }

  // Pattern check
  if (rules.pattern && typeof value === "string") {
    if (!rules.pattern.test(value)) {
      return rules.message || "Invalid format";
    }
  }

  // Custom validation
  if (rules.custom && typeof rules.custom === "function") {
    if (!rules.custom(value)) {
      return rules.message || "Validation failed";
    }
  }

  return undefined;
}

/**
 * Common validation patterns
 */
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s-()]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphabetic: /^[a-zA-Z\s]+$/,
  numeric: /^\d+$/,
};

/**
 * Validate multiple fields at once
 */
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  rules: Record<keyof T, ValidationRule>,
): Record<keyof T, string | undefined> {
  const errors = {} as Record<keyof T, string | undefined>;

  for (const key in rules) {
    const error = validateField(data[key], rules[key]);
    if (error) {
      errors[key] = error;
    }
  }

  return errors;
}
