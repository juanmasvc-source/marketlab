import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/marketlab/header";
import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { ProbabilityChart } from "@/components/marketlab/probability-chart";
import { getMarket, getMarketYesChance, isMarketBuyable } from "@/lib/markets";

interface Props {
  params: Promise<{ id: string }>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const market = await getMarket(id);
  return {
    title: market ? `${market.title} · MarketLab` : "Market Not Found · MarketLab",
  };
}

export default async function MarketDetailPage({ params }: Props) {
  const { id } = await params;
  const [market, yesChanceData] = await Promise.all([
    getMarket(id),
    getMarketYesChance(id),
  ]);

  if (!market) notFound();

  const buyable = isMarketBuyable(market);

  return (
    <div className="flex flex-col min-h-svh">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-8">
        <Link
          href="/markets"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Markets
        </Link>

        {/* Info card */}
        <div className="rounded-xl border bg-card p-6 mb-5">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <MarketStatusBadge status={market.status} />
            {market.close_date && (
              <span className="text-sm text-muted-foreground">
                Closes {formatDate(market.close_date)}
              </span>
            )}
          </div>

          <h1 className="text-xl font-bold tracking-tight mb-2">
            {market.title}
          </h1>

          {market.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {market.description}
            </p>
          )}
        </div>

        {/* Probability chart */}
        <div className="mb-5">
          <ProbabilityChart
            yesChance={yesChanceData.yesChance}
            hasPositions={yesChanceData.hasPositions}
            marketCreatedAt={market.created_at}
            marketStatus={market.status}
          />
        </div>

        {/* Outcomes */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-sm font-semibold mb-4">Outcomes</h2>
          <div className="grid grid-cols-2 gap-3">
            {(["Yes", "No"] as const).map((side) => (
              <div
                key={side}
                className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3"
              >
                <span className="text-sm font-medium">{side}</span>
                <span className="text-sm font-semibold tabular-nums">
                  {side === "Yes"
                    ? `${yesChanceData.yesChance}%`
                    : `${100 - yesChanceData.yesChance}%`}
                </span>
              </div>
            ))}
          </div>

          {!buyable && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
              Buying is unavailable for this market.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
