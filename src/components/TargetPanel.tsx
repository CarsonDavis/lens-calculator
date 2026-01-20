import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  targetFormatIdAtom,
  setTargetFocalLengthOverrideAtom,
  setTargetApertureOverrideAtom,
  equivalenceResultAtom,
} from '@/atoms';
import { VALIDATION } from '@/calc';
import { FormatDropdown } from './FormatDropdown';
import { NumberInput } from './NumberInput';
import { ResultDisplay } from './ResultDisplay';
import {
  formatFOV,
  formatDistance,
  formatCoC,
  formatBlurDisc,
  formatBlurPercent,
  formatOrPlaceholder,
  formatFocalLengthInput,
  formatApertureInputCalculated,
  formatCropFactor,
} from '@/utils/format';

interface ResetButtonProps {
  onClick: () => void;
  visible: boolean;
  ariaLabel: string;
}

function ResetButton({ onClick, visible, ariaLabel }: ResetButtonProps) {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        ml-2 p-1.5 rounded-md
        text-text-muted hover:text-text-secondary
        hover:bg-border/50
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-accent
      "
      aria-label={ariaLabel}
      title={ariaLabel}
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
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </button>
  );
}

export function TargetPanel() {
  const [formatId, setFormatId] = useAtom(targetFormatIdAtom);
  const setFocalLengthOverride = useSetAtom(setTargetFocalLengthOverrideAtom);
  const setApertureOverride = useSetAtom(setTargetApertureOverrideAtom);
  const result = useAtomValue(equivalenceResultAtom);

  const { target, isTargetFocalOverridden, isTargetApertureOverridden } =
    result;

  // Handle focal length change
  // If user clears the input (null), clear the override
  // If user enters a value, set the override
  const handleFocalLengthChange = (value: number | null) => {
    setFocalLengthOverride(value);
  };

  // Handle aperture change similarly
  const handleApertureChange = (value: number | null) => {
    setApertureOverride(value);
  };

  return (
    <div className="bg-surface border border-border rounded-md p-4">
      <h2 className="text-label uppercase tracking-wider text-text-secondary mb-4">
        Target
      </h2>

      <div className="space-y-3">
        {/* Format dropdown */}
        <div>
          <label
            htmlFor="target-format"
            className="block text-label text-text-secondary mb-1"
          >
            Format
          </label>
          <FormatDropdown
            id="target-format"
            value={formatId}
            onChange={setFormatId}
          />
        </div>

        {/* Focal length input - shows calculated value, can be overridden */}
        <div>
          <label
            htmlFor="target-focal"
            className="block text-label text-text-secondary mb-1"
          >
            Focal Length
          </label>
          <div className="flex items-center">
            <div className="flex-1">
              <NumberInput
                id="target-focal"
                value={target.focalLength}
                onChange={handleFocalLengthChange}
                min={VALIDATION.focalLength.min}
                max={VALIDATION.focalLength.max}
                suffix="mm"
                isOverridden={isTargetFocalOverridden}
                formatDisplayValue={formatFocalLengthInput}
              />
            </div>
            <ResetButton
              onClick={() => setFocalLengthOverride(null)}
              visible={isTargetFocalOverridden}
              ariaLabel="Reset focal length to calculated value"
            />
          </div>
        </div>

        {/* Aperture input - shows calculated value, can be overridden */}
        <div>
          <label
            htmlFor="target-aperture"
            className="block text-label text-text-secondary mb-1"
          >
            Aperture
          </label>
          <div className="flex items-center">
            <div className="flex-1">
              <NumberInput
                id="target-aperture"
                value={target.aperture}
                onChange={handleApertureChange}
                min={VALIDATION.aperture.min}
                max={VALIDATION.aperture.max}
                prefix="f/"
                isOverridden={isTargetApertureOverridden}
                formatDisplayValue={formatApertureInputCalculated}
              />
            </div>
            <ResetButton
              onClick={() => setApertureOverride(null)}
              visible={isTargetApertureOverridden}
              ariaLabel="Reset aperture to calculated value"
            />
          </div>
        </div>

        {/* Subject distance display (calculated, not editable) */}
        {target.subjectDistance !== undefined && (
          <div>
            <span className="block text-label text-text-secondary mb-1">
              Subject Distance
            </span>
            <div className="text-text-primary text-body tabular-nums py-2">
              {formatDistance(target.subjectDistance)}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <ResultDisplay
          label="Crop factor"
          value={formatCropFactor(result.cropFactor)}
        />
        <ResultDisplay
          label="FOV"
          value={`${formatFOV(target.aov.diagonal)} diagonal`}
        />
        <ResultDisplay label="CoC" value={formatCoC(target.format.coc)} />
        <ResultDisplay
          label="DOF"
          value={
            target.dof
              ? `${formatDistance(target.dof.nearLimit)} – ${formatDistance(target.dof.farLimit)}`
              : '—'
          }
        />
        <ResultDisplay
          label="Blur disc"
          value={formatOrPlaceholder(target.blurDisc, formatBlurDisc)}
        />
        {target.blurPercent !== undefined && (
          <ResultDisplay
            label="Blur %"
            value={formatBlurPercent(target.blurPercent)}
          />
        )}
      </div>
    </div>
  );
}
