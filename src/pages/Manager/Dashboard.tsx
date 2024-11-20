import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { businessHoursPlaylists, eveningPlaylists, weekendPlaylists } from "@/data/playlists";
import { useQuery } from "@tanstack/react-query";

interface PlaylistsData {
  businessHours: typeof businessHoursPlaylists;
  evening: typeof eveningPlaylists;
  weekend: typeof weekendPlaylists;
}

// Simulate API call
const fetchPlaylists = async (): Promise<PlaylistsData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        businessHours: businessHoursPlaylists,
        evening: eveningPlaylists,
        weekend: weekendPlaylists
      });
    }, 1500);
  });
};

export default function ManagerDashboard() {
  const { data: playlists, isLoading } = useQuery({
    queryKey: ['playlists'],
    queryFn: fetchPlaylists,
  });

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assigned Playlists</h1>
          <p className="text-gray-500 mt-1">Manage your business music playlists</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search playlists..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-12">
        <PlaylistGrid 
          title="Business Hours" 
          description="Active during business hours"
          playlists={playlists?.businessHours || []}
          isLoading={isLoading}
        />
        
        <PlaylistGrid 
          title="Evening Ambience" 
          description="Perfect for evening atmosphere"
          playlists={playlists?.evening || []}
          isLoading={isLoading}
        />
        
        <PlaylistGrid 
          title="Weekend Selection" 
          description="Special weekend playlists"
          playlists={playlists?.weekend || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}