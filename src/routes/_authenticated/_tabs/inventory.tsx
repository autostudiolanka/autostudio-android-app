import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { FilterPill } from "@/components/primitives/FilterPill";
import { OfflineBanner } from "@/components/inventory/OfflineBanner";
import { VehicleCard } from "@/components/inventory/VehicleCard";
import { AppHeader } from "@/components/shell/AppHeader";
import { useOnline } from "@/hooks/use-online";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { fetchInventory, type InventoryVehicle } from "@/lib/inventory";

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
  const online = useOnline();
  const [filter, setFilter] = useState<FilterKey>("all");

  const query = useQuery({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
    staleTime: 30_000,
    // Keep the last successful list on screen when the connection drops.
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    enabled: online,
  });

  const pull = usePullToRefresh(async () => {
    if (online) await query.refetch();
  });

  const vehicles = query.data ?? [];
  const visible = useMemo(
    () => vehicles.filter((vehicle) => FILTERS[filter].match(vehicle)),
    [vehicles, filter],
  );

  return (
    <>
      <AppHeader eyebrow="Forecourt" title="Inventory" />

      <section
        className="flex-1 bg-sheet text-text"
        style={{
          borderTopLeftRadius: "var(--radius-sheet)",
          borderTopRightRadius: "var(--radius-sheet)",
          padding: "8px 16px 24px",
          transform: `translateY(${pull.distance}px)`,
          transition: pull.distance === 0 ? "transform 200ms ease-out" : "none",
        }}
      >
        <div className="flex h-6 items-center justify-center" aria-live="polite">
          {pull.refreshing ? (
            <span
              className="spinner block text-muted"
              style={{ height: "16px", width: "16px" }}
              aria-label="Refreshing"
            />
          ) : pull.distance > 0 ? (
            <span className="type-micro text-muted">
              {pull.distance >= pull.threshold ? "Release to refresh" : "Pull to refresh"}
            </span>
          ) : null}
        </div>

        <div className="-mx-16 mt-1 overflow-x-auto px-16" style={{ scrollbarWidth: "none" }}>
          <div className="flex w-max items-center gap-2">
            {(Object.keys(FILTERS) as FilterKey[]).map((key) => (
              <FilterPill
                key={key}
                selected={filter === key}
                onClick={() => setFilter(key)}
              >
                {FILTERS[key].label}
              </FilterPill>
            ))}
          </div>
        </div>

        {!online ? (
          <div className="mt-2">
            <OfflineBanner />
          </div>
        ) : null}

        <div className="mt-3 flex flex-col gap-3">
          {query.isPending && online ? (
            <p className="type-body text-muted">Loading your stock…</p>
          ) : query.isError && vehicles.length === 0 ? (
            <p className="type-body text-muted">
              {(query.error as Error).message}
            </p>
          ) : vehicles.length === 0 ? (
            <div className="py-8">
              <h2 className="type-section-title text-text">No vehicles yet</h2>
              <p className="type-body text-muted mt-2">
                Stock added to your dealership will show up here.
              </p>
            </div>
          ) : visible.length === 0 ? (
            <p className="type-body text-muted py-6">Nothing matches this filter.</p>
          ) : (
            visible.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)
          )}
        </div>
      </section>
    </>
  );
}

type FilterKey = "all" | "live" | "processing" | "no_photos" | "sold";

const FILTERS: Record<FilterKey, { label: string; match: (v: InventoryVehicle) => boolean }> = {
  all: { label: "All", match: () => true },
  live: { label: "Live", match: (v) => v.isPublished && !v.soldAt },
  processing: { label: "Processing", match: (v) => v.state === "processing" },
  no_photos: { label: "No photos", match: (v) => v.state === "no_photos" },
  sold: { label: "Sold", match: (v) => v.state === "sold" },
};
