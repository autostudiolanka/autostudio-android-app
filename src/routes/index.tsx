import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import heroCar from "@/assets/hero-car.jpg";
import { Button } from "@/components/primitives/Button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AutoStudio Lanka — Your stock, online today" },
      {
        name: "description",
        content:
          "The AutoStudio Lanka dealer app: get your stock online and answer buyer enquiries from your phone.",
      },
      { property: "og:title", content: "AutoStudio Lanka — Your stock, online today" },
      {
        property: "og:description",
        content: "Manage dealership stock and buyer enquiries from your phone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoggedOutHome,
});

function LoggedOutHome() {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) navigate({ to: "/home", replace: true });
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-ground">
      <img
        src={heroCar}
        alt="Dark luxury SUV photographed in a studio"
        width={784}
        height={1600}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--ground) 85%, transparent) 0%, transparent 30%, transparent 45%, var(--ground) 92%)",
        }}
      />

      <div
        className="relative flex min-h-screen flex-col"
        style={{
          paddingTop: "calc(var(--safe-top) + 24px)",
          paddingBottom: "calc(var(--safe-bottom) + 24px)",
          paddingInline: "20px",
        }}
      >
        <p className="type-screen-title text-sheet">AutoStudio Lanka</p>

        <div className="mt-auto">
          <h1 className="type-display text-sheet">
            Your stock,
            <br />
            online today
          </h1>

          <Button
            variant="primary-on-ground"
            shape="block"
            className="mt-6 font-semibold"
            style={{
              minHeight: "var(--size-button)",
              paddingInline: "var(--space-button-x)",
              borderRadius: "var(--radius-pill)",
            }}
            onClick={() => navigate({ to: "/signin" })}
          >
            Sign in
          </Button>
        </div>
      </div>
    </main>
  );
}