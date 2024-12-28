export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface Hero {
  _type: 'hero';
  title: string;
  subtitle?: string;
  image?: SanityImage;
  cta?: {
    text: string;
    link: string;
  };
}

export interface Feature {
  _type: 'feature';
  title: string;
  description: string;
  icon?: string;
}

export interface Page {
  title: string;
  slug: {
    current: string;
  };
  content: (Hero | Feature)[];
}