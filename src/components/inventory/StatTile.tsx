import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function StatTile({
  title,
  chip,
  tone,
  onClick,
}: {
  title: ReactNode;
  chip: string;
  tone: "done" | "failed";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "press flex flex-1 flex-col justify-between text-left",
        tone === "done" ? "bg-done-bg text-done-fg" : "bg-failed-bg text-failed-fg",
      )}
      style={{ borderRadius: "var(--radius-card)", padding: "16px", minHeight: "132px" }}
    >
      <span className="type-section-title">{title}</span>
      <span className="flex items-center justify-between gap-2">
        <span
          className="type-chip"
          style={{
            borderRadius: "var(--radius-pill)",
            padding: "7px 10px",
            backgroundColor: "rgba(0, 0, 0, 0.08)",
          }}
        >
          {chip}
        </span>
        <span
          className="flex items-center justify-center bg-primary text-sheet"
          style={{ height: "38px", width: "38px", borderRadius: "var(--radius-pill)" }}
          aria-hidden
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </span>
      </span>
    </button>
  );
}
