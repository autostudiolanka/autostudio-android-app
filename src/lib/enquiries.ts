import { supabase } from "@/integrations/supabase/client";
import { asDetails, vehicleSubtitle, vehicleTitle, type VehicleDetails } from "@/lib/inventory";

export type EnquiryStatus = "new" | "replied" | string;

export type EnquiryVehicle = {
  id: string;
  title: string;
  spec: string;
  thumbnailUrl: string | null;
};

export type Enquiry = {
  id: string;
  vehicleId: string | null;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  message: string | null;
  source: string;
  status: EnquiryStatus;
  createdAt: string;
  respondedAt: string | null;
  whatsappSent: boolean;
  vehicle: EnquiryVehicle | null;
  /** vehicle_id set but the join found nothing. */
  vehicleDeleted: boolean;
};

type Slot = { slotId?: string; previewUrl?: string | null; processedUrl?: string | null };

function firstPhoto(slots: unknown): string | null {
  if (!Array.isArray(slots)) return null;
  for (const raw of slots as Slot[]) {
    if (String(raw.slotId ?? "").startsWith("video_")) continue;
    const url = raw.processedUrl || raw.previewUrl;
    if (url) return url;
  }
  return null;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]![0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export const SOURCE_LABEL: Record<string, string> = {
  contact_page: "Contact page",
  vehicle_page: "Vehicle page",
  website: "Website",
};

/** Sri Lankan numbers, stored in mixed formats. Normalise to 94XXXXXXXXX. */
export function toInternational(phone: string | null): string | null {
  if (!phone) return null;
  let digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  digits = digits.replace(/\D/g, "");
  if (digits.startsWith("0094")) digits = digits.slice(2);
  if (digits.startsWith("94")) return digits;
  if (digits.startsWith("0")) return `94${digits.slice(1)}`;
  if (digits.length === 9) return `94${digits}`;
  return digits.length > 0 ? digits : null;
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
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

  const { data: rows, error } = await supabase
    .from("enquiries")
    .select(
      "id, vehicle_id, customer_name, customer_phone, customer_email, message, source, status, created_at, responded_at, whatsapp_sent",
    )
    .in("dealership_id", dealershipIds)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const list = rows ?? [];
  const vehicleIds = [...new Set(list.map((r) => r.vehicle_id).filter(Boolean))] as string[];

  const vehicles = new Map<string, EnquiryVehicle>();
  if (vehicleIds.length > 0) {
    const { data: jobs, error: jobsError } = await supabase
      .from("car_jobs")
      .select("id, registration, slots, vehicle_details")
      .in("id", vehicleIds)
      .is("deleted_at", null);
    if (jobsError) throw jobsError;
    for (const job of jobs ?? []) {
      const details: VehicleDetails = asDetails(job.vehicle_details);
      vehicles.set(job.id, {
        id: job.id,
        title: vehicleTitle(details),
        spec: [job.registration, vehicleSubtitle(details)].filter(Boolean).join(" · "),
        thumbnailUrl: firstPhoto(job.slots),
      });
    }
  }

  return list.map((row) => {
    const vehicle = row.vehicle_id ? (vehicles.get(row.vehicle_id) ?? null) : null;
    return {
      id: row.id,
      vehicleId: row.vehicle_id,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerEmail: row.customer_email,
      message: row.message,
      source: row.source,
      status: row.status,
      createdAt: row.created_at,
      respondedAt: row.responded_at,
      whatsappSent: Boolean(row.whatsapp_sent),
      vehicle,
      vehicleDeleted: Boolean(row.vehicle_id) && vehicle === null,
    } satisfies Enquiry;
  });
}

export async function markReplied(id: string, viaWhatsApp: boolean): Promise<void> {
  const { error } = await supabase
    .from("enquiries")
    .update({
      status: "replied",
      responded_at: new Date().toISOString(),
      ...(viaWhatsApp ? { whatsapp_sent: true } : {}),
    })
    .eq("id", id);
  if (error) throw error;
}
