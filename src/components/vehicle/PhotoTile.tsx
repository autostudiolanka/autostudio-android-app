import { useState } from "react";

import type { VehicleSlot } from "@/lib/vehicle";
import { cn } from "@/lib/utils";

const skin: Record<VehicleSlot["state"], string> = {
  done: "bg-surface-2",
  processing: "bg-processing-bg",
  error: "bg-failed-bg",
  empty: "bg-surface-2 border border-dashed border-border-strong",
};

export function PhotoTile({ slot, index }: { slot: VehicleSlot; index: number }) {
  const [failed, setFailed] = useState(false);
  const showImage = slot.state === "done" && slot.url && !failed;

  return (
    <div
      className={cn("relative aspect-square overflow-hidden", skin[slot.state])}
      style={{ borderRadius: "var(--radius-thumb)" }}
    >
      {showImage ? (
        <img
          src={slot.url ?? ""}
          alt={slot.label}
          loading="lazy"
          onError={() => setFailed(true)}
          className="photo-lands h-full w-full object-cover"
        />
      ) : null}

      {slot.state === "processing" ? (
        <span
          className="processing-pulse processing-pulse-stagger absolute inset-0"
          style={{
            backgroundColor: "var(--processing-fg)",
            opacity: 0.12,
            ...({ "--pulse-index": index } as Record<string, number>),
          }}
          aria-hidden
        />
      ) : null}

      <span
        className={cn(
          "type-micro absolute bottom-1 left-1 max-w-[calc(100%-8px)] truncate",
          slot.state === "error"
            ? "text-failed-fg"
            : slot.state === "empty"
              ? "text-muted"
              : slot.state === "processing"
                ? "text-processing-fg"
                : "text-sheet",
        )}
        style={
          slot.state === "done"
            ? { textShadow: "var(--elevation-icon)" }
            : undefined
        }
      >
        {slot.label}
      </span>
    </div>
  );
}