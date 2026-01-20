import { useAtomValue } from 'jotai';
import { groupedFormatsAtom, type GroupedFormats } from '@/atoms';
import type { Format } from '@/calc';

interface FormatDropdownProps {
  value: string;
  onChange: (formatId: string) => void;
  id?: string;
  'aria-label'?: string;
}

const categoryLabels: Record<keyof GroupedFormats, string> = {
  small: 'Small Format',
  medium: 'Medium Format',
  large: 'Large Format',
  cinema: 'Cinema',
  custom: 'Custom',
};

const categoryOrder: (keyof GroupedFormats)[] = [
  'small',
  'medium',
  'large',
  'cinema',
  'custom',
];

export function FormatDropdown({
  value,
  onChange,
  id,
  'aria-label': ariaLabel,
}: FormatDropdownProps) {
  const grouped = useAtomValue(groupedFormatsAtom);

  return (
    <select
      id={id}
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full bg-surface border border-border rounded-md px-3 py-2
        text-body text-text-primary
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0
        cursor-pointer
      "
    >
      {categoryOrder.map((category) => {
        const formats = grouped[category];
        if (formats.length === 0) return null;

        return (
          <optgroup key={category} label={categoryLabels[category]}>
            {formats.map((format: Format) => (
              <option key={format.id} value={format.id}>
                {format.name}
              </option>
            ))}
          </optgroup>
        );
      })}
    </select>
  );
}
