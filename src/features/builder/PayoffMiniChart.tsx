import type { PayoffPoint } from "../../domain/options/calculations";
import { formatCurrency, formatPrice } from "../../domain/options/calculations";

type PayoffMiniChartProps = {
  points: PayoffPoint[];
  currentUnderlyingPrice: number;
  breakevens: number[];
};

export function PayoffMiniChart({
  points,
  currentUnderlyingPrice,
  breakevens,
}: PayoffMiniChartProps) {
  if (points.length < 2) {
    return (
      <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-line bg-white/60 p-6 text-center text-sm text-muted">
        Add valid option legs to preview the payoff curve.
      </div>
    );
  }

  const width = 720;
  const height = 260;
  const padding = 28;
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

  const zeroY = y(0);
  const currentX = x(currentUnderlyingPrice);

  return (
    <div className="rounded-lg border border-line bg-white/78 p-4">
      <svg
        aria-label={`Expiration payoff chart. Current underlying ${formatPrice(
          currentUnderlyingPrice,
        )}. Breakevens ${breakevens.length ? breakevens.map(formatPrice).join(", ") : "none found"}.`}
        className="h-auto w-full overflow-visible"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        <rect fill="#ffffff" height={height} rx="8" width={width} />
        <line stroke="#d9ded6" strokeDasharray="4 5" x1={padding} x2={width - padding} y1={zeroY} y2={zeroY} />
        <line stroke="#2357ff" strokeDasharray="3 5" x1={currentX} x2={currentX} y1={padding} y2={height - padding} />
        {breakevens.map((breakeven) => (
          <line
            key={breakeven}
            stroke="#c87900"
            strokeDasharray="3 5"
            x1={x(breakeven)}
            x2={x(breakeven)}
            y1={padding}
            y2={height - padding}
          />
        ))}
        <path d={path} fill="none" stroke="#09a66d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
        <text fill="#5d655e" fontSize="12" fontWeight="700" x={padding} y={height - 8}>
          {formatPrice(minX)}
        </text>
        <text fill="#5d655e" fontSize="12" fontWeight="700" textAnchor="end" x={width - padding} y={height - 8}>
          {formatPrice(maxX)}
        </text>
        <text fill="#5d655e" fontSize="12" fontWeight="700" x={padding} y={18}>
          {formatCurrency(maxY)}
        </text>
        <text fill="#5d655e" fontSize="12" fontWeight="700" x={padding} y={height - 32}>
          {formatCurrency(minY)}
        </text>
      </svg>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-muted">
        <span>Blue: current price</span>
        <span>Orange: breakeven</span>
        <span>Green: expiration P/L</span>
      </div>
    </div>
  );
}

