import {
  Archive,
  BookOpen,
  Boxes,
  ChartNoAxesCombined,
  CheckCircle2,
  Database,
  FileText,
  Gauge,
  NotebookPen,
  Search,
  ShieldAlert,
} from "lucide-react";
import type { ReactNode } from "react";
import { clsx } from "../../ui/clsx";

type InfographicProps = {
  className?: string;
  compact?: boolean;
};

export function LearningFlowInfographic({ className, compact = false }: InfographicProps) {
  return (
    <InfographicFrame
      ariaLabel="Learning flow infographic showing lessons, strategy modeling, payoff review, and journal reflection."
      className={className}
      compact={compact}
      title="Learning loop"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <StepCard icon={<BookOpen className="size-4" />} label="Learn" value="Concept" tone="primary" />
        <StepCard icon={<Boxes className="size-4" />} label="Build" value="Legs" tone="support" />
        <StepCard icon={<ChartNoAxesCombined className="size-4" />} label="Model" value="Payoff" tone="warning" />
        <StepCard icon={<NotebookPen className="size-4" />} label="Review" value="Journal" tone="neutral" />
      </div>
      <FlowRail />
    </InfographicFrame>
  );
}

export function LearningPathInfographic({ className, compact = false }: InfographicProps) {
  return (
    <InfographicFrame
      ariaLabel="Learning path infographic showing beginner, intermediate, and advanced levels."
      className={className}
      compact={compact}
      title="Training path"
    >
      <div className="grid gap-3">
        <PathRow label="Beginner" percent="100%" tone="primary" />
        <PathRow label="Intermediate" percent="45%" tone="support" />
        <PathRow label="Advanced" percent="20%" tone="warning" />
      </div>
    </InfographicFrame>
  );
}

export function StrategyMapInfographic({ className, compact = false }: InfographicProps) {
  return (
    <InfographicFrame
      ariaLabel="Strategy map infographic showing outlook, risk, and trade style filters."
      className={className}
      compact={compact}
      title="Strategy map"
    >
      <div className="relative min-h-44">
        <div className="absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink/15" />
        <div className="absolute inset-y-2 left-1/2 w-1 -translate-x-1/2 rounded-full bg-ink/15" />
        <AxisPill className="left-0 top-1/2 -translate-y-1/2" label="Bearish" />
        <AxisPill className="right-0 top-1/2 -translate-y-1/2" label="Bullish" />
        <AxisPill className="left-1/2 top-0 -translate-x-1/2" label="Income" />
        <AxisPill className="bottom-0 left-1/2 -translate-x-1/2" label="Hedge" />
        <div className="absolute left-[55%] top-[30%] rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 text-xs font-black text-primary-ink">
          Long call
        </div>
        <div className="absolute bottom-[28%] left-[18%] rounded-lg border border-support/25 bg-support/10 px-3 py-2 text-xs font-black text-support">
          Long put
        </div>
        <div className="absolute right-[11%] top-[12%] rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs font-black text-[#744700]">
          Covered call
        </div>
      </div>
    </InfographicFrame>
  );
}

export function GlossaryConstellationInfographic({ className, compact = false }: InfographicProps) {
  const terms = ["Strike", "Premium", "Expiration", "Assignment", "Breakeven"];

  return (
    <InfographicFrame
      ariaLabel="Glossary concept infographic connecting strike, premium, expiration, assignment, and breakeven."
      className={className}
      compact={compact}
      title="Concept links"
    >
      <div className="grid gap-2">
        {terms.map((term, index) => (
          <div
            className={clsx(
              "flex items-center justify-between rounded-lg border bg-white/78 px-3 py-2",
              index % 3 === 0 && "border-primary/25",
              index % 3 === 1 && "border-support/25",
              index % 3 === 2 && "border-warning/25",
            )}
            key={term}
          >
            <span className="font-bold">{term}</span>
            <span className="size-2 rounded-full bg-primary" />
          </div>
        ))}
      </div>
    </InfographicFrame>
  );
}

export function JournalReviewInfographic({ className, compact = false }: InfographicProps) {
  return (
    <InfographicFrame
      ariaLabel="Journal review infographic showing thesis, risk plan, adjustment, and reflection notes."
      className={className}
      compact={compact}
      title="Review stack"
    >
      <div className="grid gap-2">
        <NoteRow icon={<FileText className="size-4" />} label="Thesis" />
        <NoteRow icon={<ShieldAlert className="size-4" />} label="Risk plan" tone="warning" />
        <NoteRow icon={<Gauge className="size-4" />} label="Adjustment" tone="support" />
        <NoteRow icon={<CheckCircle2 className="size-4" />} label="Reflection" tone="primary" />
      </div>
    </InfographicFrame>
  );
}

export function LocalBackupInfographic({ className, compact = false }: InfographicProps) {
  return (
    <InfographicFrame
      ariaLabel="Local backup infographic showing browser database, export file, and restore flow."
      className={className}
      compact={compact}
      title="Local backup"
    >
      <div className="flex items-center justify-center gap-3">
        <BackupNode icon={<Database className="size-5" />} label="IndexedDB" tone="primary" />
        <Arrow />
        <BackupNode icon={<Archive className="size-5" />} label="JSON" tone="support" />
        <Arrow />
        <BackupNode icon={<Search className="size-5" />} label="Restore" tone="warning" />
      </div>
    </InfographicFrame>
  );
}

function InfographicFrame({
  ariaLabel,
  children,
  className,
  compact,
  title,
}: {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  compact?: boolean;
  title: string;
}) {
  return (
    <figure
      aria-label={ariaLabel}
      className={clsx(
        "overflow-hidden rounded-lg border border-line bg-white/78 shadow-[0_18px_42px_rgba(18,21,18,0.07)]",
        className,
      )}
      role="img"
    >
      <div
        className={clsx(
          "relative min-h-64 p-4",
          compact && "min-h-48",
          "[background:linear-gradient(90deg,rgba(18,21,18,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(18,21,18,0.045)_1px,transparent_1px),rgba(238,241,234,0.72)] [background-size:24px_24px]",
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="font-mono text-[0.68rem] font-black uppercase text-muted">{title}</p>
          <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-[0.62rem] font-black uppercase text-primary-ink">
            Simulated
          </span>
        </div>
        {children}
      </div>
    </figure>
  );
}

function StepCard({
  icon,
  label,
  tone,
  value,
}: {
  icon: ReactNode;
  label: string;
  tone: "primary" | "support" | "warning" | "neutral";
  value: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-lg border p-3",
        tone === "primary" && "border-primary/25 bg-primary/10 text-primary-ink",
        tone === "support" && "border-support/25 bg-support/10 text-support",
        tone === "warning" && "border-warning/30 bg-warning/10 text-[#744700]",
        tone === "neutral" && "border-line bg-white/82 text-ink",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-mono text-[0.65rem] font-bold uppercase opacity-70">{label}</p>
        {icon}
      </div>
      <p className="text-xl font-black leading-tight">{value}</p>
    </div>
  );
}

function FlowRail() {
  return (
    <div className="mt-5 rounded-lg border border-line bg-white/72 p-3">
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3].map((item) => (
          <div className="flex flex-1 items-center gap-2" key={item}>
            <span
              className={clsx(
                "size-3 rounded-full",
                item === 0 && "bg-primary",
                item === 1 && "bg-support",
                item === 2 && "bg-warning",
                item === 3 && "bg-ink",
              )}
            />
            {item < 3 ? <span className="h-1 flex-1 rounded-full bg-ink/15" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function PathRow({ label, percent, tone }: { label: string; percent: string; tone: "primary" | "support" | "warning" }) {
  return (
    <div className="rounded-lg border border-line bg-white/78 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-bold">{label}</p>
        <p className="font-mono text-xs font-black text-muted">{percent}</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink/10">
        <div
          className={clsx(
            "h-full rounded-full",
            tone === "primary" && "w-full bg-primary",
            tone === "support" && "w-[45%] bg-support",
            tone === "warning" && "w-[20%] bg-warning",
          )}
        />
      </div>
    </div>
  );
}

function AxisPill({ className, label }: { className?: string; label: string }) {
  return (
    <span className={clsx("absolute rounded-lg border border-line bg-white px-3 py-2 text-xs font-black", className)}>
      {label}
    </span>
  );
}

function NoteRow({ icon, label, tone = "neutral" }: { icon: ReactNode; label: string; tone?: "primary" | "support" | "warning" | "neutral" }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 rounded-lg border px-3 py-3",
        tone === "primary" && "border-primary/25 bg-primary/10 text-primary-ink",
        tone === "support" && "border-support/25 bg-support/10 text-support",
        tone === "warning" && "border-warning/25 bg-warning/10 text-[#744700]",
        tone === "neutral" && "border-line bg-white/78 text-ink",
      )}
    >
      {icon}
      <span className="font-black">{label}</span>
    </div>
  );
}

function BackupNode({ icon, label, tone }: { icon: ReactNode; label: string; tone: "primary" | "support" | "warning" }) {
  return (
    <div
      className={clsx(
        "grid min-h-24 flex-1 place-items-center rounded-lg border p-3 text-center",
        tone === "primary" && "border-primary/25 bg-primary/10 text-primary-ink",
        tone === "support" && "border-support/25 bg-support/10 text-support",
        tone === "warning" && "border-warning/25 bg-warning/10 text-[#744700]",
      )}
    >
      {icon}
      <p className="mt-2 text-xs font-black leading-tight">{label}</p>
    </div>
  );
}

function Arrow() {
  return <span className="h-1 w-5 shrink-0 rounded-full bg-ink/20" />;
}

