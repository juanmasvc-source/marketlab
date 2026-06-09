// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProbabilityChart } from "./probability-chart";

const baseProps = {
  yesChance: 50,
  hasPositions: false,
  marketCreatedAt: "2026-01-01T00:00:00.000Z",
  marketStatus: "open" as const,
};

describe("ProbabilityChart", () => {
  it("renders an SVG chart", () => {
    const { container } = render(<ProbabilityChart {...baseProps} />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("shows neutral baseline label when no positions available", () => {
    render(<ProbabilityChart {...baseProps} yesChance={50} hasPositions={false} />);
    // Use the full span text — avoids collision with Y-axis tick labels
    expect(screen.getByText(/Current Market Balance:.*No trading history/)).toBeDefined();
  });

  it("shows current yes probability label when positions are available", () => {
    render(<ProbabilityChart {...baseProps} yesChance={65} hasPositions={true} />);
    expect(screen.getByText("Current Yes Probability: 65%")).toBeDefined();
  });

  it("shows different probability value when yesChance changes", () => {
    render(<ProbabilityChart {...baseProps} yesChance={40} hasPositions={false} />);
    expect(screen.getByText(/Current Market Balance:.*40%/)).toBeDefined();
  });

  it("renders a flat line (same y position) for current-state visualization", () => {
    const { container } = render(<ProbabilityChart {...baseProps} />);
    const paths = Array.from(container.querySelectorAll("path"));
    const hasFlatLine = paths.some((path) => {
      const d = path.getAttribute("d") ?? "";
      const m = d.match(/M\s+([\d.]+),([\d.]+)\s+L\s+([\d.]+),([\d.]+)/);
      return m !== null && m[2] === m[4];
    });
    expect(hasFlatLine).toBe(true);
  });

  it("encodes yes chance in svg aria-label", () => {
    const { container } = render(<ProbabilityChart {...baseProps} yesChance={72} hasPositions={false} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-label")).toContain("72%");
  });

  it("renders the Yes Probability heading", () => {
    render(<ProbabilityChart {...baseProps} />);
    expect(screen.getByRole("heading", { name: "Yes Probability" })).toBeDefined();
  });
});
