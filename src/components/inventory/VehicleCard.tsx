import { Link } from "@tanstack/react-router";
import { ImageOff } from "lucide-react";
import { useState } from "react";

import { StatusChip } from "@/components/primitives/StatusChip";
import {
  vehicleSubtitle,
  vehicleTitle,
  type InventoryVehicle,
  type VehicleCardState,
} from "@/lib/inventory";
import { cn } from "@/lib/utils";

const cardSkin: Record<VehicleCardState, string> = {
  complete: "bg-surface text-text",
  processing: "bg-accent-soft text-primary-on-ground-fg",
  published_no_backgrounds: "bg-failed-bg text-failed-fg",
  no_photos: "bg-surface text-text",
  sold: "bg-offline-bg text-offline-fg",
};

function PhotoProgress({ done, total, pulsing }: { done: number; total: number; pulsing: boolean }) {
  if (total === 0) return null;
  const dashes = Array.from({ length: total });

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 items-center gap-1">
        {dashes.map((_, index) => {
          const filled = index < done;
          const isWorking = pulsing && !filled;
          return (
            <span
              key={index}
              className={cn("h-[3px] flex-1", isWorking && "processing-pulse processing-pulse-stagger")}
              style={{
                borderRadius: "var(--radius-pill)",
                backgroundColor: filled ? "currentColor" : "var(--border-strong)",
                ...(isWorking ? ({ "--pulse-index": index } as Record<string, number>) : {}),
              }}
            />
          );
        })}
      </div>
      <span className="type-meta shrink-0">
        {done}/{total}
      </span>
    </div>
  );
}

function Thumbnail({ url, alt }: { url: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);
  const showFallback = !url || failed;

  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden bg-surface-2 text-muted"
      style={{ height: "68px", width: "88px", borderRadius: "var(--radius-thumb)" }}
    >
      {showFallback ? (
        <ImageOff size={20} strokeWidth={2} aria-hidden />
      ) : (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="photo-lands h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function StateFooter({ vehicle }: { vehicle: InventoryVehicle }) {
  switch (vehicle.state) {
    case "processing":
      return (
        <div className="flex items-center gap-2">
          <span
            className="spinner block shrink-0"
            style={{ height: "14px", width: "14px" }}
            aria-hidden
          />
          <p className="type-meta">Backgrounds are still being made</p>
        </div>
      );
    case "published_no_backgrounds":
      return (
        <p className="type-meta">
          Live on the website using the original photos. New backgrounds were not made this time.
        </p>
      );
    case "no_photos":
      return <StatusChip tone="offline">No photos yet</StatusChip>;
    case "sold":
      return <StatusChip tone="offline">Sold</StatusChip>;
    case "complete":
    default:
      return (
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip tone="done">
            {vehicle.photosTotal > 0 ? `All ${vehicle.photosDone} photos done` : "Photos done"}
          </StatusChip>
          {vehicle.isPublished ? <StatusChip tone="done">Live</StatusChip> : null}
        </div>
      );
  }
}

export function VehicleCard({ vehicle }: { vehicle: InventoryVehicle }) {
  const title = vehicleTitle(vehicle.details);
  const subtitle = vehicleSubtitle(vehicle.details);

  return (
    <Link
      to="/vehicle/$vehicleId"
      params={{ vehicleId: vehicle.id }}
      className={cn("press block", cardSkin[vehicle.state])}
      style={{ borderRadius: "var(--radius-card)", padding: "12px" }}
    >
      <div className="flex items-start gap-3">
        <Thumbnail url={vehicle.thumbnailUrl} alt={title} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="type-card-title min-w-0 flex-1 break-words">{title}</h3>
            {vehicle.registration ? (
              <span
                className="type-meta shrink-0 bg-surface-2 text-text-2"
                style={{
                  borderRadius: "var(--radius-pill)",
                  padding: "5px 10px",
                  maxWidth: "104px",
                  wordBreak: "break-word",
                }}
              >
                {vehicle.registration}
              </span>
            ) : null}
          </div>
          {subtitle ? <p className="type-meta mt-1 break-words opacity-80">{subtitle}</p> : null}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {vehicle.state === "processing" || vehicle.state === "complete" ? (
          <PhotoProgress
            done={vehicle.photosDone}
            total={vehicle.photosTotal}
            pulsing={vehicle.state === "processing"}
          />
        ) : null}
        <StateFooter vehicle={vehicle} />
      </div>
    </Link>
  );
}