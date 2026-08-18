import { supabase } from "@/integrations/supabase/client";

export const SLOT_ORDER = [
  { slotId: "ext_front", label: "Front" },
  { slotId: "ext_driver_front_quarter", label: "Drv ¾" },
  { slotId: "ext_driver_side", label: "Drv side" },
  { slotId: "ext_driver_rear_quarter", label: "Drv rear ¾" },
  { slotId: "ext_rear", label: "Rear" },
  { slotId: "ext_passenger_rear_quarter", label: "Pass rear ¾" },
  { slotId: "ext_passenger_side", label: "Pass side" },
  { slotId: "ext_passenger_front_quarter", label: "Pass ¾" },
] as const;

export type SlotState = "done" | "processing" | "error" | "empty";

export type VehicleSlot = {
  slotId: string;
  label: string;
  url: string | null;
  state: SlotState;
};

export type VehicleInfo = {
  make: string | null;
  model: string | null;
  variant: string | null;
  year: string | null;
  mileage: string | null;
  fuel_type: string | null;
  transmission: string | null;
  color: string | null;
  engine_capacity: string | null;
  body_type: string | null;
  description: string | null;
};

export type VehicleDetail = {
  id: string;
  registration: string | null;
  status: string;
  createdAt: string;
  soldAt: string | null;
  info: VehicleInfo;
  slots: VehicleSlot[];
  photosDone: number;
  photosWorking: number;
  isPublished: boolean;
  publishedAt: string | null;
  imagingStatus: string | null;
};

function text(value: unknown): string | null {
  if (typeof value === "string") return value.trim() === "" ? null : value.trim();
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object" && "CurrentTextValue" in (value as Record<string, unknown>)) {
    return text((value as { CurrentTextValue?: unknown }).CurrentTextValue);
  }
  return null;
}

/** Prefers the modern key, falls back to the legacy capitalised one. */
export function normaliseDetails(raw: unknown): VehicleInfo {
  const d = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const pick = (...keys: string[]): string | null => {
    for (const key of keys) {
      const value = text(d[key]);
      if (value) return value;
    }
    return null;
  };

  return {
    make: pick("make", "CarMake", "MakeDescription"),
    model: pick("model", "CarModel", "ModelDescription"),
    variant: pick("variant", "trim_level"),
    year: pick("year", "RegistrationYear"),
    mileage: pick("mileage"),
    fuel_type: pick("fuel_type", "FuelType"),
    transmission: pick("transmission", "Transmission"),
    color: pick("color", "Colour", "ColourCurrent"),
    engine_capacity: pick("engine_capacity", "EngineSize"),
    body_type: pick("body_type", "VehicleClass"),
    description: pick("description", "Description"),
  };
}

export function vehicleName(info: VehicleInfo): string {
  const parts = [info.make, info.model, info.variant].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "Untitled vehicle";
}

export function vehicleMetaLine(info: VehicleInfo): string {
  const mileage = info.mileage
    ? `${Number(info.mileage.replace(/[^\d]/g, "") || 0).toLocaleString("en-GB")} km`
    : null;
  const engine = info.engine_capacity
    ? /cc/i.test(info.engine_capacity)
      ? info.engine_capacity
      : `${info.engine_capacity} cc`
    : null;
  return [info.year, mileage, info.fuel_type, info.transmission, info.color, engine]
    .filter(Boolean)
    .join(" · ");
}

type RawSlot = {
  slotId?: string;
  previewUrl?: string | null;
  processedUrl?: string | null;
  processingState?: string | null;
  errorMessage?: string | null;
};

type RawPair = {
  slotId?: string | null;
  originalUrl?: string | null;
  processedUrl?: string | null;
  showProcessed?: boolean | null;
  processing?: boolean | null;
};

function pairUrl(pair: RawPair): string | null {
  const url = (pair.showProcessed && pair.processedUrl) || pair.processedUrl || pair.originalUrl;
  return url && url.length > 0 ? url : null;
}

function buildSlots(
  value: unknown,
  pairsValue: unknown,
  manualUrls: string[] | null,
): VehicleSlot[] {
  const raw: RawSlot[] = Array.isArray(value) ? (value as RawSlot[]) : [];
  const bySlot = new Map(raw.filter((s) => s.slotId).map((s) => [s.slotId as string, s]));

  // Photos published from the web app live on published_vehicles, not car_jobs.slots.
  const pairs: RawPair[] = Array.isArray(pairsValue) ? (pairsValue as RawPair[]) : [];
  const pairBySlot = new Map<string, RawPair>();
  const loosePairUrls: string[] = [];
  for (const pair of pairs) {
    const url = pairUrl(pair);
    if (!url) continue;
    if (pair.slotId && !pairBySlot.has(pair.slotId)) pairBySlot.set(pair.slotId, pair);
    else loosePairUrls.push(url);
  }
  if (pairs.length === 0) {
    for (const url of manualUrls ?? []) if (url) loosePairUrls.push(url);
  }
  let looseIndex = 0;

  return SLOT_ORDER.map(({ slotId, label }) => {
    const slot = bySlot.get(slotId);
    const pair = pairBySlot.get(slotId);
    let url = slot?.processedUrl || slot?.previewUrl || (pair ? pairUrl(pair) : null) || null;
    const processing = pair?.processing === true;

    let state: SlotState = "empty";
    if (slot?.errorMessage) state = "error";
    else if (slot?.processingState === "processing" || slot?.processingState === "queued" || processing)
      state = "processing";
    else {
      if (!url && looseIndex < loosePairUrls.length) url = loosePairUrls[looseIndex++]!;
      if (url) state = "done";
    }

    return { slotId, label, url: state === "done" ? url : null, state };
  });
}

export async function fetchVehicle(vehicleId: string): Promise<VehicleDetail | null> {
  const { data: job, error } = await supabase
    .from("car_jobs")
    .select("id, registration, status, created_at, sold_at, slots, vehicle_details")
    .eq("id", vehicleId)
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw error;
  if (!job) return null;

  const { data: published, error: publishedError } = await supabase
    .from("published_vehicles")
    .select("is_published, published_at, imaging_status, manual_photo_pairs, manual_photo_urls")
    .eq("car_job_id", vehicleId)
    .maybeSingle();
  if (publishedError) throw publishedError;

  const slots = buildSlots(
    job.slots,
    published?.manual_photo_pairs,
    published?.manual_photo_urls ?? null,
  );

  return {
    id: job.id,
    registration: job.registration,
    status: job.status,
    createdAt: job.created_at,
    soldAt: job.sold_at,
    info: normaliseDetails(job.vehicle_details),
    slots,
    photosDone: slots.filter((s) => s.state === "done").length,
    photosWorking: slots.filter((s) => s.state === "processing").length,
    isPublished: Boolean(published?.is_published),
    publishedAt: published?.published_at ?? null,
    imagingStatus: published?.imaging_status ?? null,
  };
}