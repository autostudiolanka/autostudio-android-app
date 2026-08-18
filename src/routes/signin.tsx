import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/primitives/Button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — AutoStudio Lanka" },
      {
        name: "description",
        content: "Dealer sign-in for managing AutoStudio Lanka stock and buyer enquiries.",
      },
      { property: "og:title", content: "Sign in — AutoStudio Lanka" },
      {
        property: "og:description",
        content: "Sign in to manage your dealership stock and enquiries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignInScreen,
});

const inputStyle = {
  minHeight: "var(--size-button)",
  borderRadius: "var(--radius-button)",
  paddingInline: "var(--space-button-x)",
} as const;

function SignInScreen() {
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) navigate({ to: "/home", replace: true });
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
      return;
    }

    navigate({ to: "/home", replace: true });
  }

  return (
    <main className="flex min-h-screen flex-col bg-ground">
      <div
        style={{
          paddingTop: "calc(var(--safe-top) + 16px)",
          paddingInline: "20px",
          paddingBottom: "24px",
        }}
      >
        <Button
          variant="secondary-on-ground"
          shape="round"
          aria-label="Back"
          className="text-sheet"
          onClick={() => router.history.back()}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <h1 className="type-screen-title text-sheet mt-5">Welcome back</h1>
      </div>

      <section
        className="flex-1 bg-sheet"
        style={{
          borderTopLeftRadius: "var(--radius-sheet)",
          borderTopRightRadius: "var(--radius-sheet)",
          padding: "24px 20px calc(var(--safe-bottom) + 24px)",
        }}
      >
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="email" className="type-meta text-text-2">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@dealership.lk"
            className="type-body mt-2 w-full bg-surface-2 text-text placeholder:text-placeholder outline-none"
            style={inputStyle}
          />

          <label htmlFor="password" className="type-meta text-text-2 mt-4">
            Password
          </label>
          <div
            className="mt-2 flex w-full items-center bg-sheet border"
            style={{
              ...inputStyle,
              borderColor: "var(--text)",
              paddingInlineEnd: "var(--space-status-chip-x)",
            }}
          >
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="type-body min-w-0 flex-1 bg-transparent text-text placeholder:text-placeholder outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="press type-body text-text-2 shrink-0"
              style={{ minHeight: "var(--size-touch)", paddingInline: "10px" }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setKeepSignedIn((v) => !v)}
              aria-pressed={keepSignedIn}
              className="press flex items-center gap-3 text-left"
              style={{ minHeight: "var(--size-touch)", paddingBlock: "6px" }}
            >
              <span
                aria-hidden
                className="flex items-center justify-center border"
                style={{
                  height: "24px",
                  width: "24px",
                  borderRadius: "8px",
                  borderColor: "var(--text)",
                  background: keepSignedIn ? "var(--primary)" : "var(--sheet)",
                  color: "var(--sheet)",
                }}
              >
                {keepSignedIn ? (
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                    <path
                      d="M5 12.5l4.5 4.5L19 7"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </span>
              <span className="type-body text-text">Keep me signed in</span>
            </button>

            <button
              type="button"
              onClick={() => setShowForgot((v) => !v)}
              className="press type-body text-text underline"
              style={{ minHeight: "var(--size-touch)", paddingInline: "6px" }}
            >
              Forgot?
            </button>
          </div>

          {showForgot ? (
            <p className="type-meta text-text-2 mt-1">
              Reset your password on the AutoStudio Lanka website, then sign in here.
            </p>
          ) : null}

          {error ? (
            <p role="alert" className="type-meta text-destructive mt-3">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            shape="block"
            disabled={submitting}
            className="mt-5"
            style={{
              minHeight: "var(--size-button)",
              paddingInline: "var(--space-button-x)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            {submitting ? (
              <span aria-hidden className="spinner" style={{ height: "18px", width: "18px" }} />
            ) : null}
            {submitting ? "Signing in" : "Sign in"}
          </Button>
        </form>
      </section>
    </main>
  );
}