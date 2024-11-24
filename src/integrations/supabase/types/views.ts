export type DatabaseViews = {
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
      }
    ]
  }
}
