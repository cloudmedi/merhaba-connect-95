import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Playlist } from "@/types/api";

export function PlaylistsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: playlists, isLoading } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          company:company_id(name),
          profiles:created_by(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Playlist[];
    }
  });

  const filteredPlaylists = playlists?.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const businessPlaylists = filteredPlaylists.filter(p => !p.is_public);
  const publicPlaylists = filteredPlaylists.filter(p => p.is_public);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search playlists..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => navigate("create")}
          className="bg-[#6366F1] text-white hover:bg-[#5558DD] w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" /> Create New Playlist
        </Button>
      </div>

      <div className="space-y-12">
        <PlaylistGrid 
          title="Business Playlists" 
          description="Private playlists for business use"
          playlists={businessPlaylists}
          isLoading={isLoading}
        />
        
        <PlaylistGrid 
          title="Public Playlists" 
          description="Playlists available to all users"
          playlists={publicPlaylists}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}