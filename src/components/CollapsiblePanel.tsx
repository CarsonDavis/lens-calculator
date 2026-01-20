import { useState, type ReactNode } from 'react';

interface CollapsiblePanelProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function CollapsiblePanel({
  title,
  children,
  defaultOpen = false,
}: CollapsiblePanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full flex items-center justify-between
          px-4 py-3 text-left
          text-label uppercase tracking-wider text-text-secondary
          hover:bg-border/50 transition-colors duration-150
        "
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transform transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-200 ease-out
          ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}
