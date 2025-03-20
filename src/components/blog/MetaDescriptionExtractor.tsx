
interface MetaDescriptionExtractorProps {
  content: string | null | undefined;
  fallbackDescription: string;
}

export function extractMetaDescription(content: string | null | undefined, fallbackDescription: string = ''): string {
  if (!content) return fallbackDescription;
  
  try {
    // Remove any HTML tags and get clean text
    const cleanText = content.replace(/<[^>]*>/g, '');
    
    // Get first 2-3 sentences for description (better than just 160 characters)
    const sentences = cleanText.split(/[.!?]+/).filter(sentence => 
      sentence && sentence.trim().length > 0
    );
    
    let description = '';
    // Try to get 2-3 sentences depending on length
    if (sentences.length >= 2) {
      description = sentences.slice(0, sentences[0].length < 80 ? 3 : 2).join('. ').trim();
    } else {
      description = sentences[0] || '';
    }
    
    // Ensure it's not too long for meta description (120-160 chars is ideal)
    return description.length > 160 
      ? description.substring(0, 157) + '...' 
      : description;
  } catch (e) {
    console.error('Error extracting meta description:', e);
    return fallbackDescription;
  }
}

export function MetaDescriptionExtractor({ content, fallbackDescription }: MetaDescriptionExtractorProps) {
  // This is a utility component that doesn't render anything
  return null;
}
