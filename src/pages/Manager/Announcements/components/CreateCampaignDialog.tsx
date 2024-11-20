import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { PlaybackSettings } from "./PlaybackSettings";
import { toast } from "sonner";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [playbackSettings, setPlaybackSettings] = useState({
    playbackType: "smooth" as "smooth" | "immediate",
    interval: 30,
    songInterval: 2,
    scheduledTime: ""
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      setFiles(prev => [...prev, ...Array.from(uploadedFiles)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name || files.length === 0 || !startDate || !endDate) {
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
            <Label>Anonslar</Label>
            <div className="mt-2 space-y-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
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
      </DialogContent>
    </Dialog>
  );
}