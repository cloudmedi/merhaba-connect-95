import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SongsTab } from "./SongsTab";
import { GenresTab } from "./GenresTab";
import { MoodsTab } from "./MoodsTab";
import { CategoriesTab } from "./CategoriesTab";

interface PlaylistTabsProps {
  playlistData: {
    selectedSongs: any[];
    selectedGenres: any[];
    selectedMoods: any[];
    selectedCategories: any[];
  };
  setPlaylistData: (data: any) => void;
  onRemoveSong?: (songId: string) => void;
}

export function PlaylistTabs({ playlistData, setPlaylistData, onRemoveSong }: PlaylistTabsProps) {
  return (
    <Tabs defaultValue="songs" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="songs" className="flex-1">Songs</TabsTrigger>
        <TabsTrigger value="genres" className="flex-1">Genres</TabsTrigger>
        <TabsTrigger value="moods" className="flex-1">Moods</TabsTrigger>
        <TabsTrigger value="categories" className="flex-1">Categories</TabsTrigger>
      </TabsList>

      <TabsContent value="songs">
        <SongsTab
          selectedSongs={playlistData.selectedSongs}
          onAddSong={(song) => setPlaylistData((prev: any) => ({
            ...prev,
            selectedSongs: [...prev.selectedSongs, song]
          }))}
          onRemoveSong={(songId) => {
            console.log('Removing song with ID:', songId);
            setPlaylistData((prev: any) => ({
              ...prev,
              selectedSongs: prev.selectedSongs.filter((s: any) => s._id !== songId)
            }));
          }}
        />
      </TabsContent>

      <TabsContent value="genres">
        <GenresTab
          selectedGenres={playlistData.selectedGenres}
          onSelectGenre={(genre) => setPlaylistData((prev: any) => ({
            ...prev,
            selectedGenres: [genre]
          }))}
          onUnselectGenre={(genreId) => setPlaylistData((prev: any) => ({
            ...prev,
            selectedGenres: prev.selectedGenres.filter((g: any) => g.id !== genreId)
          }))}
        />
      </TabsContent>

      <TabsContent value="moods">
        <MoodsTab
          selectedMoods={playlistData.selectedMoods}
          onSelectMood={(mood) => setPlaylistData((prev: any) => ({
            ...prev,
            selectedMoods: [mood]
          }))}
          onUnselectMood={(moodId) => setPlaylistData((prev: any) => ({
            ...prev,
            selectedMoods: prev.selectedMoods.filter((m: any) => m.id !== moodId)
          }))}
        />
      </TabsContent>

      <TabsContent value="categories">
        <CategoriesTab
          selectedCategories={playlistData.selectedCategories}
          onSelectCategory={(category) => setPlaylistData((prev: any) => ({
            ...prev,
            selectedCategories: [...prev.selectedCategories, category]
          }))}
          onUnselectCategory={(categoryId) => setPlaylistData((prev: any) => ({
            ...prev,
            selectedCategories: prev.selectedCategories.filter((c: any) => c.id !== categoryId)
          }))}
        />
      </TabsContent>
    </Tabs>
  );
}