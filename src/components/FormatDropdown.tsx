import { useState, useRef, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { groupedFormatsAtom, type GroupedFormats } from '@/atoms';
import { CustomFormatModal } from './CustomFormatModal';
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

const CUSTOM_OPTION_VALUE = '__custom__';

export function FormatDropdown({
  value,
  onChange,
  id,
  'aria-label': ariaLabel,
}: FormatDropdownProps) {
  const grouped = useAtomValue(groupedFormatsAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormat, setEditFormat] = useState<Format | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Find the currently selected format
  const allFormats = categoryOrder.flatMap((cat) => grouped[cat]);
  const selectedFormat = allFormats.find((f) => f.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    }
  };

  const handleSelect = (formatId: string) => {
    if (formatId === CUSTOM_OPTION_VALUE) {
      setEditFormat(null);
      setIsModalOpen(true);
    } else {
      onChange(formatId);
    }
    setIsOpen(false);
  };

  const handleEdit = (format: Format, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditFormat(format);
    setIsModalOpen(true);
    setIsOpen(false);
  };

  const handleModalSave = (formatId: string) => {
    onChange(formatId);
  };

  return (
    <>
      <div ref={dropdownRef} className="relative" onKeyDown={handleKeyDown}>
        {/* Trigger button */}
        <button
          ref={buttonRef}
          id={id}
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="
            w-full bg-surface border border-border rounded-md px-3 py-2
            text-body text-text-primary text-left
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0
            cursor-pointer flex items-center justify-between
          "
        >
          <span>{selectedFormat?.name || 'Select format'}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            role="listbox"
            className="
              absolute z-40 mt-1 w-full bg-surface border border-border rounded-md
              shadow-lg max-h-80 overflow-auto
            "
          >
            {categoryOrder.map((category) => {
              const formats = grouped[category];
              if (formats.length === 0 && category !== 'custom') return null;

              return (
                <div key={category}>
                  {/* Category header */}
                  <div className="px-2 py-1 text-label text-text-muted uppercase tracking-wider sticky top-0 bg-surface">
                    {categoryLabels[category]}
                  </div>

                  {/* Format options */}
                  {formats.map((format: Format) => (
                    <div
                      key={format.id}
                      role="option"
                      aria-selected={format.id === value}
                      onClick={() => handleSelect(format.id)}
                      className={`
                        pl-4 pr-2 py-1 cursor-pointer flex items-center justify-between group
                        ${format.id === value ? 'bg-accent/10 text-accent' : 'hover:bg-border/50'}
                      `}
                    >
                      <span className="text-body">{format.name}</span>
                      {format.isCustom && (
                        <button
                          onClick={(e) => handleEdit(format, e)}
                          className="
                            opacity-0 group-hover:opacity-100
                            p-1 -m-1 rounded text-text-muted hover:text-text-primary
                            focus:outline-none focus:opacity-100 focus:ring-2 focus:ring-accent
                          "
                          aria-label={`Edit ${format.name}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add "Custom..." option at the end of custom category */}
                  {category === 'custom' && (
                    <div
                      role="option"
                      aria-selected={false}
                      onClick={() => handleSelect(CUSTOM_OPTION_VALUE)}
                      className="pl-4 pr-2 py-1 cursor-pointer hover:bg-border/50 text-accent"
                    >
                      <span className="text-body">+ Add Custom...</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom format modal */}
      <CustomFormatModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditFormat(null);
        }}
        onSave={handleModalSave}
        editFormat={editFormat}
      />
    </>
  );
}
