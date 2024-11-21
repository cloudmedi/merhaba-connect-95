import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

interface Genre {
  id: string;
  name: string;
  description: string | null;
}

interface GenresTabProps {
  selectedGenres: Genre[];
  onSelectGenre: (genre: Genre) => void;
  onUnselectGenre: (genreId: string) => void;
}

export function GenresTab({ selectedGenres, onSelectGenre, onUnselectGenre }: GenresTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .ilike('name', `%${searchQuery}%`);
      
      if (error) {
        console.error('Error fetching genres:', error);
        return;
      }
      
      setGenres(data || []);
    };

    fetchGenres();
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search genres..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {genres.map((genre) => {
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
              <div>
                <span className="text-sm font-medium">{genre.name}</span>
                {genre.description && (
                  <p className="text-xs text-gray-500">{genre.description}</p>
                )}
              </div>
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