import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Header() {
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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
