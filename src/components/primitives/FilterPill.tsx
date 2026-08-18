import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Surface = "sheet" | "ground";

const skin: Record<Surface, { selected: string; unselected: string }> = {
  sheet: {
    selected: "bg-text text-sheet",
    unselected: "bg-surface-2 text-text-2",
  },
  ground: {
    selected: "bg-primary-on-ground text-primary-on-ground-fg",
    unselected: "bg-raised text-muted-ground",
  },
};

type FilterPillProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  surface?: Surface;
  children: ReactNode;
};

/** Hit area is padded out to the 44px minimum without growing the visual pill. */
export function FilterPill({
  selected = false,
  surface = "sheet",
  className,
  children,
  ...props
}: FilterPillProps) {
  const tone = skin[surface];

  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "press-pill inline-flex select-none items-center justify-center outline-none",
        className,
      )}
      style={{
        minHeight: "var(--size-touch)",
        paddingBlock: "calc((var(--size-touch) - var(--size-filter-pill)) / 2)",
      }}
      {...props}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap",
          selected ? tone.selected : tone.unselected,
        )}
        style={{
          height: "var(--size-filter-pill)",
          paddingBlock: "var(--space-filter-pill-y)",
          paddingInline: "var(--space-filter-pill-x)",
          borderRadius: "var(--radius-pill)",
          fontSize: "var(--text-meta-size)",
          lineHeight: "var(--text-meta-line)",
          fontWeight: selected ? 600 : 500,
        }}
      >
        {children}
      </span>
    </button>
  );
}