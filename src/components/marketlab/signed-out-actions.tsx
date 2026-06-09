import Link from "next/link";

export function SignedOutActions() {
  return (
    <>
      <Link
        href="/auth?mode=signup"
        className="px-3 py-1.5 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
      >
        Sign up
      </Link>
      <Link
        href="/auth"
        className="px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Sign in
      </Link>
    </>
  );
}
