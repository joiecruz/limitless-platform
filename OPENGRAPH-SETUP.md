
# Setting Up OpenGraph Tags for Social Media Sharing

This guide explains how to properly configure your OpenGraph tags for social media sharing. Since your site is a single-page application (SPA), social media crawlers can't execute JavaScript, so we need a server-side approach to inject the correct metadata.

## The Problem

When you share a link on social media platforms like Facebook, Twitter, or LinkedIn, their crawlers fetch your page but **don't execute any JavaScript**. This means:

1. All React-based OpenGraph tags (using Helmet or similar) won't be seen by the crawlers
2. The default metadata in your HTML file is used instead, resulting in generic previews

## The Solution: Server-Side Middleware

We've implemented a server middleware approach that:

1. Intercepts requests to your blog posts
2. Fetches the relevant post data from Sanity
3. Modifies the HTML to include the correct OpenGraph tags before sending it to the browser

## Deployment Instructions

### For Netlify (Recommended):

1. **Install the Node fetch dependency**:
   ```bash
   npm install node-fetch
   ```

2. **Create a `netlify.toml` file** in your project root (already done)

3. **Set up your environment variables in Netlify**:
   - Go to Site settings > Build & deploy > Environment
   - Add `SUPABASE_ANON_KEY` with your public anon key

4. **Deploy to Netlify**:
   ```bash
   netlify deploy --prod
   ```

### For Vercel:

1. **Install the Node fetch dependency**:
   ```bash
   npm install node-fetch
   ```

2. **Set up your environment variables in Vercel**:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add `SUPABASE_ANON_KEY` with your public anon key

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

## Testing Your OpenGraph Tags

After deployment, you can test your OpenGraph tags using these tools:

- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

These tools will show you exactly what social media platforms see when your links are shared.

## Troubleshooting

If your OpenGraph tags aren't being properly injected, check these common issues:

1. **Path issues**: Make sure your server function can find the HTML file. The paths may differ in production.
2. **Environment variables**: Check that your SUPABASE_ANON_KEY is properly set.
3. **Deployment configuration**: Verify that your redirects in netlify.toml or vercel.json are correct.
4. **Sanity connectivity**: Make sure your Sanity client can connect without CORS issues.

## How It Works

The server middleware:

1. Intercepts requests to URLs like `/blog/my-post`
2. Extracts the slug (`my-post`)
3. Fetches the post data from Sanity 
4. Modifies the HTML to include dynamic OpenGraph tags
5. Returns the modified HTML to the browser

This ensures that social media crawlers see the correct metadata.
