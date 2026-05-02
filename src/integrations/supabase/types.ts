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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_memory: {
        Row: {
          boundaries_needed: string[] | null
          key_triggers: string[] | null
          last_module_slug: string | null
          last_noticing: string | null
          last_question: string | null
          last_reflection: string | null
          next_steps: string[] | null
          pattern_type: string | null
          recommended_next: string | null
          repeated_behaviors: string[] | null
          summary: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          boundaries_needed?: string[] | null
          key_triggers?: string[] | null
          last_module_slug?: string | null
          last_noticing?: string | null
          last_question?: string | null
          last_reflection?: string | null
          next_steps?: string[] | null
          pattern_type?: string | null
          recommended_next?: string | null
          repeated_behaviors?: string[] | null
          summary?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          boundaries_needed?: string[] | null
          key_triggers?: string[] | null
          last_module_slug?: string | null
          last_noticing?: string | null
          last_question?: string | null
          last_reflection?: string | null
          next_steps?: string[] | null
          pattern_type?: string | null
          recommended_next?: string | null
          repeated_behaviors?: string[] | null
          summary?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          module_id: string
          options: Json | null
          position: number
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind: string
          module_id: string
          options?: Json | null
          position: number
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          module_id?: string
          options?: Json | null
          position?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      kit_resources: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          file_type: string | null
          id: string
          module: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          file_type?: string | null
          id?: string
          module: string
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          file_type?: string | null
          id?: string
          module?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          created_at: string
          id: string
          intro: string | null
          position: number
          slug: string
          subtitle: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          intro?: string | null
          position: number
          slug: string
          subtitle?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          intro?: string | null
          position?: number
          slug?: string
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          pattern_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          pattern_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          pattern_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount_total: number | null
          created_at: string
          currency: string | null
          environment: string
          has_access: boolean
          id: string
          price_id: string | null
          product_id: string | null
          refunded: boolean
          status: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_total?: number | null
          created_at?: string
          currency?: string | null
          environment?: string
          has_access?: boolean
          id?: string
          price_id?: string | null
          product_id?: string | null
          refunded?: boolean
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_total?: number | null
          created_at?: string
          currency?: string | null
          environment?: string
          has_access?: boolean
          id?: string
          price_id?: string | null
          product_id?: string | null
          refunded?: boolean
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          answer_data: Json | null
          answer_text: string | null
          exercise_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer_data?: Json | null
          answer_text?: string | null
          exercise_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer_data?: Json | null
          answer_text?: string | null
          exercise_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          id: string
          module_id: string
          started_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          module_id: string
          started_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          module_id?: string
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_paid_access: { Args: { _user_id: string }; Returns: boolean }
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
