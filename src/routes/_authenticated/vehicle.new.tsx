import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/primitives/Button";
import { createVehicle } from "@/lib/capture";

export const Route = createFileRoute("/_authenticated/vehicle/new")({
  head: () => ({
    meta: [
      { title: "Add a vehicle — AutoStudio Lanka" },
      { name: "description", content: "Add a vehicle to your AutoStudio Lanka stock." },
      { property: "og:title", content: "Add a vehicle — AutoStudio Lanka" },
      { property: "og:description", content: "Add a vehicle to your AutoStudio Lanka stock." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AddVehicleScreen,
});

/** Sri Lankan plates: letters, digits and a single dash, uppercase. */
function formatPlate(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, 12);
}

function AddVehicleScreen() {
  const router = useRouter();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [saving, setSaving] = useState(false);

  const valid = registration.trim().length >= 4 && make.trim() !== "" && model.trim() !== "";

  const submit = async () => {
    if (!valid) return;
    setSaving(true);
    try {
      const vehicle = await createVehicle({ registration, make, model });
      navigate({ to: "/capture/$vehicleId", params: { vehicleId: vehicle.id }, replace: true });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const fieldStyle = {
    borderRadius: "var(--radius-button)",
    padding: "13px 14px",
    minHeight: "var(--size-button)",
  } as const;

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      <header
        className="flex items-center gap-3"
        style={{ paddingTop: "calc(var(--safe-top) + 12px)", paddingInline: "20px", paddingBottom: "16px" }}
      >
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label="Back"
          className="press flex items-center justify-center bg-raised text-sheet"
          style={{
            height: "var(--size-icon-button)",
            width: "var(--size-icon-button)",
            borderRadius: "var(--radius-pill)",
          }}
        >
          <ChevronLeft size={20} strokeWidth={2} aria-hidden />
        </button>
        <h1 className="type-screen-title text-sheet">Add a vehicle</h1>
      </header>

      <section
        className="flex-1 bg-sheet text-text"
        style={{
          borderTopLeftRadius: "var(--radius-sheet)",
          borderTopRightRadius: "var(--radius-sheet)",
          padding: "24px 20px calc(var(--safe-bottom) + 24px)",
        }}
      >
        <label className="type-meta block text-muted" htmlFor="registration">
          Registration
        </label>
        <input
          id="registration"
          value={registration}
          onChange={(event) => setRegistration(formatPlate(event.target.value))}
          placeholder="CAB-1234"
          autoCapitalize="characters"
          className="type-card-title mt-2 w-full bg-surface-2 uppercase text-text outline-none placeholder:text-placeholder"
          style={fieldStyle}
        />

        <label className="type-meta mt-5 block text-muted" htmlFor="make">
          Make
        </label>
        <input
          id="make"
          value={make}
          onChange={(event) => setMake(event.target.value)}
          placeholder="Toyota"
          className="type-card-title mt-2 w-full bg-surface-2 text-text outline-none placeholder:text-placeholder"
          style={fieldStyle}
        />

        <label className="type-meta mt-5 block text-muted" htmlFor="model">
          Model
        </label>
        <input
          id="model"
          value={model}
          onChange={(event) => setModel(event.target.value)}
          placeholder="Corolla"
          className="type-card-title mt-2 w-full bg-surface-2 text-text outline-none placeholder:text-placeholder"
          style={fieldStyle}
        />

        <div className="mt-8">
          <Button
            shape="block"
            variant="primary"
            disabled={!valid || saving}
            onClick={submit}
            style={{ borderRadius: "var(--radius-pill)" }}
          >
            {saving ? "Creating…" : "Next: take photos"}
          </Button>
        </div>
      </section>
    </div>
  );
}
