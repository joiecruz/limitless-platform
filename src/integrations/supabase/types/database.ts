export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          meta_description?: string | null
          cover_image?: string | null
          published?: boolean
          created_at: string
          updated_at: string
          tags?: string[] | null
          categories?: string[] | null
          created_by?: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          meta_description?: string | null
          cover_image?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
          tags?: string[] | null
          categories?: string[] | null
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          meta_description?: string | null
          cover_image?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
          tags?: string[] | null
          categories?: string[] | null
          created_by?: string | null
        }
      }
      case_studies: {
        Row: {
          id: string
          name: string
          slug: string
          client?: string | null
          description?: string | null
          services?: string[] | null
          sdgs?: string[] | null
          problem_opportunity?: string | null
          approach?: string | null
          impact?: string | null
          quote_from_customer?: string | null
          cover_photo?: string | null
          additional_photo1?: string | null
          additional_photo2?: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          client?: string | null
          description?: string | null
          services?: string[] | null
          sdgs?: string[] | null
          problem_opportunity?: string | null
          approach?: string | null
          impact?: string | null
          quote_from_customer?: string | null
          cover_photo?: string | null
          additional_photo1?: string | null
          additional_photo2?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          client?: string | null
          description?: string | null
          services?: string[] | null
          sdgs?: string[] | null
          problem_opportunity?: string | null
          approach?: string | null
          impact?: string | null
          quote_from_customer?: string | null
          cover_photo?: string | null
          additional_photo1?: string | null
          additional_photo2?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      channels: {
        Row: {
          id: string
          name: string
          description: string | null
          is_public: boolean
          workspace_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_public?: boolean
          workspace_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_public?: boolean
          workspace_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string | null
          locked: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url?: string | null
          locked?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          locked?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          completed_lessons: string[]
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          completed_lessons?: string[]
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          completed_lessons?: string[]
          created_at?: string
          updated_at?: string | null
        }
      }
      lessons: {
        Row: {
          id: string
          title: string
          content: string | null
          course_id: string
          order: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          course_id: string
          order?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          course_id?: string
          order?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      message_reactions: {
        Row: {
          id: string
          message_id: string
          user_id: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          emoji?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          content: string | null
          user_id: string
          channel_id: string
          created_at: string
          updated_at: string | null
          image_url: string | null
        }
        Insert: {
          id?: string
          content?: string | null
          user_id: string
          channel_id: string
          created_at?: string
          updated_at?: string | null
          image_url?: string | null
        }
        Update: {
          id?: string
          content?: string | null
          user_id?: string
          channel_id?: string
          created_at?: string
          updated_at?: string | null
          image_url?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          first_name: string | null
          last_name: string | null
          username: string | null
          avatar_url: string | null
          bio: string | null
          is_superadmin: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          is_superadmin?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          is_superadmin?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          role?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Functions: {
      create_workspace_with_owner: {
        Args: {
          workspace_name: string
          workspace_slug: string
          owner_id: string
        }
        Returns: Json
      }
      is_workspace_admin: {
        Args: {
          workspace_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "member"
    }
  }
}
