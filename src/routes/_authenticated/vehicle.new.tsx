import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/vehicle/new")({
  head: () => ({
    meta: [
      { title: "Add a vehicle — AutoStudio Lanka" },
      { name: "description", content: "Add a vehicle to your AutoStudio Lanka stock." },
      { property: "og:title", content: "Add a vehicle — AutoStudio Lanka" },
      { property: "og:description", content: "Add a vehicle to your AutoStudio Lanka stock." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AddVehicleScreen,
});

function AddVehicleScreen() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      <header
        className="flex items-center gap-3"
        style={{ paddingTop: "calc(var(--safe-top) + 12px)", paddingInline: "20px", paddingBottom: "16px" }}
      >
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label="Back"
          className="press flex items-center justify-center bg-raised text-sheet"
          style={{
            height: "var(--size-icon-button)",
            width: "var(--size-icon-button)",
            borderRadius: "var(--radius-pill)",
          }}
        >
          <ChevronLeft size={20} strokeWidth={2} aria-hidden />
        </button>
        <h1 className="type-screen-title text-sheet">Add a vehicle</h1>
      </header>

      <section
        className="flex-1 bg-sheet text-text"
        style={{
          borderTopLeftRadius: "var(--radius-sheet)",
          borderTopRightRadius: "var(--radius-sheet)",
          padding: "24px 20px",
        }}
      >
        <p className="type-body text-muted">
          Photo capture and vehicle details are coming in the next step.
        </p>
      </section>
    </div>
  );
}
