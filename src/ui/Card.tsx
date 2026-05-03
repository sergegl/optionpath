import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "./clsx";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  tone?: "default" | "muted" | "dark";
};

export function Card({ children, className, tone = "default", ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-lg border p-5",
        tone === "default" && "surface",
        tone === "muted" && "surface-muted",
        tone === "dark" && "border-ink bg-ink text-white shadow-panel",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
