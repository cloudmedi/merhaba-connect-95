import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlaySquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { BulkPlaylistDialog } from "./bulk-playlist/BulkPlaylistDialog";

interface MusicFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedGenre: string;
  onGenreChange: (value: string) => void;
  genres: string[];
  onSelectAll: () => void;
  selectedCount: number;
}

export function MusicFilters({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  genres,
  onSelectAll,
  selectedCount,
}: MusicFiltersProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedGenre} onValueChange={onGenreChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Genre" />
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

        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <PlaySquare className="h-4 w-4" />
          Bulk Playlist
        </Button>

        <BulkPlaylistDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          genres={genres}
        />
      </div>
      
      <Button 
        variant="outline" 
        onClick={onSelectAll}
        className="whitespace-nowrap"
      >
        {selectedCount > 0 ? "Clear Selection" : "Select All Filtered"}
      </Button>
    </div>
  );
}