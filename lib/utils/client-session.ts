import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/service";
import { CLIENT_SESSION_COOKIE } from "@/lib/utils/client-auth";

export interface ClientUserSession {
  id: string;
  name: string;
  email: string;
  client_id: string;
}

export async function getClientUserSession(): Promise<ClientUserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENT_SESSION_COOKIE)?.value;
  if (!token) return null;

  const svc = createServiceClient();
  const { data: sess } = await svc
    .from("client_user_sessions")
    .select("client_user_id, expires_at")
    .eq("token", token)
    .maybeSingle();
  if (!sess) return null;

  if (new Date(sess.expires_at).getTime() < Date.now()) {
    await svc.from("client_user_sessions").delete().eq("token", token);
    return null;
  }

  const { data: user } = await svc
    .from("client_users")
    .select("id, name, email, client_id")
    .eq("id", sess.client_user_id)
    .maybeSingle();
  if (!user) return null;

  return user as ClientUserSession;
}
