import type { ReactNode } from "react";
import { formatCurrency } from "../../domain/options/calculations";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ink">{label}</span>
      {children}
    </label>
  );
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white/72 p-3">
      <p className="font-mono text-[0.65rem] font-bold uppercase text-muted">{label}</p>
      <p className="number mt-2 text-xl font-black leading-tight">{value}</p>
    </div>
  );
}

export function formatMetric(value: number | "unlimited" | "unknown") {
  if (typeof value === "number") return formatCurrency(value);
  return value;
}
