import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { Camera, Check, ChevronLeft, Images, RotateCcw, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/primitives/Button";
import { compressImage, currentDealershipId, uploadSlotPhoto } from "@/lib/capture";
import { SLOT_ORDER } from "@/lib/vehicle";

export const Route = createFileRoute("/_authenticated/capture/$vehicleId")({
  head: () => ({
    meta: [
      { title: "Capture photos — AutoStudio Lanka" },
      { name: "description", content: "Shoot the eight vehicle angles and upload them in one go." },
      { property: "og:title", content: "Capture photos — AutoStudio Lanka" },
      { property: "og:description", content: "Shoot the eight vehicle angles and upload them in one go." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CaptureScreen,
});

type Shot = { blob: Blob; url: string; uploaded: boolean; failed: boolean };

function CaptureScreen() {
  const router = useRouter();
  const navigate = useNavigate();
  const { vehicleId } = Route.useParams();
  const [active, setActive] = useState(0);
  const [shots, setShots] = useState<Record<string, Shot>>({});
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);

  const dealership = useQuery({
    queryKey: ["dealership-id"],
    queryFn: currentDealershipId,
    staleTime: 300_000,
  });

  const slot = SLOT_ORDER[active]!;
  const taken = Object.keys(shots).length;
  const remaining = SLOT_ORDER.length - taken;
  const failed = Object.entries(shots).filter(([, shot]) => shot.failed);
  const pending = Object.entries(shots).filter(([, shot]) => !shot.uploaded);

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    try {
      const blob = await compressImage(file);
      setShots((prev) => {
        const previous = prev[slot.slotId];
        if (previous) URL.revokeObjectURL(previous.url);
        return {
          ...prev,
          [slot.slotId]: { blob, url: URL.createObjectURL(blob), uploaded: false, failed: false },
        };
      });
      setActive((index) => Math.min(index + 1, SLOT_ORDER.length - 1));
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const upload = async () => {
    const dealershipId = dealership.data;
    if (!dealershipId) {
      toast.error("Your account is not linked to a dealership.");
      return;
    }
    const queue = Object.entries(shots).filter(([, shot]) => !shot.uploaded);
    if (queue.length === 0) return;

    setUploading(true);
    setProgress(0);
    let done = 0;
    let failures = 0;

    for (const [slotId, shot] of queue) {
      try {
        await uploadSlotPhoto({ dealershipId, vehicleId, slotId, blob: shot.blob });
        setShots((prev) => ({ ...prev, [slotId]: { ...prev[slotId]!, uploaded: true, failed: false } }));
      } catch {
        failures += 1;
        setShots((prev) => ({ ...prev, [slotId]: { ...prev[slotId]!, failed: true } }));
      }
      done += 1;
      setProgress(Math.round((done / queue.length) * 100));
    }

    setUploading(false);
    if (failures > 0) {
      toast.error(`${failures} photo${failures === 1 ? "" : "s"} still to upload — tap retry.`);
      return;
    }
    toast.success("Photos uploaded");
    navigate({ to: "/vehicle/$vehicleId", params: { vehicleId }, replace: true });
  };

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
        <div className="min-w-0 flex-1">
          <h1 className="type-card-title text-sheet">Shooting: {slot.label}</h1>
          <p className="type-meta text-muted-ground">
            {taken} of {SLOT_ORDER.length} taken · {remaining} to go
          </p>
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
        <div
          className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-surface text-muted"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          {shots[slot.slotId] ? (
            <img
              src={shots[slot.slotId]!.url}
              alt={slot.label}
              className="photo-lands h-full w-full object-cover"
            />
          ) : (
            <span className="type-body">No photo for {slot.label} yet</span>
          )}
        </div>

        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(event) => {
            void onPick(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <input
          ref={libraryRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            void onPick(event.target.files?.[0]);
            event.target.value = "";
          }}
        />

        <div className="mt-4 flex gap-2">
          <Button
            shape="block"
            variant="primary"
            onClick={() => cameraRef.current?.click()}
            style={{ borderRadius: "var(--radius-pill)" }}
          >
            <Camera size={18} strokeWidth={2} aria-hidden />
            Take photo
          </Button>
          <Button
            shape="block"
            variant="secondary"
            onClick={() => libraryRef.current?.click()}
            style={{ borderRadius: "var(--radius-pill)" }}
          >
            <Images size={18} strokeWidth={2} aria-hidden />
            Camera roll
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setActive((index) => Math.min(index + 1, SLOT_ORDER.length - 1))}
          className="press type-body mt-3 self-center text-muted"
          style={{ padding: "11px 16px" }}
        >
          Skip this angle
        </button>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {SLOT_ORDER.map((entry, index) => {
            const shot = shots[entry.slotId];
            const isActive = index === active;
            return (
              <button
                key={entry.slotId}
                type="button"
                onClick={() => setActive(index)}
                className="press flex flex-col items-center gap-1"
                style={{ padding: "6px 0" }}
              >
                <span
                  className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-surface-2 text-muted"
                  style={{
                    borderRadius: "var(--radius-thumb)",
                    outline: isActive ? "2px solid var(--primary)" : "none",
                    outlineOffset: "2px",
                  }}
                >
                  {shot ? (
                    <img src={shot.url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="type-micro">{index + 1}</span>
                  )}
                  {shot?.uploaded ? (
                    <span
                      className="absolute bottom-1 right-1 flex items-center justify-center bg-done-bg text-done-fg"
                      style={{ height: "16px", width: "16px", borderRadius: "var(--radius-pill)" }}
                    >
                      <Check size={10} strokeWidth={3} aria-hidden />
                    </span>
                  ) : shot?.failed ? (
                    <span
                      className="absolute bottom-1 right-1 flex items-center justify-center bg-failed-bg text-failed-fg"
                      style={{ height: "16px", width: "16px", borderRadius: "var(--radius-pill)" }}
                    >
                      <X size={10} strokeWidth={3} aria-hidden />
                    </span>
                  ) : null}
                </span>
                <span className="type-micro text-muted">{entry.label}</span>
              </button>
            );
          })}
        </div>

        {failed.length > 0 && !uploading ? (
          <div
            className="mt-4 bg-failed-bg text-failed-fg"
            style={{ borderRadius: "var(--radius-button)", padding: "12px 14px" }}
          >
            <p className="type-meta">
              Still to upload:{" "}
              {failed
                .map(([slotId]) => SLOT_ORDER.find((entry) => entry.slotId === slotId)?.label)
                .filter(Boolean)
                .join(", ")}
            </p>
            <button
              type="button"
              onClick={() => void upload()}
              className="press type-card-title mt-2 inline-flex items-center gap-2"
              style={{ padding: "11px 0" }}
            >
              <RotateCcw size={16} strokeWidth={2} aria-hidden />
              Retry
            </button>
          </div>
        ) : null}

        {uploading ? (
          <div className="mt-4">
            <div
              className="h-1.5 overflow-hidden bg-surface-2"
              style={{ borderRadius: "var(--radius-pill)" }}
            >
              <div
                className="h-full bg-primary"
                style={{ width: `${progress}%`, borderRadius: "var(--radius-pill)" }}
              />
            </div>
            <p className="type-meta mt-2 text-muted">Uploading… {progress}%</p>
          </div>
        ) : null}

        <div className="mt-6">
          <Button
            shape="block"
            variant="primary"
            disabled={uploading || pending.length === 0}
            onClick={() => void upload()}
            style={{ borderRadius: "var(--radius-pill)" }}
          >
            {uploading
              ? "Uploading…"
              : `Upload ${pending.length} photo${pending.length === 1 ? "" : "s"}`}
          </Button>
        </div>
      </section>
    </div>
  );
}
