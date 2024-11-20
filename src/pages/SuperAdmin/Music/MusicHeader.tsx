import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as musicMetadata from 'music-metadata-browser';

interface MusicHeaderProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MusicHeader({ onUpload }: MusicHeaderProps) {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      try {
        // Parse music metadata
        const metadata = await musicMetadata.parseBlob(file);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('metadata', JSON.stringify({
          title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
          artist: metadata.common.artist || "Unknown Artist",
          album: metadata.common.album || "Unknown Album",
          genres: metadata.common.genre || [],
          duration: metadata.format.duration || 0,
          artworkUrl: metadata.common.picture?.[0] ? 
            URL.createObjectURL(new Blob([metadata.common.picture[0].data], { type: metadata.common.picture[0].format })) :
            undefined
        }));

        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await supabase.functions.invoke('upload-music', {
          body: formData,
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        toast({
          title: "Success",
          description: `${file.name} uploaded successfully`,
        });

      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }

    // Clear input
    event.target.value = '';
  };

  return (
    <Button
      onClick={() => document.getElementById("music-upload")?.click()}
      className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
    >
      <Upload className="w-4 h-4 mr-2" />
      Upload Music
      <input
        id="music-upload"
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />
    </Button>
  );
}