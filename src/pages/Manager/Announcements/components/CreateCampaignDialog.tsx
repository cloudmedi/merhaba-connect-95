import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import { useState } from "react";
import { AnnouncementFile } from "./AnnouncementFile";
import { PlaybackSettings } from "./PlaybackSettings";
import { toast } from "sonner";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [files, setFiles] = useState<Array<{
    id: string;
    file: File;
    playbackType: "immediate" | "smooth";
    interval?: number;
    songInterval?: number;
    scheduledTime?: string;
  }>>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      const newFiles = Array.from(uploadedFiles).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        playbackType: "smooth" as const,
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const handleUpdateFileSettings = (id: string, settings: Partial<typeof files[0]>) => {
    setFiles(files.map(f => f.id === id ? { ...f, ...settings } : f));
  };

  const handleSubmit = () => {
    if (!name || !startDate || !endDate || files.length === 0) {
      toast.error("Lütfen tüm gerekli alanları doldurun");
      return;
    }

    // Here you would typically send the data to your backend
    toast.success("Kampanya başarıyla oluşturuldu");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Yeni Kampanya Oluştur</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Tarih seçin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Bitiş Tarihi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Tarih seçin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label>Anonslar</Label>
            <div className="mt-2 space-y-4">
              {files.map((file) => (
                <AnnouncementFile
                  key={file.id}
                  file={file}
                  onRemove={() => handleRemoveFile(file.id)}
                  onUpdateSettings={(settings) => handleUpdateFileSettings(file.id, settings)}
                />
              ))}

              <div 
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Anons dosyalarını yüklemek için tıklayın</p>
                <input
                  id="file-upload"
                  type="file"
                  accept="audio/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button onClick={handleSubmit}>
              Kampanya Oluştur
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}