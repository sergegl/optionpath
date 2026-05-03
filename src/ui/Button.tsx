import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "react-router-dom";
import { Link } from "react-router-dom";
import { clsx } from "./clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white border-primary shadow-[0_10px_24px_rgba(9,166,109,0.22)] hover:bg-[#078b5c]",
  secondary:
    "bg-panel text-ink border-line hover:border-ink/25 hover:bg-panel-muted",
  ghost: "bg-transparent text-ink border-transparent hover:bg-ink/5",
  danger:
    "bg-danger text-white border-danger shadow-[0_10px_24px_rgba(180,35,24,0.18)] hover:bg-[#941f16]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
};

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  children,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg border font-bold leading-none transition duration-200 disabled:cursor-not-allowed disabled:opacity-55",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      type={type}
      {...props}
    >
      {icon ? <span className="flex size-4 items-center justify-center">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}

type LinkButtonProps = LinkProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

export function LinkButton({
  variant = "secondary",
  size = "md",
  icon,
  children,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg border font-bold leading-none transition duration-200",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {icon ? <span className="flex size-4 items-center justify-center">{icon}</span> : null}
      <span>{children}</span>
    </Link>
  );
}
