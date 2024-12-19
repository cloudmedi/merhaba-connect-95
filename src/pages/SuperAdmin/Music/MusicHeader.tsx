import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/services/api";

export function MusicHeader() {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/admin/songs/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        toast.success(`${file.name} başarıyla yüklendi`);
      } catch (error: any) {
        console.error('Upload error:', error);
        toast.error(`${file.name} yüklenirken hata oluştu: ${error.message}`);
      }
    }

    setIsUploading(false);
    event.target.value = ''; // Reset input
  };

  return (
    <div className="flex gap-4">
      <input
        type="file"
        id="music-upload"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        onClick={() => document.getElementById('music-upload')?.click()}
        className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
        disabled={isUploading}
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? 'Yükleniyor...' : 'Müzik Yükle'}
      </Button>
    </div>
  );
}