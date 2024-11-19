import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music2, Users, Tag, Grid2X2, Heart } from "lucide-react";
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
    <div className="bg-white rounded-lg border">
      <Tabs defaultValue="songs" className="w-full">
        <TabsList className="w-full justify-start bg-gray-50 border-b">
          <TabsTrigger value="songs" className="data-[state=active]:bg-white">
            <Music2 className="w-4 h-4 mr-2" />
            Songs
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-white">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="genres" className="data-[state=active]:bg-white">
            <Tag className="w-4 h-4 mr-2" />
            Genres
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-white">
            <Grid2X2 className="w-4 h-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="moods" className="data-[state=active]:bg-white">
            <Heart className="w-4 h-4 mr-2" />
            Moods
          </TabsTrigger>
        </TabsList>

        <div className="p-6">
          <TabsContent value="songs">
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

          <TabsContent value="users">
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

          <TabsContent value="genres">
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

          <TabsContent value="categories">
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

          <TabsContent value="moods">
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
        </div>
      </Tabs>
    </div>
  );
}