export interface Tool {
  id: string;
  name: string;
  price: number | null;
  download_url: string | null;
  type: string;
  category: string;
  brief_description: string | null;
  long_description: string | null;
  use_case_1: string | null;
  use_case_2: string | null;
  use_case_3: string | null;
  how_to_use: string | null;
  when_to_use: string | null;
  slug: string | null;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}