import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

import { Placeholder } from "@/components/shell/Placeholder";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — AutoStudio Lanka" },
      { name: "description", content: "Alerts about stock and buyer enquiries." },
      { property: "og:title", content: "Notifications — AutoStudio Lanka" },
      { property: "og:description", content: "Alerts about stock and buyer enquiries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotificationsScreen,
});

function NotificationsScreen() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      <header
        className="flex items-center gap-3 bg-ground"
        style={{ paddingTop: "calc(var(--safe-top) + 20px)", paddingInline: "20px", paddingBottom: "16px" }}
      >
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.history.back()}
          className="press flex shrink-0 items-center justify-center bg-raised text-sheet"
          style={{
            height: "var(--size-icon-button)",
            width: "var(--size-icon-button)",
            borderRadius: "var(--radius-pill)",
          }}
        >
          <ChevronLeft size={22} strokeWidth={2} aria-hidden />
        </button>
        <h1 className="type-screen-title text-sheet">Notifications</h1>
      </header>
      <Placeholder title="Nothing yet" note="Notifications will appear here." />
    </div>
  );
}
