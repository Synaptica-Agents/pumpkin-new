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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      case_math_explanation_templates: {
        Row: {
          active: boolean
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation_text: string
          id: string
          match_rule: string
          priority: number
          task_type: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation_text: string
          id?: string
          match_rule: string
          priority?: number
          task_type: string
        }
        Update: {
          active?: boolean
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation_text?: string
          id?: string
          match_rule?: string
          priority?: number
          task_type?: string
        }
        Relationships: []
      }
      case_math_questions: {
        Row: {
          active: boolean
          answer_display: string | null
          answer_unit: string | null
          answer_value: number
          category: Database["public"]["Enums"]["case_math_category"]
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation: string | null
          id: string
          module: string
          question: string
          tags: string | null
          tolerance: number
        }
        Insert: {
          active?: boolean
          answer_display?: string | null
          answer_unit?: string | null
          answer_value: number
          category: Database["public"]["Enums"]["case_math_category"]
          created_at?: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          module?: string
          question: string
          tags?: string | null
          tolerance?: number
        }
        Update: {
          active?: boolean
          answer_display?: string | null
          answer_unit?: string | null
          answer_value?: number
          category?: Database["public"]["Enums"]["case_math_category"]
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          module?: string
          question?: string
          tags?: string | null
          tolerance?: number
        }
        Relationships: []
      }
      chart_cases: {
        Row: {
          active: boolean
          chart_data: Json
          chart_title: string | null
          chart_type: string
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          interpretation_hints: string | null
          prompt: string
          reference_answer: string | null
        }
        Insert: {
          active?: boolean
          chart_data: Json
          chart_title?: string | null
          chart_type: string
          created_at?: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          interpretation_hints?: string | null
          prompt: string
          reference_answer?: string | null
        }
        Update: {
          active?: boolean
          chart_data?: Json
          chart_title?: string | null
          chart_type?: string
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          interpretation_hints?: string | null
          prompt?: string
          reference_answer?: string | null
        }
        Relationships: []
      }
      creativity_cases: {
        Row: {
          active: boolean
          context_info: string | null
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          industry: string
          prompt: string
          reference_ideas: string | null
        }
        Insert: {
          active?: boolean
          context_info?: string | null
          created_at?: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          industry: string
          prompt: string
          reference_ideas?: string | null
        }
        Update: {
          active?: boolean
          context_info?: string | null
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          industry?: string
          prompt?: string
          reference_ideas?: string | null
        }
        Relationships: []
      }
      drill_attempts: {
        Row: {
          created_at: string
          difficulty: string | null
          drill_type: string
          id: string
          is_correct: boolean
          response_time_ms: number
          session_id: string | null
          task_type: string
          user_email: string
        }
        Insert: {
          created_at?: string
          difficulty?: string | null
          drill_type: string
          id?: string
          is_correct: boolean
          response_time_ms?: number
          session_id?: string | null
          task_type: string
          user_email: string
        }
        Update: {
          created_at?: string
          difficulty?: string | null
          drill_type?: string
          id?: string
          is_correct?: boolean
          response_time_ms?: number
          session_id?: string | null
          task_type?: string
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "drill_attempts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "drill_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      drill_sessions: {
        Row: {
          accuracy_percent: number
          correct_count: number
          created_at: string
          drill_type: string
          duration_seconds: number
          id: string
          total_count: number
          user_email: string
        }
        Insert: {
          accuracy_percent?: number
          correct_count?: number
          created_at?: string
          drill_type: string
          duration_seconds?: number
          id?: string
          total_count?: number
          user_email: string
        }
        Update: {
          accuracy_percent?: number
          correct_count?: number
          created_at?: string
          drill_type?: string
          duration_seconds?: number
          id?: string
          total_count?: number
          user_email?: string
        }
        Relationships: []
      }
      drill_tasks: {
        Row: {
          active: boolean
          answer_value: number | null
          category: Database["public"]["Enums"]["drill_category"]
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          rand_key: number
          task: string
          task_type: string | null
          tolerance: number
        }
        Insert: {
          active?: boolean
          answer_value?: number | null
          category: Database["public"]["Enums"]["drill_category"]
          created_at?: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          rand_key?: number
          task: string
          task_type?: string | null
          tolerance?: number
        }
        Update: {
          active?: boolean
          answer_value?: number | null
          category?: Database["public"]["Enums"]["drill_category"]
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          rand_key?: number
          task?: string
          task_type?: string | null
          tolerance?: number
        }
        Relationships: []
      }
      framework_cases: {
        Row: {
          active: boolean
          category: string
          context_info: string | null
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          prompt: string
          recommended_framework: string | null
          reference_solution: string | null
          reference_tree: Json | null
        }
        Insert: {
          active?: boolean
          category: string
          context_info?: string | null
          created_at?: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          prompt: string
          recommended_framework?: string | null
          reference_solution?: string | null
          reference_tree?: Json | null
        }
        Update: {
          active?: boolean
          category?: string
          context_info?: string | null
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          prompt?: string
          recommended_framework?: string | null
          reference_solution?: string | null
          reference_tree?: Json | null
        }
        Relationships: []
      }
      ib_questions: {
        Row: {
          active: boolean
          archetype: string
          company: string | null
          created_at: string
          difficulty_level: number
          id: string
          key_points: string[] | null
          optimal_answer: string
          prompt: string
          question_type: string
          topic: string
        }
        Insert: {
          active?: boolean
          archetype: string
          company?: string | null
          created_at?: string
          difficulty_level: number
          id?: string
          key_points?: string[] | null
          optimal_answer: string
          prompt: string
          question_type: string
          topic: string
        }
        Update: {
          active?: boolean
          archetype?: string
          company?: string | null
          created_at?: string
          difficulty_level?: number
          id?: string
          key_points?: string[] | null
          optimal_answer?: string
          prompt?: string
          question_type?: string
          topic?: string
        }
        Relationships: []
      }
      ib_sessions: {
        Row: {
          archetype_queue: string[]
          company: string | null
          current_archetype: string | null
          current_difficulty: number
          current_stage: string | null
          end_reason: string | null
          ended_at: string | null
          failed_topics: string[] | null
          final_content_score: number | null
          final_delivery_score: number | null
          final_feedback: Json | null
          final_structure_score: number | null
          id: string
          max_difficulty: number
          passed_topics: string[] | null
          started_at: string
          starting_difficulty: number
          topics: string[]
          user_email: string
          user_rating: number
        }
        Insert: {
          archetype_queue?: string[]
          company?: string | null
          current_archetype?: string | null
          current_difficulty: number
          current_stage?: string | null
          end_reason?: string | null
          ended_at?: string | null
          failed_topics?: string[] | null
          final_content_score?: number | null
          final_delivery_score?: number | null
          final_feedback?: Json | null
          final_structure_score?: number | null
          id?: string
          max_difficulty: number
          passed_topics?: string[] | null
          started_at?: string
          starting_difficulty: number
          topics: string[]
          user_email: string
          user_rating: number
        }
        Update: {
          archetype_queue?: string[]
          company?: string | null
          current_archetype?: string | null
          current_difficulty?: number
          current_stage?: string | null
          end_reason?: string | null
          ended_at?: string | null
          failed_topics?: string[] | null
          final_content_score?: number | null
          final_delivery_score?: number | null
          final_feedback?: Json | null
          final_structure_score?: number | null
          id?: string
          max_difficulty?: number
          passed_topics?: string[] | null
          started_at?: string
          starting_difficulty?: number
          topics?: string[]
          user_email?: string
          user_rating?: number
        }
        Relationships: []
      }
      ib_turns: {
        Row: {
          archetype: string | null
          archetype_stage: string | null
          bot_audio_storage_path: string | null
          bot_generation_time_ms: number | null
          bot_response: string | null
          created_at: string
          difficulty_level: number | null
          id: string
          judge_missing_points: string[] | null
          judge_rationale: string | null
          judge_verdict: string | null
          moved_to_next_archetype: boolean
          question_id: string | null
          session_id: string
          turn_index: number
          user_input_mode: string | null
          user_response_time_ms: number | null
          user_transcript: string | null
        }
        Insert: {
          archetype?: string | null
          archetype_stage?: string | null
          bot_audio_storage_path?: string | null
          bot_generation_time_ms?: number | null
          bot_response?: string | null
          created_at?: string
          difficulty_level?: number | null
          id?: string
          judge_missing_points?: string[] | null
          judge_rationale?: string | null
          judge_verdict?: string | null
          moved_to_next_archetype?: boolean
          question_id?: string | null
          session_id: string
          turn_index: number
          user_input_mode?: string | null
          user_response_time_ms?: number | null
          user_transcript?: string | null
        }
        Update: {
          archetype?: string | null
          archetype_stage?: string | null
          bot_audio_storage_path?: string | null
          bot_generation_time_ms?: number | null
          bot_response?: string | null
          created_at?: string
          difficulty_level?: number | null
          id?: string
          judge_missing_points?: string[] | null
          judge_rationale?: string | null
          judge_verdict?: string | null
          moved_to_next_archetype?: boolean
          question_id?: string | null
          session_id?: string
          turn_index?: number
          user_input_mode?: string | null
          user_response_time_ms?: number | null
          user_transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ib_turns_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "ib_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ib_turns_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      market_sizing_cases: {
        Row: {
          active: boolean
          allowed_methods: string
          category: string
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          expected_order_of_magnitude_max: number | null
          expected_order_of_magnitude_min: number | null
          id: string
          industry_tag: string
          key_assumptions_examples: string | null
          prompt: string
          reference_structure: string | null
          region: string
          target_metric: string
          unit_hint: string | null
        }
        Insert: {
          active?: boolean
          allowed_methods?: string
          category?: string
          created_at?: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          expected_order_of_magnitude_max?: number | null
          expected_order_of_magnitude_min?: number | null
          id?: string
          industry_tag: string
          key_assumptions_examples?: string | null
          prompt: string
          reference_structure?: string | null
          region?: string
          target_metric: string
          unit_hint?: string | null
        }
        Update: {
          active?: boolean
          allowed_methods?: string
          category?: string
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          expected_order_of_magnitude_max?: number | null
          expected_order_of_magnitude_min?: number | null
          id?: string
          industry_tag?: string
          key_assumptions_examples?: string | null
          prompt?: string
          reference_structure?: string | null
          region?: string
          target_metric?: string
          unit_hint?: string | null
        }
        Relationships: []
      }
      market_sizing_evaluations: {
        Row: {
          created_at: string
          feedback_json: Json
          flagged: boolean
          id: string
          scores_json: Json
          submission_id: string
          total_score: number
        }
        Insert: {
          created_at?: string
          feedback_json?: Json
          flagged?: boolean
          id?: string
          scores_json?: Json
          submission_id: string
          total_score?: number
        }
        Update: {
          created_at?: string
          feedback_json?: Json
          flagged?: boolean
          id?: string
          scores_json?: Json
          submission_id?: string
          total_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "market_sizing_evaluations_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "market_sizing_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      market_sizing_rubric: {
        Row: {
          created_at: string
          id: string
          rubric_json: Json
          version: string
        }
        Insert: {
          created_at?: string
          id?: string
          rubric_json: Json
          version: string
        }
        Update: {
          created_at?: string
          id?: string
          rubric_json?: Json
          version?: string
        }
        Relationships: []
      }
      market_sizing_submissions: {
        Row: {
          answer_text: string
          case_id: string
          created_at: string
          final_estimate_unit: string | null
          final_estimate_value: number | null
          id: string
          input_mode: string
          session_id: string | null
          time_spent_sec: number
          user_email: string
        }
        Insert: {
          answer_text: string
          case_id: string
          created_at?: string
          final_estimate_unit?: string | null
          final_estimate_value?: number | null
          id?: string
          input_mode?: string
          session_id?: string | null
          time_spent_sec?: number
          user_email: string
        }
        Update: {
          answer_text?: string
          case_id?: string
          created_at?: string
          final_estimate_unit?: string | null
          final_estimate_value?: number | null
          id?: string
          input_mode?: string
          session_id?: string | null
          time_spent_sec?: number
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_sizing_submissions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "market_sizing_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      mental_math_explanation_templates: {
        Row: {
          active: boolean
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation_text: string
          id: string
          match_rule: string
          priority: number
          task_type: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation_text: string
          id?: string
          match_rule: string
          priority?: number
          task_type: string
        }
        Update: {
          active?: boolean
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation_text?: string
          id?: string
          match_rule?: string
          priority?: number
          task_type?: string
        }
        Relationships: []
      }
      mental_math_explanations: {
        Row: {
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation_text: string
          id: string
          task_type: string
          updated_at: string
        }
        Insert: {
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation_text: string
          id?: string
          task_type: string
          updated_at?: string
        }
        Update: {
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation_text?: string
          id?: string
          task_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      mental_math_questions: {
        Row: {
          active: boolean
          answer_display: string | null
          answer_value: number
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation: string | null
          id: string
          module: string
          number_format: string | null
          question: string
          tags: string | null
          task_type: Database["public"]["Enums"]["mental_math_task_type"]
          time_limit_sec: number | null
          tolerance: number
        }
        Insert: {
          active?: boolean
          answer_display?: string | null
          answer_value: number
          created_at?: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          module?: string
          number_format?: string | null
          question: string
          tags?: string | null
          task_type: Database["public"]["Enums"]["mental_math_task_type"]
          time_limit_sec?: number | null
          tolerance?: number
        }
        Update: {
          active?: boolean
          answer_display?: string | null
          answer_value?: number
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          module?: string
          number_format?: string | null
          question?: string
          tags?: string | null
          task_type?: Database["public"]["Enums"]["mental_math_task_type"]
          time_limit_sec?: number | null
          tolerance?: number
        }
        Relationships: []
      }
      text_drill_evaluations: {
        Row: {
          created_at: string
          feedback_json: Json
          flagged: boolean
          id: string
          scores_json: Json
          submission_id: string
          total_score: number
        }
        Insert: {
          created_at?: string
          feedback_json?: Json
          flagged?: boolean
          id?: string
          scores_json?: Json
          submission_id: string
          total_score?: number
        }
        Update: {
          created_at?: string
          feedback_json?: Json
          flagged?: boolean
          id?: string
          scores_json?: Json
          submission_id?: string
          total_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "text_drill_evaluations_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "text_drill_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      text_drill_submissions: {
        Row: {
          answer_text: string
          case_id: string
          created_at: string
          drill_type: string
          id: string
          session_id: string | null
          time_spent_sec: number
          user_email: string
        }
        Insert: {
          answer_text: string
          case_id: string
          created_at?: string
          drill_type: string
          id?: string
          session_id?: string | null
          time_spent_sec?: number
          user_email: string
        }
        Update: {
          answer_text?: string
          case_id?: string
          created_at?: string
          drill_type?: string
          id?: string
          session_id?: string | null
          time_spent_sec?: number
          user_email?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      case_math_category:
        | "profitability"
        | "investment_roi"
        | "break_even"
        | "market_sizing"
      difficulty_level: "easy" | "medium" | "hard"
      drill_category: "case_math" | "mental_math"
      mental_math_task_type:
        | "multiplication"
        | "percentage"
        | "division"
        | "zero_management"
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
      app_role: ["admin", "user"],
      case_math_category: [
        "profitability",
        "investment_roi",
        "break_even",
        "market_sizing",
      ],
      difficulty_level: ["easy", "medium", "hard"],
      drill_category: ["case_math", "mental_math"],
      mental_math_task_type: [
        "multiplication",
        "percentage",
        "division",
        "zero_management",
      ],
    },
  },
} as const
