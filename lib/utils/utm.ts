import type { UTMParams } from "@/types";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s_-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

/** Slug para URLs públicas: kebab-case, sem underscores, seguro para path. */
export function clientSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function buildUTMUrl(params: UTMParams): string {
  if (!params.baseUrl || !isValidUrl(params.baseUrl)) return "";

  const url = new URL(params.baseUrl);

  if (params.source)   url.searchParams.set("utm_source",   params.source);
  if (params.medium)   url.searchParams.set("utm_medium",   params.medium);
  if (params.campaign) url.searchParams.set("utm_campaign",  params.campaign);
  if (params.content)  url.searchParams.set("utm_content",  params.content);
  if (params.term)     url.searchParams.set("utm_term",     params.term);

  return url.toString();
}

export function parseUTMUrl(fullUrl: string): Partial<UTMParams> {
  try {
    const url = new URL(fullUrl);
    return {
      baseUrl: `${url.origin}${url.pathname}`,
      source:   url.searchParams.get("utm_source")   ?? undefined,
      medium:   url.searchParams.get("utm_medium")   ?? undefined,
      campaign: url.searchParams.get("utm_campaign") ?? undefined,
      content:  url.searchParams.get("utm_content")  ?? undefined,
      term:     url.searchParams.get("utm_term")     ?? undefined,
    };
  } catch {
    return {};
  }
}

export const SOURCE_PRESETS = [
  { value: "google", label: "Google" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "email", label: "E-mail" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "newsletter", label: "Newsletter" },
];

export const MEDIUM_PRESETS = [
  { value: "cpc", label: "CPC (pago)" },
  { value: "social", label: "Social orgânico" },
  { value: "email", label: "E-mail" },
  { value: "banner", label: "Banner" },
  { value: "video", label: "Vídeo" },
  { value: "organic", label: "Orgânico" },
  { value: "referral", label: "Referral" },
  { value: "whatsapp", label: "WhatsApp" },
];

export const FREE_LINK_LIMIT = 5;
export const SESSION_KEY = "utm_rapido_session";
export const FREE_LINKS_KEY = "utm_rapido_free_links";
