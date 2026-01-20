import { useAtom, useAtomValue } from 'jotai';
import {
  sourceFormatIdAtom,
  sourceFocalLengthAtom,
  sourceApertureAtom,
  subjectDistanceAtom,
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
  formatApertureInputUser,
  formatDistanceInput,
} from '@/utils/format';

export function SourcePanel() {
  const [formatId, setFormatId] = useAtom(sourceFormatIdAtom);
  const [focalLength, setFocalLength] = useAtom(sourceFocalLengthAtom);
  const [aperture, setAperture] = useAtom(sourceApertureAtom);
  const [subjectDistance, setSubjectDistance] = useAtom(subjectDistanceAtom);
  const result = useAtomValue(equivalenceResultAtom);

  const handleFocalLengthChange = (value: number | null) => {
    if (value !== null) {
      setFocalLength(value);
    }
  };

  const handleApertureChange = (value: number | null) => {
    if (value !== null) {
      setAperture(value);
    }
  };

  const { source } = result;

  return (
    <div className="bg-surface border border-border rounded-md p-4">
      <h2 className="text-label uppercase tracking-wider text-text-secondary mb-4">
        Source
      </h2>

      <div className="space-y-3">
        {/* Format dropdown */}
        <div>
          <label
            htmlFor="source-format"
            className="block text-label text-text-secondary mb-1"
          >
            Format
          </label>
          <FormatDropdown
            id="source-format"
            value={formatId}
            onChange={setFormatId}
          />
        </div>

        {/* Focal length input */}
        <div>
          <label
            htmlFor="source-focal"
            className="block text-label text-text-secondary mb-1"
          >
            Focal Length
          </label>
          <NumberInput
            id="source-focal"
            value={focalLength}
            onChange={handleFocalLengthChange}
            min={VALIDATION.focalLength.min}
            max={VALIDATION.focalLength.max}
            suffix="mm"
            formatDisplayValue={formatFocalLengthInput}
          />
        </div>

        {/* Aperture input */}
        <div>
          <label
            htmlFor="source-aperture"
            className="block text-label text-text-secondary mb-1"
          >
            Aperture
          </label>
          <NumberInput
            id="source-aperture"
            value={aperture}
            onChange={handleApertureChange}
            min={VALIDATION.aperture.min}
            max={VALIDATION.aperture.max}
            prefix="f/"
            formatDisplayValue={formatApertureInputUser}
          />
        </div>

        {/* Subject distance input (optional) */}
        <div>
          <label
            htmlFor="source-distance"
            className="block text-label text-text-secondary mb-1"
          >
            Subject Distance
          </label>
          <NumberInput
            id="source-distance"
            value={subjectDistance}
            onChange={setSubjectDistance}
            min={focalLength + 1}
            max={VALIDATION.subjectDistanceMax}
            suffix="mm"
            placeholder="optional"
            formatDisplayValue={formatDistanceInput}
          />
        </div>
      </div>

      {/* Results */}
      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <ResultDisplay
          label="FOV"
          value={`${formatFOV(source.aov.diagonal)} diagonal`}
        />
        <ResultDisplay label="CoC" value={formatCoC(source.format.coc)} />
        <ResultDisplay
          label="DOF"
          value={
            source.dof
              ? `${formatDistance(source.dof.nearLimit)} – ${formatDistance(source.dof.farLimit)}`
              : '—'
          }
        />
        <ResultDisplay
          label="Blur disc"
          value={formatOrPlaceholder(source.blurDisc, formatBlurDisc)}
        />
        {source.blurPercent !== undefined && (
          <ResultDisplay
            label="Blur %"
            value={formatBlurPercent(source.blurPercent)}
          />
        )}
      </div>
    </div>
  );
}
