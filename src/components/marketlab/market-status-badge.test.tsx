// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarketStatusBadge } from "./market-status-badge";

describe("MarketStatusBadge", () => {
  it('renders "Open" for open status', () => {
    render(<MarketStatusBadge status="open" />);
    expect(screen.getByText("Open")).toBeDefined();
  });

  it('renders "Closed" for closed status', () => {
    render(<MarketStatusBadge status="closed" />);
    expect(screen.getByText("Closed")).toBeDefined();
  });

  it('renders "Resolved" for resolved status', () => {
    render(<MarketStatusBadge status="resolved" />);
    expect(screen.getByText("Resolved")).toBeDefined();
  });
});
