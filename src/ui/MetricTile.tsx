import type { ReactNode } from "react";
import { clsx } from "./clsx";

type MetricTileProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  tone?: "default" | "primary" | "warning";
};

export function MetricTile({ label, value, detail, icon, tone = "default" }: MetricTileProps) {
  return (
    <div
      className={clsx(
        "rounded-lg border p-4",
        tone === "default" && "border-line bg-white/78",
        tone === "primary" && "border-primary/25 bg-primary/10",
        tone === "warning" && "border-warning/25 bg-warning/10",
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-mono text-[0.68rem] font-bold uppercase text-muted">{label}</p>
        {icon ? <div className="text-muted">{icon}</div> : null}
      </div>
      <p className="number text-3xl font-black leading-none text-ink">{value}</p>
      {detail ? <p className="mt-2 text-sm leading-5 text-muted">{detail}</p> : null}
    </div>
  );
}

