import { Json } from './json';

export type DatabaseFunctions = {
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
  update_playlist_categories: {
    Args: {
      p_playlist_id: string
      p_category_ids: string[]
    }
    Returns: undefined
  }
  update_playlist_songs: {
    Args: {
      p_playlist_id: string
      p_song_ids: Array<{
        song_id: string
        position: number
      }>
    }
    Returns: undefined
  }
}