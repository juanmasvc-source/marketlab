import Link from "next/link";

import type { Market } from "@/lib/markets";
import { MarketStatusBadge } from "./market-status-badge";

function formatCloseDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MarketCard({ market }: { market: Market }) {
  return (
    <article className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <MarketStatusBadge status={market.status} />
        {market.close_date && (
          <span className="text-xs text-muted-foreground shrink-0">
            Closes {formatCloseDate(market.close_date)}
          </span>
        )}
      </div>

      <h2 className="text-base font-semibold leading-snug mb-2">
        {market.title}
      </h2>

      {market.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {market.description}
        </p>
      )}

      <div className="mt-auto pt-3 border-t border-border">
        <Link
          href={`/markets/${market.id}`}
          className="inline-flex items-center text-sm font-medium text-[#00d395] hover:underline"
        >
          View Market →
        </Link>
      </div>
    </article>
  );
}
