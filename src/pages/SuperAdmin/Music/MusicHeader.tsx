import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function MusicHeader() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const { data, error } = await supabase.functions.invoke('upload-music', {
          body: formData,
        });

        if (error) {
          throw error;
        }
        
        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded successfully`,
        });

      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload failed",
          description: error.message || 'Failed to upload file',
          variant: "destructive",
        });
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