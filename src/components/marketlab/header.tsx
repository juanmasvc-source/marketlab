import Image from "next/image";
import Link from "next/link";

import { SignedInActions } from "@/components/marketlab/signed-in-actions";
import { SignedOutActions } from "@/components/marketlab/signed-out-actions";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function getHeaderData() {
  if (!isSupabaseConfigured) return { user: null, balanceCents: null };
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { user: null, balanceCents: null };
    const { data: profile } = await supabase
      .from("profiles")
      .select("balance_cents")
      .eq("id", user.id)
      .single();
    return { user, balanceCents: profile?.balance_cents ?? null };
  } catch {
    return { user: null, balanceCents: null };
  }
}

export async function Header() {
  const { user, balanceCents } = await getHeaderData();

  return (
    <header className="border-b border-border bg-background text-foreground sticky top-0 z-30 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 h-14">
        <Link href="/markets" className="shrink-0">
          <Image
            src="/logo/logo-marketlab.webp"
            alt="MarketLab"
            width={677}
            height={369}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/markets"
            className="px-3 py-1.5 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Markets
          </Link>
          {user ? (
            <SignedInActions balanceCents={balanceCents} />
          ) : (
            <SignedOutActions />
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
