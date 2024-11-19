import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Filters } from "./types";

interface MusicFiltersProps {
  onGenreChange: (genre: string) => void;
  onPlaylistChange: (playlist: string) => void;
  onRecentChange: (recent: boolean) => void;
  onFilterChange: (filters: Filters) => void;
  genres: string[];
  playlists: string[];
}

export function MusicFilters({
  onGenreChange,
  onPlaylistChange,
  onRecentChange,
  onFilterChange,
  genres = [], // Provide default empty array
  playlists = [], // Provide default empty array
}: MusicFiltersProps) {
  return (
    <div className="flex flex-wrap gap-6 items-center p-4 bg-white rounded-lg border">
      <div className="flex-1 min-w-[200px]">
        <Select onValueChange={onGenreChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-genres">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <Select onValueChange={onPlaylistChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by playlist" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-playlists">All Playlists</SelectItem>
            {playlists.map((playlist) => (
              <SelectItem key={playlist} value={playlist}>
                {playlist}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="recent-mode"
          onCheckedChange={onRecentChange}
        />
        <Label htmlFor="recent-mode">Show recent uploads first</Label>
      </div>
    </div>
  );
}