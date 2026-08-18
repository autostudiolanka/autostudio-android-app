import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EnquiryCard, type ActionKind } from "@/components/enquiries/EnquiryCard";
import { OfflineBanner } from "@/components/inventory/OfflineBanner";
import { FilterPill } from "@/components/primitives/FilterPill";
import { AppHeader } from "@/components/shell/AppHeader";
import { useOnline } from "@/hooks/use-online";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { fetchEnquiries, markReplied, type Enquiry } from "@/lib/enquiries";

export const Route = createFileRoute("/_authenticated/_tabs/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries — AutoStudio Lanka" },
      { name: "description", content: "Customer enquiries for AutoStudio Lanka dealer staff." },
      { property: "og:title", content: "Enquiries — AutoStudio Lanka" },
      {
        property: "og:description",
        content: "Customer enquiries for AutoStudio Lanka dealer staff.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EnquiriesScreen,
});

type FilterKey = "all" | "new" | "replied";

const FILTERS: Record<FilterKey, { label: string; match: (e: Enquiry) => boolean }> = {
  all: { label: "All", match: () => true },
  new: { label: "New", match: (e) => e.status !== "replied" },
  replied: { label: "Replied", match: (e) => e.status === "replied" },
};

const QUERY_KEY = ["enquiries"];

function EnquiriesScreen() {
  const online = useOnline();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sending, setSending] = useState<{ id: string; kind: ActionKind } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchEnquiries,
    staleTime: 30_000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    enabled: online,
  });

  const pull = usePullToRefresh(async () => {
    if (online) await query.refetch();
  });

  const enquiries = query.data ?? [];

  const reply = useMutation({
    mutationFn: ({ id, kind }: { id: string; kind: ActionKind }) =>
      markReplied(id, kind === "whatsapp"),
    onMutate: async ({ id, kind }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previous = queryClient.getQueryData<Enquiry[]>(QUERY_KEY);
      queryClient.setQueryData<Enquiry[]>(QUERY_KEY, (old) =>
        (old ?? []).map((e) =>
          e.id === id
            ? {
                ...e,
                status: "replied",
                respondedAt: new Date().toISOString(),
                whatsappSent: kind === "whatsapp" ? true : e.whatsappSent,
              }
            : e,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEY, context.previous);
      setError("Could not save that as replied. Try again.");
    },
    onSuccess: () => setError(null),
  });

  const newestUnrepliedId = useMemo(() => {
    // Data is already newest-first.
    return enquiries.find((e) => e.status !== "replied")?.id ?? null;
  }, [enquiries]);

  const visible = useMemo(
    () => enquiries.filter((e) => FILTERS[filter].match(e)),
    [enquiries, filter],
  );

  const newCount = enquiries.filter((e) => e.status !== "replied").length;

  function handleAction(enquiry: Enquiry, kind: ActionKind, href: string) {
    setSending({ id: enquiry.id, kind });
    if (enquiry.status !== "replied") reply.mutate({ id: enquiry.id, kind });
    // Same-tab navigation to the app scheme: Android back returns here.
    window.location.href = href;
    window.setTimeout(() => setSending(null), 1200);
  }

  return (
    <>
      <AppHeader
        eyebrow={newCount > 0 ? `${newCount} awaiting a reply` : "Forecourt"}
        title="Enquiries"
      />

      <section
        className="flex-1 bg-sheet text-text"
        style={{
          borderTopLeftRadius: "var(--radius-sheet)",
          borderTopRightRadius: "var(--radius-sheet)",
          padding: "8px 16px 24px",
          transform: `translateY(${pull.distance}px)`,
          transition: pull.distance === 0 ? "transform 200ms ease-out" : "none",
        }}
      >
        <div className="flex h-6 items-center justify-center" aria-live="polite">
          {pull.refreshing ? (
            <span
              className="spinner block text-muted"
              style={{ height: "16px", width: "16px" }}
              aria-label="Refreshing"
            />
          ) : pull.distance > 0 ? (
            <span className="type-micro text-muted">
              {pull.distance >= pull.threshold ? "Release to refresh" : "Pull to refresh"}
            </span>
          ) : null}
        </div>

        <div className="mt-1 flex items-center gap-2">
          {(Object.keys(FILTERS) as FilterKey[]).map((key) => (
            <FilterPill key={key} selected={filter === key} onClick={() => setFilter(key)}>
              {FILTERS[key].label}
            </FilterPill>
          ))}
        </div>

        {!online ? (
          <div className="mt-2">
            <OfflineBanner />
          </div>
        ) : null}

        {error ? (
          <p className="type-meta text-destructive mt-2" role="status">
            {error}
          </p>
        ) : null}

        <div className="mt-3 flex flex-col gap-3">
          {query.isPending && online ? (
            <p className="type-body text-muted">Loading enquiries…</p>
          ) : query.isError && enquiries.length === 0 ? (
            <p className="type-body text-muted">{(query.error as Error).message}</p>
          ) : enquiries.length === 0 ? (
            <div className="py-8">
              <h2 className="type-section-title text-text">No enquiries yet</h2>
              <p className="type-body text-muted mt-2">
                Messages from your website will land here.
              </p>
            </div>
          ) : visible.length === 0 ? (
            <p className="type-body text-muted py-6">Nothing matches this filter.</p>
          ) : (
            visible.map((enquiry) => (
              <EnquiryCard
                key={enquiry.id}
                enquiry={enquiry}
                highlight={enquiry.id === newestUnrepliedId}
                sending={sending?.id === enquiry.id ? sending.kind : null}
                onAction={(kind, href) => handleAction(enquiry, kind, href)}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
}
