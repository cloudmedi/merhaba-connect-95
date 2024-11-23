import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function MusicHeader() {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    for (const file of Array.from(files)) {
      try {
        // Create FormData
        const formData = new FormData();
        formData.append('file', file);

        // Call the upload-music edge function
        const { data, error } = await supabase.functions.invoke('upload-music', {
          body: formData,
        });

        if (error) {
          throw error;
        }

        console.log('Upload response:', data);
        toast.success(`${file.name} has been uploaded successfully`);

      } catch (error: any) {
        console.error('Upload error:', error);
        toast.error(error.message || 'Failed to upload file');
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
        {isUploading ? 'Uploading...' : 'Upload Music'}
      </Button>
    </div>
  );
}