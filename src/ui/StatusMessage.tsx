import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { clsx } from "./clsx";

type StatusTone = "info" | "success" | "warning";

type StatusMessageProps = {
  tone?: StatusTone;
  title: string;
  children: ReactNode;
};

const config = {
  info: {
    icon: Info,
    className: "border-support/20 bg-support/10 text-ink",
  },
  success: {
    icon: CheckCircle2,
    className: "border-primary/25 bg-primary/10 text-ink",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-warning/30 bg-warning/10 text-ink",
  },
};

export function StatusMessage({ tone = "info", title, children }: StatusMessageProps) {
  const Icon = config[tone].icon;

  return (
    <div className={clsx("flex gap-3 rounded-lg border p-4", config[tone].className)}>
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div>
        <p className="font-bold leading-5">{title}</p>
        <div className="mt-1 text-sm leading-6 text-muted">{children}</div>
      </div>
    </div>
  );
}
