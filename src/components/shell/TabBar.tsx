import { Link, useRouterState } from "@tanstack/react-router";
import { FileText, House, MessageCircle, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type TabDef = {
  to: "/home" | "/inventory" | "/enquiries" | "/settings";
  label: string;
  icon: LucideIcon;
  badge?: boolean;
};

export const TABS: TabDef[] = [
  { to: "/home", label: "Home", icon: House },
  { to: "/inventory", label: "Inventory", icon: FileText },
  { to: "/enquiries", label: "Enquiries", icon: MessageCircle, badge: true },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full bg-sheet"
      style={{
        maxWidth: "var(--app-max-width, 100%)",
        paddingTop: "var(--tabbar-pad-top)",
        paddingInline: "var(--tabbar-pad-x)",
        paddingBottom: "calc(var(--tabbar-pad-bottom) + var(--safe-bottom))",
        boxShadow: "var(--shadow-bottom-bar)",
      }}
    >
      <ul
        className="grid grid-cols-4"
        style={{ gap: "var(--tabbar-gap)", listStyle: "none", margin: 0, padding: 0 }}
      >
        {TABS.map((tab) => {
          const active = pathname === tab.to;
          const Icon = tab.icon;

          return (
            <li key={tab.to} className="relative">
              <Link
                to={tab.to}
                aria-current={active ? "page" : undefined}
                className="tab-item relative flex w-full select-none flex-col items-center justify-center"
                style={{
                  paddingTop: "var(--tabitem-pad-top)",
                  paddingBottom: "var(--tabitem-pad-bottom)",
                  gap: "var(--tabitem-gap)",
                  borderRadius: "var(--radius-tab)",
                  backgroundColor: active ? "var(--accent-soft)" : "transparent",
                  color: active ? "var(--primary-on-ground-fg)" : "var(--muted-dark)",
                }}
              >
                <Icon size={24} strokeWidth={2} aria-hidden />
                <span
                  style={{
                    fontSize: "var(--text-chip-size)",
                    lineHeight: 1,
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {tab.label}
                </span>
                {tab.badge ? (
                  <span
                    aria-hidden
                    className="absolute rounded-full bg-tab-badge"
                    style={{
                      top: "var(--tab-badge-top)",
                      right: "var(--tab-badge-right)",
                      height: "var(--tab-badge-size)",
                      width: "var(--tab-badge-size)",
                      boxShadow: "0 0 0 var(--tab-badge-ring) var(--sheet)",
                    }}
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
