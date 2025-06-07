export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
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
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          enrollee_count: number | null
          format: string
          id: string
          image_url: string | null
          learning_outcomes: string[] | null
          lesson_count: number | null
          locked: boolean | null
          long_description: string | null
          price: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enrollee_count?: number | null
          format?: string
          id?: string
          image_url?: string | null
          learning_outcomes?: string[] | null
          lesson_count?: number | null
          locked?: boolean | null
          long_description?: string | null
          price?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enrollee_count?: number | null
          format?: string
          id?: string
          image_url?: string | null
          learning_outcomes?: string[] | null
          lesson_count?: number | null
          locked?: boolean | null
          long_description?: string | null
          price?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
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
          project_id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          project_id: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          project_id?: string
          role?: string
          updated_at?: string
          user_id?: string
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
      projects: {
        Row: {
          archived: boolean | null
          background_color: string | null
          challenge_description: string | null
          challenge_statement: string | null
          cover_image: string | null
          created_at: string
          current_phase: string | null
          description: string | null
          due_date: string | null
          icon_name: string | null
          id: string
          metadata: Json | null
          name: string
          owner_id: string | null
          status: string | null
          title: string | null
          updated_at: string
          workflow_template_id: string | null
          workspace_id: string | null
        }
        Insert: {
          archived?: boolean | null
          background_color?: string | null
          challenge_description?: string | null
          challenge_statement?: string | null
          cover_image?: string | null
          created_at?: string
          current_phase?: string | null
          description?: string | null
          due_date?: string | null
          icon_name?: string | null
          id?: string
          metadata?: Json | null
          name: string
          owner_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          workflow_template_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          archived?: boolean | null
          background_color?: string | null
          challenge_description?: string | null
          challenge_statement?: string | null
          cover_image?: string | null
          created_at?: string
          current_phase?: string | null
          description?: string | null
          due_date?: string | null
          icon_name?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          owner_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          workflow_template_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_workflow_template_id_fkey"
            columns: ["workflow_template_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
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
      is_workspace_admin: {
        Args: { workspace_id: string }
        Returns: boolean
      }
      is_workspace_admin_or_owner: {
        Args: { workspace_id: string; user_id: string }
        Returns: boolean
      }
      is_workspace_member: {
        Args: { workspace_id: string; user_id: string }
        Returns: boolean
      }
      is_workspace_member_secure: {
        Args: { workspace_id: string; user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
