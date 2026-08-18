import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type StatusTone = "done" | "processing" | "failed" | "offline";

const toneClasses: Record<StatusTone, string> = {
  done: "bg-done-bg text-done-fg",
  processing: "bg-processing-bg text-processing-fg",
  failed: "bg-failed-bg text-failed-fg",
  offline: "bg-offline-bg text-offline-fg",
};

/** Static status indicator. Never interactive — renders a <span>, no handlers. */
export function StatusChip({
  tone,
  children,
  className,
}: {
  tone: StatusTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "type-chip inline-flex select-none items-center justify-center whitespace-nowrap",
        toneClasses[tone],
        className,
      )}
      style={{
        height: "var(--size-status-chip)",
        paddingBlock: "var(--space-status-chip-y)",
        paddingInline: "var(--space-status-chip-x)",
        borderRadius: "var(--radius-pill)",
      }}
    >
      {children}
    </span>
  );
}