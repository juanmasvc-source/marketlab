"use client";

import type { MarketStatus } from "@/lib/markets";

interface ProbabilityChartProps {
  yesChance: number;
  hasPositions: boolean;
  marketCreatedAt: string;
  marketStatus: MarketStatus;
}

const TEAL = "#00d395";

// SVG chart dimensions
const VW = 560;
const VH = 200;
const PAD = { left: 48, right: 16, top: 14, bottom: 38 };
const CX1 = PAD.left;
const CX2 = VW - PAD.right;
const CY1 = PAD.top;
const CY2 = VH - PAD.bottom;
const CW = CX2 - CX1;
const CH = CY2 - CY1;

const Y_TICKS = [100, 75, 50, 25, 0];

function yPos(pct: number) {
  return CY2 - (pct / 100) * CH;
}

function formatAxisDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProbabilityChart({
  yesChance,
  hasPositions,
  marketCreatedAt,
}: ProbabilityChartProps) {
  const lineY = yPos(yesChance);
  const areaPath = `M ${CX1},${lineY} L ${CX2},${lineY} L ${CX2},${CY2} L ${CX1},${CY2} Z`;
  const linePath = `M ${CX1},${lineY} L ${CX2},${lineY}`;

  const midX = CX1 + CW / 2;
  const label = hasPositions
    ? `Current Yes Probability: ${yesChance}%`
    : `Current Market Balance: ${yesChance}% · No trading history`;

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 className="text-sm font-semibold text-card-foreground">
          Yes Probability
        </h3>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>

      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full"
        aria-label={label}
        role="img"
      >
        {/* Gradient fill */}
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TEAL} stopOpacity="0.25" />
            <stop offset="100%" stopColor={TEAL} stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Y-axis gridlines and labels */}
        {Y_TICKS.map((pct) => {
          const y = yPos(pct);
          return (
            <g key={pct}>
              <line
                x1={CX1}
                y1={y}
                x2={CX2}
                y2={y}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border"
                strokeDasharray={pct === 0 || pct === 100 ? undefined : "3 4"}
              />
              <text
                x={CX1 - 6}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="10"
                className="fill-muted-foreground"
              >
                {pct}%
              </text>
            </g>
          );
        })}

        {/* Filled area */}
        <path d={areaPath} fill="url(#chart-fill)" />

        {/* Line */}
        <path
          d={linePath}
          stroke={TEAL}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Dot at midpoint */}
        <circle cx={midX} cy={lineY} r="4" fill={TEAL} />
        <circle cx={midX} cy={lineY} r="2.5" fill="white" />

        {/* X-axis labels */}
        <text
          x={CX1}
          y={CY2 + 16}
          textAnchor="start"
          fontSize="10"
          className="fill-muted-foreground"
        >
          {formatAxisDate(marketCreatedAt)}
        </text>
        <text
          x={CX2}
          y={CY2 + 16}
          textAnchor="end"
          fontSize="10"
          className="fill-muted-foreground"
        >
          Today
        </text>
      </svg>
    </div>
  );
}
