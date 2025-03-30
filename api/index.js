// Copy of server-middleware.js for Vercel
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

export default async function handler(req, res) {
  // Get the path from the request
  const urlPath = req.url;
  
  console.log('Processing request for path:', urlPath);
  
  try {
    // Handle blog posts
    if (urlPath.startsWith('/blog/') && urlPath !== '/blog/') {
      // Extract the slug from the URL
      const slug = urlPath.replace('/blog/', '').split('?')[0]; // Remove query parameters
      console.log('Handling blog post with slug:', slug);
      
      // First try to fetch data from Sanity directly
      try {
        const SANITY_PROJECT_ID = '42h9veeb';
        const SANITY_DATASET = 'production';
        const SANITY_API_VERSION = '2021-10-21';
        
        const sanityQuery = encodeURIComponent(`*[_type == "post" && slug.current == "${slug}"][0]{
          title,
          excerpt,
          "publishedAt": publishedAt,
          mainImage{asset->{_id, url}},
          "author": author->name,
          "categories": categories[]->name
        }`);
        
        const response = await fetch(
          `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${sanityQuery}`,
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        );
        
        const sanityData = await response.json();
        console.log('Fetched blog post from Sanity:', sanityData.result ? 'success' : 'not found');
        
        if (sanityData.result) {
          const post = sanityData.result;
          
          // Read the HTML file
          const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
          console.log('Reading HTML file from:', htmlPath);
          let html = fs.readFileSync(htmlPath, 'utf8');
          
          // Get the image URL
          let imageUrl = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png";
          if (post.mainImage && post.mainImage.asset) {
            // Use the direct URL if available
            if (post.mainImage.asset.url) {
              imageUrl = `${post.mainImage.asset.url}?w=1200&h=630&fit=crop&crop=center`;
            } else if (post.mainImage.asset._id) {
              // Or build it from _id
              imageUrl = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${post.mainImage.asset._id.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}?w=1200&h=630&fit=crop&crop=center`;
            }
          }
          
          // Get proper domain for canonical URL
          const domain = req.headers.host ? `${req.headers['x-forwarded-proto'] ? req.headers['x-forwarded-proto'] : 'https'}://${req.headers.host}` : 'https://limitlesslab.org';
          const canonicalUrl = `${domain}/blog/${slug}`;
          
          // Replace all meta tags - use a more thorough approach
          const head = html.split('</head>')[0];
          const body = html.split('</head>')[1];
          
          // Create new head content with proper meta tags
          let newHead = head;
          
          // Remove existing OpenGraph tags
          newHead = newHead.replace(/<meta property="og:[^>]*>/g, '');
          newHead = newHead.replace(/<meta name="twitter:[^>]*>/g, '');
          
          // Add updated OpenGraph tags
          const ogTags = `
  <title>${post.title} | Limitless Lab</title>
  <meta name="description" content="${post.excerpt || post.title}">
  <meta property="og:title" content="${post.title} | Limitless Lab">
  <meta property="og:description" content="${post.excerpt || post.title}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Limitless Lab">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${post.title} | Limitless Lab">
  <meta name="twitter:description" content="${post.excerpt || post.title}">
  <meta name="twitter:image" content="${imageUrl}">
  <link rel="canonical" href="${canonicalUrl}">`;
          
          // Inject the new tags just before </head>
          newHead += ogTags;
          
          // Put it all back together
          html = newHead + '</head>' + body;
          
          console.log('Successfully injected blog metadata from Sanity');
          
          // Return the modified HTML
          res.setHeader('Content-Type', 'text/html');
          return res.status(200).send(html);
        }
      } catch (sanityError) {
        console.error('Error fetching from Sanity:', sanityError);
        // Continue to try Supabase as a fallback
      }
      
      // Fallback to Supabase
      try {
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
        console.log('Fetched blog posts from Supabase:', posts && posts.length);
        
        if (posts && posts.length > 0) {
          const post = posts[0];
          
          // Read the HTML file
          const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
          console.log('Reading HTML file from:', htmlPath);
          let html = fs.readFileSync(htmlPath, 'utf8');
          
          // Replace OpenGraph tags with dynamic content
          html = html.replace(/<meta property="og:title" content="[^"]*"/, 
                            `<meta property="og:title" content="${post.title} | Limitless Lab"`);
          
          html = html.replace(/<meta property="og:description" content="[^"]*"/, 
                            `<meta property="og:description" content="${post.excerpt || post.meta_description || post.title.substring(0, 160)}"`);
          
          html = html.replace(/<meta property="og:image" content="[^"]*"/, 
                            `<meta property="og:image" content="${post.cover_image || 'https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png'}"`);
          
          html = html.replace(/<meta property="og:url" content="[^"]*"/, 
                            `<meta property="og:url" content="https://limitlesslab.org/blog/${slug}"`);
          
          html = html.replace(/<meta property="og:type" content="[^"]*"/, 
                            `<meta property="og:type" content="article"`);
          
          html = html.replace(/<title>[^<]*<\/title>/, 
                            `<title>${post.title} | Limitless Lab</title>`);
                            
          html = html.replace(/<meta name="description" content="[^"]*"/, 
                            `<meta name="description" content="${post.excerpt || post.meta_description || post.title.substring(0, 160)}"`);
          
          console.log('Successfully injected blog metadata from Supabase');
          
          // Return the modified HTML
          res.setHeader('Content-Type', 'text/html');
          return res.status(200).send(html);
        }
      } catch (error) {
        console.error('Error processing request:', error);
      }
    }
  } catch (error) {
    console.error('Error processing request:', error);
  }
  
  // For all other requests, serve the file as-is
  console.log('Serving static HTML for path:', urlPath);
  try {
    const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (readError) {
    console.error('Error reading HTML file:', readError);
    return res.status(500).send('Internal Server Error');
  }
};
