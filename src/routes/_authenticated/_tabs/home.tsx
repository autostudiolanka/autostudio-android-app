import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/primitives/Button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/_tabs/home")({
  head: () => ({
    meta: [
      { title: "You're in — AutoStudio Lanka" },
      {
        name: "description",
        content: "Placeholder home for signed-in dealer staff managing stock and enquiries.",
      },
      { property: "og:title", content: "You're in — AutoStudio Lanka" },
      {
        property: "og:description",
        content: "Signed-in placeholder while the app shell is built.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePlaceholder,
});

function HomePlaceholder() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
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
      <h1 className="type-screen-title text-sheet">You're in</h1>
      <p className="type-body text-muted-ground mt-2">
        Signed in as {user.email}. The app shell lands here next.
      </p>

      <div className="mt-auto">
        <Button variant="secondary-on-ground" shape="block" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </main>
  );
}