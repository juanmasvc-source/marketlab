// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Market } from "@/lib/markets";
import { MarketCard } from "./market-card";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Use noon UTC to avoid calendar-day shifts across timezones
const market: Market = {
  id: "market-1",
  title: "Will this happen?",
  description: "A test market description.",
  status: "open",
  close_date: "2026-06-15T12:00:00.000Z",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("MarketCard", () => {
  it("renders title and description", () => {
    const { container } = render(<MarketCard market={market} />);
    expect(container.textContent).toContain("Will this happen?");
    expect(container.textContent).toContain("A test market description.");
  });

  it("renders market status badge", () => {
    render(<MarketCard market={market} />);
    expect(screen.getByText("Open")).toBeDefined();
  });

  it("renders close date with year visible", () => {
    const { container } = render(<MarketCard market={market} />);
    // Avoid exact date string — local timezone may shift the calendar day
    expect(container.textContent).toMatch(/Closes.*2026/);
  });

  it("renders view market link pointing to detail page", () => {
    render(<MarketCard market={market} />);
    const link = screen.getByRole("link", { name: /view market/i });
    expect(link).toBeDefined();
    expect((link as HTMLAnchorElement).href).toContain("/markets/market-1");
  });

  it("does not render hero or template images", () => {
    const { container } = render(<MarketCard market={market} />);
    for (const img of Array.from(container.querySelectorAll("img"))) {
      expect(img.getAttribute("src")).not.toMatch(/hero|quito|template/i);
    }
  });

  it("renders without crashing when description is null", () => {
    const { container } = render(<MarketCard market={{ ...market, description: null }} />);
    expect(container.textContent).toContain("Will this happen?");
  });

  it("does not render close date section when close_date is null", () => {
    const { container } = render(<MarketCard market={{ ...market, close_date: null }} />);
    expect(container.textContent).not.toMatch(/Closes/i);
  });
});
