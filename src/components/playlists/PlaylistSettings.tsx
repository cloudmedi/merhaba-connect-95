import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PlaylistSettingsProps {
  playlistData: {
    isCatalog: boolean;
    isPublic: boolean;
    isHero: boolean;
  };
  setPlaylistData: (data: any) => void;
}

export function PlaylistSettings({ playlistData, setPlaylistData }: PlaylistSettingsProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="catalog-mode"
          checked={playlistData.isCatalog}
          onCheckedChange={(checked) => 
            setPlaylistData((prev: any) => ({ ...prev, isCatalog: checked }))
          }
        />
        <Label htmlFor="catalog-mode">Add to Catalog (visible to all managers)</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="public-mode"
          checked={playlistData.isPublic}
          onCheckedChange={(checked) => 
            setPlaylistData((prev: any) => ({ ...prev, isPublic: checked }))
          }
        />
        <Label htmlFor="public-mode">Make Public</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="hero-mode"
          checked={playlistData.isHero}
          onCheckedChange={(checked) => 
            setPlaylistData((prev: any) => ({ ...prev, isHero: checked }))
          }
        />
        <Label htmlFor="hero-mode">Set as Featured Playlist</Label>
      </div>
    </div>
  );
}