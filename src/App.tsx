import { useState, useCallback } from 'react';
import { useUrlSync } from '@/atoms';
import { SourcePanel } from '@/components/SourcePanel';
import { TargetPanel } from '@/components/TargetPanel';
import { OptionsPanel } from '@/components/OptionsPanel';
import { SensorOverlay } from '@/components/SensorOverlay';
import { InfoPanel } from '@/components/InfoPanel';

export default function App() {
  // Sync state with URL for shareable links
  useUrlSync();

  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <div className="mx-auto max-w-content px-4 py-6">
      {/* Header with share button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-text-primary">
          Lens Calculator
        </h1>
        <button
          onClick={handleShare}
          className="
            flex items-center gap-1.5
            px-3 py-1.5 text-sm rounded-md
            bg-surface border border-border
            text-text-secondary hover:text-text-primary
            hover:border-text-secondary
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-accent
          "
          aria-label="Copy link to clipboard"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {/* Options panel (collapsed by default) */}
      <div className="mb-4">
        <OptionsPanel />
      </div>

      {/* Main panels - responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <SourcePanel />
        <TargetPanel />
      </div>

      {/* Sensor overlay visualization */}
      <div className="mb-4">
        <SensorOverlay />
      </div>

      {/* Information panel (collapsed by default) */}
      <InfoPanel />
    </div>
  );
}
