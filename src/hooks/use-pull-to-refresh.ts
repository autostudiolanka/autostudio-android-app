import { useEffect, useRef, useState } from "react";

const THRESHOLD = 72;
const MAX = 96;

/** Touch-only pull to refresh for a page that scrolls the window. */
export function usePullToRefresh(onRefresh: () => Promise<unknown>) {
  const [distance, setDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const refreshRef = useRef(onRefresh);
  refreshRef.current = onRefresh;

  useEffect(() => {
    function onTouchStart(event: TouchEvent) {
      startY.current = window.scrollY <= 0 ? (event.touches[0]?.clientY ?? null) : null;
    }

    function onTouchMove(event: TouchEvent) {
      if (startY.current === null || refreshing) return;
      const current = event.touches[0]?.clientY ?? 0;
      const delta = current - startY.current;
      setDistance(delta > 0 ? Math.min(delta * 0.5, MAX) : 0);
    }

    async function onTouchEnd() {
      if (startY.current === null) return;
      const pulled = distance;
      startY.current = null;
      if (pulled >= THRESHOLD && !refreshing) {
        setRefreshing(true);
        setDistance(THRESHOLD);
        try {
          await refreshRef.current();
        } finally {
          setRefreshing(false);
          setDistance(0);
        }
        return;
      }
      setDistance(0);
    }

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [distance, refreshing]);

  return { distance, refreshing, threshold: THRESHOLD };
}