import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import type { ReactNode } from "react";

export function AppHeader({ eyebrow, title }: { eyebrow?: string; title: ReactNode }) {
  return (
    <header
      className="flex items-start justify-between gap-4 bg-ground"
      style={{
        paddingTop: "calc(var(--safe-top) + 20px)",
        paddingInline: "20px",
        paddingBottom: "16px",
      }}
    >
      <div>
        {eyebrow ? <p className="type-meta text-muted-ground">{eyebrow}</p> : null}
        <h1 className="type-screen-title text-sheet">{title}</h1>
      </div>

      <Link
        to="/notifications"
        aria-label="Notifications"
        className="press flex shrink-0 items-center justify-center bg-raised text-sheet"
        style={{
          height: "var(--size-icon-button)",
          width: "var(--size-icon-button)",
          borderRadius: "var(--radius-pill)",
        }}
      >
        <Bell size={20} strokeWidth={2} aria-hidden />
      </Link>
    </header>
  );
}
