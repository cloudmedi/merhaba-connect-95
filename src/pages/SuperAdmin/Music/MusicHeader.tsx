import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('No active session');
        }

        // Create FormData and explicitly set the file
        const formData = new FormData();
        formData.append('file', file, file.name);

        const { data, error } = await supabase.functions.invoke('upload-music', {
          body: formData,
          headers: {
            // Let the browser set the correct Content-Type with boundary
            'Accept': 'application/json',
          },
        });

        if (error) {
          throw error;
        }

        toast({
          title: "Success",
          description: `${file.name} uploaded successfully`,
        });

      } catch (error: any) {
        console.error('Upload error:', error);
        toast({
          title: "Error",
          description: error.message || `Failed to upload ${file.name}`,
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