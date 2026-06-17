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

// ─────────────────────────────────────────────
// Estrutura visual + explicações dos parâmetros UTM
// ─────────────────────────────────────────────
export interface UTMParamInfo {
  key: "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term";
  shortKey: "source" | "medium" | "campaign" | "content" | "term";
  value: string;
  label: string;
  explanation: string;
  bg: string;
  text: string;
}

const PARAM_META: Record<
  UTMParamInfo["shortKey"],
  { key: UTMParamInfo["key"]; label: string; explanation: string; bg: string; text: string }
> = {
  source: {
    key: "utm_source",
    label: "Origem do tráfego",
    explanation: "De onde veio o clique",
    bg: "bg-brand-light",
    text: "text-brand-dark",
  },
  medium: {
    key: "utm_medium",
    label: "Tipo de mídia",
    explanation: "Como o link foi distribuído",
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  campaign: {
    key: "utm_campaign",
    label: "Nome da campanha",
    explanation: "Identifica a ação de marketing",
    bg: "bg-green-100",
    text: "text-green-700",
  },
  content: {
    key: "utm_content",
    label: "Variação do anúncio",
    explanation: "Diferencia criativos",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  term: {
    key: "utm_term",
    label: "Palavra-chave / segmentação",
    explanation: "Palavra-chave ou segmentação de público",
    bg: "bg-gray-100",
    text: "text-gray-700",
  },
};

interface ExtractInput {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
}

export function extractUTMInfo(input: ExtractInput): UTMParamInfo[] {
  const out: UTMParamInfo[] = [];
  const pairs: Array<[UTMParamInfo["shortKey"], string | null | undefined]> = [
    ["source", input.utm_source],
    ["medium", input.utm_medium],
    ["campaign", input.utm_campaign],
    ["content", input.utm_content],
    ["term", input.utm_term],
  ];
  for (const [shortKey, value] of pairs) {
    if (!value) continue;
    const meta = PARAM_META[shortKey];
    out.push({
      key: meta.key,
      shortKey,
      value,
      label: meta.label,
      explanation: meta.explanation,
      bg: meta.bg,
      text: meta.text,
    });
  }
  return out;
}

function humanize(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function buildCopyWithStructure(url: string, params: ExtractInput): string {
  const items = extractUTMInfo(params);
  if (items.length === 0) {
    return `🔗 Link UTM: ${url}\n\nGerado por UTM Rápido — utmrapido.com.br`;
  }
  const lines = items.map((p) => {
    const friendly = humanize(p.value);
    const lead =
      p.shortKey === "source"
        ? "origem"
        : p.shortKey === "medium"
        ? "tipo"
        : p.shortKey === "campaign"
        ? "campanha"
        : p.shortKey === "content"
        ? "conteúdo"
        : "termo";
    return `- ${p.key}=${p.value} → ${lead}: ${friendly}`;
  });
  return `🔗 Link UTM: ${url}

📊 Estrutura:
${lines.join("\n")}

Gerado por UTM Rápido — utmrapido.com.br`;
}

// ─────────────────────────────────────────────
// Descrição automática (sugerida) a partir dos parâmetros UTM
// ─────────────────────────────────────────────
export function generateAutoDescription(params: ExtractInput): string {
  const source = params.utm_source ? humanize(params.utm_source) : "";
  const medium = params.utm_medium ? humanize(params.utm_medium) : "";
  const campaign = params.utm_campaign ? humanize(params.utm_campaign) : "";
  const content = params.utm_content ? humanize(params.utm_content) : "";
  const term = params.utm_term ? humanize(params.utm_term) : "";

  if (!source && !medium && !campaign && !content && !term) return "";

  const parts: string[] = ["Link para rastrear cliques"];
  if (source) parts.push(`vindos do ${source}`);
  if (medium) parts.push(`via ${medium.toLowerCase()}`);
  if (campaign) parts.push(`, da campanha ${campaign}`);
  if (content) parts.push(`, criativo ${content}`);
  if (term) parts.push(`, segmentação ${term}`);

  return parts.join(" ").replace(/\s+,/g, ",") + ".";
}
