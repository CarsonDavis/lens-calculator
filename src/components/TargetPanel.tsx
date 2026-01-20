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
} from '@/utils/format';

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

        {/* Aperture input - shows calculated value, can be overridden */}
        <div>
          <label
            htmlFor="target-aperture"
            className="block text-label text-text-secondary mb-1"
          >
            Aperture
          </label>
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
