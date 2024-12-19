import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { UploadMusicDialog } from "./components/UploadMusicDialog";
import { toast } from "sonner";

export function MusicHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
    const maxSize = 20 * 1024 * 1024; // 20MB

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} desteklenen bir ses dosyası değil`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} 20MB limitini aşıyor`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setIsDialogOpen(true);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
      <Button
        onClick={handleUploadClick}
        className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
      >
        <Upload className="w-4 h-4 mr-2" />
        Müzik Yükle
      </Button>

      <UploadMusicDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        selectedFiles={selectedFiles}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedFiles([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      />
    </div>
  );
}