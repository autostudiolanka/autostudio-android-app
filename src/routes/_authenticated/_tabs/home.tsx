import { createFileRoute } from "@tanstack/react-router";

import { AppHeader } from "@/components/shell/AppHeader";
import { Placeholder } from "@/components/shell/Placeholder";

export const Route = createFileRoute("/_authenticated/_tabs/home")({
  head: () => ({
    meta: [
      { title: "Home — AutoStudio Lanka" },
      { name: "description", content: "Forecourt overview for AutoStudio Lanka dealer staff." },
      { property: "og:title", content: "Home — AutoStudio Lanka" },
      { property: "og:description", content: "Forecourt overview for dealer staff." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeScreen,
});

function HomeScreen() {
  const { user } = Route.useRouteContext();

  return (
    <>
      <AppHeader eyebrow="Forecourt · last 7 days" title="Home" />
      <Placeholder title="Home" note={`Signed in as ${user.email}. Screen content lands next.`} />
    </>
  );
}
