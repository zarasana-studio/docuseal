import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://docuseal.ai";
  const now = new Date();

  const toolPages = [
    "privacy-policy",
    "terms-of-service",
    "nda",
    "client-contract",
    "freelancer-agreement",
    "cookie-policy",
    "employment-contract",
    "refund-policy",
  ];

  return [
    // Homepage — highest priority
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    // Tool pages — all high priority (these are the SEO core)
    ...toolPages.map((slug) => ({
      url: `${base}/tools/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    // Auth pages — lower priority
    { url: `${base}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];
}
