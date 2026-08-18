import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/primitives/Button";
import { FilterPill } from "@/components/primitives/FilterPill";
import { MetadataChip } from "@/components/primitives/MetadataChip";
import { StatusChip } from "@/components/primitives/StatusChip";

export const Route = createFileRoute("/design")({
  head: () => ({
    meta: [
      { title: "Design System — Stock & Enquiries App" },
      {
        name: "description",
        content:
          "Token reference and interactive primitives: buttons, status chips, metadata chips and filter pills at 390px.",
      },
      { property: "og:title", content: "Design System — Stock & Enquiries App" },
      {
        property: "og:description",
        content: "Token reference and interactive primitives for the mobile app.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DesignSystemDemo,
});

const COLOR_TOKENS = [
  "--ground",
  "--raised",
  "--raised-2",
  "--sheet",
  "--surface",
  "--surface-2",
  "--border",
  "--border-strong",
  "--text",
  "--text-2",
  "--muted",
  "--muted-dark",
  "--muted-ground",
  "--placeholder",
  "--primary",
  "--primary-on-ground",
  "--accent-soft",
  "--destructive",
  "--done-bg",
  "--done-fg",
  "--processing-bg",
  "--processing-fg",
  "--failed-bg",
  "--failed-fg",
  "--offline-bg",
  "--offline-fg",
  "--unread-dot",
  "--tab-badge",
  "--insights",
];

const TYPE_ROWS = [
  ["type-display", "Display 34/1.08/700"],
  ["type-metric", "Metric 40"],
  ["type-screen-title", "Screen title 27"],
  ["type-section-title", "Section title 19"],
  ["type-card-title", "Card title 16"],
  ["type-body", "Body 15 — the quick brown fox jumps over the lazy dog."],
  ["type-meta", "Meta 13 — supporting detail"],
  ["type-chip", "CHIP 12"],
  ["type-eyebrow", "EYEBROW 11"],
  ["type-micro", "MICRO 10"],
] as const;

const RADII = [
  ["--radius-pill", "Pills 999"],
  ["--radius-card", "Cards 22"],
  ["--radius-row", "Rows 20"],
  ["--radius-tab", "Tab pill 18"],
  ["--radius-button", "Buttons 14"],
  ["--radius-thumb", "Thumbnails 12"],
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="type-eyebrow uppercase tracking-wide text-muted">{title}</h2>
      {children}
    </section>
  );
}

function DesignSystemDemo() {
  const [sheetFilter, setSheetFilter] = useState("All");
  const [groundFilter, setGroundFilter] = useState("All");
  const [photoKey, setPhotoKey] = useState(0);

  return (
    <main
      className="mx-auto flex w-full flex-col gap-8 bg-sheet text-text"
      style={{
        maxWidth: "390px",
        minHeight: "100dvh",
        paddingTop: "calc(var(--safe-top) + 24px)",
        paddingBottom: "calc(var(--safe-bottom) + 40px)",
        paddingInline: "16px",
      }}
    >
      <header className="flex flex-col gap-1">
        <p className="type-eyebrow uppercase tracking-wide text-muted">Reference</p>
        <h1 className="type-screen-title">Design system</h1>
        <p className="type-meta text-muted">Every primitive, every state, at 390px.</p>
      </header>

      <Section title="Colour tokens">
        <ul className="grid grid-cols-3 gap-2">
          {COLOR_TOKENS.map((token) => (
            <li key={token} className="flex flex-col gap-1">
              <span
                className="block w-full"
                style={{
                  height: "40px",
                  background: `var(${token})`,
                  borderRadius: "var(--radius-thumb)",
                  border: "1px solid var(--border)",
                }}
              />
              <span className="type-micro text-muted">{token}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Type scale">
        <div className="flex flex-col gap-3">
          {TYPE_ROWS.map(([cls, label]) => (
            <p key={cls} className={cls}>
              {label}
            </p>
          ))}
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-col gap-3">
          <Button variant="primary" shape="block">
            Primary
          </Button>
          <Button variant="secondary" shape="block">
            Secondary
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="primary">Inline</Button>
            <Button variant="secondary">Inline</Button>
            <Button variant="icon" shape="round" aria-label="Round icon button">
              ★
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Buttons on ground">
        <div
          className="flex flex-wrap items-center gap-3 bg-ground"
          style={{ padding: "16px", borderRadius: "var(--radius-card)" }}
        >
          <Button variant="primary-on-ground">Primary</Button>
          <Button variant="secondary-on-ground">Secondary</Button>
          <Button variant="icon-on-ground" shape="round" aria-label="Round icon button on ground">
            ★
          </Button>
        </div>
      </Section>

      <Section title="Status chips (static)">
        <div className="flex flex-wrap gap-2">
          <StatusChip tone="done">Done</StatusChip>
          <StatusChip tone="processing">Processing</StatusChip>
          <StatusChip tone="failed">Failed</StatusChip>
          <StatusChip tone="offline">Offline</StatusChip>
        </div>
      </Section>

      <Section title="Metadata chips">
        <div className="flex flex-wrap gap-2">
          <MetadataChip>2019</MetadataChip>
          <MetadataChip>48,300 mi</MetadataChip>
          <MetadataChip>Diesel</MetadataChip>
          <MetadataChip>Automatic</MetadataChip>
        </div>
      </Section>

      <Section title="Filter pills on sheet">
        <div className="flex flex-wrap gap-2">
          {["All", "Live", "Draft", "Sold"].map((label) => (
            <FilterPill
              key={label}
              selected={sheetFilter === label}
              onClick={() => setSheetFilter(label)}
            >
              {label}
            </FilterPill>
          ))}
        </div>
      </Section>

      <Section title="Filter pills on ground">
        <div
          className="flex flex-wrap gap-2 bg-ground"
          style={{ padding: "12px", borderRadius: "var(--radius-card)" }}
        >
          {["All", "Unread", "Replied"].map((label) => (
            <FilterPill
              key={label}
              surface="ground"
              selected={groundFilter === label}
              onClick={() => setGroundFilter(label)}
            >
              {label}
            </FilterPill>
          ))}
        </div>
      </Section>

      <Section title="Radii">
        <ul className="grid grid-cols-3 gap-2">
          {RADII.map(([token, label]) => (
            <li key={token} className="flex flex-col gap-1">
              <span
                className="block w-full bg-surface-2"
                style={{ height: "48px", borderRadius: `var(${token})` }}
              />
              <span className="type-micro text-muted">{label}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Elevation">
        <div className="flex flex-col gap-4" style={{ paddingBottom: "8px" }}>
          <div
            className="type-meta bg-sheet text-text-2"
            style={{
              padding: "16px",
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--shadow-sheet)",
            }}
          >
            Sheet elevation
          </div>
          <div
            className="type-meta bg-sheet text-text-2"
            style={{
              padding: "16px",
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--shadow-bottom-bar)",
            }}
          >
            Bottom bar elevation
          </div>
          <div
            className="bg-ground"
            style={{ padding: "16px", borderRadius: "var(--radius-card)" }}
          >
            <span
              className="type-chip inline-flex items-center justify-center bg-raised-2 text-primary-on-ground"
              style={{
                height: "var(--size-icon-button)",
                width: "var(--size-icon-button)",
                borderRadius: "var(--radius-pill)",
                boxShadow: "var(--shadow-icon)",
              }}
            >
              ★
            </span>
          </div>
        </div>
      </Section>

      <Section title="Motion">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="processing-pulse processing-pulse-stagger block bg-processing-bg"
                style={
                  {
                    "--pulse-index": i,
                    height: "32px",
                    width: "56px",
                    borderRadius: "var(--radius-thumb)",
                  } as React.CSSProperties
                }
              />
            ))}
            <span className="type-micro text-muted">Processing pulse</span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="spinner block text-text-2"
              style={{ height: "20px", width: "20px" }}
            />
            <span className="type-micro text-muted">Spinner</span>
          </div>

          <div className="flex items-center gap-3">
            <span
              key={photoKey}
              className="photo-lands block bg-accent-soft"
              style={{ height: "64px", width: "64px", borderRadius: "var(--radius-thumb)" }}
            />
            <Button variant="secondary" onClick={() => setPhotoKey((k) => k + 1)}>
              Replay photo lands
            </Button>
          </div>

          <p className="type-micro text-muted">
            Press any button or pill for press feedback. Reduced motion is respected.
          </p>
        </div>
      </Section>
    </main>
  );
}
