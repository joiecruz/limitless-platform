
export interface Toolkit {
  id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface ToolkitItem {
  id: string;
  toolkit_id: string;
  title: string;
  file_url: string;
  description: string | null;
  order_index: number;
  created_at: string;
}

export interface ToolkitWithItems extends Toolkit {
  items: ToolkitItem[];
}
