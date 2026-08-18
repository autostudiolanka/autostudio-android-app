import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/primitives/Button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — AutoStudio Lanka" },
      {
        name: "description",
        content:
          "Sign in to manage your dealership stock and buyer enquiries on the go.",
      },
      { property: "og:title", content: "Sign in — AutoStudio Lanka" },
      {
        property: "og:description",
        content: "Dealer sign-in for managing stock and enquiries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignInScreen,
});

function SignInScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <main
      className="flex min-h-screen flex-col bg-ground"
      style={{
        paddingTop: "calc(var(--safe-top) + 28px)",
        paddingBottom: "calc(var(--safe-bottom) + 28px)",
        paddingInline: "20px",
      }}
    >
      <h1 className="type-screen-title text-sheet">AutoStudio Lanka</h1>

      <div className="mt-auto pt-10">
        <p className="type-display text-sheet">
          Your stock,
          <br />
          online today
        </p>

        <form className="mt-7 flex flex-col gap-3" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="type-eyebrow text-muted-ground uppercase tracking-wide">Email</span>
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@dealership.lk"
              className="type-body w-full bg-raised text-sheet placeholder:text-muted-ground outline-none"
              style={{
                minHeight: "var(--size-button)",
                borderRadius: "var(--radius-button)",
                paddingInline: "var(--space-button-x)",
              }}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="type-eyebrow text-muted-ground uppercase tracking-wide">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="type-body w-full bg-raised text-sheet placeholder:text-muted-ground outline-none"
              style={{
                minHeight: "var(--size-button)",
                borderRadius: "var(--radius-button)",
                paddingInline: "var(--space-button-x)",
              }}
            />
          </label>

          {error ? (
            <p role="alert" className="type-meta text-destructive">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary-on-ground"
            shape="block"
            disabled={submitting}
            className="mt-2"
          >
            {submitting ? (
              <span
                aria-hidden
                className="spinner"
                style={{ height: "18px", width: "18px" }}
              />
            ) : null}
            {submitting ? "Signing in" : "Sign in"}
          </Button>
        </form>

        <p className="type-meta text-muted-ground mt-4">
          Forgotten your password? Reset it on the AutoStudio Lanka website, then sign in here.
        </p>
      </div>
    </main>
  );
}