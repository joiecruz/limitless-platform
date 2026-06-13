import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const SUPABASE_URL = "https://crllgygjuqpluvdpwayi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybGxneWdqdXFwbHV2ZHB3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NDQ1MjksImV4cCI6MjA0OTEyMDUyOX0.-L1Kc059oqFdOacRh9wcbf5wBCOqqTHBzvmIFKqlWU8";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const BASE_URL = "https://limitlesslab.org";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

async function fetchDynamicContent(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  // Fetch published articles
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('published', true);

  if (articles) {
    for (const article of articles) {
      entries.push({
        path: `/blog/${article.slug}`,
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: article.updated_at ? new Date(article.updated_at).toISOString().split('T')[0] : undefined,
      });
    }
  }

  // Fetch case studies
  const { data: caseStudies } = await supabase
    .from('case_studies')
    .select('slug, updated_at');

  if (caseStudies) {
    for (const cs of caseStudies) {
      entries.push({
        path: `/case-studies/${cs.slug}`,
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: cs.updated_at ? new Date(cs.updated_at).toISOString().split('T')[0] : undefined,
      });
    }
  }

  // Fetch courses (Online/Hybrid)
  const { data: courses } = await supabase
    .from('courses')
    .select('slug, updated_at')
    .in('format', ['Online', 'Hybrid']);

  if (courses) {
    for (const course of courses) {
      if (course.slug) {
        entries.push({
          path: `/courses/${course.slug}`,
          changefreq: 'monthly',
          priority: '0.6',
          lastmod: course.updated_at ? new Date(course.updated_at).toISOString().split('T')[0] : undefined,
        });
      }
    }
  }

  // Fetch workshops (In-Person)
  const { data: workshops } = await supabase
    .from('courses')
    .select('id, updated_at')
    .eq('format', 'In-Person');

  if (workshops) {
    for (const workshop of workshops) {
      entries.push({
        path: `/workshops/${workshop.id}`,
        changefreq: 'monthly',
        priority: '0.6',
        lastmod: workshop.updated_at ? new Date(workshop.updated_at).toISOString().split('T')[0] : undefined,
      });
    }
  }

  // Fetch innovation tools
  const { data: tools } = await supabase
    .from('innovation_tools')
    .select('id, updated_at');

  if (tools) {
    for (const tool of tools) {
      entries.push({
        path: `/tools/${tool.id}`,
        changefreq: 'monthly',
        priority: '0.6',
        lastmod: tool.updated_at ? new Date(tool.updated_at).toISOString().split('T')[0] : undefined,
      });
    }
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

async function main() {
  const staticEntries: SitemapEntry[] = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/product", changefreq: "monthly", priority: "0.8" },
    { path: "/services", changefreq: "monthly", priority: "0.8" },
    { path: "/courses", changefreq: "weekly", priority: "0.8" },
    { path: "/tools", changefreq: "weekly", priority: "0.8" },
    { path: "/programs", changefreq: "monthly", priority: "0.8" },
    { path: "/programs/limitlessgov", changefreq: "monthly", priority: "0.7" },
    { path: "/programs/ai-ready-asean", changefreq: "monthly", priority: "0.7" },
    { path: "/programs/aim-asean", changefreq: "monthly", priority: "0.7" },
    { path: "/limitlessbiz", changefreq: "monthly", priority: "0.7" },
    { path: "/blog", changefreq: "daily", priority: "0.9" },
    { path: "/case-studies", changefreq: "weekly", priority: "0.8" },
    { path: "/about", changefreq: "monthly", priority: "0.6" },
    { path: "/updates", changefreq: "weekly", priority: "0.5" },
    { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
    { path: "/terms-of-service", changefreq: "yearly", priority: "0.3" },
  ];

  const dynamicEntries = await fetchDynamicContent();
  const allEntries = [...staticEntries, ...dynamicEntries];

  const sitemap = generateSitemap(allEntries);
  writeFileSync(resolve("public/sitemap.xml"), sitemap);
  console.log(`sitemap.xml written (${allEntries.length} entries)`);
}

main().catch(console.error);
