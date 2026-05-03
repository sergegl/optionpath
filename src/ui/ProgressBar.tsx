type ProgressBarProps = {
  value: number;
  label: string;
  tone?: "default" | "inverse";
};

export function ProgressBar({ value, label, tone = "default" }: ProgressBarProps) {
  const normalizedValue = Math.max(0, Math.min(100, value));
  const labelClass = tone === "inverse" ? "text-white/82" : "text-ink";
  const valueClass = tone === "inverse" ? "text-white/62" : "text-muted";
  const trackClass = tone === "inverse" ? "bg-white/14" : "bg-ink/10";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className={`text-sm font-semibold ${labelClass}`}>{label}</span>
        <span className={`number font-mono text-xs font-bold ${valueClass}`}>
          {Math.round(normalizedValue)}%
        </span>
      </div>
      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(normalizedValue)}
        className={`h-2 overflow-hidden rounded-full ${trackClass}`}
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
}
