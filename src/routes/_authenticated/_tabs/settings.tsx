import { createFileRoute } from "@tanstack/react-router";

import { AppHeader } from "@/components/shell/AppHeader";
import { Placeholder } from "@/components/shell/Placeholder";

export const Route = createFileRoute("/_authenticated/_tabs/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AutoStudio Lanka" },
      { name: "description", content: "Settings for AutoStudio Lanka dealer staff." },
      { property: "og:title", content: "Settings — AutoStudio Lanka" },
      { property: "og:description", content: "Settings for AutoStudio Lanka dealer staff." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsScreen,
});

function SettingsScreen() {
  return (
    <>
      <AppHeader eyebrow="Forecourt" title="Settings" />
      <Placeholder title="Settings" note="This tab has no content yet." />
    </>
  );
}
