import { useId, useMemo, useState } from "react";
import type { PayoffPoint } from "../../domain/options/calculations";
import {
  formatBreakevens,
  formatCurrency,
  formatMetricValue,
  formatPrice,
} from "../../domain/options/calculations";

type PayoffChartProps = {
  points: PayoffPoint[];
  currentUnderlyingPrice: number;
  breakevens: number[];
  maxProfit: number | "unlimited" | "unknown";
  maxLoss: number | "unlimited" | "unknown";
  title: string;
};

const width = 760;
const height = 300;
const padding = 34;

export function PayoffChart({
  points,
  currentUnderlyingPrice,
  breakevens,
  maxProfit,
  maxLoss,
  title,
}: PayoffChartProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [activePoint, setActivePoint] = useState<PayoffPoint | null>(null);

  const geometry = useMemo(() => getGeometry(points, currentUnderlyingPrice), [points, currentUnderlyingPrice]);
  const scenarioPoint = activePoint ?? geometry.currentPoint;

  if (points.length < 2) {
    return (
      <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-line bg-white/60 p-6 text-center text-sm text-muted">
        Add valid option legs to preview the payoff curve.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-white/78 p-4">
      <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div>
          <h3 className="text-lg font-black" id={titleId}>
            {title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted" id={descriptionId}>
            Max profit {formatMetricValue(maxProfit)}. Max loss {formatMetricValue(maxLoss)}.
            Breakevens {formatBreakevens(breakevens)}.
          </p>
        </div>
        {scenarioPoint ? (
          <div className="rounded-lg border border-line bg-panel-muted px-3 py-2 text-sm">
            <p className="font-mono text-[0.65rem] font-bold uppercase text-muted">Scenario</p>
            <p className="number mt-1 font-black">
              {formatPrice(scenarioPoint.underlyingPrice)} / {formatCurrency(scenarioPoint.profitLoss)}
            </p>
          </div>
        ) : null}
      </div>

      <svg
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        className="h-auto w-full overflow-visible"
        onMouseLeave={() => setActivePoint(null)}
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        <rect fill="#ffffff" height={height} rx="8" width={width} />
        <rect
          fill="rgba(8, 127, 91, 0.07)"
          height={Math.max(0, geometry.zeroY - padding)}
          width={width - padding * 2}
          x={padding}
          y={padding}
        />
        <rect
          fill="rgba(201, 42, 42, 0.06)"
          height={Math.max(0, height - padding - geometry.zeroY)}
          width={width - padding * 2}
          x={padding}
          y={geometry.zeroY}
        />
        {geometry.gridLines.map((line) => (
          <line
            key={line.y}
            stroke="#eef1ea"
            strokeWidth="1"
            x1={padding}
            x2={width - padding}
            y1={line.y}
            y2={line.y}
          />
        ))}
        <line
          stroke="#5d655e"
          strokeDasharray="4 5"
          x1={padding}
          x2={width - padding}
          y1={geometry.zeroY}
          y2={geometry.zeroY}
        />
        <text fill="#087f5b" fontSize="12" fontWeight="800" x={padding + 8} y={Math.max(22, geometry.zeroY - 10)}>
          Profit
        </text>
        <text fill="#c92a2a" fontSize="12" fontWeight="800" x={padding + 8} y={Math.min(height - 14, geometry.zeroY + 20)}>
          Loss
        </text>
        <line
          stroke="#2357ff"
          strokeDasharray="3 5"
          strokeWidth="2"
          x1={geometry.currentX}
          x2={geometry.currentX}
          y1={padding}
          y2={height - padding}
        />
        {breakevens.map((breakeven) => (
          <line
            key={breakeven}
            stroke="#c87900"
            strokeDasharray="3 5"
            strokeWidth="2"
            x1={geometry.x(breakeven)}
            x2={geometry.x(breakeven)}
            y1={padding}
            y2={height - padding}
          />
        ))}
        <path
          d={geometry.path}
          fill="none"
          stroke="#09a66d"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        {geometry.interactivePoints.map((point) => (
          <circle
            aria-label={`${formatPrice(point.underlyingPrice)} underlying, ${formatCurrency(point.profitLoss)} profit loss`}
            className="cursor-pointer opacity-0 focus:opacity-100"
            cx={geometry.x(point.underlyingPrice)}
            cy={geometry.y(point.profitLoss)}
            fill="#121512"
            key={`${point.underlyingPrice}-${point.profitLoss}`}
            onBlur={() => setActivePoint(null)}
            onFocus={() => setActivePoint(point)}
            onMouseEnter={() => setActivePoint(point)}
            r="7"
            tabIndex={0}
          />
        ))}
        {scenarioPoint ? (
          <g pointerEvents="none">
            <circle
              cx={geometry.x(scenarioPoint.underlyingPrice)}
              cy={geometry.y(scenarioPoint.profitLoss)}
              fill="#121512"
              r="5"
            />
            <rect
              fill="#121512"
              height="34"
              rx="6"
              width="132"
              x={Math.min(width - padding - 132, Math.max(padding, geometry.x(scenarioPoint.underlyingPrice) - 66))}
              y={Math.max(10, geometry.y(scenarioPoint.profitLoss) - 46)}
            />
            <text
              fill="#ffffff"
              fontSize="12"
              fontWeight="800"
              textAnchor="middle"
              x={Math.min(width - padding - 66, Math.max(padding + 66, geometry.x(scenarioPoint.underlyingPrice)))}
              y={Math.max(31, geometry.y(scenarioPoint.profitLoss) - 25)}
            >
              {formatPrice(scenarioPoint.underlyingPrice)} / {formatCurrency(scenarioPoint.profitLoss)}
            </text>
          </g>
        ) : null}
        <text fill="#5d655e" fontSize="12" fontWeight="700" x={padding} y={height - 8}>
          {formatPrice(geometry.minX)}
        </text>
        <text fill="#5d655e" fontSize="12" fontWeight="700" textAnchor="end" x={width - padding} y={height - 8}>
          {formatPrice(geometry.maxX)}
        </text>
        <text fill="#5d655e" fontSize="12" fontWeight="700" x={padding} y={18}>
          {formatCurrency(geometry.maxY)}
        </text>
        <text fill="#5d655e" fontSize="12" fontWeight="700" x={padding} y={height - 32}>
          {formatCurrency(geometry.minY)}
        </text>
      </svg>

      <div className="mt-3 grid gap-3 text-xs font-bold text-muted sm:grid-cols-3">
        <span>Blue marker: current price</span>
        <span>Orange markers: breakevens</span>
        <span>Green curve: expiration P/L</span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3" aria-label="Payoff chart text summary">
        <Scenario label="Current" point={geometry.currentPoint} />
        <Scenario label="Best shown" point={geometry.bestPoint} />
        <Scenario label="Worst shown" point={geometry.worstPoint} />
      </div>
    </div>
  );
}

function Scenario({ label, point }: { label: string; point?: PayoffPoint }) {
  return (
    <div className="rounded-lg border border-line bg-panel-muted p-3">
      <p className="font-mono text-[0.65rem] font-bold uppercase text-muted">{label}</p>
      <p className="number mt-1 text-sm font-black">
        {point ? `${formatPrice(point.underlyingPrice)} / ${formatCurrency(point.profitLoss)}` : "Unavailable"}
      </p>
    </div>
  );
}

function getGeometry(points: PayoffPoint[], currentUnderlyingPrice: number) {
  const minX = Math.min(...points.map((point) => point.underlyingPrice));
  const maxX = Math.max(...points.map((point) => point.underlyingPrice));
  const minY = Math.min(...points.map((point) => point.profitLoss), 0);
  const maxY = Math.max(...points.map((point) => point.profitLoss), 0);
  const yRange = maxY - minY || 1;
  const xRange = maxX - minX || 1;
  const x = (value: number) => padding + ((value - minX) / xRange) * (width - padding * 2);
  const y = (value: number) => height - padding - ((value - minY) / yRange) * (height - padding * 2);
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${x(point.underlyingPrice)} ${y(point.profitLoss)}`)
    .join(" ");
  const currentPoint = nearestPoint(points, currentUnderlyingPrice);
  const bestPoint = points.reduce((best, point) => (point.profitLoss > best.profitLoss ? point : best), points[0]);
  const worstPoint = points.reduce((worst, point) => (point.profitLoss < worst.profitLoss ? point : worst), points[0]);
  const stride = Math.max(1, Math.floor(points.length / 10));

  return {
    minX,
    maxX,
    minY,
    maxY,
    x,
    y,
    path,
    currentX: x(currentUnderlyingPrice),
    zeroY: y(0),
    currentPoint,
    bestPoint,
    worstPoint,
    interactivePoints: points.filter((_, index) => index % stride === 0 || index === points.length - 1),
    gridLines: [0.25, 0.5, 0.75].map((ratio) => ({ y: padding + ratio * (height - padding * 2) })),
  };
}

function nearestPoint(points: PayoffPoint[], target: number) {
  return points.reduce((nearest, point) =>
    Math.abs(point.underlyingPrice - target) < Math.abs(nearest.underlyingPrice - target) ? point : nearest,
  );
}

