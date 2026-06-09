import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Market = Database["public"]["Tables"]["markets"]["Row"];
export type MarketStatus = Database["public"]["Enums"]["market_status"];

export function isMarketBuyable(market: Market): boolean {
  if (market.status !== "open") return false;
  if (market.close_date && new Date(market.close_date) <= new Date()) return false;
  return true;
}

export async function getMarkets(): Promise<Market[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("markets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getMarket(id: string): Promise<Market | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("markets")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export interface MarketYesChance {
  yesChance: number;
  hasPositions: boolean;
}

export async function getMarketYesChance(marketId: string): Promise<MarketYesChance> {
  if (!isSupabaseConfigured) return { yesChance: 50, hasPositions: false };
  try {
    const supabase = await createServerSupabaseClient();
    // Positions are RLS-restricted to each user's own rows; unauthenticated requests
    // return no rows, so market-level aggregates are unavailable without a service-role key.
    const { data, error } = await supabase
      .from("positions")
      .select("yes_shares_cents, no_shares_cents")
      .eq("market_id", marketId);

    if (error || !data || data.length === 0) {
      return { yesChance: 50, hasPositions: false };
    }

    const yesTotal = data.reduce((sum, p) => sum + p.yes_shares_cents, 0);
    const noTotal = data.reduce((sum, p) => sum + p.no_shares_cents, 0);
    const total = yesTotal + noTotal;

    if (total === 0) return { yesChance: 50, hasPositions: false };

    return {
      yesChance: Math.round((yesTotal / total) * 100),
      hasPositions: true,
    };
  } catch {
    return { yesChance: 50, hasPositions: false };
  }
}
