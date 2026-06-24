import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://limitlesslab.org";

// Keep this list in sync with the `reactSnap.include` array in package.json.
// Only prerendered public marketing routes are listed here so crawlers and
// LLMs only see pages where we ship real HTML body content.
interface SitemapEntry {
  path: string;
  changefreq?: string;
  priority?: string;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/entrepreneurs", changefreq: "monthly", priority: "0.8" },
  { path: "/corporates", changefreq: "monthly", priority: "0.8" },
  { path: "/government", changefreq: "monthly", priority: "0.8" },
  { path: "/schools", changefreq: "monthly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/programs", changefreq: "monthly", priority: "0.8" },
  { path: "/programs/limitlessgov", changefreq: "monthly", priority: "0.7" },
  { path: "/programs/ai-ready-asean", changefreq: "monthly", priority: "0.7" },
  { path: "/programs/aim-asean", changefreq: "monthly", priority: "0.7" },
  { path: "/programs/limitlessbiz", changefreq: "monthly", priority: "0.7" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms-of-service", changefreq: "yearly", priority: "0.3" },
];

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} prerendered entries)`);
