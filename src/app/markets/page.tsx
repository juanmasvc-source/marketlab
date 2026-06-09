import { LayoutGrid } from "lucide-react";

import { Header } from "@/components/marketlab/header";
import { MarketCard } from "@/components/marketlab/market-card";
import { getMarkets } from "@/lib/markets";

export const metadata = {
  title: "Markets · MarketLab",
  description: "Browse fictional Yes/No prediction markets.",
};

export default async function MarketsPage() {
  const markets = await getMarkets();

  return (
    <div className="flex flex-col min-h-svh">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Markets</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Browse fictional Yes/No markets using fake money.
          </p>
        </div>

        {markets.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/40 px-6 py-20 text-center"
            data-testid="markets-empty-state"
          >
            <LayoutGrid className="h-10 w-10 text-muted-foreground mb-4" aria-hidden="true" />
            <h2 className="text-base font-semibold">No markets yet</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Markets will appear here once they are created in the database.
            </p>
          </div>
        ) : (
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            data-testid="markets-grid"
          >
            {markets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
