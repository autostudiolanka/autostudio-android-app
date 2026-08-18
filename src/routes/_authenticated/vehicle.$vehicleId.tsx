import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ImageOff, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/primitives/Button";
import { MetadataChip } from "@/components/primitives/MetadataChip";
import { PhotoTile } from "@/components/vehicle/PhotoTile";
import { fetchVehicle, vehicleMetaLine, vehicleName } from "@/lib/vehicle";

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

const STATUS_LABEL: Record<string, string> = {
  incomplete: "Incomplete",
  pending: "Pending",
  stock: "In stock",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function VehicleScreen() {
  const router = useRouter();
  const { vehicleId } = Route.useParams();
  const query = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => fetchVehicle(vehicleId),
    staleTime: 30_000,
  });
  const vehicle = query.data ?? null;
  const hero = vehicle?.slots.find((slot) => slot.state === "done") ?? null;
  const info = vehicle?.info ?? null;

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
        <div className="flex min-w-0 flex-1 justify-center">
          {vehicle?.registration ? (
            <span
              className="type-card-title truncate bg-raised text-sheet"
              style={{ borderRadius: "var(--radius-pill)", padding: "10px 16px" }}
            >
              {vehicle.registration}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="More options"
          className="press flex shrink-0 items-center justify-center bg-raised text-sheet"
          style={{
            height: "var(--size-icon-button)",
            width: "var(--size-icon-button)",
            borderRadius: "var(--radius-pill)",
          }}
        >
          <MoreHorizontal size={22} strokeWidth={2} aria-hidden />
        </button>
      </header>

      {query.isPending ? (
        <p className="type-body px-5 pb-8 text-muted-ground">Loading vehicle…</p>
      ) : query.isError ? (
        <p className="type-body px-5 pb-8 text-muted-ground">{(query.error as Error).message}</p>
      ) : !vehicle || !info ? (
        <p className="type-body px-5 pb-8 text-muted-ground">This vehicle is no longer available.</p>
      ) : (
        <>
          <div className="relative px-5">
            <div
              className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-raised text-muted-ground"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              {hero?.url ? (
                <img
                  src={hero.url}
                  alt={vehicleName(info)}
                  className="photo-lands h-full w-full object-cover"
                />
              ) : (
                <ImageOff size={28} strokeWidth={2} aria-hidden />
              )}

              {vehicle.photosWorking > 0 ? (
                <span
                  className="type-meta absolute bottom-3 left-3 inline-flex items-center gap-2 bg-processing-bg text-processing-fg"
                  style={{ borderRadius: "var(--radius-pill)", padding: "7px 12px" }}
                >
                  <span
                    className="spinner block shrink-0"
                    style={{ height: "12px", width: "12px" }}
                    aria-hidden
                  />
                  {vehicle.photosWorking} photo{vehicle.photosWorking === 1 ? "" : "s"} still
                  processing
                </span>
              ) : null}
            </div>
          </div>

          <div className="px-5 pb-5 pt-4">
            <h1 className="type-screen-title break-words text-sheet">{vehicleName(info)}</h1>
            {vehicleMetaLine(info) ? (
              <p className="type-body mt-1 break-words text-muted-ground">
                {vehicleMetaLine(info)}
              </p>
            ) : null}
          </div>

          <section
            className="flex flex-1 flex-col bg-sheet text-text"
            style={{
              borderTopLeftRadius: "var(--radius-sheet)",
              borderTopRightRadius: "var(--radius-sheet)",
              padding: "20px 16px calc(var(--safe-bottom) + 20px)",
            }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="type-section-title">Photos</h2>
              <span className="type-meta text-muted">
                {vehicle.photosDone} done
                {vehicle.photosWorking > 0 ? ` · ${vehicle.photosWorking} working` : ""}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {vehicle.slots.map((slot, index) => (
                <PhotoTile key={slot.slotId} slot={slot} index={index} />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <MetadataChip>
                {vehicle.soldAt ? "Sold" : (STATUS_LABEL[vehicle.status] ?? vehicle.status)}
              </MetadataChip>
              <MetadataChip>Added {formatDate(vehicle.createdAt)}</MetadataChip>
              <MetadataChip>
                {vehicle.isPublished ? "Live on website" : "Not on website"}
              </MetadataChip>
            </div>

            <div className="mt-6">
              <Button
                shape="block"
                variant={vehicle.isPublished ? "secondary" : "primary"}
                style={{ borderRadius: "var(--radius-pill)" }}
              >
                {vehicle.isPublished ? "View on website" : "Publish to website"}
              </Button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}