"use client";

import { signOutAction } from "@/app/auth/actions";

interface SignedInActionsProps {
  balanceCents: number | null;
}

export function SignedInActions({ balanceCents }: SignedInActionsProps) {
  const formattedBalance =
    balanceCents != null ? `$${(balanceCents / 100).toFixed(2)} fake` : null;

  return (
    <>
      {formattedBalance && (
        <span className="px-2 text-sm font-medium text-muted-foreground tabular-nums">
          {formattedBalance}
        </span>
      )}
      <form action={signOutAction}>
        <button
          type="submit"
          className="px-3 py-1.5 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Sign out
        </button>
      </form>
    </>
  );
}
