import type { MetadataRoute } from "next";
import { getAllPosts } from "@/content/posts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://utmrapido.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getAllPosts();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                                  lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/precos`,                      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blog`,                        lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/o-que-e-utm`,                 lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/utm-para-meta-ads`,           lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/utm-para-google-ads`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
