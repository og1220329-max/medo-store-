import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getStore } from "@/lib/db/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/services/social-media`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/offers`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE.url}/cart`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/checkout`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/orders/track`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/auth/login`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE.url}/auth/register`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  let productUrls: MetadataRoute.Sitemap = [];
  let categoryUrls: MetadataRoute.Sitemap = [];

  try {
    const { products, categories } = await getStore();
    productUrls = products
      .filter((p) => p.active)
      .map((p) => ({
        url: `${SITE.url}/products/${p.slug}`,
        lastModified: new Date(p.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    categoryUrls = categories.map((c) => ({
      url: `${SITE.url}/products?category=${encodeURIComponent(c.slug)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB not available during build — return static routes only
  }

  return [...staticRoutes, ...productUrls, ...categoryUrls];
}