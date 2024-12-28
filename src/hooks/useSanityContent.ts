import { useQuery } from '@tanstack/react-query';
import { client } from '@/integrations/sanity/client';
import type { Page } from '@/integrations/sanity/types';

export const useSanityPage = (slug: string) => {
  return useQuery({
    queryKey: ['page', slug],
    queryFn: async () => {
      const query = `*[_type == "page" && slug.current == $slug][0]`;
      const page = await client.fetch<Page>(query, { slug });
      return page;
    },
  });
};

export const useSanityPages = () => {
  return useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const query = `*[_type == "page"] { title, slug }`;
      const pages = await client.fetch(query);
      return pages;
    },
  });
};