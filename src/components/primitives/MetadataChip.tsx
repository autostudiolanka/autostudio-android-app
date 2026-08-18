import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function MetadataChip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "type-meta inline-flex select-none items-center justify-center whitespace-nowrap bg-surface-2 text-text-2",
        className,
      )}
      style={{
        height: "var(--size-metadata-chip)",
        paddingBlock: "var(--space-metadata-chip-y)",
        paddingInline: "var(--space-metadata-chip-x)",
        borderRadius: "var(--radius-pill)",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}