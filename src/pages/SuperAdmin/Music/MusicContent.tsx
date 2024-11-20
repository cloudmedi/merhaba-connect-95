import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MusicHeader } from "./MusicHeader";
import { MusicTable } from "./MusicTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Song {
  id: string;
  title: string;
  artist: string | null;
  album: string | null;
  genre: string[] | null;
  duration: number | null;
  file_url: string;
  artwork_url: string | null;
  created_at: string;
}

export function MusicContent() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: songs, isLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Song[];
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    try {
      // Upload to storage bucket
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('music')
        .upload(`songs/${fileName}`, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('music')
        .getPublicUrl(`songs/${fileName}`);

      // Create song record
      const { error: dbError } = await supabase
        .from('songs')
        .insert([{
          title: file.name.replace(/\.[^/.]+$/, ""),
          file_url: publicUrl,
        }]);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Song uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading song:', error);
      toast({
        title: "Error",
        description: "Failed to upload song",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <MusicHeader onUpload={handleFileUpload} />
      <MusicTable songs={songs || []} isLoading={isLoading} />
    </div>
  );
}