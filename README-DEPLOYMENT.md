
# Deployment Instructions for OpenGraph Tags

## Overview
To make social media previews work correctly with your Sanity-powered blog and case studies, you need to deploy the server middleware that injects OpenGraph tags into the HTML before it's sent to the browser.

## Option 1: Netlify Deployment

1. Install the necessary dependency:
```bash
npm install node-fetch
```

2. Create a `netlify/functions` directory in your project root if it doesn't exist already:
```bash
mkdir -p netlify/functions
```

3. Copy the `server-middleware.js` file to `netlify/functions/server.js`:
```bash
cp server-middleware.js netlify/functions/server.js
```

4. Create a `netlify.toml` file in your project root with the following content:
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

5. Deploy to Netlify using the Netlify CLI or by connecting your GitHub repository.

## Option 2: Vercel Deployment

1. Install the necessary dependency:
```bash
npm install node-fetch
```

2. Create an `api` directory in your project root if it doesn't exist already:
```bash
mkdir -p api
```

3. Copy the `server-middleware.js` file to `api/index.js`:
```bash
cp server-middleware.js api/index.js
```

4. Create a `vercel.json` file in your project root with the following content:
```json
{
  "rewrites": [
    { "source": "/blog/:slug*", "destination": "/api/index" },
    { "source": "/case-studies/:slug*", "destination": "/api/index" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

5. Deploy to Vercel using the Vercel CLI or by connecting your GitHub repository.

## Testing OpenGraph Tags

After deployment, test your OpenGraph tags using these tools:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Important Note

This setup does not require any changes to your React components. Your existing `OpenGraphTags` component should be kept as is for the regular browser experience, while this middleware handles the social media crawler requests.
