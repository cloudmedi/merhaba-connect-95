import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Users, Tag, Grid2X2, Heart } from "lucide-react";
import { SongsTab } from "./SongsTab";
import { UsersTab } from "./UsersTab";
import { GenresTab } from "./GenresTab";
import { CategoriesTab } from "./CategoriesTab";
import { MoodsTab } from "./MoodsTab";

interface PlaylistTabsProps {
  playlistData: any;
  setPlaylistData: (data: any) => void;
}

export function PlaylistTabs({ playlistData, setPlaylistData }: PlaylistTabsProps) {
  return (
    <Tabs defaultValue="songs">
      <TabsList>
        <TabsTrigger value="songs">
          <Music className="w-4 h-4 mr-2" />
          Songs
        </TabsTrigger>
        <TabsTrigger value="users">
          <Users className="w-4 h-4 mr-2" />
          Users
        </TabsTrigger>
        <TabsTrigger value="genres">
          <Tag className="w-4 h-4 mr-2" />
          Genres
        </TabsTrigger>
        <TabsTrigger value="categories">
          <Grid2X2 className="w-4 h-4 mr-2" />
          Categories
        </TabsTrigger>
        <TabsTrigger value="moods">
          <Heart className="w-4 h-4 mr-2" />
          Moods
        </TabsTrigger>
      </TabsList>

      <TabsContent value="songs" className="mt-4">
        <SongsTab
          selectedSongs={playlistData.selectedSongs}
          onAddSong={(song) => setPlaylistData(prev => ({
            ...prev,
            selectedSongs: [...prev.selectedSongs, song],
          }))}
          onRemoveSong={(songId) => setPlaylistData(prev => ({
            ...prev,
            selectedSongs: prev.selectedSongs.filter(s => s.id !== songId),
          }))}
        />
      </TabsContent>

      <TabsContent value="users" className="mt-4">
        <UsersTab
          selectedUsers={playlistData.selectedUsers}
          onSelectUser={(user) => setPlaylistData(prev => ({
            ...prev,
            selectedUsers: [...prev.selectedUsers, user],
          }))}
          onUnselectUser={(userId) => setPlaylistData(prev => ({
            ...prev,
            selectedUsers: prev.selectedUsers.filter(u => u.id !== userId),
          }))}
        />
      </TabsContent>

      <TabsContent value="genres" className="mt-4">
        <GenresTab
          selectedGenres={playlistData.selectedGenres}
          onSelectGenre={(genre) => setPlaylistData(prev => ({
            ...prev,
            selectedGenres: [...prev.selectedGenres, genre],
          }))}
          onUnselectGenre={(genreId) => setPlaylistData(prev => ({
            ...prev,
            selectedGenres: prev.selectedGenres.filter(g => g.id !== genreId),
          }))}
        />
      </TabsContent>

      <TabsContent value="categories" className="mt-4">
        <CategoriesTab
          selectedCategories={playlistData.selectedCategories}
          onSelectCategory={(category) => setPlaylistData(prev => ({
            ...prev,
            selectedCategories: [...prev.selectedCategories, category],
          }))}
          onUnselectCategory={(categoryId) => setPlaylistData(prev => ({
            ...prev,
            selectedCategories: prev.selectedCategories.filter(c => c.id !== categoryId),
          }))}
        />
      </TabsContent>

      <TabsContent value="moods" className="mt-4">
        <MoodsTab
          selectedMoods={playlistData.selectedMoods}
          onSelectMood={(mood) => setPlaylistData(prev => ({
            ...prev,
            selectedMoods: [...prev.selectedMoods, mood],
          }))}
          onUnselectMood={(moodId) => setPlaylistData(prev => ({
            ...prev,
            selectedMoods: prev.selectedMoods.filter(m => m.id !== moodId),
          }))}
        />
      </TabsContent>
    </Tabs>
  );
}