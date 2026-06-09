// @vitest-environment jsdom
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SignedInActions } from "./signed-in-actions";
import { SignedOutActions } from "./signed-out-actions";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@/app/auth/actions", () => ({
  signOutAction: vi.fn(),
}));

describe("signed-out header state", () => {
  it("renders sign-in link pointing to /auth", () => {
    render(<SignedOutActions />);
    const link = screen.getByRole("link", { name: /sign in/i });
    expect(link).toBeDefined();
    expect((link as HTMLAnchorElement).href).toContain("/auth");
  });

  it("renders sign-up link pointing to /auth?mode=signup", () => {
    render(<SignedOutActions />);
    const link = screen.getByRole("link", { name: /sign up/i });
    expect(link).toBeDefined();
    expect((link as HTMLAnchorElement).href).toContain("mode=signup");
  });

  it("does not render sign-out button", () => {
    render(<SignedOutActions />);
    expect(screen.queryByRole("button", { name: /sign out/i })).toBeNull();
  });
});

describe("signed-in header state", () => {
  it("renders sign-out button", () => {
    render(<SignedInActions balanceCents={10000} />);
    expect(screen.getByRole("button", { name: /sign out/i })).toBeDefined();
  });

  it("does not render sign-in or sign-up links", () => {
    render(<SignedInActions balanceCents={10000} />);
    expect(screen.queryByRole("link", { name: /sign in/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /sign up/i })).toBeNull();
  });
});

describe("fake balance display", () => {
  it("displays balance formatted as dollars", () => {
    const { container } = render(<SignedInActions balanceCents={10000} />);
    expect(container.textContent).toContain("$100.00 fake");
  });

  it("formats non-default balance correctly", () => {
    const { container } = render(<SignedInActions balanceCents={5050} />);
    expect(container.textContent).toContain("$50.50 fake");
  });

  it("formats zero balance correctly", () => {
    const { container } = render(<SignedInActions balanceCents={0} />);
    expect(container.textContent).toContain("$0.00 fake");
  });
});

describe("missing profile state", () => {
  it("hides balance when profile is null", () => {
    const { container } = render(<SignedInActions balanceCents={null} />);
    expect(container.textContent).not.toContain("fake");
  });

  it("still shows sign-out when profile is null", () => {
    render(<SignedInActions balanceCents={null} />);
    expect(screen.getByRole("button", { name: /sign out/i })).toBeDefined();
  });
});

describe("theme toggle still rendering", () => {
  it("renders the theme toggle button", async () => {
    document.documentElement.classList.remove("dark");
    render(<ThemeToggle />);
    await act(async () => {});
    expect(screen.getByRole("button", { name: /switch to/i })).toBeDefined();
  });
});
