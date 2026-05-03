import { describe, it, expect } from "vitest";

const PROD_URL = "https://www.limitlesslab.org/cocreate/smoke-test-nonexistent";
const SUPABASE_URL = "https://crllgygjuqpluvdpwayi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybGxneWdqdXFwbHV2ZHB3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NDQ1MjksImV4cCI6MjA0OTEyMDUyOX0.-L1Kc059oqFdOacRh9wcbf5wBCOqqTHBzvmIFKqlWU8";

describe("co-creation public route smoke test", () => {
  it("serves /cocreate/:slug with HTTP 200 and no auth redirect", async () => {
    const res = await fetch(PROD_URL, { redirect: "manual" });
    expect(res.status).toBe(200);

    const location = res.headers.get("location") || "";
    expect(location).not.toMatch(/sign[-_]?in|login|auth/i);

    const html = await res.text();
    // Custom domain only — never expose lovable.app URLs to participants
    expect(html).not.toMatch(/lovable\.app/i);
    // Should be the SPA shell, not a sign-in page
    expect(html.toLowerCase()).not.toContain("please sign in");
  });

  it("allows anonymous Supabase reads of live cocreation_sessions", async () => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cocreation_sessions?select=id,slug,status&status=eq.live&limit=1`,
      { headers: { apikey: SUPABASE_ANON_KEY } },
    );
    expect(res.status).toBe(200);
    const rows = await res.json();
    expect(Array.isArray(rows)).toBe(true);
  });
});
