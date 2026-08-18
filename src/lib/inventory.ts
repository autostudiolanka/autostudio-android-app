import { supabase } from "@/integrations/supabase/client";

export type ImagingStatus =
  | "none"
  | "complete"
  | "degraded_quota"
  | "degraded_ceiling"
  | "degraded_no_backdrop"
  | "degraded_error"
  | "not_eligible";

export type VehicleCardState =
  | "sold"
  | "no_photos"
  | "processing"
  | "published_no_backgrounds"
  | "complete";

export type StockStatus = "incomplete" | "pending" | "stock";

export type PhotoSlot = {
  slotId?: string;
  previewUrl?: string | null;
  processedUrl?: string | null;
  processingState?: string | null;
};

export type VehicleDetails = {
  make?: string | null;
  model?: string | null;
  variant?: string | null;
  year?: string | number | null;
  mileage?: string | number | null;
  body_type?: string | null;
  fuel_type?: string | null;
  transmission?: string | null;
  engine_capacity?: string | null;
  color?: string | null;
};

export type InventoryVehicle = {
  id: string;
  registration: string | null;
  status: StockStatus | string;
  createdAt: string;
  soldAt: string | null;
  details: VehicleDetails;
  photosDone: number;
  photosTotal: number;
  photosWorking: number;
  thumbnailUrl: string | null;
  imagingStatus: ImagingStatus | null;
  isPublished: boolean;
  state: VehicleCardState;
};

function asSlots(value: unknown): PhotoSlot[] {
  return Array.isArray(value) ? (value as PhotoSlot[]) : [];
}

function slotUrl(slot: PhotoSlot): string | null {
  const url = slot.processedUrl || slot.previewUrl;
  return url && url.length > 0 ? url : null;
}

function asDetails(value: unknown): VehicleDetails {
  if (!value || typeof value !== "object") return {};
  const raw = value as Record<string, unknown>;
  const text = (v: unknown): string | null => {
    if (typeof v === "string") return v.trim() === "" ? null : v;
    if (typeof v === "number") return String(v);
    if (v && typeof v === "object" && "CurrentTextValue" in (v as Record<string, unknown>)) {
      const inner = (v as { CurrentTextValue?: unknown }).CurrentTextValue;
      return typeof inner === "string" && inner.trim() !== "" ? inner : null;
    }
    return null;
  };

  return {
    make: text(raw["make"]) ?? text(raw["MakeDescription"]) ?? text(raw["CarMake"]),
    model: text(raw["model"]) ?? text(raw["ModelDescription"]) ?? text(raw["CarModel"]),
    variant: text(raw["variant"]) ?? text(raw["trim_level"]),
    year: text(raw["year"]) ?? text(raw["RegistrationYear"]),
    mileage: text(raw["mileage"]),
    body_type: text(raw["body_type"]) ?? text(raw["VehicleClass"]),
    fuel_type: text(raw["fuel_type"]),
    transmission: text(raw["transmission"]),
    engine_capacity: text(raw["engine_capacity"]),
    color: text(raw["color"]),
  };
}

export function vehicleTitle(details: VehicleDetails): string {
  const parts = [details.make, details.model, details.variant].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "Untitled vehicle";
}

export function vehicleSubtitle(details: VehicleDetails): string {
  const mileage =
    details.mileage != null && String(details.mileage).trim() !== ""
      ? `${Number(String(details.mileage).replace(/[^\d]/g, "") || 0).toLocaleString("en-GB")} km`
      : null;
  return [details.year, mileage, details.fuel_type, details.transmission, details.color]
    .filter(Boolean)
    .join(" · ");
}

function deriveState(input: {
  soldAt: string | null;
  photosDone: number;
  imagingStatus: ImagingStatus | null;
  isPublished: boolean;
}): VehicleCardState {
  if (input.soldAt) return "sold";
  if (input.photosDone === 0) return "no_photos";
  if (input.imagingStatus && input.imagingStatus.startsWith("degraded_")) {
    return "published_no_backgrounds";
  }
  if (input.imagingStatus === "complete") return "complete";
  // Published but imaging has not landed yet — backgrounds are still generating.
  if (input.isPublished) return "processing";
  return "complete";
}

export async function fetchInventory(): Promise<InventoryVehicle[]> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return [];

  const { data: memberships, error: membershipError } = await supabase
    .from("dealership_users")
    .select("dealership_id")
    .eq("user_id", userId)
    .eq("status", "active");
  if (membershipError) throw membershipError;

  const dealershipIds = (memberships ?? []).map((row) => row.dealership_id);
  if (dealershipIds.length === 0) return [];

  const { data: jobs, error: jobsError } = await supabase
    .from("car_jobs")
    .select("id, registration, status, created_at, sold_at, slots, vehicle_details")
    .in("dealership_id", dealershipIds)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (jobsError) throw jobsError;

  const rows = jobs ?? [];
  const ids = rows.map((row) => row.id);

  let publishedByJob = new Map<string, { imagingStatus: ImagingStatus; isPublished: boolean }>();
  if (ids.length > 0) {
    const { data: published, error: publishedError } = await supabase
      .from("published_vehicles")
      .select("car_job_id, imaging_status, is_published")
      .in("car_job_id", ids);
    if (publishedError) throw publishedError;
    publishedByJob = new Map(
      (published ?? []).map((row) => [
        row.car_job_id,
        {
          imagingStatus: (row.imaging_status ?? "none") as ImagingStatus,
          isPublished: Boolean(row.is_published),
        },
      ]),
    );
  }

  return rows.map((row) => {
    const slots = asSlots(row.slots);
    const photoSlots = slots.filter((slot) => !String(slot.slotId ?? "").startsWith("video_"));
    const done = photoSlots.filter((slot) => slotUrl(slot) !== null);
    const working = photoSlots.filter(
      (slot) => slot.processingState === "processing" || slot.processingState === "queued",
    );
    const publishedRow = publishedByJob.get(row.id);
    const details = asDetails(row.vehicle_details);

    return {
      id: row.id,
      registration: row.registration,
      status: row.status,
      createdAt: row.created_at,
      soldAt: row.sold_at,
      details,
      photosDone: done.length,
      photosTotal: photoSlots.length,
      photosWorking: working.length,
      thumbnailUrl: done.length > 0 ? slotUrl(done[0]!) : null,
      imagingStatus: publishedRow?.imagingStatus ?? null,
      isPublished: publishedRow?.isPublished ?? false,
      state: deriveState({
        soldAt: row.sold_at,
        photosDone: done.length,
        imagingStatus: publishedRow?.imagingStatus ?? null,
        isPublished: publishedRow?.isPublished ?? false,
      }),
    } satisfies InventoryVehicle;
  });
}