import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PlaylistSettingsProps {
  isCatalog: boolean;
  isPublic: boolean;
  onCatalogChange: (checked: boolean) => void;
  onPublicChange: (checked: boolean) => void;
}

export function PlaylistSettings({ 
  isCatalog, 
  isPublic, 
  onCatalogChange, 
  onPublicChange 
}: PlaylistSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="catalog-mode"
          checked={isCatalog}
          onCheckedChange={onCatalogChange}
        />
        <Label htmlFor="catalog-mode">Add to Catalog (visible to all managers)</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="public-mode"
          checked={isPublic}
          onCheckedChange={onPublicChange}
        />
        <Label htmlFor="public-mode">Make Public</Label>
      </div>
    </div>
  );
}