import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://utmrapido.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/precos`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/o-que-e-utm`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/utm-para-meta-ads`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/utm-para-google-ads`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];
}
