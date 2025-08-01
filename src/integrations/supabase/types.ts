export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          categories: string[] | null
          content: string
          cover_image: string | null
          created_at: string
          created_by: string | null
          excerpt: string | null
          id: string
          published: boolean | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          categories?: string[] | null
          content: string
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          categories?: string[] | null
          content?: string
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "articles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      case_studies: {
        Row: {
          additional_photo1: string | null
          additional_photo2: string | null
          approach: string | null
          client: string | null
          cover_photo: string | null
          created_at: string
          description: string | null
          id: string
          impact: string | null
          name: string
          problem_opportunity: string | null
          quote_from_customer: string | null
          sdgs: string[] | null
          services: string[] | null
          slug: string
          updated_at: string
        }
        Insert: {
          additional_photo1?: string | null
          additional_photo2?: string | null
          approach?: string | null
          client?: string | null
          cover_photo?: string | null
          created_at?: string
          description?: string | null
          id?: string
          impact?: string | null
          name: string
          problem_opportunity?: string | null
          quote_from_customer?: string | null
          sdgs?: string[] | null
          services?: string[] | null
          slug: string
          updated_at?: string
        }
        Update: {
          additional_photo1?: string | null
          additional_photo2?: string | null
          approach?: string | null
          client?: string | null
          cover_photo?: string | null
          created_at?: string
          description?: string | null
          id?: string
          impact?: string | null
          name?: string
          problem_opportunity?: string | null
          quote_from_customer?: string | null
          sdgs?: string[] | null
          services?: string[] | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      channels: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          read_only: boolean | null
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          read_only?: boolean | null
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          read_only?: boolean | null
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "channels_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      client_logos: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          image_url: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          image_url: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_logos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_logos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "client_logos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      content_dependencies: {
        Row: {
          content_id: string
          created_at: string
          dependency_type: string | null
          depends_on_content_id: string | null
          updated_at: string | null
        }
        Insert: {
          content_id: string
          created_at?: string
          dependency_type?: string | null
          depends_on_content_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content_id?: string
          created_at?: string
          dependency_type?: string | null
          depends_on_content_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_dependencies_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: true
            referencedRelation: "stage_contents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_dependencies_depends_on_content_id_fkey"
            columns: ["depends_on_content_id"]
            isOneToOne: false
            referencedRelation: "stage_contents"
            referencedColumns: ["id"]
          },
        ]
      }
      content_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          methodology_id: string | null
          stage_id: string | null
          step_id: string | null
          template_structure: Json | null
          template_type: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          methodology_id?: string | null
          stage_id?: string | null
          step_id?: string | null
          template_structure?: Json | null
          template_type: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          methodology_id?: string | null
          stage_id?: string | null
          step_id?: string | null
          template_structure?: Json | null
          template_type?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_templates_methodology_id_fkey"
            columns: ["methodology_id"]
            isOneToOne: false
            referencedRelation: "methodologies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_templates_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_templates_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "stage_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          booking_link: string | null
          course_curriculum_text: string | null
          created_at: string
          description: string | null
          enrollee_count: number | null
          format: string
          id: string
          image_url: string | null
          learning_outcomes: string | null
          lesson_count: number | null
          locked: boolean | null
          long_description: string | null
          price: number | null
          title: string
          updated_at: string
          who_is_this_for: string | null
        }
        Insert: {
          booking_link?: string | null
          course_curriculum_text?: string | null
          created_at?: string
          description?: string | null
          enrollee_count?: number | null
          format?: string
          id?: string
          image_url?: string | null
          learning_outcomes?: string | null
          lesson_count?: number | null
          locked?: boolean | null
          long_description?: string | null
          price?: number | null
          title: string
          updated_at?: string
          who_is_this_for?: string | null
        }
        Update: {
          booking_link?: string | null
          course_curriculum_text?: string | null
          created_at?: string
          description?: string | null
          enrollee_count?: number | null
          format?: string
          id?: string
          image_url?: string | null
          learning_outcomes?: string | null
          lesson_count?: number | null
          locked?: boolean | null
          long_description?: string | null
          price?: number | null
          title?: string
          updated_at?: string
          who_is_this_for?: string | null
        }
        Relationships: []
      }
      design_challenges: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          status: string
          title: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "design_challenges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "design_challenges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "design_challenges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "design_challenges_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_lessons: string[] | null
          course_id: string
          created_at: string
          id: string
          progress: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_lessons?: string[] | null
          course_id: string
          created_at?: string
          id?: string
          progress?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_lessons?: string[] | null
          course_id?: string
          created_at?: string
          id?: string
          progress?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          timestamp?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      idea_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          idea_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          idea_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          idea_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_comments_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_likes: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_likes_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          content: string
          created_at: string
          id: string
          project_id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          project_id: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ideas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      innovation_tools: {
        Row: {
          brief_description: string | null
          category: string
          cover_image: string | null
          created_at: string
          download_url: string | null
          downloads_count: number | null
          how_to_use: string | null
          id: string
          long_description: string | null
          name: string
          price: number | null
          slug: string | null
          type: string
          updated_at: string
          use_case_1: string | null
          use_case_2: string | null
          use_case_3: string | null
          when_to_use: string | null
        }
        Insert: {
          brief_description?: string | null
          category?: string
          cover_image?: string | null
          created_at?: string
          download_url?: string | null
          downloads_count?: number | null
          how_to_use?: string | null
          id?: string
          long_description?: string | null
          name: string
          price?: number | null
          slug?: string | null
          type: string
          updated_at?: string
          use_case_1?: string | null
          use_case_2?: string | null
          use_case_3?: string | null
          when_to_use?: string | null
        }
        Update: {
          brief_description?: string | null
          category?: string
          cover_image?: string | null
          created_at?: string
          download_url?: string | null
          downloads_count?: number | null
          how_to_use?: string | null
          id?: string
          long_description?: string | null
          name?: string
          price?: number | null
          slug?: string | null
          type?: string
          updated_at?: string
          use_case_1?: string | null
          use_case_2?: string | null
          use_case_3?: string | null
          when_to_use?: string | null
        }
        Relationships: []
      }
      issue_reports: {
        Row: {
          admin_notes: string | null
          attachment_url: string | null
          category: string | null
          created_at: string
          description: string
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          attachment_url?: string | null
          category?: string | null
          created_at?: string
          description: string
          id?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          attachment_url?: string | null
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "issue_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      lessons: {
        Row: {
          body_content: string | null
          course_id: string
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          order: number
          release_date: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          body_content?: string | null
          course_id: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          order: number
          release_date?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          body_content?: string | null
          course_id?: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          order?: number
          release_date?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      master_trainer_access: {
        Row: {
          created_at: string
          granted_by: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      master_trainer_faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          order_index: number | null
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      master_trainer_invitations: {
        Row: {
          created_at: string
          email: string
          id: string
          invited_by: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          invited_by: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          invited_by?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      master_trainer_materials: {
        Row: {
          category: string
          created_at: string
          description: string | null
          download_count: number | null
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          is_active: boolean | null
          title: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      master_trainer_profiles: {
        Row: {
          bio: string | null
          contact_info: Json | null
          created_at: string
          email: string
          expertise_areas: string[] | null
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          profile_image_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          contact_info?: Json | null
          created_at?: string
          email: string
          expertise_areas?: string[] | null
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          profile_image_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          contact_info?: Json | null
          created_at?: string
          email?: string
          expertise_areas?: string[] | null
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          profile_image_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      master_trainer_recordings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration: number | null
          id: string
          is_active: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          uploaded_by: string
          video_url: string
          view_count: number | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          uploaded_by: string
          video_url: string
          view_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string
          video_url?: string
          view_count?: number | null
        }
        Relationships: []
      }
      master_trainer_targets: {
        Row: {
          created_at: string
          depth_training_current: number
          depth_training_target: number
          hour_of_code_current: number
          hour_of_code_target: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          depth_training_current?: number
          depth_training_target?: number
          hour_of_code_current?: number
          hour_of_code_target?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          depth_training_current?: number
          depth_training_target?: number
          hour_of_code_current?: number
          hour_of_code_target?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "message_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      messages: {
        Row: {
          channel_id: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      methodologies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      methodology_stages: {
        Row: {
          created_at: string | null
          id: string
          methodology_id: string
          order_index: number | null
          stage_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          methodology_id?: string
          order_index?: number | null
          stage_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          methodology_id?: string
          order_index?: number | null
          stage_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "methodology_stages_methodology_id_fkey"
            columns: ["methodology_id"]
            isOneToOne: false
            referencedRelation: "methodologies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "methodology_stages_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: Json
          created_at: string
          created_by: string | null
          id: string
          meta_description: string | null
          published: boolean | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          meta_description?: string | null
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          meta_description?: string | null
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "pages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_size: string | null
          created_at: string
          email: string
          first_name: string | null
          goals: string | null
          id: string
          is_admin: boolean | null
          is_superadmin: boolean | null
          last_name: string | null
          referral_source: string | null
          role: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_size?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          goals?: string | null
          id: string
          is_admin?: boolean | null
          is_superadmin?: boolean | null
          last_name?: string | null
          referral_source?: string | null
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_size?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          goals?: string | null
          id?: string
          is_admin?: boolean | null
          is_superadmin?: boolean | null
          last_name?: string | null
          referral_source?: string | null
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      project_members: {
        Row: {
          created_at: string
          id: string
          project_id: string | null
          responsibilities: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          project_id?: string | null
          responsibilities?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string | null
          responsibilities?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "project_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          project_id: string | null
          started_at: string | null
          status: string | null
          updated_at: string
          workflow_phase_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          project_id?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string
          workflow_phase_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          project_id?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string
          workflow_phase_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_phases_workflow_phase_id_fkey"
            columns: ["workflow_phase_id"]
            isOneToOne: false
            referencedRelation: "workflow_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      project_stages: {
        Row: {
          completed_at: string | null
          content_status: string | null
          created_at: string
          id: string
          project_id: string | null
          stage_id: string | null
          started_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          content_status?: string | null
          created_at?: string
          id?: string
          project_id?: string | null
          stage_id?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          content_status?: string | null
          created_at?: string
          id?: string
          project_id?: string | null
          stage_id?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_stages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_stages_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      project_step_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          step_content_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          step_content_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          step_content_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_step_comments_step_content_id_fkey"
            columns: ["step_content_id"]
            isOneToOne: false
            referencedRelation: "project_step_content"
            referencedColumns: ["id"]
          },
        ]
      }
      project_step_content: {
        Row: {
          comments_count: number | null
          content: Json
          created_at: string
          created_by: string | null
          id: string
          is_latest: boolean | null
          phase_step_id: string | null
          project_id: string | null
          updated_at: string
          version: number | null
          votes: number | null
        }
        Insert: {
          comments_count?: number | null
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_latest?: boolean | null
          phase_step_id?: string | null
          project_id?: string | null
          updated_at?: string
          version?: number | null
          votes?: number | null
        }
        Update: {
          comments_count?: number | null
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_latest?: boolean | null
          phase_step_id?: string | null
          project_id?: string | null
          updated_at?: string
          version?: number | null
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_step_content_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_step_content_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "project_step_content_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "project_step_content_phase_step_id_fkey"
            columns: ["phase_step_id"]
            isOneToOne: false
            referencedRelation: "workflow_phase_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_step_content_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_step_votes: {
        Row: {
          created_at: string
          id: string
          step_content_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          step_content_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          step_content_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_step_votes_step_content_id_fkey"
            columns: ["step_content_id"]
            isOneToOne: false
            referencedRelation: "project_step_content"
            referencedColumns: ["id"]
          },
        ]
      }
      project_steps: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          content_status: string | null
          created_at: string
          id: string
          project_id: string | null
          started_at: string | null
          status: string | null
          step_id: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          content_status?: string | null
          created_at?: string
          id?: string
          project_id?: string | null
          started_at?: string | null
          status?: string | null
          step_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          content_status?: string | null
          created_at?: string
          id?: string
          project_id?: string | null
          started_at?: string | null
          status?: string | null
          step_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_steps_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_steps_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "project_steps_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "project_steps_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "stage_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          archived: boolean | null
          background_color: string | null
          cover_image: string | null
          created_at: string
          current_stage_id: string | null
          description: string | null
          end_date: string | null
          icon_name: string | null
          id: string
          metadata: Json | null
          methodology_id: string | null
          name: string
          owner_id: string | null
          start_date: string | null
          status: string | null
          title: string | null
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          archived?: boolean | null
          background_color?: string | null
          cover_image?: string | null
          created_at?: string
          current_stage_id?: string | null
          description?: string | null
          end_date?: string | null
          icon_name?: string | null
          id?: string
          metadata?: Json | null
          methodology_id?: string | null
          name: string
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          archived?: boolean | null
          background_color?: string | null
          cover_image?: string | null
          created_at?: string
          current_stage_id?: string | null
          description?: string | null
          end_date?: string | null
          icon_name?: string | null
          id?: string
          metadata?: Json | null
          methodology_id?: string | null
          name?: string
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_current_stage_id_fkey"
            columns: ["current_stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_methodology_id_fkey"
            columns: ["methodology_id"]
            isOneToOne: false
            referencedRelation: "methodologies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          ended_at: string | null
          id: string
          started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          started_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stage_contents: {
        Row: {
          content_data: Json | null
          created_at: string
          created_by: string | null
          id: string
          project_id: string | null
          stage_id: string | null
          template_id: string | null
          updated_at: string | null
          updated_by: string | null
          version: number | null
        }
        Insert: {
          content_data?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          project_id?: string | null
          stage_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
        }
        Update: {
          content_data?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          project_id?: string | null
          stage_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_steps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_contents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_contents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "stage_contents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "stage_contents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_contents_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_contents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "content_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_contents_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_contents_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "stage_contents_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      stage_steps: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string | null
          order_index: number | null
          stage_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          order_index?: number | null
          stage_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          order_index?: number | null
          stage_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stage_steps_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      step_contents: {
        Row: {
          content_data: Json | null
          created_at: string
          created_by: string | null
          id: string
          project_id: string | null
          step_id: string | null
          template_id: string | null
          updated_at: string | null
          updated_by: string | null
          version: number | null
        }
        Insert: {
          content_data?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          project_id?: string | null
          step_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
        }
        Update: {
          content_data?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          project_id?: string | null
          step_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "step_contents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step_contents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "step_contents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "step_contents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step_contents_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "stage_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step_contents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "content_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step_contents_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step_contents_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "step_contents_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      step_templates: {
        Row: {
          config: Json | null
          created_at: string
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      sticky_notes: {
        Row: {
          challenge_id: string | null
          color: string
          content: string
          created_at: string
          created_by: string | null
          id: string
          position_x: number
          position_y: number
          updated_at: string
        }
        Insert: {
          challenge_id?: string | null
          color?: string
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          position_x?: number
          position_y?: number
          updated_at?: string
        }
        Update: {
          challenge_id?: string | null
          color?: string
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          position_x?: number
          position_y?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sticky_notes_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "design_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sticky_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sticky_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "sticky_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      testimonials: {
        Row: {
          body: string
          created_at: string
          id: string
          name: string
          photo_url: string | null
          role: string
          type: string | null
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          role: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          role?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      toolkit_items: {
        Row: {
          created_at: string
          description: string | null
          file_url: string
          id: string
          order_index: number | null
          title: string
          toolkit_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          order_index?: number | null
          title: string
          toolkit_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          order_index?: number | null
          title?: string
          toolkit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "toolkit_items_toolkit_id_fkey"
            columns: ["toolkit_id"]
            isOneToOne: false
            referencedRelation: "toolkits"
            referencedColumns: ["id"]
          },
        ]
      }
      toolkits: {
        Row: {
          about_this_tool: string | null
          category: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          how_to_use: string | null
          id: string
          name: string
          updated_at: string
          use_cases: string | null
          when_to_use: string | null
        }
        Insert: {
          about_this_tool?: string | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          how_to_use?: string | null
          id?: string
          name: string
          updated_at?: string
          use_cases?: string | null
          when_to_use?: string | null
        }
        Update: {
          about_this_tool?: string | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          how_to_use?: string | null
          id?: string
          name?: string
          updated_at?: string
          use_cases?: string | null
          when_to_use?: string | null
        }
        Relationships: []
      }
      training_reports: {
        Row: {
          affiliation_name: string
          affiliation_type: string
          attendance_sheet_url: string | null
          created_at: string
          educator_count: number
          id: string
          lgu: string
          parent_count: number
          photo_urls: string[] | null
          province: string
          region: string
          session_type: string
          total_participants: number
          trainer_full_name: string
          updated_at: string
          user_id: string
          workshop_date: string
          workshop_location: string
          youth_count: number
        }
        Insert: {
          affiliation_name: string
          affiliation_type: string
          attendance_sheet_url?: string | null
          created_at?: string
          educator_count: number
          id?: string
          lgu: string
          parent_count: number
          photo_urls?: string[] | null
          province: string
          region: string
          session_type: string
          total_participants: number
          trainer_full_name: string
          updated_at?: string
          user_id: string
          workshop_date: string
          workshop_location: string
          youth_count: number
        }
        Update: {
          affiliation_name?: string
          affiliation_type?: string
          attendance_sheet_url?: string | null
          created_at?: string
          educator_count?: number
          id?: string
          lgu?: string
          parent_count?: number
          photo_urls?: string[] | null
          province?: string
          region?: string
          session_type?: string
          total_participants?: number
          trainer_full_name?: string
          updated_at?: string
          user_id?: string
          workshop_date?: string
          workshop_location?: string
          youth_count?: number
        }
        Relationships: []
      }
      training_session_reports: {
        Row: {
          admin_notes: string | null
          affiliation_name: string
          affiliation_type: Database["public"]["Enums"]["affiliation_type_enum"]
          attendance_sheet_url: string | null
          created_at: string
          educator_count: number
          id: string
          lgu: string | null
          parent_count: number
          photos: string[] | null
          province: string | null
          region: string | null
          session_type: Database["public"]["Enums"]["session_type_enum"]
          status: Database["public"]["Enums"]["report_status_enum"]
          total_participants: number
          trainer_full_name: string
          updated_at: string
          user_id: string
          workshop_date: string
          workshop_location: string
          youth_count: number
        }
        Insert: {
          admin_notes?: string | null
          affiliation_name: string
          affiliation_type: Database["public"]["Enums"]["affiliation_type_enum"]
          attendance_sheet_url?: string | null
          created_at?: string
          educator_count?: number
          id?: string
          lgu?: string | null
          parent_count?: number
          photos?: string[] | null
          province?: string | null
          region?: string | null
          session_type: Database["public"]["Enums"]["session_type_enum"]
          status?: Database["public"]["Enums"]["report_status_enum"]
          total_participants: number
          trainer_full_name: string
          updated_at?: string
          user_id: string
          workshop_date: string
          workshop_location: string
          youth_count?: number
        }
        Update: {
          admin_notes?: string | null
          affiliation_name?: string
          affiliation_type?: Database["public"]["Enums"]["affiliation_type_enum"]
          attendance_sheet_url?: string | null
          created_at?: string
          educator_count?: number
          id?: string
          lgu?: string | null
          parent_count?: number
          photos?: string[] | null
          province?: string | null
          region?: string | null
          session_type?: Database["public"]["Enums"]["session_type_enum"]
          status?: Database["public"]["Enums"]["report_status_enum"]
          total_participants?: number
          trainer_full_name?: string
          updated_at?: string
          user_id?: string
          workshop_date?: string
          workshop_location?: string
          youth_count?: number
        }
        Relationships: []
      }
      user_course_access: {
        Row: {
          course_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_access_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "user_course_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      workflow_phase_steps: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_required: boolean | null
          metadata: Json | null
          name: string
          order_index: number
          phase_id: string | null
          step_template_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_required?: boolean | null
          metadata?: Json | null
          name: string
          order_index: number
          phase_id?: string | null
          step_template_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_required?: boolean | null
          metadata?: Json | null
          name?: string
          order_index?: number
          phase_id?: string | null
          step_template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_phase_steps_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "workflow_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_phase_steps_step_template_id_fkey"
            columns: ["step_template_id"]
            isOneToOne: false
            referencedRelation: "step_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_phases: {
        Row: {
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          name: string
          order_index: number
          updated_at: string
          workflow_template_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          order_index: number
          updated_at?: string
          workflow_template_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          order_index?: number
          updated_at?: string
          workflow_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_phases_workflow_template_id_fkey"
            columns: ["workflow_template_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_stages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string | null
          order_index: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          order_index?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          order_index?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      workflow_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workflow_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      workspace_course_access: {
        Row: {
          course_id: string
          created_at: string
          id: string
          workspace_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          workspace_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_course_access_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_course_access_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_domains: {
        Row: {
          created_at: string
          domain: string
          id: string
          updated_at: string
          verified: boolean | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          updated_at?: string
          verified?: boolean | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          updated_at?: string
          verified?: boolean | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_domains_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_invitations: {
        Row: {
          accepted_at: string | null
          batch_id: string | null
          created_at: string
          email: string
          email_verified: boolean | null
          emails: string[] | null
          expires_at: string
          id: string
          invited_by: string
          last_sent_at: string | null
          magic_link_token: string | null
          metadata: Json | null
          role: string
          status: string
          workspace_id: string
        }
        Insert: {
          accepted_at?: string | null
          batch_id?: string | null
          created_at?: string
          email: string
          email_verified?: boolean | null
          emails?: string[] | null
          expires_at?: string
          id?: string
          invited_by: string
          last_sent_at?: string | null
          magic_link_token?: string | null
          metadata?: Json | null
          role: string
          status?: string
          workspace_id: string
        }
        Update: {
          accepted_at?: string | null
          batch_id?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean | null
          emails?: string[] | null
          expires_at?: string
          id?: string
          invited_by?: string
          last_sent_at?: string | null
          magic_link_token?: string | null
          metadata?: Json | null
          role?: string
          status?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workspace_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workspace_invitations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          created_at: string
          last_active: string
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          last_active?: string
          role: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          last_active?: string
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      workspace_members_info: {
        Row: {
          email: string | null
          user_id: string | null
          workspace_id: string | null
          workspace_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members_materialized: {
        Row: {
          accepted_at: string | null
          display_status: string | null
          email: string | null
          expires_at: string | null
          first_name: string | null
          invitation_created_at: string | null
          invitation_id: string | null
          invitation_role: string | null
          invitation_status: string | null
          invited_by: string | null
          last_active: string | null
          last_name: string | null
          member_created_at: string | null
          member_role: string | null
          profile_id: string | null
          user_id: string | null
          workspace_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workspace_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members_with_invitations: {
        Row: {
          accepted_at: string | null
          display_status: string | null
          email: string | null
          expires_at: string | null
          first_name: string | null
          invitation_created_at: string | null
          invitation_id: string | null
          invitation_role: string | null
          invitation_status: string | null
          invited_by: string | null
          last_active: string | null
          last_name: string | null
          member_created_at: string | null
          member_role: string | null
          profile_id: string | null
          user_id: string | null
          workspace_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workspace_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_materialized"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_members_with_invitations"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_workspace_membership: {
        Args: { workspace_id_param: string }
        Returns: boolean
      }
      cleanup_expired_invitations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_workspace_with_owner: {
        Args: {
          workspace_name: string
          workspace_slug: string
          owner_id: string
        }
        Returns: Json
      }
      delete_user_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_current_user_admin_or_superadmin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_superadmin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_workspace_admin: {
        Args: { workspace_id: string }
        Returns: boolean
      }
      is_workspace_admin_or_owner: {
        Args: { workspace_id: string; user_id: string }
        Returns: boolean
      }
      is_workspace_member: {
        Args:
          | { workspace_id: string; user_id: string }
          | { workspace_id_param: string }
        Returns: boolean
      }
      is_workspace_member_secure: {
        Args: { workspace_id: string; user_id: string }
        Returns: boolean
      }
      refresh_workspace_members_materialized: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      affiliation_type_enum: "School" | "Community" | "Workplace" | "University"
      report_status_enum: "submitted" | "approved" | "rejected"
      session_type_enum: "hour_of_code" | "depth_training"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      affiliation_type_enum: ["School", "Community", "Workplace", "University"],
      report_status_enum: ["submitted", "approved", "rejected"],
      session_type_enum: ["hour_of_code", "depth_training"],
    },
  },
} as const
