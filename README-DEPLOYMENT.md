
# Deployment Guide for Server-Side Rendering

This guide will help you set up server-side rendering (SSR) for social media sharing previews on Vercel or Netlify.

## The Problem

Social media platforms and search engines don't execute JavaScript when crawling web pages. This means that meta tags injected by React components are never seen by these crawlers, resulting in poor social sharing previews.

## Solution: Server Middleware

We've implemented a server middleware approach that intercepts requests to your blog posts and case studies, fetches the relevant data from Supabase, and injects the correct OpenGraph tags into the HTML before it's sent to the browser.

## Deployment Instructions

### For Vercel:

1. Create a `vercel.json` file in your project root:

```json
{
  "rewrites": [
    { "source": "/blog/:slug*", "destination": "/api/index" },
    { "source": "/case-studies/:slug*", "destination": "/api/index" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "vite"
}
```

2. Move `server-middleware.js` to `api/index.js`

3. Add your Supabase key to Vercel environment variables:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add `SUPABASE_ANON_KEY` with your public anon key

4. Deploy to Vercel:
   ```
   npx vercel
   ```

### For Netlify:

1. Create a `netlify.toml` file in your project root:

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

2. Create a `netlify/functions` directory and move `server-middleware.js` to `netlify/functions/server.js`

3. Add your Supabase key to Netlify environment variables:
   - Go to Site settings > Build & deploy > Environment
   - Add `SUPABASE_ANON_KEY` with your public anon key

4. Deploy to Netlify:
   ```
   npx netlify deploy
   ```

## Testing OpenGraph Tags

After deployment, you can test your OpenGraph tags using these tools:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Important Notes

1. This solution uses server-side rendering for just the OpenGraph tags, while the rest of your application remains a client-side rendered SPA.

2. The middleware fetches fresh data from Supabase for each request to a blog post or case study URL.

3. Remember to keep your environment variables secure but accessible to your serverless functions.
