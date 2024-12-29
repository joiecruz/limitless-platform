export interface ContentfulEntry<T> {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
  };
  fields: T;
  metadata: {
    tags: any[];
  };
}

export interface RichTextContent {
  nodeType: string;
  content: any[];
  data: any;
  value?: string;
}