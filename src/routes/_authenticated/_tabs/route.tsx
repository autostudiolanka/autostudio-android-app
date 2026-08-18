import { Outlet, createFileRoute, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { TabBar, TABS } from "@/components/shell/TabBar";

export const Route = createFileRoute("/_authenticated/_tabs")({
  component: TabsLayout,
});

const TAB_PATHS = TABS.map((tab) => tab.to as string);

function TabsLayout() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const previousPath = useRef(pathname);

  useEffect(() => {
    previousPath.current = pathname;
  }, [pathname]);

  // Android hardware back: from a non-Home tab root, go to Home before exiting.
  useEffect(() => {
    function handlePopState() {
      const from = previousPath.current;
      if (TAB_PATHS.includes(from) && from !== "/home") {
        router.navigate({ to: "/home", replace: true });
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  return (
    <div
      className="flex min-h-screen flex-col bg-ground"
      style={{ paddingBottom: "calc(75px + var(--safe-bottom))" }}
    >
      <Outlet />
      <TabBar />
    </div>
  );
}
