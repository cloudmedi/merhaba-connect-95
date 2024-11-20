import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlaybackSettingsProps {
  settings: {
    playbackType: "immediate" | "smooth";
    interval?: number;
    songInterval?: number;
    scheduledTime?: string;
  };
  onUpdate: (settings: Partial<typeof settings>) => void;
}

export function PlaybackSettings({ settings, onUpdate }: PlaybackSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Çalma Tipi</Label>
        <RadioGroup
          value={settings.playbackType}
          onValueChange={(value: "immediate" | "smooth") => onUpdate({ playbackType: value })}
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
              value={settings.interval || ""}
              onChange={(e) => onUpdate({ interval: parseInt(e.target.value) })}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Şarkı Aralığı</Label>
            <Input
              type="number"
              min="1"
              value={settings.songInterval || ""}
              onChange={(e) => onUpdate({ songInterval: parseInt(e.target.value) })}
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
            value={settings.scheduledTime || ""}
            onChange={(e) => onUpdate({ scheduledTime: e.target.value })}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
}