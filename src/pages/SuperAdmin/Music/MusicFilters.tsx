import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MusicFiltersProps {
  onGenreChange: (genre: string) => void;
  onRecentChange: (recent: boolean) => void;
  onSearchChange: (search: string) => void;
  genres: string[];
  searchQuery: string;
}

export function MusicFilters({
  onGenreChange,
  onRecentChange,
  onSearchChange,
  genres,
  searchQuery,
}: MusicFiltersProps) {
  return (
    <div className="flex flex-wrap gap-6 items-center p-4 bg-white rounded-lg border">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search songs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex-1 min-w-[200px]">
        <Select onValueChange={onGenreChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
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