import { supabase } from "@/integrations/supabase/client";

/** First name for the greeting — falls back to the email handle. */
export async function fetchFirstName(): Promise<string | null> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const full = data?.full_name?.trim();
  if (full) return full.split(/\s+/)[0]!;

  const handle = user.email?.split("@")[0];
  if (!handle) return null;
  return handle.charAt(0).toUpperCase() + handle.slice(1);
}
