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
      bookings: {
        Row: {
          checked_in_at: string | null
          created_at: string
          id: string
          in_game_id: string | null
          status: Database["public"]["Enums"]["booking_status"]
          tournament_id: string
          user_id: string
        }
        Insert: {
          checked_in_at?: string | null
          created_at?: string
          id?: string
          in_game_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          tournament_id: string
          user_id: string
        }
        Update: {
          checked_in_at?: string | null
          created_at?: string
          id?: string
          in_game_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          tournament_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      game_profiles: {
        Row: {
          created_at: string
          game: Database["public"]["Enums"]["game_type"]
          game_uid: string
          id: string
          nickname: string | null
          user_id: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          game: Database["public"]["Enums"]["game_type"]
          game_uid: string
          id?: string
          nickname?: string | null
          user_id: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          game?: Database["public"]["Enums"]["game_type"]
          game_uid?: string
          id?: string
          nickname?: string | null
          user_id?: string
          verified?: boolean
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          full_name: string | null
          game_id_bgmi: string | null
          game_id_fc: string | null
          game_id_freefire: string | null
          id: string
          language: string | null
          onboarded: boolean
          phone: string | null
          rank: string | null
          state: string | null
          timezone: string | null
          updated_at: string
          username: string | null
          verified: boolean
          wallet_coins: number
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          game_id_bgmi?: string | null
          game_id_fc?: string | null
          game_id_freefire?: string | null
          id: string
          language?: string | null
          onboarded?: boolean
          phone?: string | null
          rank?: string | null
          state?: string | null
          timezone?: string | null
          updated_at?: string
          username?: string | null
          verified?: boolean
          wallet_coins?: number
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          game_id_bgmi?: string | null
          game_id_fc?: string | null
          game_id_freefire?: string | null
          id?: string
          language?: string | null
          onboarded?: boolean
          phone?: string | null
          rank?: string | null
          state?: string | null
          timezone?: string | null
          updated_at?: string
          username?: string | null
          verified?: boolean
          wallet_coins?: number
          xp?: number
        }
        Relationships: []
      }
      rewards: {
        Row: {
          amount: number
          claimed: boolean
          created_at: string
          id: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          amount?: number
          claimed?: boolean
          created_at?: string
          id?: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          claimed?: boolean
          created_at?: string
          id?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          id: string
          message: string
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ticket_replies: {
        Row: {
          created_at: string
          id: string
          is_admin: boolean
          message: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_admin?: boolean
          message: string
          ticket_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_admin?: boolean
          message?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_winners: {
        Row: {
          created_at: string
          id: string
          prize_amount: number
          rank: number
          tournament_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prize_amount?: number
          rank: number
          tournament_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prize_amount?: number
          rank?: number
          tournament_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_winners_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          banner_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          end_at: string | null
          entry_fee: number
          game: Database["public"]["Enums"]["game_type"]
          id: string
          match_at: string
          mode: Database["public"]["Enums"]["tournament_mode"]
          prize_pool: number
          prize_split: Json
          region: string | null
          room_id: string | null
          room_password: string | null
          slots_left: number
          status: Database["public"]["Enums"]["tournament_status"]
          title: string
          total_slots: number
          winner_count: number
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_at?: string | null
          entry_fee?: number
          game: Database["public"]["Enums"]["game_type"]
          id?: string
          match_at: string
          mode?: Database["public"]["Enums"]["tournament_mode"]
          prize_pool?: number
          prize_split?: Json
          region?: string | null
          room_id?: string | null
          room_password?: string | null
          slots_left: number
          status?: Database["public"]["Enums"]["tournament_status"]
          title: string
          total_slots: number
          winner_count?: number
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_at?: string | null
          entry_fee?: number
          game?: Database["public"]["Enums"]["game_type"]
          id?: string
          match_at?: string
          mode?: Database["public"]["Enums"]["tournament_mode"]
          prize_pool?: number
          prize_split?: Json
          region?: string | null
          room_id?: string | null
          room_password?: string | null
          slots_left?: number
          status?: Database["public"]["Enums"]["tournament_status"]
          title?: string
          total_slots?: number
          winner_count?: number
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
      wallet_logs: {
        Row: {
          created_at: string
          delta: number
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delta: number
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          delta?: number
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      book_tournament: {
        Args: { _in_game_id: string; _tournament_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      mark_tournament_winners: {
        Args: { _tournament_id: string; _winners: Json }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "user"
      booking_status: "confirmed" | "checked_in" | "cancelled" | "won" | "lost"
      game_type: "freefire" | "bgmi" | "fc"
      ticket_status: "open" | "pending" | "resolved" | "closed"
      tournament_mode: "solo" | "duo" | "squad"
      tournament_status: "upcoming" | "live" | "completed" | "cancelled"
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
      booking_status: ["confirmed", "checked_in", "cancelled", "won", "lost"],
      game_type: ["freefire", "bgmi", "fc"],
      ticket_status: ["open", "pending", "resolved", "closed"],
      tournament_mode: ["solo", "duo", "squad"],
      tournament_status: ["upcoming", "live", "completed", "cancelled"],
    },
  },
} as const
