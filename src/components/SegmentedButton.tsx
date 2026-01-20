interface SegmentedButtonOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedButtonProps<T extends string> {
  options: SegmentedButtonOption<T>[];
  value: T;
  onChange: (value: T) => void;
  name: string;
  'aria-label'?: string;
}

export function SegmentedButton<T extends string>({
  options,
  value,
  onChange,
  name,
  'aria-label': ariaLabel,
}: SegmentedButtonProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex rounded-md border border-border overflow-hidden"
    >
      {options.map((option, index) => (
        <label
          key={option.value}
          className={`
            relative px-3 py-1.5 text-body cursor-pointer
            transition-colors duration-150
            ${index > 0 ? 'border-l border-border' : ''}
            ${
              value === option.value
                ? 'bg-accent text-white'
                : 'bg-surface text-text-secondary hover:bg-border'
            }
          `}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
