import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface MusicFiltersProps {
  onGenreChange: (genre: string) => void;
  onPlaylistChange: (playlist: string) => void;
  onRecentChange: (recent: boolean) => void;
  genres: string[];
  playlists: string[];
}

export function MusicFilters({
  onGenreChange,
  onPlaylistChange,
  onRecentChange,
  genres,
  playlists,
}: MusicFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex-1 min-w-[200px]">
        <Select onValueChange={onGenreChange}>
          <SelectTrigger className="bg-gray-50 border-gray-200">
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
          <SelectTrigger className="bg-gray-50 border-gray-200">
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

      <div className="flex items-center space-x-2 ml-auto">
        <Switch
          id="recent-mode"
          onCheckedChange={onRecentChange}
          className="data-[state=checked]:bg-[#9b87f5]"
        />
        <Label htmlFor="recent-mode" className="text-sm text-gray-600">Show recent uploads first</Label>
      </div>
    </div>
  );
}