import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { PlaylistBanner } from "./components/PlaylistBanner";
import { PlaylistSection } from "./components/PlaylistSection";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const featuredPlaylists = [
  {
    id: 1,
    title: "Summer Vibes 2024",
    tags: ["Pop", "Energetic"],
    artwork: "/lovable-uploads/93efb0e3-414c-445d-8fd5-2b2cd82fe0bf.png"
  },
  {
    id: 2,
    title: "Relaxing Jazz",
    tags: ["Jazz", "Calm"],
    artwork: "/lovable-uploads/93efb0e3-414c-445d-8fd5-2b2cd82fe0bf.png"
  },
  {
    id: 3,
    title: "Coffee Shop Ambience",
    tags: ["Ambient", "Relaxed"],
    artwork: "/lovable-uploads/93efb0e3-414c-445d-8fd5-2b2cd82fe0bf.png"
  },
  {
    id: 4,
    title: "Shopping Mall Hits",
    tags: ["Pop", "Upbeat"],
    artwork: "/lovable-uploads/93efb0e3-414c-445d-8fd5-2b2cd82fe0bf.png"
  },
  {
    id: 5,
    title: "Dinner Time Classics",
    tags: ["Classical", "Elegant"],
    artwork: "/lovable-uploads/93efb0e3-414c-445d-8fd5-2b2cd82fe0bf.png"
  }
];

export default function Media() {
  return (
    <ManagerLayout>
      <div className="space-y-8">
        <PlaylistBanner
          title="Chill Beats"
          description="Feel the groove with tracks like 'Conquer the Storm,' 'My Side,' and 'Magic Ride.' Let the soothing beats take you on a journey through laid-back melodies and chill vibes, perfect for any relaxing moment."
          artwork="/lovable-uploads/93efb0e3-414c-445d-8fd5-2b2cd82fe0bf.png"
        />

        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10"
            />
          </div>
        </div>

        <PlaylistSection
          title="Cafe Channel"
          description="Time to get cozy"
          playlists={featuredPlaylists}
        />

        <PlaylistSection
          title="Popular today"
          description="Time to get cozy"
          playlists={featuredPlaylists}
        />

        <PlaylistSection
          title="Trending Playlists"
          description="Time to get cozy"
          playlists={featuredPlaylists}
        />
      </div>
    </ManagerLayout>
  );
}