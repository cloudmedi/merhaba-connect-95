import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUploadPreview } from "./FileUploadPreview";
import { PlaybackSettings } from "./PlaybackSettings";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [playbackSettings, setPlaybackSettings] = useState({
    playbackType: "smooth" as "smooth" | "immediate",
    interval: 30,
    songInterval: 2,
    scheduledTime: ""
  });

  const handleDayChange = (day: keyof typeof selectedDays) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const handleSubmit = () => {
    if (!name || files.length === 0 || !startDate || !endDate) {
      toast.error("Lütfen tüm gerekli alanları doldurun");
      return;
    }

    if (!Object.values(selectedDays).some(day => day)) {
      toast.error("En az bir gün seçmelisiniz");
      return;
    }

    toast.success("Kampanya başarıyla oluşturuldu");
    onOpenChange(false);
  };

  const days = [
    { key: 'monday', label: 'Pazartesi' },
    { key: 'tuesday', label: 'Salı' },
    { key: 'wednesday', label: 'Çarşamba' },
    { key: 'thursday', label: 'Perşembe' },
    { key: 'friday', label: 'Cuma' },
    { key: 'saturday', label: 'Cumartesi' },
    { key: 'sunday', label: 'Pazar' },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Yeni Kampanya Oluştur</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6 pr-4">
            <div>
              <Label>Kampanya Adı</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kampanya adını girin"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Başlangıç Tarihi</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label>Bitiş Tarihi</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Kampanya Günleri</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                {days.map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={selectedDays[key]}
                      onCheckedChange={() => handleDayChange(key)}
                    />
                    <Label htmlFor={key} className="cursor-pointer">{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Anonslar</Label>
              <div className="mt-2">
                <FileUploadPreview
                  files={files}
                  onFilesChange={setFiles}
                />
              </div>
            </div>

            <PlaybackSettings
              settings={playbackSettings}
              onUpdate={setPlaybackSettings}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button onClick={handleSubmit}>
                Kampanya Oluştur
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}