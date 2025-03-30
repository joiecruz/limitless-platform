
import { sanityClient } from './client';
import { SanityCaseStudy } from './types';

// Fetch all case studies
export async function getAllCaseStudies(): Promise<SanityCaseStudy[]> {
  return sanityClient.fetch(`
    *[_type == "caseStudy" && defined(slug.current)] | order(_createdAt desc) {
      _id,
      _createdAt,
      name,
      slug,
      description,
      coverImage,
      client,
      services,
      sdgs
    }
  `);
}

// Fetch a single case study by slug
export async function getCaseStudyBySlug(slug: string): Promise<SanityCaseStudy> {
  return sanityClient.fetch(`
    *[_type == "caseStudy" && slug.current == $slug][0] {
      _id,
      _createdAt,
      name,
      slug,
      description,
      coverImage,
      additionalImage1,
      additionalImage2,
      client,
      services,
      sdgs,
      problemOpportunity,
      approach,
      impact,
      quoteFromCustomer
    }
  `, { slug });
}
