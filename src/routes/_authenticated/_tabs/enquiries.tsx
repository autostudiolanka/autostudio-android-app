import { createFileRoute } from "@tanstack/react-router";

import { AppHeader } from "@/components/shell/AppHeader";
import { Placeholder } from "@/components/shell/Placeholder";

export const Route = createFileRoute("/_authenticated/_tabs/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries — AutoStudio Lanka" },
      { name: "description", content: "Enquiries for AutoStudio Lanka dealer staff." },
      { property: "og:title", content: "Enquiries — AutoStudio Lanka" },
      { property: "og:description", content: "Enquiries for AutoStudio Lanka dealer staff." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EnquiriesScreen,
});

function EnquiriesScreen() {
  return (
    <>
      <AppHeader eyebrow="Forecourt" title="Enquiries" />
      <Placeholder title="Enquiries" note="This tab has no content yet." />
    </>
  );
}
