import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface MusicFiltersProps {
  onFilterChange: (filters: {
    artists: string[];
    albums: string[];
    uploaders: string[];
    genre: string;
    mood: string;
  }) => void;
}

export function MusicFilters({ onFilterChange }: MusicFiltersProps) {
  const [filters, setFilters] = useState({
    artists: [],
    albums: [],
    uploaders: [],
    genre: "",
    mood: "",
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 rounded-lg border border-border/40">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/90">Artist</label>
          <Select
            onValueChange={(value) => handleFilterChange("artists", [value])}
          >
            <SelectTrigger className="w-full bg-background/50">
              <SelectValue placeholder="Select one or multi" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                <SelectItem value="artist1">Artist 1</SelectItem>
                <SelectItem value="artist2">Artist 2</SelectItem>
                <SelectItem value="artist3">Artist 3</SelectItem>
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/90">Album</label>
          <Select
            onValueChange={(value) => handleFilterChange("albums", [value])}
          >
            <SelectTrigger className="w-full bg-background/50">
              <SelectValue placeholder="Select one or multi" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                <SelectItem value="album1">Album 1</SelectItem>
                <SelectItem value="album2">Album 2</SelectItem>
                <SelectItem value="album3">Album 3</SelectItem>
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/90">Uploader</label>
          <Select
            onValueChange={(value) => handleFilterChange("uploaders", [value])}
          >
            <SelectTrigger className="w-full bg-background/50">
              <SelectValue placeholder="Select one or multi" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                <SelectItem value="uploader1">Uploader 1</SelectItem>
                <SelectItem value="uploader2">Uploader 2</SelectItem>
                <SelectItem value="uploader3">Uploader 3</SelectItem>
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/90">Genre</label>
          <Select onValueChange={(value) => handleFilterChange("genre", value)}>
            <SelectTrigger className="w-full bg-background/50">
              <SelectValue placeholder="Please select" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="classical">Classical</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/90">Mood</label>
          <Select onValueChange={(value) => handleFilterChange("mood", value)}>
            <SelectTrigger className="w-full bg-background/50">
              <SelectValue placeholder="Please select" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="calm">Calm</SelectItem>
                <SelectItem value="energetic">Energetic</SelectItem>
                <SelectItem value="relaxed">Relaxed</SelectItem>
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setFilters({
                artists: [],
                albums: [],
                uploaders: [],
                genre: "",
                mood: "",
              });
              onFilterChange({
                artists: [],
                albums: [],
                uploaders: [],
                genre: "",
                mood: "",
              });
            }}
          >
            Reset
          </Button>
          <Button className="w-full">Apply Filters</Button>
        </div>
      </div>
    </div>
  );
}