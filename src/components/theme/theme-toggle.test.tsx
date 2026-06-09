// @vitest-environment jsdom
import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeToggle } from "./theme-toggle";

beforeEach(() => {
  document.documentElement.classList.remove("dark");
  localStorage.clear();
});

describe("ThemeToggle", () => {
  it("renders a button after mounting", async () => {
    render(<ThemeToggle />);
    await act(async () => {});
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("has an accessible aria-label", async () => {
    render(<ThemeToggle />);
    await act(async () => {});
    const button = screen.getByRole("button");
    expect(button.getAttribute("aria-label")).toMatch(/switch to (light|dark) mode/i);
  });

  it("toggles dark class and persists to localStorage on click", async () => {
    render(<ThemeToggle />);
    await act(async () => {});
    const button = screen.getByRole("button");
    await act(async () => { button.click(); });
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("ml-theme")).toBe("dark");
  });
});
