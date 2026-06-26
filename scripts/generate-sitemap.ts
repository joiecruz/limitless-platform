// Runs before `vite dev` and `vite build` (predev/prebuild hooks).
// Writes public/sitemap.xml with:
//   1. Static public marketing routes
//   2. All published dynamic content (blog posts, tools, case studies, courses)
//      pulled live from Supabase via the REST API (no SDK needed at build time)
//
// Failure to reach Supabase falls back to the static list so builds never break.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://limitlesslab.org";
const SUPABASE_URL = "https://crllgygjuqpluvdpwayi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybGxneWdqdXFwbHV2ZHB3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NDQ1MjksImV4cCI6MjA0OTEyMDUyOX0.-L1Kc059oqFdOacRh9wcbf5wBCOqqTHBzvmIFKqlWU8";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/entrepreneurs", changefreq: "monthly", priority: "0.8" },
  { path: "/corporates", changefreq: "monthly", priority: "0.8" },
  { path: "/government", changefreq: "monthly", priority: "0.8" },
  { path: "/schools", changefreq: "monthly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/about/transformation-model", changefreq: "monthly", priority: "0.7" },
  { path: "/about/partner", changefreq: "monthly", priority: "0.7" },
  { path: "/programs", changefreq: "monthly", priority: "0.8" },
  { path: "/programs/limitlessgov", changefreq: "monthly", priority: "0.7" },
  { path: "/programs/ai-ready-asean", changefreq: "monthly", priority: "0.7" },
  { path: "/programs/aim-asean", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/tools", changefreq: "weekly", priority: "0.7" },
  { path: "/case-studies", changefreq: "weekly", priority: "0.7" },
  { path: "/courses", changefreq: "weekly", priority: "0.7" },
  { path: "/services", changefreq: "monthly", priority: "0.6" },
  { path: "/product", changefreq: "monthly", priority: "0.6" },
  { path: "/updates", changefreq: "weekly", priority: "0.5" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms-of-service", changefreq: "yearly", priority: "0.3" },
];

async function fetchTable<T>(
  path: string,
  select: string,
  filter = "",
): Promise<T[]> {
  const url = `${SUPABASE_URL}/rest/v1/${path}?select=${select}${
    filter ? `&${filter}` : ""
  }`;
  try {
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) {
      console.warn(`[sitemap] ${path} fetch failed: ${res.status}`);
      return [];
    }
    return (await res.json()) as T[];
  } catch (err) {
    console.warn(`[sitemap] ${path} fetch errored:`, err);
    return [];
  }
}

function toISO(d: string | null | undefined): string | undefined {
  if (!d) return undefined;
  try {
    return new Date(d).toISOString().split("T")[0];
  } catch {
    return undefined;
  }
}

async function buildEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [...staticEntries];

  // Articles (blog posts) — only published
  const articles = await fetchTable<{
    slug: string;
    updated_at: string | null;
    created_at: string | null;
  }>("articles", "slug,updated_at,created_at", "published=eq.true");
  for (const a of articles) {
    if (!a.slug) continue;
    entries.push({
      path: `/blog/${a.slug}`,
      lastmod: toISO(a.updated_at || a.created_at),
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  // Innovation tools — public, addressable by uuid id
  const tools = await fetchTable<{ id: string; slug: string | null }>(
    "innovation_tools",
    "id,slug",
  );
  for (const t of tools) {
    if (!t.id) continue;
    entries.push({
      path: `/tools/${t.id}`,
      changefreq: "monthly",
      priority: "0.5",
    });
  }

  // Case studies
  const caseStudies = await fetchTable<{
    slug: string | null;
    id: string;
    updated_at: string | null;
  }>("case_studies", "id,slug,updated_at");
  for (const c of caseStudies) {
    const seg = c.slug || c.id;
    if (!seg) continue;
    entries.push({
      path: `/case-studies/${seg}`,
      lastmod: toISO(c.updated_at),
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  // Courses (public landing)
  const courses = await fetchTable<{ id: string; slug: string | null }>(
    "courses",
    "id,slug",
  );
  for (const c of courses) {
    const seg = c.slug || c.id;
    if (!seg) continue;
    entries.push({
      path: `/courses/${seg}`,
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  return entries;
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
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

(async () => {
  const entries = await buildEntries();
  writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
  console.log(
    `sitemap.xml written — ${entries.length} entries (${staticEntries.length} static + ${
      entries.length - staticEntries.length
    } dynamic)`,
  );
})();
