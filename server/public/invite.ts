import type { SupabaseClient } from "@supabase/supabase-js";

export type InviteRow = {
  id: string;
  code: string;
  code_type: string;
  locality_id: string | null;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
};

export async function validateInviteCode(
  admin: SupabaseClient,
  inviteCode: string,
): Promise<{ valid: true; invite: InviteRow } | { valid: false; reason: string }> {
  const { data, error } = await admin
    .from("invite_codes")
    .select("*")
    .eq("code", inviteCode)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { valid: false, reason: "Invalid invite code" };
  if (!data.is_active) return { valid: false, reason: "Invite code is disabled" };
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, reason: "Invite code has expired" };
  }
  if (data.used_count >= data.max_uses) {
    return { valid: false, reason: "Invite code usage limit reached" };
  }

  return { valid: true, invite: data as InviteRow };
}

export async function incrementInviteUsage(
  admin: SupabaseClient,
  inviteId: string,
  usedCount: number,
) {
  const { error } = await admin
    .from("invite_codes")
    .update({ used_count: usedCount + 1 })
    .eq("id", inviteId);

  if (error) throw error;
}
