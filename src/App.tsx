import { useAtomValue } from 'jotai';
import { equivalenceResultAtom } from '@/atoms';
import { SourcePanel } from '@/components/SourcePanel';
import { TargetPanel } from '@/components/TargetPanel';
import { OptionsPanel } from '@/components/OptionsPanel';
import { SensorOverlay } from '@/components/SensorOverlay';
import { InfoPanel } from '@/components/InfoPanel';
import { formatCropFactor } from '@/utils/format';

export default function App() {
  const result = useAtomValue(equivalenceResultAtom);

  return (
    <div className="mx-auto max-w-content px-4 py-6">
      {/* Header with crop factor */}
      <div className="flex justify-between items-baseline mb-6">
        <h1 className="text-xl font-semibold text-text-primary">
          Lens Calculator
        </h1>
        <span className="text-text-secondary text-body tabular-nums">
          Crop factor: {formatCropFactor(result.cropFactor)}
        </span>
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
