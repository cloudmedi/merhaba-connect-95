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
      announcement_branches: {
        Row: {
          announcement_id: string
          branch_id: string
          created_at: string | null
        }
        Insert: {
          announcement_id: string
          branch_id: string
          created_at?: string | null
        }
        Update: {
          announcement_id?: string
          branch_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcement_branches_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcement_files: {
        Row: {
          announcement_id: string | null
          bunny_id: string | null
          created_at: string | null
          duration: number | null
          file_name: string
          file_url: string
          id: string
          interval: number | null
          playback_type: string | null
          scheduled_time: string | null
          song_interval: number | null
          updated_at: string | null
        }
        Insert: {
          announcement_id?: string | null
          bunny_id?: string | null
          created_at?: string | null
          duration?: number | null
          file_name: string
          file_url: string
          id?: string
          interval?: number | null
          playback_type?: string | null
          scheduled_time?: string | null
          song_interval?: number | null
          updated_at?: string | null
        }
        Update: {
          announcement_id?: string | null
          bunny_id?: string | null
          created_at?: string | null
          duration?: number | null
          file_name?: string
          file_url?: string
          id?: string
          interval?: number | null
          playback_type?: string | null
          scheduled_time?: string | null
          song_interval?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcement_files_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          repeat_interval: number | null
          repeat_type: string | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          repeat_interval?: number | null
          repeat_type?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          repeat_interval?: number | null
          repeat_type?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_metrics: {
        Row: {
          created_at: string | null
          endpoint: string
          error_count: number
          id: string
          measured_at: string | null
          response_time: number
          success_rate: number
          total_requests: number
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          error_count?: number
          id?: string
          measured_at?: string | null
          response_time?: number
          success_rate?: number
          total_requests?: number
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          error_count?: number
          id?: string
          measured_at?: string | null
          response_time?: number
          success_rate?: number
          total_requests?: number
        }
        Relationships: []
      }
      branch_group_assignments: {
        Row: {
          branch_id: string
          created_at: string | null
          group_id: string
        }
        Insert: {
          branch_id: string
          created_at?: string | null
          group_id: string
        }
        Update: {
          branch_id?: string
          created_at?: string | null
          group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "branch_group_assignments_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branch_group_assignments_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "branch_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      branch_groups: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branch_groups_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branch_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          location: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          position: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          position: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          position?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          id: string
          name: string
          subscription_ends_at: string | null
          subscription_status: string | null
          trial_ends_at: string | null
          trial_notification_sent: Json | null
          trial_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          subscription_ends_at?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          trial_notification_sent?: Json | null
          trial_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          subscription_ends_at?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          trial_notification_sent?: Json | null
          trial_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      device_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          last_system_update: string | null
          mac_address: string
          status: Database["public"]["Enums"]["token_status"] | null
          system_info: Json | null
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          last_system_update?: string | null
          mac_address: string
          status?: Database["public"]["Enums"]["token_status"] | null
          system_info?: Json | null
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          last_system_update?: string | null
          mac_address?: string
          status?: Database["public"]["Enums"]["token_status"] | null
          system_info?: Json | null
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      devices: {
        Row: {
          branch_id: string | null
          category: string
          created_at: string | null
          id: string
          ip_address: string | null
          last_seen: string | null
          location: string | null
          location_id: string | null
          name: string
          schedule: Json | null
          status: string | null
          system_info: Json | null
          token: string | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          category: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          last_seen?: string | null
          location?: string | null
          location_id?: string | null
          name: string
          schedule?: Json | null
          status?: string | null
          system_info?: Json | null
          token?: string | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          category?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          last_seen?: string | null
          location?: string | null
          location_id?: string | null
          name?: string
          schedule?: Json | null
          status?: string | null
          system_info?: Json | null
          token?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      genres: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "genres_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          quantity: number | null
          start_date: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          quantity?: number | null
          start_date?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          quantity?: number | null
          start_date?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "licenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          city: string
          created_at: string | null
          district: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          city: string
          created_at?: string | null
          district?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          city?: string
          created_at?: string | null
          district?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      moods: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moods_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string | null
          device_status_alerts: boolean | null
          email_notifications: boolean | null
          id: string
          maintenance_reminders: boolean | null
          system_updates: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_status_alerts?: boolean | null
          email_notifications?: boolean | null
          id?: string
          maintenance_reminders?: boolean | null
          system_updates?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_status_alerts?: boolean | null
          email_notifications?: boolean | null
          id?: string
          maintenance_reminders?: boolean | null
          system_updates?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          priority: string
          read_at: string | null
          recipient_id: string
          status: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: string
          read_at?: string | null
          recipient_id: string
          status?: string
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string
          read_at?: string | null
          recipient_id?: string
          status?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offline_players: {
        Row: {
          created_at: string | null
          device_id: string | null
          id: string
          last_sync_at: string | null
          local_storage_path: string | null
          settings: Json | null
          sync_status: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          id?: string
          last_sync_at?: string | null
          local_storage_path?: string | null
          settings?: Json | null
          sync_status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          id?: string
          last_sync_at?: string | null
          local_storage_path?: string | null
          settings?: Json | null
          sync_status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offline_players_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      offline_playlists: {
        Row: {
          created_at: string | null
          device_id: string | null
          id: string
          last_synced_at: string | null
          local_path: string | null
          playlist_id: string | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          id?: string
          last_synced_at?: string | null
          local_path?: string | null
          playlist_id?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          id?: string
          last_synced_at?: string | null
          local_path?: string | null
          playlist_id?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offline_playlists_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "offline_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offline_playlists_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "most_played_bar_playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offline_playlists_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      offline_songs: {
        Row: {
          created_at: string | null
          device_id: string | null
          id: string
          last_synced_at: string | null
          local_path: string | null
          song_id: string | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          id?: string
          last_synced_at?: string | null
          local_path?: string | null
          song_id?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          id?: string
          last_synced_at?: string | null
          local_path?: string | null
          song_id?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offline_songs_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "offline_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offline_songs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "song_play_statistics"
            referencedColumns: ["song_id"]
          },
          {
            foreignKeyName: "offline_songs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      offline_sync_history: {
        Row: {
          completed_at: string | null
          created_at: string | null
          details: Json | null
          id: string
          player_id: string | null
          started_at: string | null
          status: string | null
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          player_id?: string | null
          started_at?: string | null
          status?: string | null
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          player_id?: string | null
          started_at?: string | null
          status?: string | null
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "offline_sync_history_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "offline_players"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_assignments: {
        Row: {
          assigned_at: string | null
          expires_at: string | null
          id: string
          notification_sent: boolean | null
          playlist_id: string | null
          scheduled_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          expires_at?: string | null
          id?: string
          notification_sent?: boolean | null
          playlist_id?: string | null
          scheduled_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          expires_at?: string | null
          id?: string
          notification_sent?: boolean | null
          playlist_id?: string | null
          scheduled_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_assignments_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "most_played_bar_playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_assignments_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_categories: {
        Row: {
          category_id: string
          created_at: string | null
          playlist_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          playlist_id: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          playlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_categories_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "most_played_bar_playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_categories_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_songs: {
        Row: {
          created_at: string | null
          playlist_id: string
          position: number
          song_id: string
        }
        Insert: {
          created_at?: string | null
          playlist_id: string
          position: number
          song_id: string
        }
        Update: {
          created_at?: string | null
          playlist_id?: string
          position?: number
          song_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_songs_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "most_played_bar_playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_songs_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_songs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "song_play_statistics"
            referencedColumns: ["song_id"]
          },
          {
            foreignKeyName: "playlist_songs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          artwork_url: string | null
          assigned_to: string[] | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          genre_id: string | null
          id: string
          is_catalog: boolean | null
          is_hero: boolean | null
          is_public: boolean | null
          last_played: string | null
          mood_id: string | null
          name: string
          play_count: number | null
          updated_at: string | null
        }
        Insert: {
          artwork_url?: string | null
          assigned_to?: string[] | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          genre_id?: string | null
          id?: string
          is_catalog?: boolean | null
          is_hero?: boolean | null
          is_public?: boolean | null
          last_played?: string | null
          mood_id?: string | null
          name: string
          play_count?: number | null
          updated_at?: string | null
        }
        Update: {
          artwork_url?: string | null
          assigned_to?: string[] | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          genre_id?: string | null
          id?: string
          is_catalog?: boolean | null
          is_hero?: boolean | null
          is_public?: boolean | null
          last_played?: string | null
          mood_id?: string | null
          name?: string
          play_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlists_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlists_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlists_mood_id_fkey"
            columns: ["mood_id"]
            isOneToOne: false
            referencedRelation: "moods"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_device_assignments: {
        Row: {
          created_at: string | null
          device_id: string
          schedule_id: string
        }
        Insert: {
          created_at?: string | null
          device_id: string
          schedule_id: string
        }
        Update: {
          created_at?: string | null
          device_id?: string
          schedule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_device_assignments_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_device_assignments_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedule_events"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_events: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_time: string
          id: string
          notifications: Json | null
          playlist_id: string | null
          recurrence: Json | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time: string
          id?: string
          notifications?: Json | null
          playlist_id?: string | null
          recurrence?: Json | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string
          id?: string
          notifications?: Json | null
          playlist_id?: string | null
          recurrence?: Json | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_events_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "most_played_bar_playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_events_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      song_play_history: {
        Row: {
          branch_id: string | null
          bunny_stream_id: string | null
          created_at: string | null
          device_id: string | null
          id: string
          last_played_at: string | null
          play_count_today: number | null
          song_id: string | null
        }
        Insert: {
          branch_id?: string | null
          bunny_stream_id?: string | null
          created_at?: string | null
          device_id?: string | null
          id?: string
          last_played_at?: string | null
          play_count_today?: number | null
          song_id?: string | null
        }
        Update: {
          branch_id?: string | null
          bunny_stream_id?: string | null
          created_at?: string | null
          device_id?: string | null
          id?: string
          last_played_at?: string | null
          play_count_today?: number | null
          song_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "song_play_history_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_play_history_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_play_history_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "song_play_statistics"
            referencedColumns: ["song_id"]
          },
          {
            foreignKeyName: "song_play_history_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      songs: {
        Row: {
          album: string | null
          artist: string | null
          artwork_url: string | null
          bunny_id: string | null
          created_at: string | null
          created_by: string | null
          duration: number | null
          file_url: string
          genre: string[] | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          album?: string | null
          artist?: string | null
          artwork_url?: string | null
          bunny_id?: string | null
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          file_url: string
          genre?: string[] | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          album?: string | null
          artist?: string | null
          artwork_url?: string | null
          bunny_id?: string | null
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          file_url?: string
          genre?: string[] | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "songs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          cpu_usage: number
          created_at: string | null
          error_rate: number
          id: string
          measured_at: string | null
          memory_usage: number
          response_time: number
          server_uptime: number
          storage_usage: number
        }
        Insert: {
          cpu_usage?: number
          created_at?: string | null
          error_rate?: number
          id?: string
          measured_at?: string | null
          memory_usage?: number
          response_time?: number
          server_uptime?: number
          storage_usage?: number
        }
        Update: {
          cpu_usage?: number
          created_at?: string | null
          error_rate?: number
          id?: string
          measured_at?: string | null
          memory_usage?: number
          response_time?: number
          server_uptime?: number
          storage_usage?: number
        }
        Relationships: []
      }
    }
    Views: {
      most_played_bar_playlists: {
        Row: {
          artwork_url: string | null
          assigned_to: string[] | null
          category_id: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          genre_id: string | null
          genre_name: string | null
          id: string | null
          is_catalog: boolean | null
          is_public: boolean | null
          last_played: string | null
          mood_id: string | null
          mood_name: string | null
          name: string | null
          play_count: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlists_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlists_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlists_mood_id_fkey"
            columns: ["mood_id"]
            isOneToOne: false
            referencedRelation: "moods"
            referencedColumns: ["id"]
          },
        ]
      }
      song_play_statistics: {
        Row: {
          artist: string | null
          avg_daily_plays: number | null
          last_played: string | null
          song_id: string | null
          song_title: string | null
          total_plays: number | null
          unique_branches: number | null
          unique_devices: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_song_history: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      collect_system_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_song_statistics: {
        Args: {
          p_start_date: string
          p_end_date: string
          p_branch_id?: string
        }
        Returns: {
          song_id: string
          song_title: string
          artist: string
          play_count: number
          unique_devices: number
          peak_hour: number
          peak_day: string
        }[]
      }
      update_category_positions: {
        Args: {
          category_positions: Json[]
        }
        Returns: undefined
      }
    }
    Enums: {
      token_status: "active" | "used" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
