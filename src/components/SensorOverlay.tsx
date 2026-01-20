import { useAtomValue } from 'jotai';
import { equivalenceResultAtom } from '@/atoms';

export function SensorOverlay() {
  const result = useAtomValue(equivalenceResultAtom);

  const sourceFormat = result.source.format;
  const targetFormat = result.target.format;

  // Determine which format is larger (by diagonal)
  const sourceIsLarger = sourceFormat.diagonal >= targetFormat.diagonal;
  const largerFormat = sourceIsLarger ? sourceFormat : targetFormat;
  const smallerFormat = sourceIsLarger ? targetFormat : sourceFormat;

  // SVG dimensions and padding
  const padding = 20;
  const maxWidth = 320;

  // Scale to fit within maxWidth
  const scale = (maxWidth - padding * 2) / largerFormat.width;
  const scaledLargerWidth = largerFormat.width * scale;
  const scaledLargerHeight = largerFormat.height * scale;
  const scaledSmallerWidth = smallerFormat.width * scale;
  const scaledSmallerHeight = smallerFormat.height * scale;

  const svgWidth = scaledLargerWidth + padding * 2;
  const svgHeight = scaledLargerHeight + padding * 2;

  // Position rectangles (bottom-left aligned within the SVG)
  const largerX = padding;
  const largerY = padding;
  const smallerX = padding;
  const smallerY = padding + scaledLargerHeight - scaledSmallerHeight;

  // Colors - source is accent (prominent), target is subtle
  const sourceColor = '#58a6ff';
  const targetColor = '#8b949e';
  const sourceFill = 'rgba(88, 166, 255, 0.12)';
  const targetFill = 'rgba(139, 148, 158, 0.08)';

  return (
    <div className="bg-surface border border-border rounded-md p-4">
      <h2 className="text-label uppercase tracking-wider text-text-secondary mb-4">
        Sensor Comparison
      </h2>

      {/* SVG Visualization */}
      <div className="flex justify-center">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="max-w-full h-auto"
        >
          {sourceIsLarger ? (
            <>
              {/* Source is larger (dashed outline) */}
              <rect
                x={largerX}
                y={largerY}
                width={scaledLargerWidth}
                height={scaledLargerHeight}
                fill={sourceFill}
                stroke={sourceColor}
                strokeWidth="1.5"
                strokeDasharray="6 3"
              />
              {/* Target is smaller (solid) */}
              <rect
                x={smallerX}
                y={smallerY}
                width={scaledSmallerWidth}
                height={scaledSmallerHeight}
                fill={targetFill}
                stroke={targetColor}
                strokeWidth="1.5"
              />
            </>
          ) : (
            <>
              {/* Target is larger (dashed outline) */}
              <rect
                x={largerX}
                y={largerY}
                width={scaledLargerWidth}
                height={scaledLargerHeight}
                fill={targetFill}
                stroke={targetColor}
                strokeWidth="1.5"
                strokeDasharray="6 3"
              />
              {/* Source is smaller (solid) */}
              <rect
                x={smallerX}
                y={smallerY}
                width={scaledSmallerWidth}
                height={scaledSmallerHeight}
                fill={sourceFill}
                stroke={sourceColor}
                strokeWidth="1.5"
              />
            </>
          )}
        </svg>
      </div>

      {/* Labels below the visualization - centered */}
      <div className="flex justify-center gap-8 mt-4 text-body">
        {/* Source info */}
        <div className="flex items-start gap-2">
          <div
            className="w-4 h-3 rounded-sm mt-0.5 flex-shrink-0"
            style={{
              border: `1.5px solid ${sourceColor}`,
              background: sourceFill,
            }}
          />
          <div>
            <div style={{ color: sourceColor }} className="font-medium text-sm">
              Source
            </div>
            <div className="text-text-muted text-xs">{sourceFormat.name}</div>
            <div className="text-text-muted text-xs tabular-nums">
              {sourceFormat.width} × {sourceFormat.height}mm
            </div>
          </div>
        </div>

        {/* Target info */}
        <div className="flex items-start gap-2">
          <div
            className="w-4 h-3 rounded-sm mt-0.5 flex-shrink-0"
            style={{
              border: `1.5px solid ${targetColor}`,
              background: targetFill,
            }}
          />
          <div>
            <div style={{ color: targetColor }} className="font-medium text-sm">
              Target
            </div>
            <div className="text-text-muted text-xs">{targetFormat.name}</div>
            <div className="text-text-muted text-xs tabular-nums">
              {targetFormat.width} × {targetFormat.height}mm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
