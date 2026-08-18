import { Mail, MessageCircle, MessageSquare, ImageOff } from "lucide-react";
import { useState, type ReactNode } from "react";

import { StatusChip } from "@/components/primitives/StatusChip";
import {
  initials,
  relativeTime,
  toInternational,
  SOURCE_LABEL,
  type Enquiry,
} from "@/lib/enquiries";
import { cn } from "@/lib/utils";

export type ActionKind = "whatsapp" | "sms" | "email";

type Props = {
  enquiry: Enquiry;
  highlight: boolean;
  sending: ActionKind | null;
  onAction: (kind: ActionKind, href: string) => void;
};

function VehicleHeader({ enquiry }: { enquiry: Enquiry }) {
  const [failed, setFailed] = useState(false);
  const vehicle = enquiry.vehicle;
  const deleted = enquiry.vehicleDeleted;
  if (!vehicle && !deleted) return null;

  const url = vehicle?.thumbnailUrl ?? null;

  return (
    <div
      className="flex items-center gap-[10px]"
      style={{ paddingBottom: "11px", borderBottom: "1px solid var(--border)" }}
    >
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden bg-surface-2 text-muted"
        style={{ height: "44px", width: "44px", borderRadius: "var(--radius-thumb)" }}
      >
        {url && !failed ? (
          <img
            src={url}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
            className="photo-lands h-full w-full object-cover"
          />
        ) : (
          <ImageOff size={16} strokeWidth={2} aria-hidden />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn("break-words font-semibold", deleted && "text-muted")}
          style={{ fontSize: "15px", lineHeight: 1.1 }}
        >
          {vehicle ? vehicle.title : "Vehicle removed"}
        </p>
        {vehicle?.spec ? (
          <p className="mt-1 break-words opacity-80" style={{ fontSize: "12px", lineHeight: 1.1 }}>
            {vehicle.spec}
          </p>
        ) : null}
      </div>
      {deleted ? <StatusChip tone="offline">Vehicle removed</StatusChip> : null}
    </div>
  );
}

function ActionButton({
  label,
  icon,
  disabled,
  busy,
  onPress,
}: {
  label: string;
  icon: ReactNode;
  disabled?: boolean;
  busy?: boolean;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled || busy}
      onClick={onPress}
      className={cn(
        "press flex flex-1 select-none items-center justify-center gap-2",
        disabled ? "bg-surface-2 text-placeholder" : "bg-sheet text-text",
      )}
      style={{
        borderRadius: "var(--radius-button)",
        paddingBlock: "14px",
        minHeight: "44px",
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      {busy ? (
        <span className="spinner block" style={{ height: "14px", width: "14px" }} aria-hidden />
      ) : (
        icon
      )}
      <span>{busy ? "Opening…" : label}</span>
    </button>
  );
}

export function EnquiryCard({ enquiry, highlight, sending, onAction }: Props) {
  const [expanded, setExpanded] = useState(false);
  const message = enquiry.message ?? "";
  const long = message.length > 160;
  const phone = toInternational(enquiry.customerPhone);
  const replied = enquiry.status === "replied";

  const subject = enquiry.vehicle
    ? `Your enquiry about the ${enquiry.vehicle.title}`
    : "Your enquiry";

  return (
    <article
      className={cn(highlight ? "bg-done-bg text-done-fg" : "bg-surface text-text")}
      style={{
        borderRadius: "var(--radius-card)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "9px",
      }}
    >
      <VehicleHeader enquiry={enquiry} />

      <div className="flex items-center gap-[10px]">
        <span
          className="flex shrink-0 items-center justify-center bg-raised text-sheet"
          style={{
            height: "38px",
            width: "38px",
            borderRadius: "var(--radius-pill)",
            fontSize: "15px",
            fontWeight: 600,
            lineHeight: "38px",
          }}
          aria-hidden
        >
          {initials(enquiry.customerName)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-words" style={{ fontSize: "16px", lineHeight: 1.1, fontWeight: 700 }}>
            {enquiry.customerName}
          </p>
          <p className="mt-1 break-words opacity-80" style={{ fontSize: "13px", fontWeight: 400 }}>
            {[enquiry.customerPhone, relativeTime(enquiry.createdAt)].filter(Boolean).join(" · ")}
          </p>
        </div>
        {replied ? (
          <StatusChip tone="done">Replied</StatusChip>
        ) : (
          <span
            className="type-chip inline-flex shrink-0 items-center bg-primary text-sheet"
            style={{
              height: "var(--size-status-chip)",
              paddingInline: "var(--space-status-chip-x)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            NEW
          </span>
        )}
      </div>

      {!enquiry.vehicleId ? (
        <div>
          <StatusChip tone="offline">{SOURCE_LABEL[enquiry.source] ?? "General enquiry"}</StatusChip>
        </div>
      ) : null}

      {message ? (
        <div>
          <p
            className={cn(!expanded && "line-clamp-4")}
            style={{ fontSize: "15px", lineHeight: 1.4 }}
          >
            {message}
          </p>
          {long && !expanded ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="press-pill mt-1"
              style={{ fontSize: "13px", fontWeight: 500, minHeight: "44px" }}
            >
              More
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-stretch gap-2">
        <ActionButton
          label="WhatsApp"
          icon={<MessageCircle size={15} strokeWidth={2} aria-hidden />}
          disabled={!phone}
          busy={sending === "whatsapp"}
          onPress={() =>
            onAction("whatsapp", `whatsapp://send?phone=${phone}&text=${encodeURIComponent(subject)}`)
          }
        />
        <ActionButton
          label="SMS"
          icon={<MessageSquare size={15} strokeWidth={2} aria-hidden />}
          disabled={!enquiry.customerPhone}
          busy={sending === "sms"}
          onPress={() => onAction("sms", `tel:${enquiry.customerPhone ?? ""}`)}
        />
        <ActionButton
          label="Email"
          icon={<Mail size={15} strokeWidth={2} aria-hidden />}
          disabled={!enquiry.customerEmail}
          busy={sending === "email"}
          onPress={() =>
            onAction("email", `mailto:${enquiry.customerEmail}?subject=${encodeURIComponent(subject)}`)
          }
        />
      </div>
    </article>
  );
}
