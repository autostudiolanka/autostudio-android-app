import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

import { Placeholder } from "@/components/shell/Placeholder";

export const Route = createFileRoute("/_authenticated/vehicle/$vehicleId")({
  head: () => ({
    meta: [
      { title: "Vehicle — AutoStudio Lanka" },
      { name: "description", content: "Photos and details for a vehicle on the forecourt." },
      { property: "og:title", content: "Vehicle — AutoStudio Lanka" },
      { property: "og:description", content: "Photos and details for a vehicle on the forecourt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VehicleScreen,
});

function VehicleScreen() {
  const router = useRouter();
  const { vehicleId } = Route.useParams();

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      <header
        className="flex items-center gap-3 bg-ground"
        style={{
          paddingTop: "calc(var(--safe-top) + 20px)",
          paddingInline: "20px",
          paddingBottom: "16px",
        }}
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
        <h1 className="type-screen-title text-sheet">Vehicle</h1>
      </header>
      <Placeholder title="Vehicle detail" note={`Coming next for vehicle ${vehicleId}.`} />
    </div>
  );
}