import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://docuseal.ai";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/tools/", "/pricing", "/blog/", "/about"],
        disallow: ["/dashboard", "/documents", "/settings", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
