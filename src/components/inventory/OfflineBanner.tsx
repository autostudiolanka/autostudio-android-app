import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  return (
    <div
      className="flex items-center gap-3 bg-offline-bg text-offline-fg"
      style={{ borderRadius: "var(--radius-row)", padding: "12px 14px" }}
      role="status"
    >
      <WifiOff size={18} strokeWidth={2} aria-hidden className="shrink-0" />
      <p className="type-meta">
        You are offline. Showing the stock last loaded on this phone — editing comes back with the
        connection.
      </p>
    </div>
  );
}