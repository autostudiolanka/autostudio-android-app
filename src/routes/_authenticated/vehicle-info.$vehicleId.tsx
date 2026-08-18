import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/primitives/Button";
import { fetchVehicleForm, normaliseDetails, saveVehicleDetails } from "@/lib/vehicle";

export const Route = createFileRoute("/_authenticated/vehicle-info/$vehicleId")({
  head: () => ({
    meta: [
      { title: "Vehicle info — AutoStudio Lanka" },
      { name: "description", content: "Complete the details buyers see for this vehicle." },
      { property: "og:title", content: "Vehicle info — AutoStudio Lanka" },
      { property: "og:description", content: "Complete the details buyers see for this vehicle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VehicleInfoScreen,
});

type FieldKey =
  | "make"
  | "model"
  | "year"
  | "mileage"
  | "color"
  | "fuel_type"
  | "transmission"
  | "body_type"
  | "trim_level"
  | "engine_capacity"
  | "fuel_economy"
  | "owners";

const BASICS: { key: FieldKey; label: string; numeric?: boolean }[] = [
  { key: "make", label: "Make" },
  { key: "model", label: "Model" },
  { key: "year", label: "Year", numeric: true },
  { key: "mileage", label: "Mileage (km)", numeric: true },
  { key: "color", label: "Colour" },
  { key: "fuel_type", label: "Fuel type" },
  { key: "transmission", label: "Transmission" },
  { key: "body_type", label: "Body type" },
  { key: "trim_level", label: "Trim level" },
  { key: "engine_capacity", label: "Engine capacity" },
  { key: "fuel_economy", label: "Fuel economy", numeric: true },
  { key: "owners", label: "Owners", numeric: true },
];

type FormState = Record<FieldKey, string> & {
  price: string;
  poa: boolean;
  features: string[];
  service_history: string;
  description: string;
};

const TOTAL_FIELDS = BASICS.length + 4; // + price, features, service history, description

function digits(value: string): string {
  return value.replace(/[^\d]/g, "");
}

function grouped(value: string): string {
  const raw = digits(value);
  return raw ? Number(raw).toLocaleString("en-GB") : "";
}

function str(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function buildState(details: Record<string, unknown>): FormState {
  const info = normaliseDetails(details);
  const features = Array.isArray(details.features)
    ? (details.features as unknown[]).map((f) => str(f)).filter(Boolean)
    : [];
  return {
    make: info.make ?? "",
    model: info.model ?? "",
    year: info.year ?? "",
    mileage: info.mileage ?? "",
    color: info.color ?? "",
    fuel_type: info.fuel_type ?? "",
    transmission: info.transmission ?? "",
    body_type: info.body_type ?? "",
    trim_level: str(details.trim_level) || info.variant || "",
    engine_capacity: info.engine_capacity ?? "",
    fuel_economy: str(details.fuel_economy),
    owners: str(details.owners),
    price: grouped(str(details.price)),
    poa: details.price_on_application === true || details.poa === true,
    features,
    service_history: str(details.service_history),
    description: str(details.description) || info.description || "",
  };
}

function filledCount(form: FormState): number {
  let n = BASICS.filter((f) => form[f.key].trim() !== "").length;
  if (form.price.trim() !== "" || form.poa) n += 1;
  if (form.features.length > 0) n += 1;
  if (form.service_history.trim() !== "") n += 1;
  if (form.description.trim() !== "") n += 1;
  return n;
}

function VehicleInfoScreen() {
  const router = useRouter();
  const { vehicleId } = Route.useParams();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [featureDraft, setFeatureDraft] = useState("");

  const query = useQuery({
    queryKey: ["vehicle-form", vehicleId],
    queryFn: () => fetchVehicleForm(vehicleId),
  });

  useEffect(() => {
    if (query.data && !form) setForm(buildState(query.data.details));
  }, [query.data, form]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const model = query.data ? buildState(query.data.details).model : "";
  const subtitle = [model, query.data?.registration].filter(Boolean).join(" · ");
  const filled = useMemo(() => (form ? filledCount(form) : 0), [form]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setDirty(true);
  };

  const leave = () => {
    if (dirty && !window.confirm("You have unsaved changes. Leave without saving?")) return;
    router.history.back();
  };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const patch: Record<string, unknown> = {};
      for (const field of BASICS) patch[field.key] = form[field.key].trim();
      patch.price = digits(form.price);
      patch.price_on_application = form.poa;
      patch.features = form.features;
      patch.service_history = form.service_history.trim();
      patch.description = form.description.trim();
      await saveVehicleDetails(vehicleId, patch);
      setDirty(false);
      toast.success("Vehicle info saved");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    const value = featureDraft.trim();
    if (!value || !form) return;
    if (!form.features.includes(value)) set("features", [...form.features, value]);
    setFeatureDraft("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      <header
        className="bg-ground"
        style={{
          paddingTop: "calc(var(--safe-top) + 20px)",
          paddingInline: "20px",
          paddingBottom: "16px",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Back"
            onClick={leave}
            className="press flex shrink-0 items-center justify-center bg-raised text-sheet"
            style={{
              height: "var(--size-icon-button)",
              width: "var(--size-icon-button)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            <ChevronLeft size={22} strokeWidth={2} aria-hidden />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="type-card-title truncate text-sheet">Vehicle info</h1>
            {subtitle ? <p className="type-meta truncate text-muted-ground">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={save}
            disabled={saving || !form}
            className="press type-card-title shrink-0 text-primary-on-ground disabled:opacity-50"
            style={{ padding: "11px 8px" }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div
            className="h-1.5 flex-1 overflow-hidden bg-raised-2"
            style={{ borderRadius: "var(--radius-pill)" }}
          >
            <div
              className="h-full bg-primary-on-ground"
              style={{
                width: `${(filled / TOTAL_FIELDS) * 100}%`,
                borderRadius: "var(--radius-pill)",
              }}
            />
          </div>
          <span className="type-meta shrink-0 text-muted-ground">
            {filled} of {TOTAL_FIELDS}
          </span>
        </div>
      </header>

      <section
        className="flex flex-1 flex-col bg-sheet text-text"
        style={{
          borderTopLeftRadius: "var(--radius-sheet)",
          borderTopRightRadius: "var(--radius-sheet)",
          padding: "20px 16px calc(var(--safe-bottom) + 24px)",
        }}
      >
        {!form ? (
          <p className="type-body text-muted">
            {query.isError ? (query.error as Error).message : "Loading vehicle…"}
          </p>
        ) : step === 1 ? (
          <>
            <h2 className="type-eyebrow text-muted">THE BASICS</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {BASICS.map((field) => (
                <label
                  key={field.key}
                  className="flex flex-col gap-1 bg-surface"
                  style={{ borderRadius: "var(--radius-button)", padding: "10px 12px" }}
                >
                  <span className="type-eyebrow text-muted">{field.label}</span>
                  <input
                    value={form[field.key]}
                    onChange={(event) => set(field.key, event.target.value)}
                    placeholder="Not set"
                    inputMode={field.numeric ? "numeric" : "text"}
                    className="type-card-title w-full bg-transparent text-text outline-none placeholder:text-placeholder"
                    style={{ minHeight: "24px" }}
                  />
                </label>
              ))}
            </div>

            <div className="mt-6">
              <Button
                shape="block"
                variant="primary"
                onClick={() => setStep(2)}
                style={{ borderRadius: "var(--radius-pill)" }}
              >
                Next: price and extras
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="type-eyebrow text-muted">PRICE</h2>
            <div
              className="mt-3 flex items-center gap-3 border border-border-strong bg-sheet"
              style={{ borderRadius: "var(--radius-button)", padding: "14px 16px" }}
            >
              <span className="type-section-title text-muted">Rs</span>
              <input
                value={form.price}
                onChange={(event) => set("price", grouped(event.target.value))}
                placeholder="Not set"
                inputMode="numeric"
                aria-label="Asking price"
                className="type-metric w-full bg-transparent text-text outline-none placeholder:text-placeholder"
                style={{ fontSize: "27px", lineHeight: 1.1 }}
              />
            </div>

            <button
              type="button"
              onClick={() => set("poa", !form.poa)}
              role="switch"
              aria-checked={form.poa}
              className="press mt-3 flex w-full items-center gap-3 bg-surface text-left"
              style={{ borderRadius: "var(--radius-button)", padding: "12px 14px" }}
            >
              <span className="min-w-0 flex-1">
                <span className="type-card-title block text-text">Price on application</span>
                <span className="type-meta block text-muted">Hides the figure, shows POA</span>
              </span>
              <span
                className="relative block shrink-0"
                style={{
                  width: "48px",
                  height: "28px",
                  borderRadius: "var(--radius-pill)",
                  background: form.poa ? "var(--primary)" : "var(--border-strong)",
                }}
              >
                <span
                  className="absolute top-1 block bg-sheet"
                  style={{
                    height: "20px",
                    width: "20px",
                    borderRadius: "var(--radius-pill)",
                    left: form.poa ? "24px" : "4px",
                    transition: "left 150ms ease",
                  }}
                />
              </span>
            </button>

            <h2 className="type-eyebrow mt-6 text-muted">FEATURES / EXTRAS</h2>
            {form.features.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.features.map((feature) => (
                  <span
                    key={feature}
                    className="type-chip inline-flex items-center gap-2 bg-accent-soft text-text"
                    style={{ borderRadius: "var(--radius-pill)", padding: "7px 10px" }}
                  >
                    {feature}
                    <button
                      type="button"
                      aria-label={`Remove ${feature}`}
                      onClick={() =>
                        set(
                          "features",
                          form.features.filter((f) => f !== feature),
                        )
                      }
                      className="press flex items-center justify-center"
                      style={{ margin: "-11px -10px -11px 0", padding: "11px 10px" }}
                    >
                      <X size={14} strokeWidth={2.5} aria-hidden />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
            <input
              value={featureDraft}
              onChange={(event) => setFeatureDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addFeature();
                }
              }}
              onBlur={addFeature}
              placeholder="Type a feature and press enter"
              aria-label="Add a feature"
              className="type-body mt-3 w-full bg-surface-2 text-text outline-none placeholder:text-placeholder"
              style={{
                borderRadius: "var(--radius-button)",
                padding: "13px 14px",
                minHeight: "var(--size-button)",
              }}
            />

            <h2 className="type-eyebrow mt-6 text-muted">STILL TO FILL</h2>
            <div className="mt-3 flex flex-col gap-2">
              <label
                className="flex flex-col gap-1 border border-dashed border-border-strong"
                style={{ borderRadius: "var(--radius-button)", padding: "12px 14px" }}
              >
                <span className="type-eyebrow text-muted">Service history</span>
                <input
                  value={form.service_history}
                  onChange={(event) => set("service_history", event.target.value)}
                  placeholder="Tap to add"
                  className="type-body w-full bg-transparent text-text outline-none placeholder:text-placeholder"
                  style={{ minHeight: "22px" }}
                />
              </label>
              <label
                className="flex flex-col gap-1 border border-dashed border-border-strong"
                style={{ borderRadius: "var(--radius-button)", padding: "12px 14px" }}
              >
                <span className="type-eyebrow text-muted">Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => set("description", event.target.value)}
                  placeholder="A short line buyers read first"
                  rows={3}
                  className="type-body w-full resize-none bg-transparent text-text outline-none placeholder:text-placeholder"
                />
              </label>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setStep(1)}
                style={{ borderRadius: "var(--radius-pill)" }}
              >
                Back
              </Button>
              <Button
                shape="block"
                variant="primary"
                disabled={saving}
                onClick={save}
                style={{ borderRadius: "var(--radius-pill)" }}
              >
                {saving ? "Saving…" : "Save and continue"}
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
