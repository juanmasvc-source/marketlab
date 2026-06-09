import { cn } from "@/lib/utils";
import type { MarketStatus } from "@/lib/markets";

const statusConfig: Record<
  MarketStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className:
      "bg-green-500/10 text-green-700 border-green-500/30 dark:text-green-400",
  },
  closed: {
    label: "Closed",
    className:
      "bg-zinc-500/10 text-zinc-600 border-zinc-400/30 dark:text-zinc-400",
  },
  resolved: {
    label: "Resolved",
    className:
      "bg-blue-500/10 text-blue-700 border-blue-500/30 dark:text-blue-400",
  },
};

export function MarketStatusBadge({ status }: { status: MarketStatus }) {
  const { label, className } = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        className,
      )}
    >
      {label}
    </span>
  );
}
