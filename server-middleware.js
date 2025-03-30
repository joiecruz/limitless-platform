
// This file should be deployed as a serverless function or middleware on your hosting platform
// For Netlify, add it to your netlify/functions/ directory
// For Vercel, add it to your api/ directory

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Get the path from the request
  const { path: urlPath } = event;
  
  console.log('Processing request for path:', urlPath);
  
  try {
    // Handle blog posts
    if (urlPath.startsWith('/blog/') && urlPath !== '/blog/') {
      // Extract the slug from the URL
      const slug = urlPath.replace('/blog/', '');
      console.log('Handling blog post with slug:', slug);
      
      // First try to fetch data from Sanity directly
      try {
        const SANITY_PROJECT_ID = '42h9veeb';
        const SANITY_DATASET = 'production';
        const SANITY_API_VERSION = '2021-10-21';
        
        const response = await fetch(
          `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=*%5B_type%20%3D%3D%20%22post%22%20%26%26%20slug.current%20%3D%3D%20%22${slug}%22%5D%5B0%5D`,
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
          const htmlPath = path.join(__dirname, 'dist', 'index.html');
          console.log('Reading HTML file from:', htmlPath);
          let html = fs.readFileSync(htmlPath, 'utf8');
          
          // Get the image URL
          let imageUrl = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png";
          if (post.mainImage) {
            const imageId = post.mainImage.asset._ref;
            const dimensions = imageId.split('-')[1];
            const format = imageId.split('-')[2];
            imageUrl = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${imageId.split('-')[0]}-${dimensions}.${format}`;
          }
          
          // Replace OpenGraph tags with dynamic content
          html = html.replace(/<meta property="og:title" content="[^"]*"/, 
                            `<meta property="og:title" content="${post.title} | Limitless Lab"`);
          
          html = html.replace(/<meta property="og:description" content="[^"]*"/, 
                            `<meta property="og:description" content="${post.excerpt || post.title}"`);
          
          html = html.replace(/<meta property="og:image" content="[^"]*"/, 
                            `<meta property="og:image" content="${imageUrl}"`);
          
          html = html.replace(/<meta property="og:url" content="[^"]*"/, 
                            `<meta property="og:url" content="https://limitlesslab.org/blog/${slug}"`);
          
          html = html.replace(/<meta property="og:type" content="[^"]*"/, 
                            `<meta property="og:type" content="article"`);
          
          html = html.replace(/<title>[^<]*<\/title>/, 
                            `<title>${post.title} | Limitless Lab</title>`);
                            
          html = html.replace(/<meta name="description" content="[^"]*"/, 
                            `<meta name="description" content="${post.excerpt || post.title}"`);
          
          // Add Twitter card tags if not present
          if (!html.includes('twitter:card')) {
            const headEnd = html.indexOf('</head>');
            const twitterTags = `
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="${post.title} | Limitless Lab" />
              <meta name="twitter:description" content="${post.excerpt || post.title}" />
              <meta name="twitter:image" content="${imageUrl}" />
            `;
            html = html.slice(0, headEnd) + twitterTags + html.slice(headEnd);
          }
          
          console.log('Successfully injected blog metadata from Sanity');
          
          // Return the modified HTML
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'text/html',
            },
            body: html,
          };
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
          const htmlPath = path.join(__dirname, 'dist', 'index.html');
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
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'text/html',
            },
            body: html,
          };
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
    const htmlPath = path.join(__dirname, 'dist', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: html,
    };
  } catch (readError) {
    console.error('Error reading HTML file:', readError);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
