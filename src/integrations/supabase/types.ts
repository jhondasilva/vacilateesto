export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      access_requests: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      allowed_users: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      apify_metrics: {
        Row: {
          created_at: string | null
          external_id: string | null
          id: string
          metric_type: string
          platform: string
          raw_data: Json | null
          recorded_at: string | null
          unit: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          external_id?: string | null
          id?: string
          metric_type: string
          platform: string
          raw_data?: Json | null
          recorded_at?: string | null
          unit?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          external_id?: string | null
          id?: string
          metric_type?: string
          platform?: string
          raw_data?: Json | null
          recorded_at?: string | null
          unit?: string | null
          value?: number | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          body_md: string
          category: string
          created_at: string
          description: string
          faq: Json
          h1: string
          hero_image: string | null
          id: string
          keywords: string
          published_at: string
          reading_minutes: number
          slug: string
          source_video_ids: string[]
          speakable_summary: string | null
          status: string
          tags: string[]
          theme_key: string | null
          title: string
          tl_dr: string | null
          updated_at: string
        }
        Insert: {
          body_md: string
          category?: string
          created_at?: string
          description: string
          faq?: Json
          h1: string
          hero_image?: string | null
          id?: string
          keywords?: string
          published_at?: string
          reading_minutes?: number
          slug: string
          source_video_ids?: string[]
          speakable_summary?: string | null
          status?: string
          tags?: string[]
          theme_key?: string | null
          title: string
          tl_dr?: string | null
          updated_at?: string
        }
        Update: {
          body_md?: string
          category?: string
          created_at?: string
          description?: string
          faq?: Json
          h1?: string
          hero_image?: string | null
          id?: string
          keywords?: string
          published_at?: string
          reading_minutes?: number
          slug?: string
          source_video_ids?: string[]
          speakable_summary?: string | null
          status?: string
          tags?: string[]
          theme_key?: string | null
          title?: string
          tl_dr?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      brand_metricool_cache: {
        Row: {
          brand_slug: string
          id: string
          payload: Json
          period_from: string | null
          period_key: string
          period_label: string | null
          period_to: string | null
          refreshed_at: string
          scope: string
        }
        Insert: {
          brand_slug: string
          id?: string
          payload: Json
          period_from?: string | null
          period_key: string
          period_label?: string | null
          period_to?: string | null
          refreshed_at?: string
          scope: string
        }
        Update: {
          brand_slug?: string
          id?: string
          payload?: Json
          period_from?: string | null
          period_key?: string
          period_label?: string | null
          period_to?: string | null
          refreshed_at?: string
          scope?: string
        }
        Relationships: []
      }
      brand_reports: {
        Row: {
          brand_id: string
          content_items: Json
          created_at: string
          id: string
          pdf_url: string | null
          period_end: string | null
          period_label: string
          period_start: string | null
          platforms: Json
          summary: Json
          title: string
          top_posts: Json
          updated_at: string
        }
        Insert: {
          brand_id: string
          content_items?: Json
          created_at?: string
          id?: string
          pdf_url?: string | null
          period_end?: string | null
          period_label: string
          period_start?: string | null
          platforms?: Json
          summary?: Json
          title: string
          top_posts?: Json
          updated_at?: string
        }
        Update: {
          brand_id?: string
          content_items?: Json
          created_at?: string
          id?: string
          pdf_url?: string | null
          period_end?: string | null
          period_label?: string
          period_start?: string | null
          platforms?: Json
          summary?: Json
          title?: string
          top_posts?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_reports_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_users: {
        Row: {
          brand_id: string
          created_at: string
          display_name: string | null
          email: string
          id: string
          user_id: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          user_id?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_users_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          brand_color: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_color?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_color?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      calendar_settings: {
        Row: {
          color: string
          description: string
          id: string
          name: string
          singleton: boolean
          updated_at: string
        }
        Insert: {
          color?: string
          description?: string
          id?: string
          name?: string
          singleton?: boolean
          updated_at?: string
        }
        Update: {
          color?: string
          description?: string
          id?: string
          name?: string
          singleton?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      expense_reports: {
        Row: {
          ai_extracted: Json | null
          amount_original: number | null
          amount_usd: number
          category: string | null
          city_id: string | null
          created_at: string
          currency: string
          description: string | null
          expense_date: string
          id: string
          merchant: string | null
          notes: string | null
          paid_by: string
          payment_method: string
          receipt_url: string | null
          reporter_email: string
          reporter_name: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_extracted?: Json | null
          amount_original?: number | null
          amount_usd: number
          category?: string | null
          city_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          expense_date?: string
          id?: string
          merchant?: string | null
          notes?: string | null
          paid_by?: string
          payment_method?: string
          receipt_url?: string | null
          reporter_email: string
          reporter_name?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_extracted?: Json | null
          amount_original?: number | null
          amount_usd?: number
          category?: string | null
          city_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          expense_date?: string
          id?: string
          merchant?: string | null
          notes?: string | null
          paid_by?: string
          payment_method?: string
          receipt_url?: string | null
          reporter_email?: string
          reporter_name?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      host_stats: {
        Row: {
          avg_turn_length_seconds: number
          created_at: string
          display_name: string
          host_key: string
          id: string
          last_computed_at: string
          lexical_richness: number
          top_fillers: Json
          top_topics: Json
          top_words: Json
          total_seconds_spoken: number
          total_turns: number
          total_words: number
          unique_words: number
          updated_at: string
          videos_analyzed: number
        }
        Insert: {
          avg_turn_length_seconds?: number
          created_at?: string
          display_name: string
          host_key: string
          id?: string
          last_computed_at?: string
          lexical_richness?: number
          top_fillers?: Json
          top_topics?: Json
          top_words?: Json
          total_seconds_spoken?: number
          total_turns?: number
          total_words?: number
          unique_words?: number
          updated_at?: string
          videos_analyzed?: number
        }
        Update: {
          avg_turn_length_seconds?: number
          created_at?: string
          display_name?: string
          host_key?: string
          id?: string
          last_computed_at?: string
          lexical_richness?: number
          top_fillers?: Json
          top_topics?: Json
          top_words?: Json
          total_seconds_spoken?: number
          total_turns?: number
          total_words?: number
          unique_words?: number
          updated_at?: string
          videos_analyzed?: number
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      trip_activities: {
        Row: {
          activity_date: string | null
          activity_time: string | null
          activity_type: string
          airline: string | null
          arrival_time: string | null
          cabin_class: string | null
          city_id: string
          cost_breakdown: Json | null
          cost_estimate_usd: number | null
          cost_justification: string | null
          cost_usd: number | null
          created_at: string
          departure_time: string | null
          description: string | null
          duration: string | null
          flight_number: string | null
          id: string
          location: string | null
          metadata: Json | null
          position: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          activity_date?: string | null
          activity_time?: string | null
          activity_type: string
          airline?: string | null
          arrival_time?: string | null
          cabin_class?: string | null
          city_id: string
          cost_breakdown?: Json | null
          cost_estimate_usd?: number | null
          cost_justification?: string | null
          cost_usd?: number | null
          created_at?: string
          departure_time?: string | null
          description?: string | null
          duration?: string | null
          flight_number?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          position?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          activity_date?: string | null
          activity_time?: string | null
          activity_type?: string
          airline?: string | null
          arrival_time?: string | null
          cabin_class?: string | null
          city_id?: string
          cost_breakdown?: Json | null
          cost_estimate_usd?: number | null
          cost_justification?: string | null
          cost_usd?: number | null
          created_at?: string
          departure_time?: string | null
          description?: string | null
          duration?: string | null
          flight_number?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          position?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_activities_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "trip_cities"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_cities: {
        Row: {
          accommodation_address: string | null
          accommodation_name: string | null
          accommodation_notes: string | null
          accommodation_status: string
          booking_url: string | null
          city: string
          country: string | null
          created_at: string
          distance_to_airport_km: number | null
          distance_to_stadium_km: number | null
          end_date: string
          hotel_cost_usd: number | null
          hotel_price_range: string | null
          id: string
          nightly_rate_usd: number | null
          nights: number | null
          position: number
          start_date: string
          updated_at: string
          vibe: string | null
        }
        Insert: {
          accommodation_address?: string | null
          accommodation_name?: string | null
          accommodation_notes?: string | null
          accommodation_status?: string
          booking_url?: string | null
          city: string
          country?: string | null
          created_at?: string
          distance_to_airport_km?: number | null
          distance_to_stadium_km?: number | null
          end_date: string
          hotel_cost_usd?: number | null
          hotel_price_range?: string | null
          id?: string
          nightly_rate_usd?: number | null
          nights?: number | null
          position: number
          start_date: string
          updated_at?: string
          vibe?: string | null
        }
        Update: {
          accommodation_address?: string | null
          accommodation_name?: string | null
          accommodation_notes?: string | null
          accommodation_status?: string
          booking_url?: string | null
          city?: string
          country?: string | null
          created_at?: string
          distance_to_airport_km?: number | null
          distance_to_stadium_km?: number | null
          end_date?: string
          hotel_cost_usd?: number | null
          hotel_price_range?: string | null
          id?: string
          nightly_rate_usd?: number | null
          nights?: number | null
          position?: number
          start_date?: string
          updated_at?: string
          vibe?: string | null
        }
        Relationships: []
      }
      trip_comments: {
        Row: {
          activity_id: string | null
          author_email: string
          author_name: string | null
          city_id: string | null
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_id?: string | null
          author_email: string
          author_name?: string | null
          city_id?: string | null
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_id?: string | null
          author_email?: string
          author_name?: string | null
          city_id?: string | null
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_comments_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "trip_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_comments_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "trip_cities"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_settings: {
        Row: {
          bcv_to_usd_rate: number
          id: string
          updated_at: string
        }
        Insert: {
          bcv_to_usd_rate?: number
          id?: string
          updated_at?: string
        }
        Update: {
          bcv_to_usd_rate?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      trip_sponsors: {
        Row: {
          amount_usd_bcv: number
          category: string | null
          commission_pct: number
          created_at: string
          id: string
          name: string
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount_usd_bcv?: number
          category?: string | null
          commission_pct?: number
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount_usd_bcv?: number
          category?: string | null
          commission_pct?: number
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      yt_ingest_log: {
        Row: {
          created_at: string
          id: string
          message: string | null
          metadata: Json | null
          status: string
          video_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          status: string
          video_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          status?: string
          video_id?: string | null
        }
        Relationships: []
      }
      yt_speaker_snapshots: {
        Row: {
          id: string
          label: string
          seconds: number
          speaker: string
          taken_at: string
          turns: number
          video_id: string
          words: number
        }
        Insert: {
          id?: string
          label: string
          seconds?: number
          speaker: string
          taken_at?: string
          turns?: number
          video_id: string
          words?: number
        }
        Update: {
          id?: string
          label?: string
          seconds?: number
          speaker?: string
          taken_at?: string
          turns?: number
          video_id?: string
          words?: number
        }
        Relationships: []
      }
      yt_transcript_chunks: {
        Row: {
          chunk_index: number
          created_at: string
          embedding: string | null
          end_seconds: number
          id: string
          manual_override: boolean
          speaker: string | null
          speaker_confidence: number | null
          start_seconds: number
          text: string
          text_tsv: unknown
          video_id: string
        }
        Insert: {
          chunk_index: number
          created_at?: string
          embedding?: string | null
          end_seconds: number
          id?: string
          manual_override?: boolean
          speaker?: string | null
          speaker_confidence?: number | null
          start_seconds: number
          text: string
          text_tsv?: unknown
          video_id: string
        }
        Update: {
          chunk_index?: number
          created_at?: string
          embedding?: string | null
          end_seconds?: number
          id?: string
          manual_override?: boolean
          speaker?: string | null
          speaker_confidence?: number | null
          start_seconds?: number
          text?: string
          text_tsv?: unknown
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "yt_transcript_chunks_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "yt_videos"
            referencedColumns: ["video_id"]
          },
        ]
      }
      yt_videos: {
        Row: {
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          indexed_at: string | null
          kind: string
          published_at: string | null
          thumbnail_url: string | null
          title: string
          transcript_hash: string | null
          updated_at: string
          video_id: string
          view_count: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          indexed_at?: string | null
          kind: string
          published_at?: string | null
          thumbnail_url?: string | null
          title: string
          transcript_hash?: string | null
          updated_at?: string
          video_id: string
          view_count?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          indexed_at?: string | null
          kind?: string
          published_at?: string | null
          thumbnail_url?: string | null
          title?: string
          transcript_hash?: string | null
          updated_at?: string
          video_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apify_metrics_by_month: {
        Args: { p_handle: string; p_platform: string }
        Returns: {
          comments: number
          key: string
          label: string
          last_sync: string
          likes: number
          shares: number
          videos: number
          views: number
        }[]
      }
      cleanup_duplicate_expense_reports: {
        Args: never
        Returns: {
          deleted_count: number
        }[]
      }
      get_diarization_status: {
        Args: { limit_count?: number }
        Returns: {
          chunks_with_speaker: number
          duration_seconds: number
          invitado_chunks: number
          jhon_chunks: number
          juan_chunks: number
          title: string
          total_chunks: number
          video_id: string
        }[]
      }
      get_videos_without_transcription: {
        Args: { limit_count?: number }
        Returns: {
          duration_seconds: number
          title: string
          video_id: string
        }[]
      }
      is_allowed_user: { Args: never; Returns: boolean }
      is_brand_client: { Args: never; Returns: boolean }
      user_has_brand_access: { Args: { _brand_id: string }; Returns: boolean }
      yt_episode_speaker_compare: {
        Args: { p_label: string }
        Returns: {
          published_at: string
          seconds_after: number
          seconds_before: number
          speaker: string
          thumbnail_url: string
          title: string
          video_id: string
          words_after: number
          words_before: number
        }[]
      }
      yt_episode_speaker_stats: {
        Args: { p_video_id?: string }
        Returns: {
          published_at: string
          seconds: number
          speaker: string
          thumbnail_url: string
          title: string
          turns: number
          video_id: string
          words: number
        }[]
      }
      yt_search_chunks: {
        Args: {
          filter_kind?: string
          match_count?: number
          query_embedding: string
        }
        Returns: {
          chunk_id: string
          end_seconds: number
          kind: string
          published_at: string
          similarity: number
          start_seconds: number
          text: string
          thumbnail_url: string
          title: string
          video_id: string
        }[]
      }
      yt_search_chunks_fts: {
        Args: { filter_kind?: string; match_count?: number; query_text: string }
        Returns: {
          chunk_id: string
          end_seconds: number
          kind: string
          published_at: string
          rank: number
          start_seconds: number
          text: string
          thumbnail_url: string
          title: string
          video_id: string
        }[]
      }
      yt_search_chunks_grouped: {
        Args: {
          filter_kind?: string
          match_count?: number
          per_video_limit?: number
          query_text: string
        }
        Returns: {
          best_rank: number
          chunks: Json
          kind: string
          match_count_total: number
          published_at: string
          thumbnail_url: string
          title: string
          video_id: string
        }[]
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
    Enums: {},
  },
} as const
