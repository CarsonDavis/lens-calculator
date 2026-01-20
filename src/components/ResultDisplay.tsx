interface ResultDisplayProps {
  label: string;
  value: string;
  className?: string;
}

export function ResultDisplay({
  label,
  value,
  className = '',
}: ResultDisplayProps) {
  return (
    <div className={`flex justify-between items-baseline ${className}`}>
      <span className="text-text-secondary text-body">{label}</span>
      <span className="text-text-primary text-body tabular-nums">{value}</span>
    </div>
  );
}
