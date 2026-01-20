import { useAtom } from 'jotai';
import { equivalenceMethodAtom, matchModeAtom } from '@/atoms';
import type { EquivalenceMethod, MatchMode } from '@/calc';
import { CollapsiblePanel } from './CollapsiblePanel';
import { SegmentedButton } from './SegmentedButton';

const equivalenceOptions: { value: EquivalenceMethod; label: string }[] = [
  { value: 'diagonal', label: 'Diagonal' },
  { value: 'width', label: 'Width' },
  { value: 'height', label: 'Height' },
  { value: 'area', label: 'Area' },
];

const matchModeOptions: { value: MatchMode; label: string }[] = [
  { value: 'blur_disc', label: 'Blur disc' },
  { value: 'dof', label: 'DOF' },
];

export function OptionsPanel() {
  const [equivalenceMethod, setEquivalenceMethod] = useAtom(
    equivalenceMethodAtom
  );
  const [matchMode, setMatchMode] = useAtom(matchModeAtom);

  return (
    <CollapsiblePanel title="Options">
      <div className="space-y-4">
        <div>
          <span className="block text-label text-text-secondary mb-2">
            Equivalence
          </span>
          <SegmentedButton
            name="equivalence-method"
            options={equivalenceOptions}
            value={equivalenceMethod}
            onChange={setEquivalenceMethod}
            aria-label="Equivalence method"
          />
        </div>

        <div>
          <span className="block text-label text-text-secondary mb-2">
            Match
          </span>
          <SegmentedButton
            name="match-mode"
            options={matchModeOptions}
            value={matchMode}
            onChange={setMatchMode}
            aria-label="Match mode"
          />
        </div>
      </div>
    </CollapsiblePanel>
  );
}
