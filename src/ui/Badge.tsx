import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "./clsx";

type BadgeTone = "neutral" | "primary" | "support" | "warning" | "danger" | "profit" | "loss";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
};

const tones: Record<BadgeTone, string> = {
  neutral: "border-line bg-panel-muted text-ink",
  primary: "border-primary/30 bg-primary/10 text-primary-ink",
  support: "border-support/25 bg-support/10 text-support",
  warning: "border-warning/30 bg-warning/10 text-[#744700]",
  danger: "border-danger/25 bg-danger/10 text-danger",
  profit: "border-profit/25 bg-profit/10 text-profit",
  loss: "border-loss/25 bg-loss/10 text-loss",
};

export function Badge({ children, tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex min-h-6 items-center rounded-md border px-2 py-1 font-mono text-[0.68rem] font-bold uppercase leading-none tracking-normal",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
