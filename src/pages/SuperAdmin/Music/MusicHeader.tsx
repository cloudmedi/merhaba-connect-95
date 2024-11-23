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
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('No active session');
        }

        console.log('Uploading file:', file.name);

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);

        // Call the upload-music edge function
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-music`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
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