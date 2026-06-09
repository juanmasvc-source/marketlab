import { describe, expect, it } from "vitest";
import { isMarketBuyable } from "./markets";
import type { Market } from "./markets";

const base: Market = {
  id: "test-id",
  title: "Will it happen?",
  description: null,
  status: "open",
  close_date: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("isMarketBuyable", () => {
  it("returns true for open market with no close date", () => {
    expect(isMarketBuyable({ ...base, status: "open", close_date: null })).toBe(true);
  });

  it("returns true for open market with future close date", () => {
    const future = new Date(Date.now() + 86_400_000).toISOString();
    expect(isMarketBuyable({ ...base, status: "open", close_date: future })).toBe(true);
  });

  it("returns false for closed market", () => {
    expect(isMarketBuyable({ ...base, status: "closed" })).toBe(false);
  });

  it("returns false for resolved market", () => {
    expect(isMarketBuyable({ ...base, status: "resolved" })).toBe(false);
  });

  it("returns false for open market with past close date", () => {
    const past = new Date(Date.now() - 86_400_000).toISOString();
    expect(isMarketBuyable({ ...base, status: "open", close_date: past })).toBe(false);
  });
});
