import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

interface PlaybackSettingsType {
  playbackType: "smooth" | "immediate";
  interval: number;
  songInterval: number;
  scheduledTime: string;
}

interface PlaybackSettingsProps {
  settings: PlaybackSettingsType;
  onUpdate: (settings: PlaybackSettingsType) => void;
}

export function PlaybackSettings({ settings, onUpdate }: PlaybackSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Çalma Tipi</Label>
        <RadioGroup
          value={settings.playbackType}
          onValueChange={(value: "immediate" | "smooth") => 
            onUpdate({ ...settings, playbackType: value })
          }
          className="flex gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="smooth" id="smooth" />
            <Label htmlFor="smooth">Yumuşak Geçiş</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="immediate" id="immediate" />
            <Label htmlFor="immediate">Anında Geçiş</Label>
          </div>
        </RadioGroup>
      </div>

      {settings.playbackType === "smooth" && (
        <>
          <div>
            <Label>Zaman Aralığı (dakika)</Label>
            <Input
              type="number"
              min="1"
              value={settings.interval}
              onChange={(e) => onUpdate({ 
                ...settings, 
                interval: parseInt(e.target.value) 
              })}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Şarkı Aralığı</Label>
            <Input
              type="number"
              min="1"
              value={settings.songInterval}
              onChange={(e) => onUpdate({ 
                ...settings, 
                songInterval: parseInt(e.target.value) 
              })}
              className="mt-1"
            />
          </div>
        </>
      )}

      {settings.playbackType === "immediate" && (
        <div>
          <Label>Planlanan Saat</Label>
          <Input
            type="time"
            value={settings.scheduledTime}
            onChange={(e) => onUpdate({ 
              ...settings, 
              scheduledTime: e.target.value 
            })}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
}