import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Upload, Music, Users, Tag, Grid2X2, Heart } from "lucide-react";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

interface CreatePlaylistDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePlaylistDialog({ isOpen, onOpenChange }: CreatePlaylistDialogProps) {
  const { toast } = useToast();
  const [playlistData, setPlaylistData] = useState({
    title: "",
    description: "",
    artwork: null as File | null,
    selectedSongs: [] as Song[],
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Mock available songs data
  const availableSongs: Song[] = [
    { id: 1, title: "Summer Vibes", artist: "John Doe", duration: "3:45" },
    { id: 2, title: "Chill Beats", artist: "Jane Smith", duration: "4:20" },
  ];

  const handleCreatePlaylist = () => {
    if (!playlistData.title) {
      toast({
        title: "Error",
        description: "Please enter a playlist title",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call
    toast({
      title: "Success",
      description: "Playlist created successfully",
    });

    onOpenChange(false);
    setPlaylistData({
      title: "",
      description: "",
      artwork: null,
      selectedSongs: [],
    });
  };

  const handleArtworkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPlaylistData(prev => ({ ...prev, artwork: file }));
    }
  };

  const handleAddSong = (song: Song) => {
    if (!playlistData.selectedSongs.find(s => s.id === song.id)) {
      setPlaylistData(prev => ({
        ...prev,
        selectedSongs: [...prev.selectedSongs, song],
      }));
    }
  };

  const handleRemoveSong = (songId: number) => {
    setPlaylistData(prev => ({
      ...prev,
      selectedSongs: prev.selectedSongs.filter(s => s.id !== songId),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-[300px,1fr] gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Playlist Name</label>
              <Input
                placeholder="Enter playlist name"
                value={playlistData.title}
                onChange={(e) => setPlaylistData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe your playlist"
                value={playlistData.description}
                onChange={(e) => setPlaylistData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Artwork</label>
              <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                   onClick={() => document.getElementById('artwork-upload')?.click()}>
                {playlistData.artwork ? (
                  <img
                    src={URL.createObjectURL(playlistData.artwork)}
                    alt="Playlist artwork"
                    className="w-full h-40 object-cover rounded"
                  />
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-gray-500">
                    <Upload className="w-8 h-8 mb-2" />
                    <span>Upload Artwork</span>
                  </div>
                )}
                <input
                  id="artwork-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleArtworkUpload}
                />
              </div>
            </div>
          </div>

          <div>
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

              <TabsContent value="songs" className="border-none p-0 mt-4">
                <div className="space-y-4">
                  <Input
                    placeholder="Search songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Available Songs</h3>
                      <div className="border rounded-lg divide-y">
                        {availableSongs.map(song => (
                          <div key={song.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                            <div>
                              <p className="font-medium">{song.title}</p>
                              <p className="text-sm text-gray-500">{song.artist}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">{song.duration}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleAddSong(song)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Selected Songs ({playlistData.selectedSongs.length})</h3>
                      <div className="border rounded-lg divide-y">
                        {playlistData.selectedSongs.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No songs selected</p>
                            <p className="text-sm">Add songs from the list</p>
                          </div>
                        ) : (
                          playlistData.selectedSongs.map(song => (
                            <div key={song.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                              <div>
                                <p className="font-medium">{song.title}</p>
                                <p className="text-sm text-gray-500">{song.artist}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveSong(song.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreatePlaylist}>
            Create Playlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}