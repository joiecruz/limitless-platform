
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
      
      // Fetch blog data from Sanity using the GROQ API
      const sanityQuery = encodeURIComponent(`*[_type == "post" && slug.current == "${slug}"][0]{
        title,
        excerpt,
        "imageUrl": mainImage.asset->url,
        publishedAt,
        meta_description
      }`);
      
      const sanityUrl = `https://bg9ersmx.api.sanity.io/v2023-05-03/data/query/production?query=${sanityQuery}`;
      
      const response = await fetch(sanityUrl);
      const result = await response.json();
      const post = result.result;
      
      if (post) {
        // Read the HTML file
        let html = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf8');
        
        // Replace OpenGraph tags with dynamic content
        html = html.replace(/<meta property="og:title" content="[^"]*"/, 
                        `<meta property="og:title" content="${post.title} | Limitless Lab"`);
        
        html = html.replace(/<meta property="og:description" content="[^"]*"/, 
                        `<meta property="og:description" content="${post.excerpt || post.meta_description || post.title.substring(0, 160)}"`);
        
        const imageUrl = post.imageUrl || 'https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png';
        html = html.replace(/<meta property="og:image" content="[^"]*"/, 
                        `<meta property="og:image" content="${imageUrl}"`);
        
        html = html.replace(/<meta property="og:url" content="[^"]*"/, 
                        `<meta property="og:url" content="https://limitlesslab.io/blog/${slug}"`);
        
        html = html.replace(/<meta property="og:type" content="[^"]*"/, 
                        `<meta property="og:type" content="article"`);
        
        html = html.replace(/<title>[^<]*<\/title>/, 
                        `<title>${post.title} | Limitless Lab</title>`);
                        
        html = html.replace(/<meta name="description" content="[^"]*"/, 
                        `<meta name="description" content="${post.excerpt || post.meta_description || post.title.substring(0, 160)}"`);
        
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
      console.error('Error fetching blog data from Sanity:', error);
    }
  }
  
  // For case studies, implement similar logic
  if (urlPath.startsWith('/case-studies/') && urlPath !== '/case-studies/') {
    try {
      // Extract the slug from the URL
      const slug = urlPath.replace('/case-studies/', '');
      
      // Fetch case study data from Sanity using the GROQ API
      const sanityQuery = encodeURIComponent(`*[_type == "caseStudy" && slug.current == "${slug}"][0]{
        name,
        description,
        "imageUrl": coverImage.asset->url
      }`);
      
      const sanityUrl = `https://bg9ersmx.api.sanity.io/v2023-05-03/data/query/production?query=${sanityQuery}`;
      
      const response = await fetch(sanityUrl);
      const result = await response.json();
      const caseStudy = result.result;
      
      if (caseStudy) {
        // Read the HTML file
        let html = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf8');
        
        // Replace OpenGraph tags with dynamic content
        html = html.replace(/<meta property="og:title" content="[^"]*"/, 
                        `<meta property="og:title" content="${caseStudy.name} | Limitless Lab"`);
        
        html = html.replace(/<meta property="og:description" content="[^"]*"/, 
                        `<meta property="og:description" content="${caseStudy.description}"`);
        
        const imageUrl = caseStudy.imageUrl || 'https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png';
        html = html.replace(/<meta property="og:image" content="[^"]*"/, 
                        `<meta property="og:image" content="${imageUrl}"`);
        
        html = html.replace(/<meta property="og:url" content="[^"]*"/, 
                        `<meta property="og:url" content="https://limitlesslab.io/case-studies/${slug}"`);
        
        html = html.replace(/<meta property="og:type" content="[^"]*"/, 
                        `<meta property="og:type" content="article"`);
        
        html = html.replace(/<title>[^<]*<\/title>/, 
                        `<title>${caseStudy.name} | Limitless Lab</title>`);
                        
        html = html.replace(/<meta name="description" content="[^"]*"/, 
                        `<meta name="description" content="${caseStudy.description}"`);
        
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
      console.error('Error fetching case study data from Sanity:', error);
    }
  }
  
  // For all other requests, serve the file as-is
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf8'),
  };
};
