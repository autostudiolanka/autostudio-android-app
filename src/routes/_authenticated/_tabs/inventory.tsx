import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Bell, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { OfflineBanner } from "@/components/inventory/OfflineBanner";
import { StatTile } from "@/components/inventory/StatTile";
import { VehicleCard } from "@/components/inventory/VehicleCard";
import { useOnline } from "@/hooks/use-online";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import {
  fetchInventory,
  vehicleTitle,
  type InventoryVehicle,
} from "@/lib/inventory";
import { fetchFirstName } from "@/lib/profile";

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

type FilterKey = "all" | "live" | "missing";

function InventoryScreen() {
  const online = useOnline();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [term, setTerm] = useState("");

  const query = useQuery({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
    staleTime: 30_000,
    // Keep the last successful list on screen when the connection drops.
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    enabled: online,
  });

  const nameQuery = useQuery({
    queryKey: ["first-name"],
    queryFn: fetchFirstName,
    staleTime: 5 * 60_000,
  });

  const pull = usePullToRefresh(async () => {
    if (online) await query.refetch();
  });

  const vehicles = query.data ?? [];
  const liveCount = vehicles.filter((v) => v.isPublished && !v.soldAt).length;
  const missingCount = vehicles.filter(
    (v) => !v.soldAt && (v.state === "no_photos" || v.state === "published_no_backgrounds"),
  ).length;

  const visible = useMemo(() => {
    const needle = term.trim().toLowerCase();
    return vehicles.filter((vehicle) => {
      if (filter === "live" && !(vehicle.isPublished && !vehicle.soldAt)) return false;
      if (
        filter === "missing" &&
        !(!vehicle.soldAt &&
          (vehicle.state === "no_photos" || vehicle.state === "published_no_backgrounds"))
      ) {
        return false;
      }
      if (!needle) return true;
      return matches(vehicle, needle);
    });
  }, [vehicles, filter, term]);

  return (
    <>
      <section
        className="bg-ground"
        style={{
          paddingTop: "calc(var(--safe-top) + 20px)",
          paddingInline: "20px",
          paddingBottom: "20px",
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <h1 className="type-screen-title min-w-0 flex-1 truncate text-sheet">
            {nameQuery.data ? `Hello, ${nameQuery.data}` : "Hello"}
          </h1>
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="press relative flex shrink-0 items-center justify-center bg-raised text-sheet"
            style={{
              height: "var(--size-icon-button)",
              width: "var(--size-icon-button)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            <Bell size={20} strokeWidth={2} aria-hidden />
            <span
              aria-hidden
              className="absolute bg-unread-dot"
              style={{
                top: "10px",
                right: "10px",
                height: "9px",
                width: "9px",
                borderRadius: "var(--radius-pill)",
              }}
            />
          </Link>
        </div>

        <label
          className="mt-4 flex items-center gap-3 bg-raised"
          style={{ borderRadius: "var(--radius-pill)", padding: "0 18px", height: "52px" }}
        >
          <Search size={18} strokeWidth={2} className="shrink-0 text-muted-ground" aria-hidden />
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search plate or model"
            aria-label="Search plate or model"
            className="type-body min-w-0 flex-1 bg-transparent text-sheet outline-none placeholder:text-placeholder"
          />
        </label>

        <div className="mt-4 flex items-stretch gap-3">
          <StatTile
            title={<>On the<br />website</>}
            chip={`${liveCount} live`}
            tone="done"
            onClick={() => setFilter(filter === "live" ? "all" : "live")}
          />
          <StatTile
            title={<>Missing<br />images</>}
            chip={`${missingCount} ${missingCount === 1 ? "car" : "cars"}`}
            tone="failed"
            onClick={() => setFilter(filter === "missing" ? "all" : "missing")}
          />
        </div>
      </section>

      <section
        className="relative flex-1 bg-sheet text-text"
        style={{
          borderTopLeftRadius: "var(--radius-sheet)",
          borderTopRightRadius: "var(--radius-sheet)",
          padding: "10px 20px 100px",
          transform: `translateY(${pull.distance}px)`,
          transition: pull.distance === 0 ? "transform 200ms ease-out" : "none",
        }}
      >
        <div className="flex items-center justify-center" aria-live="polite">
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
          ) : (
            <span
              aria-hidden
              className="bg-border-strong"
              style={{ height: "4px", width: "44px", borderRadius: "var(--radius-pill)" }}
            />
          )}
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-3">
          <h2 className="type-section-title min-w-0 truncate">
            {filter === "live"
              ? "On the website"
              : filter === "missing"
                ? "Missing images"
                : "On the forecourt"}
          </h2>
          {filter === "all" ? (
            <span className="type-body shrink-0 text-muted">See all {vehicles.length}</span>
          ) : (
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="press-pill type-body shrink-0 text-muted"
              style={{ padding: "10px 0" }}
            >
              Show all
            </button>
          )}
        </div>

        {!online ? (
          <div className="mt-3">
            <OfflineBanner />
          </div>
        ) : null}

        <div className="mt-3 flex flex-col gap-3">
          {query.isPending && online ? (
            <p className="type-body text-muted">Loading your stock…</p>
          ) : query.isError && vehicles.length === 0 ? (
            <p className="type-body text-muted">{(query.error as Error).message}</p>
          ) : vehicles.length === 0 ? (
            <div className="py-8">
              <h3 className="type-section-title text-text">No vehicles yet</h3>
              <p className="type-body mt-2 text-muted">
                Stock added to your dealership will show up here.
              </p>
            </div>
          ) : visible.length === 0 ? (
            <p className="type-body py-6 text-muted">Nothing matches this yet.</p>
          ) : (
            visible.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)
          )}
        </div>
      </section>

      <div
        className="fixed inset-x-0 z-20 bg-sheet"
        style={{
          bottom: "calc(75px + var(--safe-bottom))",
          padding: "12px 20px 16px",
          maxWidth: "var(--app-max-width, 100%)",
          margin: "0 auto",
        }}
      >
        <Link
          to="/vehicle/new"
          className="press type-card-title flex w-full items-center justify-center gap-2 bg-primary text-sheet"
          style={{ borderRadius: "var(--radius-pill)", height: "60px" }}
        >
          <Plus size={20} strokeWidth={2.5} aria-hidden />
          Add a vehicle
        </Link>
      </div>
    </>
  );
}

function matches(vehicle: InventoryVehicle, needle: string): boolean {
  const haystack = [vehicleTitle(vehicle.details), vehicle.registration ?? ""]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}
