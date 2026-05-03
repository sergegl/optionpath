import type { ReactNode } from "react";
import { formatCurrency } from "../../domain/options/calculations";
import { clsx } from "../../ui/clsx";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ink">{label}</span>
      {children}
    </label>
  );
}

export function MiniMetric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "profit" | "loss";
}) {
  return (
    <div className="rounded-lg border border-line bg-white/72 p-3">
      <p className="font-mono text-[0.65rem] font-bold uppercase text-muted">{label}</p>
      <p
        className={clsx(
          "number mt-2 break-words text-xl font-black leading-tight",
          tone === "profit" && "text-profit",
          tone === "loss" && "text-loss",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 p-4">
      <p className="font-mono text-[0.62rem] font-bold uppercase text-white/50">{label}</p>
      <p className="number mt-2 text-2xl font-black leading-none text-white">{value}</p>
    </div>
  );
}

export function formatSignedCurrency(value: number) {
  return `${value > 0 ? "+" : ""}${formatCurrency(value)}`;
}
