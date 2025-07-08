
// This file should be deployed as a serverless function or middleware on your hosting platform
// For Netlify, add it to your netlify/functions/ directory
// For Vercel, add it to your api/ directory

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Get the path from the request
  const { path: urlPath } = event;

  // If this is a blog post request
  if (urlPath.startsWith('/blog/') && urlPath !== '/blog/') {
    try {
      // Extract the slug from the URL
      const slug = urlPath.replace('/blog/', '');

      // Fetch blog data from your Supabase instance
      const response = await fetch(
        `https://crllgygjuqpluvdpwayi.supabase.co/rest/v1/articles?slug=eq.${slug}&select=*`,
        {
          headers: {
            'apikey': process.env.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
          }
        }
      );

      const posts = await response.json();

      if (posts && posts.length > 0) {
        const post = posts[0];

        // Read the HTML file
        let html = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf8');

        // Replace OpenGraph tags with dynamic content
        html = html.replace(/<meta property="og:title" content="[^"]*"/,
                          `<meta property="og:title" content="${post.title} | Limitless Lab"`);

        html = html.replace(/<meta property="og:description" content="[^"]*"/,
                          `<meta property="og:description" content="${post.excerpt || post.title.substring(0, 160)}"`);

        html = html.replace(/<meta property="og:image" content="[^"]*"/,
                          `<meta property="og:image" content="${post.cover_image || 'https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png'}"`);

        html = html.replace(/<meta property="og:url" content="[^"]*"/,
                          `<meta property="og:url" content="https://limitlesslab.io/blog/${slug}"`);

        html = html.replace(/<meta property="og:type" content="[^"]*"/,
                          `<meta property="og:type" content="article"`);

        // Add article specific tags
        if (post.created_at) {
          html = html.replace('</head>',
                            `<meta property="article:published_time" content="${post.created_at}"></head>`);
        }

        if (post.read_time) {
          html = html.replace('</head>',
                            `<meta property="article:reading_time" content="${post.read_time}"></head>`);
        }

        if (post.categories && post.categories.length > 0) {
          const categoryTags = post.categories.map(category =>
            `<meta property="article:tag" content="${category}">`
          ).join('');
          html = html.replace('</head>', `${categoryTags}</head>`);
        }

        html = html.replace(/<title>[^<]*<\/title>/,
                          `<title>${post.title} | Limitless Lab</title>`);

        html = html.replace(/<meta name="description" content="[^"]*"/,
                          `<meta name="description" content="${post.excerpt || post.title.substring(0, 160)}"`);

        // Return the modified HTML
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'text/html',
          },
          body: html,
        };
      }
    } catch (error) {
      // console.error('Error fetching blog data:', error);
    }
  }

  // For case studies or other paths, implement similar logic
  // if (urlPath.startsWith('/case-studies/') && urlPath !== '/case-studies/') { ... }

  // For all other requests, serve the file as-is
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf8'),
  };
};
