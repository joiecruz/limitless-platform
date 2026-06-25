import { Helmet } from "react-helmet-async";

/**
 * Drops a `noindex,nofollow` robots meta into <head> so crawlers
 * (Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, etc.) skip
 * the page entirely. Use on auth, dashboard, and admin routes —
 * anything that shouldn't appear in search or be cited by LLMs.
 */
export function NoIndex() {
  return (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
      <meta name="googlebot" content="noindex, nofollow" />
    </Helmet>
  );
}
