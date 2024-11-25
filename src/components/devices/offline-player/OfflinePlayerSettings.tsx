import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { OfflinePlayer } from "@/types/offline-player";

interface OfflinePlayerSettingsProps {
  player: OfflinePlayer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: any) => void;
}

export function OfflinePlayerSettings({
  player,
  open,
  onOpenChange,
  onSave,
}: OfflinePlayerSettingsProps) {
  const [settings, setSettings] = useState(player.settings);

  const handleSave = () => {
    onSave(settings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Offline Player Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-sync">Auto Sync</Label>
            <Switch
              id="auto-sync"
              checked={settings.autoSync}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoSync: checked })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
            <Input
              id="sync-interval"
              type="number"
              value={settings.syncInterval}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  syncInterval: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="storage-limit">Storage Limit (MB)</Label>
            <Input
              id="storage-limit"
              type="number"
              value={settings.maxStorageSize / (1024 * 1024)}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxStorageSize: parseInt(e.target.value) * 1024 * 1024,
                })
              }
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}