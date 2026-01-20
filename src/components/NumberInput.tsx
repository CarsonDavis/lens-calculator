import { useState, useCallback, useRef, type ChangeEvent } from 'react';

interface NumberInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  isOverridden?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
  /** Format the value for display when not focused */
  formatDisplayValue?: (value: number) => string;
}

/** Default formatter - shows up to 2 decimal places, trimming trailing zeros */
function defaultFormat(value: number): string {
  // Round to 2 decimal places to avoid floating point issues
  const rounded = Math.round(value * 100) / 100;
  // Use toFixed(2) then remove trailing zeros
  const str = rounded.toFixed(2);
  return str.replace(/\.?0+$/, '');
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 0.1,
  placeholder,
  prefix,
  suffix,
  disabled = false,
  isOverridden = false,
  className = '',
  id,
  'aria-label': ariaLabel,
  formatDisplayValue = defaultFormat,
}: NumberInputProps) {
  // Track internal string value during editing (only used when focused)
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute displayed value: use editing value when focused, otherwise format the prop value
  const displayValue =
    editingValue !== null
      ? editingValue
      : value !== null
        ? formatDisplayValue(value)
        : '';

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEditingValue(e.target.value);
  }, []);

  const handleFocus = useCallback(() => {
    // Start editing with the current formatted value
    setEditingValue(value !== null ? formatDisplayValue(value) : '');
  }, [value, formatDisplayValue]);

  const handleBlur = useCallback(() => {
    if (editingValue === null) return;

    // Empty input: set to null
    if (editingValue.trim() === '') {
      onChange(null);
      setEditingValue(null);
      return;
    }

    // Parse the value
    const parsed = parseFloat(editingValue);
    if (isNaN(parsed)) {
      // Invalid: revert to previous value (just clear editing state)
      setEditingValue(null);
      return;
    }

    // Clamp to bounds
    let clamped = parsed;
    if (min !== undefined && clamped < min) {
      clamped = min;
    }
    if (max !== undefined && clamped > max) {
      clamped = max;
    }

    onChange(clamped);
    setEditingValue(null);
  }, [editingValue, onChange, min, max]);

  return (
    <div className={`flex items-center ${className}`}>
      {prefix && (
        <span className="text-text-secondary mr-1 text-body">{prefix}</span>
      )}
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        id={id}
        aria-label={ariaLabel}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        step={step}
        className={`
          w-full bg-surface border border-border rounded-md px-3 py-2
          text-body text-text-primary tabular-nums
          placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isOverridden ? 'font-medium' : 'font-normal'}
        `}
      />
      {suffix && (
        <span className="text-text-secondary ml-2 text-body">{suffix}</span>
      )}
    </div>
  );
}
