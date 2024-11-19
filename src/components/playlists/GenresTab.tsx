import { useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { availableGenres } from "@/pages/SuperAdmin/Genres";

interface Genre {
  id: number;
  name: string;
}

interface GenresTabProps {
  selectedGenres: Genre[];
  onSelectGenre: (genre: Genre) => void;
  onUnselectGenre: (genreId: number) => void;
}

export function GenresTab({ selectedGenres, onSelectGenre, onUnselectGenre }: GenresTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGenres = availableGenres.filter((genre) =>
    genre.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search genres..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGenres.map((genre) => {
          const isSelected = selectedGenres.some((g) => g.id === genre.id);
          return (
            <div
              key={genre.id}
              className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-accent cursor-pointer"
              onClick={() => {
                if (isSelected) {
                  onUnselectGenre(genre.id);
                } else {
                  onSelectGenre(genre);
                }
              }}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => {
                  if (isSelected) {
                    onUnselectGenre(genre.id);
                  } else {
                    onSelectGenre(genre);
                  }
                }}
              />
              <span className="text-sm font-medium">{genre.name}</span>
            </div>
          );
        })}
      </div>

      {selectedGenres.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Selected Genres:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map((genre) => (
              <div
                key={genre.id}
                className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
              >
                <span>{genre.name}</span>
                <button
                  onClick={() => onUnselectGenre(genre.id)}
                  className="hover:text-primary/80"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}