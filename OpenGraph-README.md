
# OpenGraph Tag Implementation Guide

## The Problem
Social media platforms and link preview generators don't execute JavaScript when they crawl your website.
This means the OpenGraph tags injected by React components are never seen by these crawlers.

## Solution: Server Middleware
We've implemented a server middleware approach that intercepts requests to your blog posts and case studies, 
fetches the relevant data from Supabase, and injects the correct OpenGraph tags into the HTML before it's sent to the browser.

## Deployment Instructions

### For Netlify:

1. Install the dependencies:
```bash
npm install node-fetch
```

2. Move `server-middleware.js` to `netlify/functions/server.js`

3. Create a `netlify.toml` file in your project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/blog/*"
  to = "/.netlify/functions/server"
  status = 200

[[redirects]]
  from = "/case-studies/*"
  to = "/.netlify/functions/server"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

4. Add your Supabase key to Netlify environment variables:
   - Go to Site settings > Build & deploy > Environment
   - Add `SUPABASE_ANON_KEY` with your public anon key

### For Vercel:

1. Move `server-middleware.js` to `api/index.js`

2. Create a `vercel.json` file in your project root:
```json
{
  "rewrites": [
    { "source": "/blog/:slug*", "destination": "/api/index" },
    { "source": "/case-studies/:slug*", "destination": "/api/index" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

3. Add your Supabase key to Vercel environment variables in the Vercel dashboard.

## Testing OpenGraph Tags

After deployment, you can test your OpenGraph tags using these tools:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Important Notes

1. This solution uses server-side rendering for just the OpenGraph tags, while the rest of your application remains a client-side rendered SPA.

2. For a more comprehensive SSR solution, consider migrating to Next.js in the future, which would handle this more elegantly.

3. If your blog posts or case studies change frequently, you may need to implement cache invalidation in your server middleware.
