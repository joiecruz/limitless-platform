# Content Import Script

This script helps you bulk import content into your Sanity.io CMS. It's particularly useful when migrating content from another platform or when you need to import multiple blog posts at once.

## Prerequisites

1. Node.js installed on your system
2. A Sanity.io project set up with the blog schema
3. A Sanity API token with write access (you can create one in your project's settings)

## Setup

1. Create a `.env` file in the root of your project and add your Sanity API token:
   ```
   SANITY_API_TOKEN=your_token_here
   ```

2. Create a `content` directory in the root of your project to store your content files:
   ```
   mkdir content
   ```

3. Install the required dependencies:
   ```bash
   npm install @sanity/client fs path dotenv
   ```

## Content Structure

Create JSON files for each blog post you want to import. Place them in the `content` directory. Each file should follow this structure:

```json
{
  "title": "My Blog Post",
  "slug": "my-blog-post",
  "excerpt": "A brief description of the post",
  "body": [
    {
      "_type": "block",
      "children": [
        {
          "_type": "span",
          "text": "The content of the post..."
        }
      ]
    }
  ],
  "imagePath": "./images/my-image.jpg",
  "publishedAt": "2024-03-30T12:00:00Z",
  "author": "author-reference-id",
  "categories": ["category-reference-id-1", "category-reference-id-2"],
  "tags": ["tag-reference-id-1", "tag-reference-id-2"]
}
```

### Notes:
- `imagePath` is optional. If provided, it should point to an image file relative to the content directory
- `author`, `categories`, and `tags` are optional. If provided, they should be reference IDs from your Sanity dataset
- The `body` field uses Portable Text format. You can use the [Sanity Block Content to HTML](https://www.sanity.io/docs/block-content-to-html) tool to convert HTML or Markdown to this format

## Running the Import

1. Compile the TypeScript file:
   ```bash
   tsc scripts/import-content.ts
   ```

2. Run the script:
   ```bash
   node scripts/import-content.js
   ```

The script will:
1. Read all JSON files in the content directory
2. Upload any referenced images to Sanity
3. Create or update blog posts in your Sanity dataset
4. Log the progress and any errors that occur

## Error Handling

The script includes error handling for:
- Invalid JSON files
- Failed image uploads
- Failed post creation/updates
- Missing required fields

If an error occurs during import, the script will:
1. Log the error details
2. Continue with the next file (if possible)
3. Exit with a non-zero status code if any critical errors occur

## Tips

1. Start with a small batch of posts to test the import process
2. Make sure your content files are properly formatted JSON
3. Keep track of the reference IDs for authors, categories, and tags
4. Back up your Sanity dataset before running large imports
5. Monitor the Sanity API rate limits if importing many posts 