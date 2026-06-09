"use client";

import { useActionState, useState } from "react";

import { type AuthState, signInAction, signUpAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

type Mode = "signin" | "signup";

const inputClass =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors";

export function AuthForm({ defaultMode }: { defaultMode: Mode }) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [signInState, signInFormAction, signingIn] = useActionState<
    AuthState,
    FormData
  >(signInAction, null);
  const [signUpState, signUpFormAction, signingUp] = useActionState<
    AuthState,
    FormData
  >(signUpAction, null);

  if (signUpState?.needsConfirmation) {
    return (
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mb-3 text-3xl">✉️</div>
        <h2 className="text-lg font-semibold mb-2">Check your email</h2>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to your inbox. Click it to activate your
          account, then{" "}
          <button
            type="button"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
            onClick={() => setMode("signin")}
          >
            sign in
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex gap-1 mb-6 rounded-lg bg-muted p-1">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "signin"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "signup"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign up
        </button>
      </div>

      {mode === "signin" ? (
        <form action={signInFormAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </div>
          {signInState?.error && (
            <p role="alert" className="text-sm text-destructive">
              {signInState.error}
            </p>
          )}
          <Button
            type="submit"
            disabled={signingIn}
            className="w-full"
            size="lg"
          >
            {signingIn ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      ) : (
        <form action={signUpFormAction} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label htmlFor="first_name" className="text-sm font-medium">
                First name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                autoComplete="given-name"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label htmlFor="last_name" className="text-sm font-medium">
                Last name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                autoComplete="family-name"
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          {signUpState?.error && (
            <p role="alert" className="text-sm text-destructive">
              {signUpState.error}
            </p>
          )}
          <Button
            type="submit"
            disabled={signingUp}
            className="w-full"
            size="lg"
          >
            {signingUp ? "Creating account…" : "Create account"}
          </Button>
        </form>
      )}
    </div>
  );
}
