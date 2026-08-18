import { createFileRoute } from "@tanstack/react-router";

import { AppHeader } from "@/components/shell/AppHeader";
import { Placeholder } from "@/components/shell/Placeholder";

export const Route = createFileRoute("/_authenticated/_tabs/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — AutoStudio Lanka" },
      { name: "description", content: "Inventory for AutoStudio Lanka dealer staff." },
      { property: "og:title", content: "Inventory — AutoStudio Lanka" },
      { property: "og:description", content: "Inventory for AutoStudio Lanka dealer staff." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InventoryScreen,
});

function InventoryScreen() {
  return (
    <>
      <AppHeader eyebrow="Forecourt" title="Inventory" />
      <Placeholder title="Inventory" note="This tab has no content yet." />
    </>
  );
}
