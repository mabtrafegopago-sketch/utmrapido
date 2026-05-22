export type { Database } from "./database";

export interface UTMParams {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
}

export interface UTMLink {
  id: string;
  name: string;
  baseUrl: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  fullUrl: string;
  createdAt: string;
  clientId?: string | null;
}

export interface Client {
  id: string;
  name: string;
  email: string | null;
  color: string;
  accessToken: string;
  createdAt: string;
  linkCount?: number;
}

export interface UserProfile {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  plan: "free" | "pro";
}
