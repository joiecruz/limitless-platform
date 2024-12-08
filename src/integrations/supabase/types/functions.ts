import { Json } from '../types';

export interface Functions {
  create_workspace_with_owner: {
    Args: {
      workspace_name: string;
      workspace_slug: string;
      owner_id: string;
    };
    Returns: Json;
  };
  is_workspace_admin: {
    Args: {
      workspace_id: string;
    };
    Returns: boolean;
  };
}