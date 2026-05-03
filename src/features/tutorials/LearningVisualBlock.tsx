import { ArrowDown, ArrowRight, ArrowUp, CircleDollarSign, KeyRound, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { TrainingVisualAsset } from "../../data/trainingVisuals";
import { Badge } from "../../ui/Badge";
import { clsx } from "../../ui/clsx";

type LearningVisualBlockProps = {
  asset?: TrainingVisualAsset;
  alt?: string;
  caption?: string;
  className?: string;
  compact?: boolean;
  title?: string;
};

const toneClasses: Record<TrainingVisualAsset["dominantTone"], string> = {
  primary: "border-primary/25 bg-primary/10 text-primary-ink",
  support: "border-support/20 bg-support/10 text-support",
  warning: "border-warning/25 bg-warning/10 text-[#744700]",
  neutral: "border-line bg-panel-muted text-ink",
};

export function LearningVisualBlock({
  asset,
  alt,
  caption,
  className,
  compact = false,
  title,
}: LearningVisualBlockProps) {
  if (!asset) return null;

  return (
    <figure
      className={clsx(
        "overflow-hidden rounded-lg border border-line bg-white/76 shadow-[0_18px_42px_rgba(18,21,18,0.07)]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={clsx(
          "relative min-h-64 overflow-hidden border-b border-line bg-panel-muted p-4",
          compact && "min-h-48",
        )}
      >
        <div className="absolute inset-0 opacity-60 [background:linear-gradient(90deg,rgba(18,21,18,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(18,21,18,0.05)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative h-full min-h-[inherit]">{renderVisual(asset)}</div>
      </div>
      <figcaption className="p-4">
        <span className="sr-only">{alt ?? asset.alt}</span>
        <Badge tone={asset.dominantTone === "primary" ? "primary" : asset.dominantTone === "warning" ? "warning" : "support"}>
          {asset.kind.replace("_", " ")}
        </Badge>
        <h3 className="mt-3 text-lg font-black leading-tight">{title ?? asset.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{caption ?? asset.caption}</p>
      </figcaption>
    </figure>
  );
}

function renderVisual(asset: TrainingVisualAsset) {
  switch (asset.component) {
    case "contractTiles":
      return <ContractTiles />;
    case "multiplierFormula":
      return <MultiplierFormula />;
    case "rightsObligations":
      return <RightsObligations />;
    case "callPutDirection":
      return <CallPutDirection />;
    case "optionTicket":
      return <OptionTicket />;
    case "moneyFlow":
      return <MoneyFlow />;
    case "valueStack":
      return <ValueStack />;
    case "longCallStory":
      return <PayoffStory direction="up" label="Long call" />;
    case "longPutStory":
      return <PayoffStory direction="down" label="Long put" />;
    case "coveredCallStory":
      return <CoveredCallStory />;
    case "cashSecuredPutStory":
      return <CashSecuredPutStory />;
    case "protectivePutStory":
      return <ProtectivePutStory />;
    case "strategyMatch":
      return <StrategyMatch />;
    default:
      return null;
  }
}

function ContractTiles() {
  return (
    <div className="flex h-full min-h-64 items-center justify-center gap-5">
      <VisualCard tone="primary">
        <p className="font-mono text-[0.65rem] font-bold uppercase opacity-70">Option</p>
        <p className="mt-2 text-3xl font-black leading-none">1 contract</p>
      </VisualCard>
      <ArrowRight className="size-7 shrink-0 text-muted" />
      <div className="grid w-36 grid-cols-10 gap-1 rounded-lg border border-line bg-white/80 p-3">
        {Array.from({ length: 100 }).map((_, index) => (
          <span
            className={clsx(
              "aspect-square rounded-[2px]",
              index % 10 < 5 ? "bg-primary/70" : "bg-support/55",
            )}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

function MultiplierFormula() {
  return (
    <div className="flex h-full min-h-64 flex-col justify-center gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <FormulaPart label="premium" value="$2.40" />
        <FormulaPart label="contracts" value="1" />
        <FormulaPart label="multiplier" value="100" />
      </div>
      <div className="rounded-lg border border-support/20 bg-support/10 p-4 text-center">
        <p className="font-mono text-xs font-bold uppercase text-support">trade value</p>
        <p className="number mt-2 text-4xl font-black text-ink">$240</p>
      </div>
    </div>
  );
}

function RightsObligations() {
  return (
    <div className="grid h-full min-h-64 content-center gap-4 sm:grid-cols-2">
      <VisualCard tone="primary">
        <KeyRound className="size-7 text-primary" />
        <p className="mt-4 font-mono text-xs font-bold uppercase text-muted">Buyer</p>
        <p className="mt-2 text-2xl font-black">Has a right</p>
        <p className="mt-2 text-sm leading-6 text-muted">Can choose to exercise.</p>
      </VisualCard>
      <VisualCard tone="warning">
        <ShieldCheck className="size-7 text-warning" />
        <p className="mt-4 font-mono text-xs font-bold uppercase text-muted">Seller</p>
        <p className="mt-2 text-2xl font-black">Accepts an obligation</p>
        <p className="mt-2 text-sm leading-6 text-muted">May be assigned.</p>
      </VisualCard>
    </div>
  );
}

function CallPutDirection() {
  return (
    <div className="flex h-full min-h-64 flex-col justify-center">
      <div className="relative mx-auto h-48 w-full max-w-sm">
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-ink/20" />
        <div className="absolute left-1/2 top-1/2 h-1 w-full -translate-x-1/2 rounded-full bg-ink/25" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-ink bg-white px-3 py-2 font-mono text-xs font-black uppercase">
          strike
        </div>
        <div className="absolute right-2 top-2 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 font-bold text-primary-ink">
          <ArrowUp className="size-4" />
          Call value zone
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-lg border border-support/25 bg-support/10 px-3 py-2 font-bold text-support">
          <ArrowDown className="size-4" />
          Put value zone
        </div>
      </div>
    </div>
  );
}

function OptionTicket() {
  const rows = [
    ["Action", "Buy or sell"],
    ["Type", "Call or put"],
    ["Strike", "100"],
    ["Expiration", "Jun 19"],
    ["Premium", "$2.40"],
    ["Quantity", "1 contract"],
  ];

  return (
    <div className="flex h-full min-h-64 items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border border-ink bg-white p-4 shadow-lift">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-xs font-black uppercase text-muted">Option ticket</p>
          <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-black text-primary-ink">Simulated</span>
        </div>
        <div className="grid gap-2">
          {rows.map(([label, value]) => (
            <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 rounded-md border border-line bg-panel-muted px-3 py-2" key={label}>
              <p className="font-mono text-[0.65rem] font-bold uppercase text-muted">{label}</p>
              <p className="font-bold text-ink">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MoneyFlow() {
  return (
    <div className="grid h-full min-h-64 content-center gap-4 sm:grid-cols-2">
      <VisualCard tone="support">
        <CircleDollarSign className="size-8 text-support" />
        <p className="mt-4 text-2xl font-black">Debit</p>
        <p className="mt-2 text-sm leading-6 text-muted">Money goes out when you buy premium.</p>
        <p className="number mt-4 rounded-md bg-white/80 px-3 py-2 text-xl font-black">-$300</p>
      </VisualCard>
      <VisualCard tone="primary">
        <CircleDollarSign className="size-8 text-primary" />
        <p className="mt-4 text-2xl font-black">Credit</p>
        <p className="mt-2 text-sm leading-6 text-muted">Money comes in when you sell premium.</p>
        <p className="number mt-4 rounded-md bg-white/80 px-3 py-2 text-xl font-black">+$200</p>
      </VisualCard>
    </div>
  );
}

function ValueStack() {
  return (
    <div className="flex h-full min-h-64 flex-col justify-center gap-4">
      <div className="overflow-hidden rounded-lg border border-line bg-white">
        <div className="flex h-20">
          <div className="flex w-[71.4%] items-center justify-center bg-primary/75 px-3 font-black text-primary-ink">
            $5 intrinsic
          </div>
          <div className="flex flex-1 items-center justify-center bg-support/30 px-3 font-black text-support">
            $2 extrinsic
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-line bg-white/82 p-4">
        <p className="font-mono text-xs font-bold uppercase text-muted">premium</p>
        <p className="number mt-1 text-3xl font-black">$7.00 = $5.00 + $2.00</p>
      </div>
    </div>
  );
}

function PayoffStory({ direction, label }: { direction: "up" | "down"; label: string }) {
  const up = direction === "up";

  return (
    <div className="flex h-full min-h-64 flex-col justify-center">
      <div className="relative mx-auto h-48 w-full max-w-md rounded-lg border border-line bg-white/78 p-4">
        <div className="absolute bottom-12 left-7 right-7 h-1 bg-ink/20" />
        <div className="absolute bottom-7 left-16 top-7 w-1 bg-ink/20" />
        <div
          className={clsx(
            "absolute h-1 origin-left rounded-full",
            up ? "bottom-[4.65rem] left-16 w-60 -rotate-[28deg] bg-primary" : "bottom-[4.65rem] left-16 w-60 rotate-[28deg] bg-support",
          )}
        />
        <div className="absolute bottom-5 left-5 rounded-md bg-white px-2 py-1 font-mono text-[0.62rem] font-bold uppercase text-muted">
          underlying
        </div>
        <div className="absolute left-20 top-5 rounded-md bg-white px-2 py-1 font-mono text-[0.62rem] font-bold uppercase text-muted">
          payoff
        </div>
        <div className={clsx("absolute rounded-lg border px-3 py-2 text-sm font-black", up ? "right-4 top-5 border-primary/30 bg-primary/10 text-primary-ink" : "left-4 top-5 border-support/25 bg-support/10 text-support")}>
          {up ? "Upside zone" : "Downside zone"}
        </div>
        <div className="absolute bottom-14 left-20 rounded-lg border border-danger/20 bg-danger/10 px-3 py-2 text-sm font-black text-danger">
          premium risk
        </div>
      </div>
      <p className="mt-3 text-center text-sm font-bold text-muted">{label}: limited premium risk, directional exposure.</p>
    </div>
  );
}

function CoveredCallStory() {
  return (
    <RiskRail
      bottomLabel="stock downside remains"
      middleLabel="own 100 shares"
      topLabel="upside capped at short call"
      tone="warning"
    />
  );
}

function CashSecuredPutStory() {
  return (
    <div className="grid h-full min-h-64 content-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
      <VisualCard tone="primary">
        <p className="font-mono text-xs font-bold uppercase text-muted">Reserve</p>
        <p className="mt-2 text-3xl font-black">$9,500</p>
        <p className="mt-2 text-sm leading-6 text-muted">Cash ready for possible assignment.</p>
      </VisualCard>
      <ArrowRight className="mx-auto hidden size-7 self-center text-muted sm:block" />
      <VisualCard tone="warning">
        <p className="font-mono text-xs font-bold uppercase text-muted">Short put</p>
        <p className="mt-2 text-3xl font-black">May buy shares</p>
        <p className="mt-2 text-sm leading-6 text-muted">Assignment can require buying at the strike.</p>
      </VisualCard>
    </div>
  );
}

function ProtectivePutStory() {
  return (
    <RiskRail
      bottomLabel="put floor"
      middleLabel="own 100 shares"
      topLabel="upside remains"
      tone="primary"
    />
  );
}

function RiskRail({
  bottomLabel,
  middleLabel,
  tone,
  topLabel,
}: {
  bottomLabel: string;
  middleLabel: string;
  tone: "primary" | "warning";
  topLabel: string;
}) {
  return (
    <div className="flex h-full min-h-64 flex-col justify-center">
      <div className="relative mx-auto h-56 w-full max-w-sm rounded-lg border border-line bg-white/78 p-5">
        <div className="absolute left-1/2 top-5 h-[11.5rem] w-1 -translate-x-1/2 rounded-full bg-ink/15" />
        <RailLabel className={clsx("top-5", tone === "warning" ? "border-warning/25 bg-warning/10 text-[#744700]" : "border-primary/25 bg-primary/10 text-primary-ink")}>
          {topLabel}
        </RailLabel>
        <RailLabel className="top-[5.85rem] border-line bg-panel-muted text-ink">{middleLabel}</RailLabel>
        <RailLabel className={clsx("bottom-5", tone === "warning" ? "border-danger/25 bg-danger/10 text-danger" : "border-support/25 bg-support/10 text-support")}>
          {bottomLabel}
        </RailLabel>
      </div>
    </div>
  );
}

function StrategyMatch() {
  const cards = [
    ["Long call", "premium risk"],
    ["Covered call", "capped upside"],
    ["Cash-secured put", "cash-backed"],
    ["Protective put", "floor"],
  ];

  return (
    <div className="grid h-full min-h-64 content-center gap-3 sm:grid-cols-2">
      {cards.map(([title, label], index) => (
        <div
          className={clsx(
            "rounded-lg border p-4",
            index % 2 === 0 ? "border-primary/25 bg-primary/10" : "border-support/20 bg-support/10",
          )}
          key={title}
        >
          <p className="text-xl font-black">{title}</p>
          <p className="mt-2 font-mono text-xs font-bold uppercase text-muted">{label}</p>
        </div>
      ))}
    </div>
  );
}

function FormulaPart({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white/82 p-4 text-center">
      <p className="font-mono text-xs font-bold uppercase text-muted">{label}</p>
      <p className="number mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function VisualCard({ children, tone }: { children: ReactNode; tone: TrainingVisualAsset["dominantTone"] }) {
  return (
    <div className={clsx("rounded-lg border p-4", toneClasses[tone])}>
      {children}
    </div>
  );
}

function RailLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "absolute left-1/2 w-[82%] -translate-x-1/2 rounded-lg border px-3 py-3 text-center text-sm font-black",
        className,
      )}
    >
      {children}
    </div>
  );
}

