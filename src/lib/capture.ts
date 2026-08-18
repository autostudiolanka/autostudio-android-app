import { supabase } from "@/integrations/supabase/client";

export const MAX_EDGE = 1920;
export const JPEG_QUALITY = 0.8;

function kb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/** Phone cameras produce 10–12MB files; the upload path rejects >10MB. */
export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare the photo on this device.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
  );
  if (!blob) throw new Error("Could not compress the photo.");

  console.log(
    `[capture] ${file.name}: original ${kb(file.size)} → compressed ${kb(blob.size)} (${width}×${height})`,
  );
  return blob;
}

export async function currentDealershipId(): Promise<string | null> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return null;
  const { data, error } = await supabase
    .from("dealership_users")
    .select("dealership_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.dealership_id ?? null;
}

export async function createVehicle(input: {
  registration: string;
  make: string;
  model: string;
}): Promise<{ id: string; dealershipId: string }> {
  const dealershipId = await currentDealershipId();
  if (!dealershipId) throw new Error("Your account is not linked to a dealership.");
  const { data: auth } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("car_jobs")
    .insert({
      dealership_id: dealershipId,
      user_id: auth.user?.id ?? null,
      registration: input.registration.trim().toUpperCase(),
      status: "incomplete",
      slots: [],
      vehicle_details: { make: input.make.trim(), model: input.model.trim() },
    })
    .select("id")
    .single();
  if (error) throw error;
  return { id: data.id, dealershipId };
}

type SlotEntry = {
  slotId: string;
  previewUrl: string;
  processingState: string;
  capturedAt: string;
};

/** Merges one slot into the existing array so earlier shots survive. */
export async function mergeSlot(vehicleId: string, entry: SlotEntry): Promise<void> {
  const { data, error } = await supabase
    .from("car_jobs")
    .select("slots")
    .eq("id", vehicleId)
    .single();
  if (error) throw error;

  const existing = Array.isArray(data.slots) ? (data.slots as unknown[]) : [];
  const next = [
    ...existing.filter(
      (slot) => !(slot && typeof slot === "object" && (slot as SlotEntry).slotId === entry.slotId),
    ),
    entry,
  ];

  const { error: updateError } = await supabase
    .from("car_jobs")
    .update({ slots: next as never })
    .eq("id", vehicleId);
  if (updateError) throw updateError;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Uploads one compressed photo, retrying with backoff before giving up. */
export async function uploadSlotPhoto(args: {
  dealershipId: string;
  vehicleId: string;
  slotId: string;
  blob: Blob;
  attempts?: number;
}): Promise<string> {
  const attempts = args.attempts ?? 3;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const path = `${args.dealershipId}/${args.vehicleId}/${args.slotId}-${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from("vehicle-photos")
        .upload(path, args.blob, { contentType: "image/jpeg", upsert: true });
      if (error) throw error;

      const { data } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
      await mergeSlot(args.vehicleId, {
        slotId: args.slotId,
        previewUrl: data.publicUrl,
        processingState: "pending",
        capturedAt: new Date().toISOString(),
      });
      return data.publicUrl;
    } catch (error) {
      lastError = error;
      console.warn(`[capture] upload attempt ${attempt} failed for ${args.slotId}`, error);
      if (attempt < attempts) await sleep(600 * 2 ** (attempt - 1));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Upload failed");
}
