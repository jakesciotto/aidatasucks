import { SITE_URL, LAST_UPDATED } from "@/lib/site";

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
