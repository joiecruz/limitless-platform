import { RichTextContent } from "./contentful";

export interface HomepageFields {
  title: string;
  subtitle?: string;
  description?: RichTextContent;
  heroImage?: {
    fields: {
      file: {
        url: string;
      };
      title: string;
    };
  };
}